// Global shopping cart variable
let cart = [];

// Initialize after page load
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from local storage
    loadCartFromStorage();
    
    // Create cart panel
    createCartPanel();
    
    // Add click events to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('RM', '').replace(' / box', ''));
            
            // Check if item already exists in cart
            const existingItemIndex = findItemIndex(productName);
            
            if (existingItemIndex !== -1) {
                // If exists, increase quantity
                cart[existingItemIndex].quantity += 1;
            } else {
                // Otherwise add new item
                cart.push({
                    name: productName,
                    price: price,
                    quantity: 1
                });
            }
            
            // Save to local storage
            saveCartToStorage();
            
            // Update cart panel
            updateCartPanel();
            
            // Show add to cart animation
            showAddToCartAnimation(this);
            
            // Open cart panel
            openCartPanel();
        });
    });

    // Add page click event handling
    document.addEventListener('click', function(e) {
        if (e.target.matches('.cart-overlay')) {
            closeCartPanel();
        }
    });

    // Add key event, Esc key to close cart
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCartPanel();
        }
    });
});

// Find item index in cart
function findItemIndex(productName) {
    return cart.findIndex(item => item.name === productName);
}

// Save cart to local storage
function saveCartToStorage() {
    localStorage.setItem('cookieShopCart', JSON.stringify(cart));
}

// Load cart from local storage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cookieShopCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error parsing cart data', e);
            cart = [];
        }
    }
}

// Clear cart
function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartPanel();
}

// Open cart panel
function openCartPanel() {
    const cartPanel = document.querySelector('.cart-panel');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (cartPanel && cartOverlay) {
        cartOverlay.classList.add('show');
        cartPanel.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Close cart panel
function closeCartPanel() {
    const cartPanel = document.querySelector('.cart-panel');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (cartPanel && cartOverlay) {
        cartOverlay.classList.remove('show');
        cartPanel.classList.remove('show');
        document.body.style.overflow = ''; // Restore background scrolling
    }
}

// Create cart panel
function createCartPanel() {
    const cartPanelExists = document.querySelector('.cart-panel');
    if (cartPanelExists) return; // Avoid creating duplicates

    // Create background overlay
    const cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    document.body.appendChild(cartOverlay);

    // Add overlay styles
    const overlayStyle = document.createElement('style');
    overlayStyle.textContent = `
        .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .cart-overlay.show {
            opacity: 1;
            visibility: visible;
        }
    `;
    document.head.appendChild(overlayStyle);

    const cartPanel = document.createElement('div');
    cartPanel.className = 'cart-panel';
    cartPanel.innerHTML = `
        <div class="cart-panel-header">
            <h3>My Shopping Cart</h3>
            <button class="close-cart">&times;</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-panel-footer">
            <div class="cart-summary">
                <div class="cart-total">Total: <span>RM0.00</span></div>
                <div class="cart-count">0 items</div>
            </div>
            <div class="cart-actions">
                <button class="clear-cart">Clear Cart</button>
                <button class="checkout-btn">Checkout</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(cartPanel);
    
    // Bind close button event
    const closeCart = cartPanel.querySelector('.close-cart');
    closeCart.addEventListener('click', closeCartPanel);
    
    // Bind checkout button event
    const checkoutBtn = cartPanel.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                const total = calculateTotal();
                showPaymentOptions(total);
                closeCartPanel();
            } else {
                alert('Your cart is empty. Please add items first.');
            }
        });
    }
    
    // Bind clear cart button event
    const clearCartBtn = cartPanel.querySelector('.clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
            }
        });
    }

    // Initialize cart panel update
    updateCartPanel();
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Update cart panel
function updateCartPanel() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-panel .cart-total span');
    const cartCount = document.querySelector('.cart-panel .cart-count');
    
    if (!cartItems || !cartTotal || !cartCount) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span class="material-icons">shopping_cart</span>
                <p>Your cart is empty</p>
                <p>Add some delicious cookies!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.style.animationDelay = `${index * 0.1}s`;
            cartItem.innerHTML = `
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">
                    <div class="cart-item-price">RM${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-item" data-index="${index}">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
            
            // Delete button event
            const removeButton = cartItem.querySelector('.remove-item');
            removeButton.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeItemWithAnimation(cartItem, index);
            });
            
            // Minus button event
            const minusButton = cartItem.querySelector('.quantity-btn.minus');
            minusButton.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    saveCartToStorage();
                    updateCartPanel();
                } else {
                    removeItemWithAnimation(cartItem, index);
                }
            });
            
            // Plus button event
            const plusButton = cartItem.querySelector('.quantity-btn.plus');
            plusButton.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
                saveCartToStorage();
                updateCartPanel();
            });
        });
    }
    
    // Update total amount
    const total = calculateTotal();
    cartTotal.textContent = `RM${total.toFixed(2)}`;
    
    // Update item count
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
}

// Remove item with animation
function removeItemWithAnimation(cartItem, index) {
    cartItem.classList.add('removing');
    setTimeout(() => {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartPanel();
    }, 300);
}

// Show add to cart animation
function showAddToCartAnimation(button) {
    // Create animation element
    const anim = document.createElement('div');
    anim.className = 'add-to-cart-animation';
    anim.innerHTML = '<span class="material-icons">shopping_cart</span>';
    
    // Get button position
    const buttonRect = button.getBoundingClientRect();
    
    // Position animation element
    anim.style.position = 'fixed';
    anim.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
    anim.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
    anim.style.zIndex = '9999';
    anim.style.transform = 'translate(-50%, -50%) scale(0)';
    anim.style.opacity = '0';
    anim.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // Add to DOM
    document.body.appendChild(anim);
    
    // Trigger animation
    setTimeout(() => {
        anim.style.transform = 'translate(-50%, -50%) scale(1.5)';
        anim.style.opacity = '1';
    }, 10);
    
    // Remove after animation completes
    setTimeout(() => {
        anim.style.transform = 'translate(-50%, -50%) scale(0)';
        anim.style.opacity = '0';
        setTimeout(() => anim.remove(), 500);
    }, 1000);
}

// Show payment options
function showPaymentOptions(total) {
    // Create payment overlay
    const overlay = document.createElement('div');
    overlay.className = 'payment-overlay';
    
    // Create payment panel
    const panel = document.createElement('div');
    panel.className = 'payment-panel';
    
    panel.innerHTML = `
        <div class="payment-header">
            <h3>Select Payment Method</h3>
            <div class="payment-close">&times;</div>
        </div>
        <div class="payment-order-summary">
            <h4>Order Summary</h4>
            <div class="order-items">
                ${cart.map(item => `
                    <div class="order-item">
                        <span class="order-item-name">${item.name} × ${item.quantity}</span>
                        <span class="order-item-price">RM${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <span>Total:</span>
                <span class="payment-total">RM${total.toFixed(2)}</span>
            </div>
        </div>
        <div class="payment-options">
            <div class="payment-option" data-method="tng">
                <img src="img/tng-ewallet.svg" alt="TNG eWallet" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'40\'><rect width=\'80\' height=\'40\' fill=\'%23FF6600\'/><text x=\'30\' y=\'25\' font-family=\'Arial\' font-size=\'10\' text-anchor=\'middle\' fill=\'white\'>TNG eWallet</text></svg>';">
                <span>Touch 'n Go eWallet</span>
            </div>
            <div class="payment-option" data-method="cash">
                <span class="material-icons">whatsapp</span>
                <span>WhatsApp Order</span>
            </div>
        </div>
        <div class="payment-details"></div>
    `;
    
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    
    // Show payment overlay with animation
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    
    // Close button event
    const closeBtn = panel.querySelector('.payment-close');
    closeBtn.addEventListener('click', function() {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 400);
    });
    
    // Escape key to close
    document.addEventListener('keydown', function escKeyHandler(e) {
        if (e.key === 'Escape') {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 400);
            document.removeEventListener('keydown', escKeyHandler);
        }
    });
    
    // Payment method selection
    const paymentOptions = panel.querySelectorAll('.payment-option');
    const paymentDetails = panel.querySelector('.payment-details');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Remove selected class from all options
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Show appropriate payment form
            if (method === 'tng') {
                showTngPaymentForm(paymentDetails, total);
            } else if (method === 'cash') {
                showCashPaymentForm(paymentDetails, total);
            }
        });
    });
    
    // Automatically select first payment option
    if (paymentOptions.length > 0) {
        setTimeout(() => {
            paymentOptions[0].click();
        }, 300);
    }
}

// Show TNG payment form
function showTngPaymentForm(container, total) {
    container.innerHTML = `
        <div class="tng-payment-form">
            <div class="tng-qrcode">
                <img src="img/tng-qr-rebacca.jpg" alt="TNG QR Code" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'250\' height=\'250\'><rect width=\'250\' height=\'250\' fill=\'%23eee\'/><text x=\'125\' y=\'125\' font-family=\'Arial\' font-size=\'16\' text-anchor=\'middle\' fill=\'%23888\'>QR Code</text></svg>';">
            </div>
            <p class="tng-instruction">Scan the QR code with your Touch 'n Go eWallet app, then click "Confirm Payment" below.</p>
            <button class="payment-button" onclick="confirmTngPayment()">Confirm Payment</button>
        </div>
    `;
    
    // Add global confirmTngPayment function
    window.confirmTngPayment = function() {
        confirmPayment('tng');
    };
}

// Show cash payment form
function showCashPaymentForm(container, total) {
    // Create order text for WhatsApp
    const orderText = cart.map(item => `${item.name} × ${item.quantity}`).join(', ');
    const whatsappMessage = `Hello, I would like to place an order:\n\n${cart.map(item => `${item.name} × ${item.quantity} - RM${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\nTotal: RM${total.toFixed(2)}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    container.innerHTML = `
        <div class="whatsapp-payment">
            <div class="whatsapp-icon">
                <img src="img/whatsapp-icon.png" alt="WhatsApp" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'80\'><rect width=\'80\' height=\'80\' fill=\'%2325D366\'/><text x=\'40\' y=\'45\' font-family=\'Arial\' font-size=\'12\' text-anchor=\'middle\' fill=\'white\'>WhatsApp</text></svg>';">
            </div>
            <h3>Order via WhatsApp</h3>
            <p>Complete your order through WhatsApp for cash on delivery or other payment arrangements.</p>
            <div class="whatsapp-orders-preview">
                <h4>Your Order:</h4>
                ${cart.map(item => `
                    <div class="whatsapp-order-item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">× ${item.quantity}</span>
                        <span class="item-price">RM${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
                <div class="order-item-more">
                    <strong>Total: RM${total.toFixed(2)}</strong>
                </div>
            </div>
            <div class="whatsapp-contacts">
                <a href="https://wa.me/60123456789?text=${encodedMessage}" target="_blank" class="whatsapp-button">
                    <span class="whatsapp-button-icon"></span>
                    Contact on WhatsApp
                </a>
            </div>
            <p style="margin-top: 15px; font-size: 0.9rem; color: #666; text-align: center;">After sending your message, click the button below to confirm your order</p>
            <button class="payment-button" style="margin-top: 15px;" onclick="confirmPayment('whatsapp')">Confirm Order</button>
        </div>
    `;
    
    // Add event for the whatsapp button
    const whatsappButton = container.querySelector('.whatsapp-button');
    whatsappButton.addEventListener('click', function(e) {
        // Open in new tab but don't need to handle confirmation separately
        // as we now have a dedicated confirm button
        this.style.backgroundColor = '#128C7E';
        this.textContent = 'WhatsApp Opened';
    });
}

// Show payment success
function showPaymentSuccess(panel, paymentMethod) {
    // Clear panel content
    panel.innerHTML = '';
    
    // Create success content
    const successDiv = document.createElement('div');
    successDiv.className = 'payment-success';
    
    let successMessage = '';
    
    if (paymentMethod === 'tng') {
        successMessage = `
            <span class="material-icons">check_circle</span>
            <h3>Payment Successful!</h3>
            <p>Thank you for your purchase.</p>
            <p>Your order has been confirmed.</p>
            <p>We'll prepare your cookies right away.</p>
            <button id="success-close-btn" class="payment-button">Close</button>
        `;
    } else if (paymentMethod === 'whatsapp') {
        successMessage = `
            <span class="material-icons">check_circle</span>
            <h3>Order Confirmed!</h3>
            <p>Thank you for your purchase.</p>
            <p>We'll contact you shortly to confirm your order.</p>
            <button id="success-close-btn" class="payment-button">Close</button>
        `;
    }
    
    successDiv.innerHTML = successMessage;
    panel.appendChild(successDiv);
    
    // Add close button event
    const closeButton = panel.querySelector('#success-close-btn');
    closeButton.addEventListener('click', function() {
        const overlay = panel.closest('.payment-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 400);
            
            // Clear cart after successful order
            clearCart();
        }
    });
}

// Fix placeholder images on error
document.addEventListener('DOMContentLoaded', function() {
    handleMissingImages();
    
    // Make sections visible when scrolled into view
    const animatedSections = document.querySelectorAll('section');
    let observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedSections.forEach(section => {
        section.classList.add('animated-section');
        observer.observe(section);
    });
    
    // Scroll to sections smoothly
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Check if scrolled past hero for sticky header
    function checkScroll() {
        const header = document.querySelector('header');
        const hero = document.querySelector('#hero');
        if (hero) {
            if (window.scrollY > hero.offsetHeight) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check
});

// Handle missing images
function handleMissingImages() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            // Check if we have a placeholder defined
            if (this.hasAttribute('data-placeholder') && this.hasAttribute('data-color')) {
                const placeholder = this.getAttribute('data-placeholder');
                const color = this.getAttribute('data-color');
                
                this.style.display = 'none';
                const parent = this.parentNode;
                
                if (parent.classList.contains('about-image-container')) {
                    parent.classList.add('placeholder-active');
                }
            }
        });
    });
}

// Handle checkout process
function handleCheckout() {
    if (cart.length > 0) {
        const total = calculateTotal();
        showPaymentOptions(total);
    } else {
        alert('Your cart is empty. Please add items first.');
    }
}

// Confirm payment
function confirmPayment(paymentMethod) {
    // Get payment panel
    const panel = document.querySelector('.payment-panel');
    if (!panel) return;
    
    // For TNG, show a loading state
    if (paymentMethod === 'tng') {
        const paymentButton = panel.querySelector('.payment-button');
        if (paymentButton) {
            paymentButton.disabled = true;
            paymentButton.textContent = 'Processing...';
        }
        
        // Simulate payment processing
        setTimeout(() => {
            showPaymentSuccess(panel, paymentMethod);
        }, 2000);
    } else if (paymentMethod === 'whatsapp') {
        showPaymentSuccess(panel, paymentMethod);
    }
}

// Make these functions accessible globally
window.openCartPanel = openCartPanel;
window.closeCartPanel = closeCartPanel;
window.handleCheckout = handleCheckout;
window.confirmPayment = confirmPayment;
window.confirmTngPayment = function() {
    confirmPayment('tng');
}; 