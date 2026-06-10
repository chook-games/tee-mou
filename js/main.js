// ============================================================
// MAIN - Global functions & initialization
// ============================================================

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    Store.updateCartCount();
    
    // Start flash sale timer if present
    if (document.querySelector('.flash-timer')) {
        Promos.startFlashTimer();
    }
    
    // Show buyer notifications
    Promos.showBuyerNotification();
    
    // Show coupon popup
    Promos.showCouponPopup();
    
    // Update user display
    updateUserDisplay();
    
    // Load products if on index page
    if (document.getElementById('product-grid')) {
        loadProducts();
    }
    
    // Load categories if on index page
    if (document.getElementById('categories-grid')) {
        loadCategories();
    }
    
    // Load cart items if on cart page
    if (document.getElementById('cart-items')) {
        loadCart();
    }
    
    // Load orders if on orders page
    if (document.getElementById('orders-list')) {
        loadOrders();
    }
    
    // Load tracking if on tracking page
    if (document.getElementById('tracking-timeline')) {
        loadTracking();
    }
    
    // Load product details if on product page
    if (document.getElementById('product-detail')) {
        loadProductDetail();
    }
    
    // Load all products if on all-products page
    if (document.getElementById('all-products-grid')) {
        loadAllProducts();
    }
});

// Update user display in header
function updateUserDisplay() {
    const user = Store.getUser();
    const userBtn = document.getElementById('user-btn');
    if (!userBtn) return;
    
    if (user) {
        userBtn.innerHTML = `
            <span class="icon">👤</span>
            <span>${user.name}</span>
        `;
        userBtn.href = 'profile.html';
    } else {
        userBtn.innerHTML = `
            <span class="icon">👤</span>
            <span>Είσοδος</span>
        `;
        userBtn.href = 'login.html';
    }
}

// Load products on homepage
function loadProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.id);
            Store.addToCart(productId);
            
            // Show feedback
            const originalText = this.textContent;
            this.textContent = '✅ Προστέθηκε!';
            this.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 1500);
        });
    });
    
    // Click on card to view product
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.dataset.id;
            window.location.href = `product.html?id=${productId}`;
        });
    });
}

// Create product card HTML
function createProductCard(product) {
    const stars = Promos.getStars(product.rating);
    const stockText = product.stock <= 2 ? `⚡ Μόνο ${product.stock} απέμειναν!` : 
                      product.stock <= 5 ? `🔥 Μόνο ${product.stock} σε απόθεμα` : '';
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="product-badge">${product.badge}</span>
            </div>
            <div class="product-info">
                <div class="product-category">${product.categoryName}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current-price">${Promos.formatPrice(product.price)}</span>
                    <span class="original-price">${Promos.formatPrice(product.originalPrice)}</span>
                    <span class="discount-badge">-${product.discount}%</span>
                </div>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span>(${product.reviews.toLocaleString()})</span>
                </div>
                ${stockText ? `<div class="product-stock" data-stock="${product.stock}">${stockText}</div>` : ''}
                <div class="product-shipping">🚚 ${product.shipping}</div>
                <button class="add-to-cart-btn" data-id="${product.id}">🛒 Πρόσθεσε στο καλάθι</button>
            </div>
        </div>
    `;
}

// Load categories on homepage
function loadCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;
    
    grid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="window.location.href='all-products.html?category=${cat.id}'">
            <div class="category-icon">${cat.icon}</div>
            <div class="category-name">${cat.name}</div>
        </div>
    `).join('');
}

// Load cart items
function loadCart() {
    const container = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    if (!container) return;
    
    const cart = Store.getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">🛒</div>
                <h2>Το καλάθι σου είναι άδειο</h2>
                <p>Αγόρασε ό,τι ονειρεύεσαι!</p>
                <a href="index.html" class="btn-primary">🛍️ Συνέχισε τις αγορές</a>
            </div>
        `;
        if (totalContainer) totalContainer.innerHTML = '';
        return;
    }
    
    let subtotal = 0;
    let html = '';
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;
        
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">${Promos.formatPrice(itemTotal)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="changeQty(${product.id}, -1)">−</button>
                    <span style="font-weight:700;font-size:18px;min-width:30px;text-align:center">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${product.id}, 1)">+</button>
                    <button class="qty-btn" onclick="removeItem(${product.id})" style="color:var(--accent);margin-left:10px;">🗑️</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    if (totalContainer) {
        const shipping = subtotal >= 50 ? 0 : 3.99;
        const total = subtotal + shipping;
        
        totalContainer.innerHTML = `
            <div class="cart-total">
                <div class="cart-total-row">
                    <span>Υποσύνολο</span>
                    <span>${Promos.formatPrice(subtotal)}</span>
                </div>
                <div class="cart-total-row">
                    <span>Μεταφορικά</span>
                    <span>${shipping === 0 ? '🚚 ΔΩΡΕΑΝ' : Promos.formatPrice(shipping)}</span>
                </div>
                ${subtotal < 50 ? `<div style="background:#fff0e6;padding:10px;border-radius:8px;font-size:13px;margin:10px 0;text-align:center;">
                    🎯 Πρόσθεσε ακόμα ${Promos.formatPrice(50 - subtotal)} για δωρεάν μεταφορικά!
                </div>` : ''}
                <div class="cart-total-row total">
                    <span>Σύνολο</span>
                    <span>${Promos.formatPrice(total)}</span>
                </div>
                <button class="btn-primary" style="width:100%;margin-top:15px;" onclick="checkout()">
                    ✅ Ολοκλήρωση αγοράς
                </button>
            </div>
        `;
    }
}

// Change quantity in cart
function changeQty(productId, delta) {
    const cart = Store.getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) {
            Store.removeFromCart(productId);
        } else {
            Store.updateQuantity(productId, newQty);
        }
        loadCart();
    }
}

// Remove item from cart
function removeItem(productId) {
    Store.removeFromCart(productId);
    loadCart();
}

// Checkout
function checkout() {
    if (!Store.isLoggedIn()) {
        alert('Πρέπει να συνδεθείς πρώτα!');
        window.location.href = 'login.html?redirect=cart.html';
        return;
    }
    window.location.href = 'checkout.html';
}

// Load orders
function loadOrders() {
    const container = document.getElementById('orders-list');
    if (!container) return;
    
    const orders = Store.getOrders();
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📦</div>
                <h2>Δεν έχεις κάνει ακόμα καμία παραγγελία</h2>
                <p>Ξεκίνα να αγοράζεις!</p>
                <a href="index.html" class="btn-primary">🛍️ Αγόρασε τώρα</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => {
        const phase = Store.getCurrentPhase(order.id);
        const phases = Store.getTrackingPhase(order.id);
        const currentPhase = phases[phase];
        
        return `
            <div class="cart-item" style="cursor:pointer;" onclick="window.location.href='tracking.html?id=${order.id}'">
                <div style="font-size:40px;">${currentPhase.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">Παραγγελία #${order.id}</div>
                    <div style="font-size:13px;color:var(--gray-500);">
                        ${order.items.map(i => i.name).join(', ')}
                    </div>
                    <div style="font-size:13px;color:var(--gray-500);">
                        ${new Date(order.date).toLocaleDateString('el-GR')}
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:700;color:var(--accent);font-size:18px;">${Promos.formatPrice(order.total)}</div>
                    <div style="font-size:12px;color:var(--success);font-weight:600;">${currentPhase.label}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Load tracking
function loadTracking() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    
    if (!orderId) {
        document.getElementById('tracking-container').innerHTML = `
            <div class="empty-state">
                <div class="icon">🔍</div>
                <h2>Δεν βρέθηκε παραγγελία</h2>
                <p>Επίλεξε μια παραγγελία από το ιστορικό σου</p>
                <a href="orders.html" class="btn-primary">📋 Οι παραγγελίες μου</a>
            </div>
        `;
        return;
    }
    
    // Increment visit
    Store.incrementVisit(parseInt(orderId));
    
    const phases = Store.getTrackingPhase(parseInt(orderId));
    const currentPhase = Store.getCurrentPhase(parseInt(orderId));
    const mapPos = Store.getMapPosition(currentPhase);
    
    // Update header
    document.getElementById('tracking-id').textContent = `Tracking #TEE${String(orderId).padStart(6, '0')}`;
    
    // Update map
    const mapContainer = document.getElementById('tracking-map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <img src="images/banners/banner2.jpg" alt="Map">
            <div class="map-pin" style="left:${mapPos.x};top:${mapPos.y};">📍</div>
            <div style="position:absolute;left:${mapPos.x};top:calc(${mapPos.y} + 35px);background:var(--white);padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;box-shadow:var(--shadow);transform:translateX(-50%);">
                ${mapPos.label}
            </div>
        `;
    }
    
    // Update timeline
    const timeline = document.getElementById('tracking-timeline');
    if (timeline) {
        timeline.innerHTML = phases.map((phase, i) => {
            let className = 'timeline-step';
            if (phase.completed) className += ' completed';
            if (i === currentPhase) className += ' active';
            
            return `
                <div class="${className}">
                    <div class="timeline-icon">${phase.icon}</div>
                    <div class="timeline-content">
                        <h3>${phase.label}</h3>
                        <p>${phase.date}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Load product detail page
function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }
    
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        window.location.href = 'index.html';
        return;
    }
    
    const container = document.getElementById('product-detail');
    const stars = Promos.getStars(product.rating);
    const stockText = product.stock <= 2 ? `⚡ Μόνο ${product.stock} απέμειναν!` : 
                      product.stock <= 5 ? `🔥 Μόνο ${product.stock} σε απόθεμα` : '✅ Σε απόθεμα';
    
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;">
            <div>
                <div style="border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);">
                    <img src="${product.image}" alt="${product.name}" style="width:100%;height:500px;object-fit:cover;">
                </div>
            </div>
            <div>
                <div style="font-size:13px;color:var(--gray-500);text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">
                    ${product.categoryName}
                </div>
                <h1 style="font-size:28px;font-weight:800;margin-bottom:10px;">${product.name}</h1>
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:15px;">
                    <span class="stars" style="font-size:18px;">${stars}</span>
                    <span style="font-size:14px;color:var(--gray-500);">${product.reviews.toLocaleString()} αξιολογήσεις</span>
                </div>
                <div style="display:flex;align-items:center;gap:15px;margin-bottom:15px;">
                    <span style="font-size:36px;font-weight:900;color:var(--accent);">${Promos.formatPrice(product.price)}</span>
                    <span style="font-size:20px;color:var(--gray-500);text-decoration:line-through;">${Promos.formatPrice(product.originalPrice)}</span>
                    <span style="background:#fff0e6;color:var(--primary);padding:4px 12px;border-radius:4px;font-size:14px;font-weight:700;">-${product.discount}%</span>
                </div>
                <div style="font-size:14px;color:var(--gray-600);margin-bottom:20px;line-height:1.7;">
                    ${product.description}
                </div>
                <div style="margin-bottom:20px;">
                    <h3 style="font-size:16px;font-weight:700;margin-bottom:10px;">✨ Χαρακτηριστικά:</h3>
                    <ul style="list-style:none;">
                        ${product.specs.map(s => `<li style="padding:6px 0;font-size:14px;color:var(--gray-700);">✅ ${s}</li>`).join('')}
                    </ul>
                </div>
                <div style="display:flex;align-items:center;gap:15px;margin-bottom:20px;">
                    <span style="font-size:14px;font-weight:600;color:${product.stock <= 2 ? 'var(--accent)' : 'var(--success)'};">${stockText}</span>
                    <span style="font-size:14px;color:var(--success);font-weight:600;">🚚 ${product.shipping}</span>
                </div>
                <div id="live-activity" style="background:#fff0e6;padding:12px;border-radius:8px;font-size:13px;margin-bottom:20px;transition:opacity 0.3s;">
                    👀 12 άτομα βλέπουν αυτό το προϊόν τώρα
                </div>
                <div style="display:flex;gap:15px;">
                    <button class="btn-primary" style="flex:1;font-size:18px;padding:16px;" onclick="buyNow(${product.id})">
                        🛒 Αγόρασε τώρα
                    </button>
                    <button class="btn-secondary" onclick="addToCartFromDetail(${product.id})">
                        🛍️ Πρόσθεσε στο καλάθι
                    </button>
                </div>
            </div>
        </div>
        <div style="margin-top:40px;">
            <h2 style="font-size:22px;font-weight:800;margin-bottom:20px;">⭐ Κριτικές</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:15px;">
                ${fakeReviews.map(r => `
                    <div style="background:var(--white);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow);">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                            <div style="width:35px;height:35px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--white);font-weight:700;">
                                ${r.name.charAt(0)}
                            </div>
                            <div>
                                <div style="font-weight:600;font-size:14px;">${r.name}</div>
                                <div style="color:var(--warning);font-size:12px;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                            </div>
                        </div>
                        <p style="font-size:14px;color:var(--gray-600);">${r.text}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Start live activity
    Promos.showLiveActivity(product.name);
}

// Buy now from product detail
function buyNow(productId) {
    Store.addToCart(productId);
    if (!Store.isLoggedIn()) {
        window.location.href = 'login.html?redirect=checkout.html';
    } else {
        window.location.href = 'checkout.html';
    }
}

// Add to cart from product detail
function addToCartFromDetail(productId) {
    Store.addToCart(productId);
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✅ Προστέθηκε!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 1500);
}

// Load all products (with optional category filter)
function loadAllProducts() {
    const grid = document.getElementById('all-products-grid');
    if (!grid) return;
    
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    
    let filteredProducts = products;
    let title = 'Όλα τα Προϊόντα';
    
    if (category) {
        const cat = categories.find(c => c.id === category);
        if (cat) {
            filteredProducts = products.filter(p => p.category === category);
            title = cat.name;
        }
    }
    
    document.getElementById('all-products-title').textContent = title;
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="icon">🔍</div>
                <h2>Δεν βρέθηκαν προϊόντα</h2>
                <p>Δοκίμασε άλλη κατηγορία</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    // Re-bind events
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.id);
            Store.addToCart(productId);
            const originalText = this.textContent;
            this.textContent = '✅ Προστέθηκε!';
            this.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 1500);
        });
    });
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.dataset.id;
            window.location.href = `product.html?id=${productId}`;
        });
    });
}
