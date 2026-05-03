<<<<<<< HEAD
// Cart management
let cartCount = 0;

// Initialize cart from session
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Add event listeners to all add-to-cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.closest('.product-card').dataset.id;
            addToCart(productId);
        });
    });
});

function addToCart(productId) {
    fetch(`/add-to-cart/${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateCartCount(data.cart_count);
                showNotification('Item added to cart!', 'success');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to add item to cart', 'error');
        });
}

function updateCartCount(count) {
    if (count !== undefined) {
        cartCount = count;
    }
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;
    const url = new URL(window.location.href);
    
    if (category) {
        url.searchParams.set('category', category);
    } else {
        url.searchParams.delete('category');
    }
    
    window.location.href = url.toString();
}

// Search functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const title = product.querySelector('h3').textContent.toLowerCase();
            const description = product.querySelector('.description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }, 300));
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
=======
// Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.cart = {};
        this.loadCart();
        this.updateCartDisplay();
        this.attachEventListeners();
    }

    loadCart() {
        const savedCart = localStorage.getItem('techstore_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('techstore_cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.updateCartDisplay();
    }

    async addToCart(productId, quantity = 1) {
        try {
            const response = await fetch('/api/add-to-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, quantity: quantity })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.cart[productId] = (this.cart[productId] || 0) + quantity;
                    this.saveCart();
                    this.showNotification('Product added to cart!', 'success');
                    
                    // Animate the cart icon
                    const cartIcon = document.querySelector('.cart-icon');
                    if (cartIcon) {
                        cartIcon.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            cartIcon.style.transform = 'scale(1)';
                        }, 300);
                    }
                    return true;
                }
            }
            throw new Error('API error');
        } catch (error) {
            // Fallback to localStorage
            this.cart[productId] = (this.cart[productId] || 0) + quantity;
            this.saveCart();
            this.showNotification('Product added to cart!', 'success');
            return true;
        }
    }

    async updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            await this.removeItem(productId);
            return;
        }
        
        try {
            const response = await fetch('/api/update-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId, quantity: quantity })
            });
            
            if (response.ok) {
                this.cart[productId] = quantity;
                this.saveCart();
                if (window.location.pathname === '/cart') {
                    location.reload();
                }
            }
        } catch (error) {
            this.cart[productId] = quantity;
            this.saveCart();
            if (window.location.pathname === '/cart') {
                location.reload();
            }
        }
    }

    async removeItem(productId) {
        try {
            const response = await fetch('/api/remove-from-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: productId })
            });
            
            if (response.ok) {
                delete this.cart[productId];
                this.saveCart();
                if (window.location.pathname === '/cart') {
                    location.reload();
                }
            }
        } catch (error) {
            delete this.cart[productId];
            this.saveCart();
            if (window.location.pathname === '/cart') {
                location.reload();
            }
        }
    }

    async checkout() {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.cart = {};
                this.saveCart();
                this.showNotification(`Order placed! Order ID: ${data.order_id}`, 'success');
                setTimeout(() => {
                    window.location.href = `/order-confirmation/${data.order_id}`;
                }, 2000);
            } else {
                this.showNotification('Checkout failed. Please try again.', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    updateCartCount() {
        const count = Object.values(this.cart).reduce((a, b) => a + b, 0);
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    updateCartDisplay() {
        if (window.location.pathname === '/cart') {
            // Cart page will handle its own display via reload
        }
    }

    attachEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.removeEventListener('click', this.handleAddToCart);
            button.addEventListener('click', this.handleAddToCart.bind(this));
        });
        
        // Quantity buttons on cart page
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.removeEventListener('click', this.handleQuantityPlus);
            btn.addEventListener('click', this.handleQuantityPlus.bind(this));
        });
        
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.removeEventListener('click', this.handleQuantityMinus);
            btn.addEventListener('click', this.handleQuantityMinus.bind(this));
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.removeEventListener('click', this.handleRemoveItem);
            btn.addEventListener('click', this.handleRemoveItem.bind(this));
        });
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.removeEventListener('click', this.handleCheckout);
            checkoutBtn.addEventListener('click', this.handleCheckout.bind(this));
        }
    }

    handleAddToCart(event) {
        const button = event.currentTarget;
        const productId = button.getAttribute('data-product-id');
        if (productId) {
            // Add loading effect
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            button.disabled = true;
            
            this.addToCart(productId, 1).then(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }).catch(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            });
        }
    }

    handleQuantityPlus(event) {
        const button = event.currentTarget;
        const productId = button.getAttribute('data-product-id');
        const input = document.getElementById(`qty-${productId}`);
        if (input && productId) {
            const newQty = parseInt(input.value) + 1;
            this.updateQuantity(productId, newQty);
        }
    }

    handleQuantityMinus(event) {
        const button = event.currentTarget;
        const productId = button.getAttribute('data-product-id');
        const input = document.getElementById(`qty-${productId}`);
        if (input && productId) {
            const newQty = parseInt(input.value) - 1;
            this.updateQuantity(productId, newQty);
        }
    }

    handleRemoveItem(event) {
        const button = event.currentTarget;
        const productId = button.getAttribute('data-product-id');
        if (productId) {
            if (confirm('Remove this item from cart?')) {
                this.removeItem(productId);
            }
        }
    }

    handleCheckout() {
        this.checkout();
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="font-size: 1.25rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            zIndex: '2000',
            animation: 'slideIn 0.3s ease',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer'
        });
        
        notification.onclick = () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        };
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}

// Add animation styles to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    /* Smooth scrolling */
    html {
        scroll-behavior: smooth;
    }
    
    /* Loading animation for buttons */
    .add-to-cart:active {
        transform: scale(0.98);
    }
    
    .add-to-cart:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    /* Hover effects */
    .product-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Quantity input styling */
    .quantity-input {
        -moz-appearance: textfield;
    }
    
    .quantity-input::-webkit-inner-spin-button,
    .quantity-input::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    /* Cart icon animation */
    .cart-icon {
        transition: transform 0.3s ease;
        display: inline-block;
    }
    
    /* Loading spinner for recommended products */
    .loading-spinner {
        text-align: center;
        padding: 2rem;
        color: var(--gray);
        font-size: 0.9rem;
    }
    
    .loading-spinner::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid var(--gray-light);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-right: 0.5rem;
        vertical-align: middle;
    }
    
    /* Scroll to top button */
    .scroll-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 45px;
        height: 45px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        z-index: 999;
        box-shadow: var(--shadow-md);
    }
    
    .scroll-top:hover {
        transform: translateY(-3px);
        background: var(--primary-dark);
    }
    
    .scroll-top.show {
        display: flex;
    }
`;
document.head.appendChild(style);

// Global function for add to cart (for dynamic elements)
window.addToCart = async function(productId) {
    if (window.cart) {
        await window.cart.addToCart(productId, 1);
    } else {
        console.error('Cart not initialized');
        // Initialize cart if not exists
        window.cart = new ShoppingCart();
        await window.cart.addToCart(productId, 1);
    }
};

// Scroll to top functionality
function initScrollTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart only once
    if (!window.cartInitialized) {
        window.cart = new ShoppingCart();
        window.cartInitialized = true;
    }
    
    // Initialize scroll to top
    initScrollTop();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            if (email) {
                window.cart.showNotification('Thank you for subscribing!', 'success');
                newsletterForm.reset();
            }
        });
    }
    
    // Add to cart buttons event delegation for dynamically added buttons
    document.body.addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.add-to-cart');
        if (addToCartBtn && !addToCartBtn.disabled) {
            const productId = addToCartBtn.getAttribute('data-product-id');
            if (productId && window.cart) {
                e.preventDefault();
                window.cart.addToCart(productId, 1);
            }
        }
        
        const addToCartSmBtn = e.target.closest('.add-to-cart-sm');
        if (addToCartSmBtn && !addToCartSmBtn.disabled) {
            const productId = addToCartSmBtn.getAttribute('data-product-id');
            if (productId && window.cart) {
                e.preventDefault();
                window.cart.addToCart(productId, 1);
            }
        }
    });
});

// Export for debugging (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart };
>>>>>>> e7ad686 (Updated DevSecOps pipeline, Terraform IaC security fixes, Checkov improvements)
}