// ============================================================
// ΠΡΟΪΟΝΤΑ - "Ο Tee mou, ti agorasa pali"
// ============================================================

const products = [
    {
        id: 1,
        name: "Designer Σακάκι Air-Float™",
        category: "fashion",
        categoryName: "Μόδα",
        price: 19.90,
        originalPrice: 249.00,
        discount: 92,
        description: "Πρωτοποριακό σακάκι με τεχνολογία Air-Float™ που σε κάνει να νιώθεις ότι πετάς! Αδιάβροχο, αντιανεμικό, με 12 τσέπες και ενσωματωμένο θερμαντικό σύστημα.",
        specs: ["Τεχνολογία Air-Float™", "Υλικό: Νανο-ίνες διαστήματος", "12 λειτουργικές τσέπες", "Θερμαινόμενο εσωτερικό", "Διαθέσιμο σε 8 χρώματα"],
        rating: 4.8,
        reviews: 1847,
        stock: 3,
        image: "images/products/jacket.jpg",
        badge: "ΠΩΛΗΣΗΡΙ",
        shipping: "Δωρεάν μεταφορικά"
    },
    {
        id: 2,
        name: "Έξυπνος Καναπές Μασάζ AI-9000™",
        category: "home",
        categoryName: "Σπίτι",
        price: 39.90,
        originalPrice: 599.00,
        discount: 93,
        description: "Ο καναπές που μασάζει μόνος του! Με τεχνητή νοημοσύνη που ανιχνεύει την κούραση σου και σε κάνει μασάζ πριν καν το ζητήσεις. Ενσωματωμένο σύστημα ήχου 5.1.",
        specs: ["AI ανίχνευση κούρασης", "16 προγράμματα μασάζ", "Ηχεία surround 5.1", "Θερμαινόμενος", "USB-C φόρτιση ενσωματωμένη"],
        rating: 4.9,
        reviews: 3215,
        stock: 1,
        image: "images/products/sofa.jpg",
        badge: "-93%",
        shipping: "Δωρεάν μεταφορικά"
    },
    {
        id: 3,
        name: "UltraBook Pro 5000TB™",
        category: "tech",
        categoryName: "Τεχνολογία",
        price: 49.90,
        originalPrice: 1299.00,
        discount: 96,
        description: "Το πιο ισχυρό laptop του κόσμου! Με 5000TB αποθηκευτικό χώρο, επεξεργαστή 128 πυρήνων και μπαταρία που διαρκεί 30 μέρες. Βάρος μόλις 200γρ!",
        specs: ["Επεξεργαστής 128 πυρήνων", "5000TB SSD", "Μπαταρία 30 ημερών", "Βάρος: 200γρ", "Οθόνη 16K HDR"],
        rating: 4.7,
        reviews: 4521,
        stock: 5,
        image: "images/products/laptop.jpg",
        badge: "ΠΡΟΣΦΟΡΑ",
        shipping: "Δωρεάν μεταφορικά"
    },
    {
        id: 4,
        name: "Υπερηχητικό Δράπανο Laser 4K™",
        category: "tools",
        categoryName: "Εργαλεία",
        price: 14.90,
        originalPrice: 149.00,
        discount: 90,
        description: "Το δράπανο που βλέπεις και στο μικροσκόπιο! Με ενσωματωμένη κάμερα 4K, λέιζερ ακριβείας και υπερηχητική τεχνολογία που τρυπάει και διαμάντια.",
        specs: ["Κάμερα 4K ενσωματωμένη", "Λέιζερ ακριβείας", "Υπερηχητική τεχνολογία", "1000W ισχύς", "Αντοχή σε διαμάντια"],
        rating: 4.6,
        reviews: 892,
        stock: 7,
        image: "images/products/drill.jpg",
        badge: "LIMITED",
        shipping: "Δωρεάν μεταφορικά"
    },
    {
        id: 5,
        name: "Γυαλιά VR HyperReality Pro™",
        category: "gadgets",
        categoryName: "Gadgets",
        price: 24.90,
        originalPrice: 399.00,
        discount: 94,
        description: "Μπες σε άλλη διάσταση! Ανάλυση 32K ανά μάτι, ασύρματη σύνδεση με τον εγκέφαλο και 10.000+ παιχνίδια προεγκατεστημένα. Μυρίζει και τον αέρα του εικονικού κόσμου!",
        specs: ["Ανάλυση 32K ανά μάτι", "Νευρωνική διεπαφή", "10.000+ παιχνίδια", "Αισθητήρας οσμής", "Μπαταρία 72 ωρών"],
        rating: 4.9,
        reviews: 6723,
        stock: 2,
        image: "images/products/vr.jpg",
        badge: "BEST SELLER",
        shipping: "Δωρεάν μεταφορικά"
    },
    {
        id: 6,
        name: "Παπούτσια Anti-Gravity Run™",
        category: "sports",
        categoryName: "Αθλητικά",
        price: 29.90,
        originalPrice: 299.00,
        discount: 90,
        description: "Τρέξε σαν να μην υπάρχει βαρύτητα! Με αντι-βαρυτική τεχνολογία που σε κάνει 90% ελαφρύτερο. Ενσωματωμένο GPS, βηματοδότη και αερόσακους ασφαλείας.",
        specs: ["Αντι-βαρυτική τεχνολογία", "Ενσωματωμένο GPS", "Αερόσακοι ασφαλείας", "Αυτόματο δέσιμο κορδονιών", "Φορτιζόμενα LED"],
        rating: 4.8,
        reviews: 2891,
        stock: 4,
        image: "images/products/shoes.jpg",
        badge: "TRENDING",
        shipping: "Δωρεάν μεταφορικά"
    },
    {
        id: 7,
        name: "Κρέμα Νεότητας DNA Repair™",
        category: "beauty",
        categoryName: "Ομορφιά",
        price: 9.90,
        originalPrice: 199.00,
        discount: 95,
        description: "Η κρέμα που γυρνάει τον χρόνο πίσω! Με νανοτεχνολογία DNA Repair που επιδιορθώνει το DNA σου ενώ κοιμάσαι. Αποτελέσματα ορατά σε 3 δευτερόλεπτα!",
        specs: ["Νανοτεχνολογία DNA Repair", "Αποτελέσματα σε 3 δευτ.", "Κατάλληλη για όλες τις ηλικίες", "SPF 5000", "Δερματολογικά ελεγμένη"],
        rating: 4.9,
        reviews: 15432,
        stock: 1,
        image: "images/products/cream.jpg",
        badge: "ΠΕΤΑΕΙ",
        shipping: "Δωρεάν μεταφορικά"
    },
    {
        id: 8,
        name: "AI Robot Dog ChatGPT-3000™",
        category: "toys",
        categoryName: "Παιχνίδια",
        price: 34.90,
        originalPrice: 449.00,
        discount: 92,
        description: "Ο σκύλος που δεν χρειάζεται βόλτα! Με ενσωματωμένο ChatGPT-3000 που συζητάει μαζί σου, σου φέρνει μπύρα και σου λέει ανθρώπινα ψέματα. Αδιάβροχος, άθραυστος, απίστευτος!",
        specs: ["ChatGPT-3000 ενσωματωμένο", "Σου φέρνει μπύρα", "Αδιάβροχος & άθραυστος", "Αναγνώριση συναισθημάτων", "Ουρά που κουνιέται μόνη της"],
        rating: 4.7,
        reviews: 9876,
        stock: 2,
        image: "images/products/robot.jpg",
        badge: "ΠΕΤΑΕΙ",
        shipping: "Δωρεάν μεταφορικά"
    }
];

// Categories data
const categories = [
    { id: "fashion", name: "Μόδα", icon: "👗", image: "images/categories/fashion.jpg" },
    { id: "home", name: "Σπίτι", icon: "🏠", image: "images/categories/home.jpg" },
    { id: "tech", name: "Τεχνολογία", icon: "💻", image: "images/categories/tech.jpg" },
    { id: "tools", name: "Εργαλεία", icon: "🔧", image: "images/categories/tools.jpg" },
    { id: "gadgets", name: "Gadgets", icon: "🎮", image: "images/categories/gadgets.jpg" },
    { id: "sports", name: "Αθλητικά", icon: "🏃", image: "images/categories/sports.jpg" },
    { id: "beauty", name: "Ομορφιά", icon: "💄", image: "images/categories/beauty.jpg" },
    { id: "toys", name: "Παιχνίδια", icon: "🧸", image: "images/categories/toys.jpg" }
];

// Fake reviews
const fakeReviews = [
    { name: "Μαρία Π.", text: "Το καλύτερο που έχω αγοράσει! Το συνιστώ ανεπιφύλακτα! ⭐⭐⭐⭐⭐", rating: 5 },
    { name: "Γιώργος Κ.", text: "Πολύ γρήγορη αποστολή, ήρθε σε 2 μέρες! Εξαιρετική ποιότητα!", rating: 5 },
    { name: "Ελένη Δ.", text: "Δεν το πιστεύω ότι τόσο φθηνά! Τέλειο για δώρο! ⭐⭐⭐⭐⭐", rating: 5 },
    { name: "Νίκος Α.", text: "5 αστέρια! Το είδα και το πήρα αμέσως, δεν το μετάνιωσα!", rating: 5 },
    { name: "Σοφία Μ.", text: "Απίστευτη σχέση ποιότητας-τιμής! Θα το ξαναπάρω σίγουρα!", rating: 5 },
    { name: "Δημήτρης Χ.", text: "Το παιδί μου το λάτρεψε! Παραγγέλνω ξανά! ⭐⭐⭐⭐⭐", rating: 5 },
    { name: "Κατερίνα Λ.", text: "Φαίνεται πανάκριβο! Όλοι με ρωτάνε που το βρήκα!", rating: 5 },
    { name: "Αντώνης Π.", text: "Επαγγελματική συσκευασία, γρήγορη παράδοση, άριστο προϊόν!", rating: 5 }
];

// Fake buyer notifications
const fakeBuyers = [
    "Η Μαρία από Αθήνα μόλις αγόρασε αυτό!",
    "Ο Γιώργος από Θεσσαλονίκη το έχει ήδη στο καλάθι!",
    "Η Ελένη από Πάτρα το αγόρασε πριν 2 λεπτά!",
    "Ο Νίκος από Ηράκλειο το βλέπει τώρα!",
    "Η Σοφία από Λάρισα το πρόσθεσε στα αγαπημένα!",
    "Ο Δημήτρης από Ιωάννινα μόλις το παρήγγειλε!",
    "Η Κατερίνα από Βόλο το αγόρασε 3 φορές!",
    "Ο Αντώνης από Χανιά το συνιστά σε όλους!"
];
