# ============================================================
# Scrape Images Script - Αυτόματο κατέβασμα εικόνων προϊόντων
# Χρησιμοποιεί DuckDuckGo Image Search (δωρεάν, χωρίς API key)
# ============================================================

import os
import re
import json
import urllib.request
import urllib.parse
import time
import sys

def extract_products_from_js(filepath):
    """Διάβασε τα προϊόντα από το js/products.js και εξαγωγή keywords"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Βρες το products array
    match = re.search(r'const products\s*=\s*\[(.*?)\];', content, re.DOTALL)
    if not match:
        print("✗ Δεν βρέθηκε το products array στο js/products.js")
        return []
    
    products_text = match.group(1)
    
    # Εξαγωγή κάθε product object
    products = []
    # Split by id: pattern
    blocks = re.findall(r'\{([^}]+)\}', products_text)
    
    for block in blocks:
        name_match = re.search(r'name:\s*"([^"]+)"', block)
        image_match = re.search(r'image:\s*"([^"]+)"', block)
        desc_match = re.search(r'description:\s*"([^"]+)"', block)
        
        if name_match and image_match:
            name = name_match.group(1)
            image_path = image_match.group(1)
            description = desc_match.group(1) if desc_match else ""
            
            # Εξαγωγή filename από το path
            filename = os.path.basename(image_path)
            
            products.append({
                'name': name,
                'description': description,
                'filename': filename,
                'image_path': image_path
            })
    
    return products


def generate_keywords(name, description):
    """Μετατροπή ονόματος προϊόντος σε αγγλικά keywords για αναζήτηση"""
    
    # Greek to English mapping for common product words
    gr_en_map = {
        'Σακάκι': 'jacket',
        'Καναπές': 'sofa couch',
        'Μασάζ': 'massage',
        'Λάπτοπ': 'laptop computer',
        'Δράπανο': 'drill power tool',
        'Γυαλιά': 'glasses goggles',
        'Παπούτσια': 'shoes sneakers',
        'Κρέμα': 'cream skincare',
        'Σκύλος': 'robot dog',
        'Ρομπότ': 'robot',
        'Χάπι': 'pill capsule',
        'Ακουστικό': 'earbuds headphones',
        'Συσκευή': 'device gadget',
        'Τηλεμεταφορά': 'teleportation',
        'Παντελόνι': 'pants trousers',
        'Στυλό': 'pen',
        'Μάσκα': 'mask',
        'Ύπνου': 'sleep',
        'Ρολόι': 'watch',
        'Φορτιστής': 'charger',
        'Ηλιακός': 'solar',
        'Τσίχλες': 'gum chewing gum',
        'Κουβέρτα': 'blanket',
        'Έξυπνος': 'smart intelligent',
        'Έξυπνη': 'smart intelligent',
        'Υπερηχητικό': 'ultrasonic',
        'Αόρατο': 'invisible hidden',
        'Αυτο-καθαριζόμενο': 'self-cleaning',
        'Αυτόματου': 'automatic',
        'Χρονοταξιδιώτη': 'time travel',
        'Αδυνατίσματος': 'weight loss slimming',
        'Νεότητας': 'anti-aging youth',
        'Μετάφρασης': 'translation translator',
        'Τεχνολογία': 'technology',
        'Παιχνίδια': 'toys',
        'Gadgets': 'gadgets tech',
        'Ομορφιά': 'beauty cosmetics',
        'Αθλητικά': 'sports athletic',
        'Εργαλεία': 'tools',
        'Σπίτι': 'home household',
        'Μόδα': 'fashion clothing',
    }
    
    # Ξεκίνα με keywords από το όνομα
    keywords = []
    
    # Πρόσθεσε keywords από το mapping
    for gr, en in gr_en_map.items():
        if gr.lower() in name.lower():
            for word in en.split():
                if word not in keywords:
                    keywords.append(word)
    
    # Πρόσθεσε αγγλικές λέξεις από το όνομα (μετά το ™)
    eng_part = re.split(r'[™®]', name)[-1].strip()
    if eng_part:
        # Κράτα λέξεις που είναι ήδη αγγλικές (κεφαλαίο + μικρά ή αρκτικόλεξα)
        eng_words = re.findall(r'[A-Z][a-z0-9]+', eng_part)
        for w in eng_words:
            w_lower = w.lower()
            if w_lower not in keywords and len(w_lower) > 2:
                keywords.append(w_lower)
    
    # Πρόσθεσε keywords από την περιγραφή
    desc_keywords = {
        'αδιάβροχο': 'waterproof',
        'αδιάβροχος': 'waterproof',
        'ασύρματη': 'wireless',
        'μπαταρία': 'battery',
        'τεχνολογία': 'technology',
        'νανο': 'nano',
        'AI': 'ai artificial intelligence',
        'τεχνητή νοημοσύνη': 'artificial intelligence ai',
        'θερμαινόμενο': 'heated warming',
        'θέρμανση': 'heating warm',
        'GPS': 'gps navigation',
        'κάμερα': 'camera',
        'λέιζερ': 'laser',
        'ηλιακή': 'solar',
        'αγκαλιά': 'hug cuddle',
        'όνειρο': 'dream',
        'ύπνο': 'sleep',
        'χρόνο': 'time travel clock',
        'φόρτιση': 'charging charger',
        'αδυνάτισμα': 'weight loss diet',
    }
    
    for gr, en in desc_keywords.items():
        if gr.lower() in description.lower():
            for word in en.split():
                if word not in keywords:
                    keywords.append(word)
    
    # Αν δεν βρέθηκαν keywords, χρησιμοποίησε το filename
    if not keywords:
        # Πάρε το όνομα αρχείου χωρίς extension
        base = name.lower()
        base = re.sub(r'[™®]', '', base)
        keywords = re.findall(r'[a-zA-Z]+', base)
    
    # Πάντα πρόσθεσε "product" ή "item" για καλύτερα αποτελέσματα
    if len(keywords) <= 2:
        keywords.append('product')
    
    return ' '.join(keywords[:6])  # Μέγιστο 6 λέξεις


def download_image_ddg(keywords, save_path, max_retries=3):
    """Αναζήτηση εικόνας στο DuckDuckGo και λήψη"""
    
    from duckduckgo_search import DDGS
    
    for attempt in range(max_retries):
        try:
            print(f"  🔍 Αναζήτηση: '{keywords}' (προσπάθεια {attempt+1}/{max_retries})")
            
            with DDGS() as ddgs:
                results = list(ddgs.images(
                    keywords=keywords,
                    max_results=5,
                    type_image="photo",
                    layout="Square",
                ))
            
            if not results:
                print(f"  ⚠ Δεν βρέθηκαν αποτελέσματα")
                return False
            
            # Πάρε το πρώτο αποτέλεσμα
            image_url = results[0]['image']
            
            print(f"  📥 Λήψη από: {image_url[:80]}...")
            
            # Κατέβασε την εικόνα
            req = urllib.request.Request(
                image_url,
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            )
            
            with urllib.request.urlopen(req, timeout=20) as response:
                with open(save_path, 'wb') as f:
                    f.write(response.read())
            
            # Έλεγξε αν κατέβηκε σωστά
            file_size = os.path.getsize(save_path)
            if file_size < 1000:  # Πολύ μικρό αρχείο = πιθανό error
                os.remove(save_path)
                print(f"  ⚠ Πολύ μικρό αρχείο ({file_size} bytes), παράβλεψη")
                return False
            
            print(f"  ✅ Αποθηκεύτηκε! ({file_size/1024:.1f} KB)")
            return True
            
        except Exception as e:
            print(f"  ✗ Σφάλμα: {e}")
            if attempt < max_retries - 1:
                wait = 2 * (attempt + 1)
                print(f"  ⏳ Αναμονή {wait} δευτερόλεπτα...")
                time.sleep(wait)
            else:
                print(f"  ✗ Απέτυχε μετά από {max_retries} προσπάθειες")
    
    return False


def main():
    print("=" * 60)
    print("🖼️  Scrape Images - Αυτόματο κατέβασμα εικόνων προϊόντων")
    print("=" * 60)
    
    # Διάβασε τα προϊόντα
    js_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'js', 'products.js')
    if not os.path.exists(js_path):
        print(f"✗ Δεν βρέθηκε το αρχείο: {js_path}")
        sys.exit(1)
    
    products = extract_products_from_js(js_path)
    print(f"\n📦 Βρέθηκαν {len(products)} προϊόντα\n")
    
    # Έλεγξε ποιες εικόνες λείπουν
    base_dir = os.path.dirname(os.path.abspath(__file__))
    missing = []
    existing = []
    
    for p in products:
        full_path = os.path.join(base_dir, p['image_path'])
        if os.path.exists(full_path):
            size = os.path.getsize(full_path)
            existing.append((p, size))
        else:
            missing.append(p)
    
    print(f"✅ Υπάρχουσες εικόνες: {len(existing)}")
    print(f"❌ Εικόνες που λείπουν: {len(missing)}\n")
    
    if not missing:
        print("🎉 Όλες οι εικόνες υπάρχουν ήδη!")
        return
    
    # Εμφάνισε τα προϊόντα που λείπουν
    print("Προϊόντα που χρειάζονται εικόνες:")
    print("-" * 60)
    for i, p in enumerate(missing, 1):
        keywords = generate_keywords(p['name'], p['description'])
        print(f"  {i}. {p['name']}")
        print(f"     Αρχείο: {p['filename']}")
        print(f"     Keywords: {keywords}")
        print()
    
    # Ζήτα επιβεβαίωση
    print("-" * 60)
    response = input(f"Θα γίνει λήψη {len(missing)} εικόνων. Να προχωρήσουμε; (y/n): ")
    
    if response.lower() != 'y':
        print("❌ Ακυρώθηκε.")
        return
    
    print("\n" + "=" * 60)
    print("🔄 Ξεκινάει η λήψη...")
    print("=" * 60 + "\n")
    
    # Κατέβασε κάθε εικόνα που λείπει
    success = 0
    fail = 0
    
    for i, p in enumerate(missing, 1):
        print(f"[{i}/{len(missing)}] {p['name']}")
        
        keywords = generate_keywords(p['name'], p['description'])
        save_path = os.path.join(base_dir, p['image_path'])
        
        # Δημιούργησε φάκελο αν δεν υπάρχει
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        if download_image_ddg(keywords, save_path):
            success += 1
        else:
            fail += 1
        
        print()  # Νέα γραμμή μεταξύ προϊόντων
        
        # Μικρή καθυστέρηση μεταξύ requests για αποφυγή rate limiting
        if i < len(missing):
            time.sleep(1.5)
    
    # Αποτελέσματα
    print("=" * 60)
    print(f"📊 ΑΠΟΤΕΛΕΣΜΑΤΑ")
    print("=" * 60)
    print(f"  ✅ Επιτυχείς λήψεις: {success}")
    print(f"  ❌ Αποτυχημένες: {fail}")
    print(f"  📦 Σύνολο: {len(missing)}")
    
    if fail > 0:
        print(f"\n⚠️  {fail} εικόνες απέτυχαν. Μπορείς να τις κατεβάσεις χειροκίνητα ή να ξανατρέξεις το script.")
    
    print("\n✨ Τέλος!")


if __name__ == '__main__':
    main()
