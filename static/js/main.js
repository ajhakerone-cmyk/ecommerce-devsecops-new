// Shopping Cart Class
class Cart {
    constructor() {
        this.items = this.load();
        this.updateCount();
        this.init();
    }

    load() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : {};
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCount();
    }

    async add(productId) {
        try {
            const res = await fetch('/api/add-to-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, quantity: 1 })
            });
            const data = await res.json();
            if (data.success) {
                this.items[productId] = (this.items[productId] || 0) + 1;
                this.save();
                this.showMsg('Product added to cart!', 'success');
            }
        } catch {
            this.items[productId] = (this.items[productId] || 0) + 1;
            this.save();
            this.showMsg('Product added to cart!', 'success');
        }
    }

    async update(productId, quantity) {
        if (quantity <= 0) {
            delete this.items[productId];
        } else {
            this.items[productId] = quantity;
        }
        
        try {
            await fetch('/api/update-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, quantity: quantity })
            });
        } catch {}
        
        this.save();
        location.reload();
    }

    async remove(productId) {
        delete this.items[productId];
        try {
            await fetch('/api/remove-from-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId })
            });
        } catch {}
        this.save();
        location.reload();
    }

    updateCount() {
        const count = Object.values(this.items).reduce((a, b) => a + b, 0);
        const el = document.getElementById('cartCount');
        if (el) {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    showMsg(msg, type) {
        const toast = document.createElement('div');
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${msg}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    init() {
        // Add to cart buttons
        document.querySelectorAll('.add-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (id) this.add(id);
            });
        });
        
        // Cart quantity buttons
        document.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const span = document.getElementById(`qty-${id}`);
                if (span) this.update(id, parseInt(span.textContent) + 1);
            });
        });
        
        document.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const span = document.getElementById(`qty-${id}`);
                if (span && parseInt(span.textContent) > 1) {
                    this.update(id, parseInt(span.textContent) - 1);
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (id && confirm('Remove this item?')) this.remove(id);
            });
        });
    }
}

// Add animation
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
    
    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Newsletter subscription
    const newsletter = document.getElementById('newsletterForm');
    if (newsletter) {
        newsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletter.querySelector('input');
            if (input.value) {
                alert('Thank you for subscribing!');
                input.value = '';
            }
        });
    }
});