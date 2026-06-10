// ============================================================
// STORE - localStorage management
// ============================================================

const Store = {
    // Get data from localStorage
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem('temu_' + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    // Set data in localStorage
    set(key, value) {
        try {
            localStorage.setItem('temu_' + key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },

    // Remove data
    remove(key) {
        localStorage.removeItem('temu_' + key);
    },

    // Get user profile
    getUser() {
        return this.get('user', null);
    },

    // Save user profile
    setUser(user) {
        this.set('user', user);
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.getUser() !== null;
    },

    // Get cart
    getCart() {
        return this.get('cart', []);
    },

    // Save cart
    setCart(cart) {
        this.set('cart', cart);
        this.updateCartCount();
    },

    // Add to cart
    addToCart(productId, quantity = 1) {
        const cart = this.getCart();
        const existing = cart.find(item => item.productId === productId);
        
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }
        
        this.setCart(cart);
        return cart;
    },

    // Remove from cart
    removeFromCart(productId) {
        const cart = this.getCart().filter(item => item.productId !== productId);
        this.setCart(cart);
        return cart;
    },

    // Update quantity
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.productId === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
        }
        this.setCart(cart);
        return cart;
    },

    // Get cart count
    getCartCount() {
        return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
    },

    // Update cart count badge
    updateCartCount() {
        const count = this.getCartCount();
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    // Get orders
    getOrders() {
        return this.get('orders', []);
    },

    // Add order
    addOrder(order) {
        const orders = this.getOrders();
        orders.unshift(order);
        this.set('orders', orders);
        return order;
    },

    // Get visit count for tracking
    getVisitCount(orderId) {
        const visits = this.get('visits_' + orderId, 0);
        return visits;
    },

    // Increment visit count
    incrementVisit(orderId) {
        const visits = this.get('visits_' + orderId, 0);
        this.set('visits_' + orderId, visits + 1);
        return visits + 1;
    },

    // Get tracking phase based on visits
    getTrackingPhase(orderId) {
        const visits = this.getVisitCount(orderId);
        const phases = [
            { id: 0, label: 'Παραγγελία καταχωρήθηκε', icon: '📦', date: 'Σήμερα', completed: true },
            { id: 1, label: 'Ετοιμάζεται στην αποθήκη (Κίνα)', icon: '🏪', date: 'Σε 1-2 μέρες', completed: visits >= 1 },
            { id: 2, label: 'Αναχώρηση από Κίνα ✈️', icon: '✈️', date: 'Σε 3-4 μέρες', completed: visits >= 2 },
            { id: 3, label: 'Άφιξη στην Ελλάδα 🇬🇷', icon: '🌍', date: 'Σε 5-6 μέρες', completed: visits >= 3 },
            { id: 4, label: 'Στο κέντρο διανομής Αθηνών', icon: '🚚', date: 'Σε 7-8 μέρες', completed: visits >= 4 },
            { id: 5, label: 'Παραδόθηκε στο σπίτι σου! 🎉', icon: '📬', date: 'Παραδόθηκε!', completed: visits >= 5 }
        ];
        return phases;
    },

    // Get current active phase
    getCurrentPhase(orderId) {
        const phases = this.getTrackingPhase(orderId);
        for (let i = phases.length - 1; i >= 0; i--) {
            if (phases[i].completed) return i;
        }
        return 0;
    },

    // Get map position based on phase
    getMapPosition(phase) {
        const positions = [
            { x: '15%', y: '60%', label: 'Αποθήκη Κίνας' },
            { x: '25%', y: '50%', label: 'Κίνα ✈️' },
            { x: '50%', y: '40%', label: 'Πτήση προς Ελλάδα' },
            { x: '70%', y: '45%', label: 'Ελλάδα 🇬🇷' },
            { x: '80%', y: '50%', label: 'Αθήνα 🚚' },
            { x: '85%', y: '55%', label: 'Παραδόθηκε! 🎉' }
        ];
        return positions[Math.min(phase, positions.length - 1)];
    }
};
