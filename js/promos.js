// ============================================================
// PROMOS - Fake ads, popups, countdowns
// ============================================================

const Promos = {
    // Flash sale countdown timer
    flashTimerInterval: null,

    startFlashTimer() {
        // Set end time 4 hours from now
        let endTime = Date.now() + (4 * 60 * 60 * 1000);
        
        const updateTimer = () => {
            const now = Date.now();
            const diff = Math.max(0, endTime - now);
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.querySelectorAll('.timer-unit').forEach((el, i) => {
                if (i === 0) el.textContent = String(hours).padStart(2, '0');
                if (i === 1) el.textContent = String(minutes).padStart(2, '0');
                if (i === 2) el.textContent = String(seconds).padStart(2, '0');
            });
        };
        
        updateTimer();
        this.flashTimerInterval = setInterval(updateTimer, 1000);
    },

    // Show fake buyer notification popup
    showBuyerNotification() {
        const buyers = [
            { name: 'Μαρία', from: 'Αθήνα', product: 'Γυαλιά VR' },
            { name: 'Γιώργος', from: 'Θεσσαλονίκη', product: 'Σακάκι Air-Float' },
            { name: 'Ελένη', from: 'Πάτρα', product: 'Κρέμα DNA Repair' },
            { name: 'Νίκος', from: 'Ηράκλειο', product: 'AI Robot Dog' },
            { name: 'Σοφία', from: 'Λάρισα', product: 'Παπούτσια Anti-Gravity' },
            { name: 'Δημήτρης', from: 'Ιωάννινα', product: 'Καναπές Μασάζ' },
            { name: 'Κατερίνα', from: 'Βόλος', product: 'Laptop UltraBook' },
            { name: 'Αντώνης', from: 'Χανιά', product: 'Δράπανο Laser' }
        ];

        const showOne = () => {
            const buyer = buyers[Math.floor(Math.random() * buyers.length)];
            
            const popup = document.createElement('div');
            popup.className = 'popup-notification';
            popup.innerHTML = `
                <div class="popup-avatar">${['👩','👨','👩','👨','👩','👨','👩','👨'][Math.floor(Math.random()*8)]}</div>
                <div class="popup-text">
                    <strong>${buyer.name}</strong> από ${buyer.from}<br>
                    μόλις αγόρασε <strong>${buyer.product}</strong>! 🔥
                </div>
            `;
            
            document.body.appendChild(popup);
            
            setTimeout(() => {
                if (popup.parentNode) popup.remove();
            }, 5000);
        };

        // Show first one after 3 seconds
        setTimeout(showOne, 3000);
        
        // Then show every 8-15 seconds
        setInterval(() => {
            if (Math.random() > 0.3) showOne(); // 70% chance
        }, 8000 + Math.random() * 7000);
    },

    // Show coupon popup
    showCouponPopup() {
        // Only show once per session
        if (sessionStorage.getItem('coupon_shown')) return;
        sessionStorage.setItem('coupon_shown', 'true');

        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.className = 'coupon-overlay';
            
            const popup = document.createElement('div');
            popup.className = 'coupon-popup';
            popup.innerHTML = `
                <div class="coupon-icon">🎉</div>
                <div class="coupon-title">ΣΥΓΧΑΡΗΤΗΡΙΑ!</div>
                <p style="color: var(--gray-600); margin-bottom: 10px;">Επιλέχθηκες τυχαία για μια αποκλειστική προσφορά!</p>
                <div class="coupon-amount">€5.00</div>
                <p style="font-size: 14px; color: var(--gray-600); margin-bottom: 10px;">Έκπτωση στην επόμενη αγορά σου!</p>
                <div class="coupon-code">TEE5MOU</div>
                <p style="font-size: 12px; color: var(--gray-500); margin-bottom: 15px;">*Ισχύει για αγορές άνω των €50. Λήγει σε 24 ώρες.</p>
                <button class="coupon-btn" onclick="this.closest('.coupon-popup').remove();document.querySelector('.coupon-overlay').remove();">
                    🎁 ΧΡΗΣΙΜΟΠΟΙΗΣΕ ΤΟ
                </button>
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(popup);
            
            overlay.addEventListener('click', () => {
                popup.remove();
                overlay.remove();
            });
        }, 15000); // Show after 15 seconds
    },

    // Show stock warning on product cards
    addStockWarnings() {
        document.querySelectorAll('.product-stock').forEach(el => {
            const stock = parseInt(el.dataset.stock);
            if (stock <= 2) {
                el.textContent = `⚡ Μόνο ${stock} απέμειναν!`;
            } else if (stock <= 5) {
                el.textContent = `🔥 Μόνο ${stock} σε απόθεμα`;
            }
        });
    },

    // Generate random rating stars
    getStars(rating) {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
    },

    // Format price
    formatPrice(price) {
        return '€' + price.toFixed(2);
    },

    // Show "Someone bought this" on product page
    showLiveActivity(productName) {
        const container = document.getElementById('live-activity');
        if (!container) return;

        const activities = [
            `🛒 Κάποιος από Αθήνα πρόσθεσε ${productName} στο καλάθι`,
            `❤️ Η Μαρία αγόρασε ${productName} πριν 2 λεπτά`,
            `👀 12 άτομα βλέπουν αυτό το προϊόν τώρα`,
            `⚡ Μόνο ${Math.floor(Math.random() * 5) + 1} απέμειναν!`,
            `⭐ Ο Νίκος έδωσε 5 αστέρια για ${productName}`
        ];

        let i = 0;
        setInterval(() => {
            container.textContent = activities[i % activities.length];
            container.style.opacity = '0';
            setTimeout(() => { container.style.opacity = '1'; }, 100);
            i++;
        }, 4000);
    },

    // Clean up
    destroy() {
        if (this.flashTimerInterval) {
            clearInterval(this.flashTimerInterval);
        }
    }
};
