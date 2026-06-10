import urllib.request
import urllib.parse
import os

# Product images - using picsum.photos for real, beautiful photos
products = {
    "jacket": "https://picsum.photos/seed/jacket/400/400",
    "sofa": "https://picsum.photos/seed/sofa/400/400",
    "laptop": "https://picsum.photos/seed/laptop/400/400",
    "drill": "https://picsum.photos/seed/drill/400/400",
    "vr": "https://picsum.photos/seed/vr/400/400",
    "shoes": "https://picsum.photos/seed/shoes/400/400",
    "cream": "https://picsum.photos/seed/cream/400/400",
    "robot": "https://picsum.photos/seed/robot/400/400",
}

categories = {
    "fashion": "https://picsum.photos/seed/fashion/600/400",
    "home": "https://picsum.photos/seed/home/600/400",
    "tech": "https://picsum.photos/seed/tech/600/400",
    "tools": "https://picsum.photos/seed/tools/600/400",
    "gadgets": "https://picsum.photos/seed/gadgets/600/400",
    "sports": "https://picsum.photos/seed/sports/600/400",
    "beauty": "https://picsum.photos/seed/beauty/600/400",
    "toys": "https://picsum.photos/seed/toys/600/400",
}

banners = {
    "banner1": "https://picsum.photos/seed/megadeals/1200/400",
    "banner2": "https://picsum.photos/seed/map/1200/400",
    "banner3": "https://picsum.photos/seed/newarrivals/1200/400",
}

def download_images(folder, images):
    os.makedirs(folder, exist_ok=True)
    for name, url in images.items():
        filepath = os.path.join(folder, f"{name}.jpg")
        if not os.path.exists(filepath):
            try:
                print(f"Downloading {name}...")
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=15) as response:
                    with open(filepath, 'wb') as f:
                        f.write(response.read())
                print(f"  ✓ {name}.jpg saved!")
            except Exception as e:
                print(f"  ✗ Failed to download {name}: {e}")
        else:
            print(f"  - {name}.jpg already exists")

print("=== Downloading Product Images ===")
download_images("images/products", products)

print("\n=== Downloading Category Images ===")
download_images("images/categories", categories)

print("\n=== Downloading Banner Images ===")
download_images("images/banners", banners)

print("\n✅ All downloads complete!")
