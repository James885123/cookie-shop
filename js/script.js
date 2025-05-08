// 定义全局购物车变量
let cart = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从本地存储加载购物车
    loadCartFromStorage();
    
    // 创建购物车面板
    createCartPanel();
    
    // 为所有加入购物车按钮添加点击事件
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('RM', '').replace(' / 盒', ''));
            
            // 检查商品是否已在购物车中
            const existingItemIndex = findItemIndex(productName);
            
            if (existingItemIndex !== -1) {
                // 如果已存在，增加数量
                cart[existingItemIndex].quantity += 1;
            } else {
                // 否则添加新商品
                cart.push({
                    name: productName,
                    price: price,
                    quantity: 1
                });
            }
            
            // 保存到本地存储
            saveCartToStorage();
            
            // 更新购物车面板
            updateCartPanel();
            
            // 显示添加成功动画
            showAddToCartAnimation(this);
            
            // 打开购物车面板
            openCartPanel();
        });
    });

    // 添加页面点击事件处理
    document.addEventListener('click', function(e) {
        if (e.target.matches('.cart-overlay')) {
            closeCartPanel();
        }
    });

    // 添加按键事件，Esc键关闭购物车
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCartPanel();
        }
    });
});

// 查找商品在购物车中的索引
function findItemIndex(productName) {
    return cart.findIndex(item => item.name === productName);
}

// 保存购物车到本地存储
function saveCartToStorage() {
    localStorage.setItem('cookieShopCart', JSON.stringify(cart));
}

// 从本地存储加载购物车
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cookieShopCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('购物车数据解析错误', e);
            cart = [];
        }
    }
}

// 清空购物车
function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartPanel();
}

// 打开购物车面板
function openCartPanel() {
    const cartPanel = document.querySelector('.cart-panel');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (cartPanel && cartOverlay) {
        cartOverlay.classList.add('show');
        cartPanel.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
}

// 关闭购物车面板
function closeCartPanel() {
    const cartPanel = document.querySelector('.cart-panel');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (cartPanel && cartOverlay) {
        cartOverlay.classList.remove('show');
        cartPanel.classList.remove('show');
        document.body.style.overflow = ''; // 恢复背景滚动
    }
}

// 创建购物车面板
function createCartPanel() {
    const cartPanelExists = document.querySelector('.cart-panel');
    if (cartPanelExists) return; // 避免重复创建

    // 创建背景遮罩
    const cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    document.body.appendChild(cartOverlay);

    // 添加背景遮罩样式
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
            <h3>我的购物车</h3>
            <button class="close-cart">&times;</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-panel-footer">
            <div class="cart-summary">
                <div class="cart-total">总计: <span>RM0.00</span></div>
                <div class="cart-count">共 0 件商品</div>
            </div>
            <div class="cart-actions">
                <button class="clear-cart">清空购物车</button>
                <button class="checkout-btn">去结算</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(cartPanel);
    
    // 绑定关闭按钮事件
    const closeCart = cartPanel.querySelector('.close-cart');
    closeCart.addEventListener('click', closeCartPanel);
    
    // 绑定结算按钮事件
    const checkoutBtn = cartPanel.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                const total = calculateTotal();
                showPaymentOptions(total);
                closeCartPanel();
            } else {
                alert('购物车是空的，请先添加商品');
            }
        });
    }
    
    // 绑定清空购物车按钮事件
    const clearCartBtn = cartPanel.querySelector('.clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('确定要清空购物车吗？')) {
                clearCart();
            }
        });
    }

    // 初始化更新购物车面板
    updateCartPanel();
}

// 计算购物车总价
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// 更新购物车面板
function updateCartPanel() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-panel .cart-total span');
    const cartCount = document.querySelector('.cart-panel .cart-count');
    
    if (!cartItems || !cartTotal || !cartCount) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span class="material-icons">shopping_cart</span>
                <p>购物车是空的</p>
                <p>请添加一些美味的曲奇吧！</p>
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
            
            // 删除按钮事件
            const removeButton = cartItem.querySelector('.remove-item');
            removeButton.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeItemWithAnimation(cartItem, index);
            });
            
            // 减少数量按钮事件
            const minusButton = cartItem.querySelector('.minus');
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
            
            // 增加数量按钮事件
            const plusButton = cartItem.querySelector('.plus');
            plusButton.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
                saveCartToStorage();
                updateCartPanel();
                
                // 显示数量增加动画
                const quantitySpan = this.parentElement.querySelector('.quantity');
                quantitySpan.classList.add('quantity-changed');
                setTimeout(() => {
                    quantitySpan.classList.remove('quantity-changed');
                }, 300);
            });
        });
    }
    
    // 更新总计和商品数量
    const total = calculateTotal();
    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
    
    cartTotal.textContent = `RM${total.toFixed(2)}`;
    cartCount.textContent = `共 ${itemCount} 件商品`;

    // 添加数量变化动画样式
    const quantityStyle = document.createElement('style');
    quantityStyle.textContent = `
        .quantity-changed {
            animation: pulse 0.3s ease;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); color: var(--primary-color); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(quantityStyle);
}

// 带动画效果地移除商品
function removeItemWithAnimation(cartItem, index) {
    cartItem.style.transition = 'all 0.3s ease';
    cartItem.style.transform = 'translateX(100%)';
    cartItem.style.opacity = '0';
                
    setTimeout(() => {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartPanel();
    }, 300);
}

// 显示添加到购物车动画
function showAddToCartAnimation(button) {
    // 创建动画元素
    const animation = document.createElement('div');
    animation.className = 'add-to-cart-animation';
    animation.innerHTML = `
        <div class="animation-content">
            <span class="material-icons">check_circle</span>
            <span>已添加到购物车</span>
        </div>
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        .add-to-cart-animation {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .add-to-cart-animation.show {
            transform: translateX(0);
        }
        .animation-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .animation-content .material-icons {
            font-size: 24px;
            animation: bounceIn 0.5s;
        }
        @keyframes bounceIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // 添加到页面
    document.body.appendChild(animation);
    
    // 显示动画
    setTimeout(() => {
        animation.classList.add('show');
    }, 10);
    
    // 3秒后移除
    setTimeout(() => {
        animation.classList.remove('show');
        setTimeout(() => {
            animation.remove();
        }, 400);
    }, 3000);

    // 添加产品飞入购物车效果
    const productCard = button.closest('.product-card');
    const productImg = productCard.querySelector('img');
    const cartPanel = document.querySelector('.cart-panel');
    
    if (productImg && cartPanel) {
        const imgClone = document.createElement('div');
        imgClone.className = 'flying-product';
        
        const imgRect = productImg.getBoundingClientRect();
        const targetRect = cartPanel.getBoundingClientRect();
        
        imgClone.style.cssText = `
            position: fixed;
            width: 50px;
            height: 50px;
            top: ${imgRect.top + imgRect.height/2 - 25}px;
            left: ${imgRect.left + imgRect.width/2 - 25}px;
            background-image: url(${productImg.src});
            background-size: cover;
            background-position: center;
            border-radius: 50%;
            z-index: 9999;
            opacity: 0.9;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
        `;
        
        document.body.appendChild(imgClone);
        
        // 触发飞行动画
        setTimeout(() => {
            imgClone.style.transform = 'scale(0.3)';
            imgClone.style.top = `${targetRect.top + 20}px`;
            imgClone.style.left = `${targetRect.right - 30}px`;
            imgClone.style.opacity = '0';
        }, 10);
        
        // 动画完成后移除
        setTimeout(() => {
            imgClone.remove();
        }, 800);
    }
}

// 显示支付选项面板
function showPaymentOptions(total) {
    // 创建支付选项面板
    const paymentOverlay = document.createElement('div');
    paymentOverlay.className = 'payment-overlay';
    
    const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
    
    // 检测是否为移动设备
    const isMobile = window.innerWidth < 768;
    
    const paymentPanel = document.createElement('div');
    paymentPanel.className = 'payment-panel';
    paymentPanel.style.maxHeight = isMobile ? '90vh' : '85vh';
    paymentPanel.style.overflow = 'auto';
    
    let orderItemsHTML = '';
    // 移动设备显示简化版本
    if (isMobile && cart.length > 3) {
        // 只显示前3个商品
        orderItemsHTML = cart.slice(0, 3).map(item => `
            <div class="order-item">
                <div class="order-item-name">${item.name} x ${item.quantity}</div>
                <div class="order-item-price">RM${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('') + `<div class="order-item-more">+${cart.length - 3} 个商品...</div>`;
    } else {
        // 电脑端显示所有商品
        orderItemsHTML = cart.map(item => `
            <div class="order-item">
                <div class="order-item-name">${item.name} x ${item.quantity}</div>
                <div class="order-item-price">RM${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    paymentPanel.innerHTML = `
        <div class="payment-header">
            <h3>选择支付方式</h3>
            <span class="payment-close">&times;</span>
        </div>
        <div class="payment-order-summary">
            <h4>订单摘要</h4>
            <div class="order-items">
                ${orderItemsHTML}
            </div>
            <div class="order-total">
                <div>共 ${totalItems} 件商品</div>
                <div class="payment-total">RM${total.toFixed(2)}</div>
            </div>
        </div>
        <div class="payment-options">
            <div class="payment-option" data-method="tng">
                <img src="img/tng-ewallet.svg" alt="TNG eWallet" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'40\\'><rect width=\\'80\\' height=\\'40\\' fill=\\'%23FF6600\\'/><text x=\\'40\\' y=\\'25\\' font-family=\\'Arial\\' font-size=\\'12\\' text-anchor=\\'middle\\' fill=\\'white\\'>TNG eWallet</text></svg>';">
                <span>TNG eWallet</span>
            </div>
            <div class="payment-option" data-method="cash">
                <span class="material-icons">whatsapp</span>
                <span>WhatsApp</span>
            </div>
        </div>
        <div class="payment-details"></div>
    `;
    
    paymentOverlay.appendChild(paymentPanel);
    document.body.appendChild(paymentOverlay);
    
    // 显示支付面板
    setTimeout(() => {
        paymentOverlay.classList.add('show');
    }, 10);
    
    // 关闭按钮功能
    const closeBtn = paymentPanel.querySelector('.payment-close');
    closeBtn.addEventListener('click', function() {
        paymentOverlay.classList.remove('show');
        setTimeout(() => {
            paymentOverlay.remove();
        }, 400);
    });
    
    // 支付选项点击事件
    const paymentOptions = paymentPanel.querySelectorAll('.payment-option');
    const paymentDetails = paymentPanel.querySelector('.payment-details');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除之前的选中状态
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            
            // 添加选中状态
            this.classList.add('selected');
            
            // 获取支付方式
            const method = this.getAttribute('data-method');
            
            // 重置支付详情区域，添加淡入动画
            paymentDetails.innerHTML = '';
            
            // 根据支付方式显示不同的表单
            if (method === 'tng') {
                showTngPaymentForm(paymentDetails, total);
            } else if (method === 'cash') {
                showCashPaymentForm(paymentDetails, total);
            }
        });
    });
    
    // 默认选中第一个选项
    if (paymentOptions.length > 0) {
        paymentOptions[0].click();
    }

    // 点击背景关闭支付面板
    paymentOverlay.addEventListener('click', function(e) {
        if (e.target === paymentOverlay) {
            paymentOverlay.classList.remove('show');
            setTimeout(() => {
                paymentOverlay.remove();
            }, 400);
        }
    });

    // 添加ESC键关闭面板
    document.addEventListener('keydown', function escKeyHandler(e) {
        if (e.key === 'Escape') {
            paymentOverlay.classList.remove('show');
            setTimeout(() => {
                paymentOverlay.remove();
                document.removeEventListener('keydown', escKeyHandler);
            }, 400);
        }
    });
}

// 显示TNG eWallet支付表单
function showTngPaymentForm(container, total) {
    container.innerHTML = `
        <div class="tng-payment-form">
            <p>请扫描下方二维码使用TNG eWallet支付</p>
            <div class="tng-qrcode">
                <img src="img/tng-qr-rebacca.jpg" alt="TNG QR Code" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'><rect width=\\'200\\' height=\\'200\\' fill=\\'%23f1f1f1\\'/><rect x=\\'50\\' y=\\'50\\' width=\\'100\\' height=\\'100\\' fill=\\'%230062cc\\'/><text x=\\'100\\' y=\\'145\\' font-family=\\'Arial\\' font-size=\\'12\\' fill=\\'white\\' text-anchor=\\'middle\\'>Touch &apos;n Go eWallet</text></svg>';">
            </div>
            <p>收款人: <strong>REBACCA POH</strong></p>
            <p>金额: <strong>RM${total.toFixed(2)}</strong></p>
            <p class="tng-instruction">扫描此二维码使用您的银行应用或电子钱包转账</p>
            <button class="payment-button" id="tng-confirm-btn">确认付款</button>
        </div>
    `;
    
    // 确认支付按钮事件
    const confirmBtn = container.querySelector('#tng-confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            // 模拟支付处理
            this.disabled = true;
            this.innerHTML = '<div class="button-spinner"></div> 处理中...';
            
            // 添加加载动画样式
            const spinnerStyle = document.createElement('style');
            spinnerStyle.textContent = `
                .button-spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 0.8s linear infinite;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 8px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(spinnerStyle);
            
            // 调用confirmPayment函数发送订单到服务器
            confirmTngPayment();
        });
    }
}

// 显示货到付款表单
function showCashPaymentForm(container, total) {
    // 生成商品清单文本
    let itemsListText = '';
    cart.forEach(item => {
        itemsListText += `${item.name} x ${item.quantity} (RM${(item.price * item.quantity).toFixed(2)})\n`;
    });
    
    // 准备消息文本
    const messageText = `您好，我想订购乔乐曲奇：\n\n${itemsListText}\n总金额: RM${total.toFixed(2)}\n\n请联系我确认订单详情，谢谢！`;
    
    // 编码消息文本用于URL
    const encodedMessage = encodeURIComponent(messageText);
    
    // 检测是否为移动设备
    const isMobile = window.innerWidth < 768;
    
    container.innerHTML = `
        <div class="whatsapp-payment">
            ${!isMobile ? `<div class="whatsapp-icon">
                <img src="img/whatsapp-icon.png" alt="WhatsApp" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\'><rect width=\\'80\\' height=\\'80\\' rx=\\'15\\' fill=\\'%2325D366\\'/><path d=\\'M55,40c0,8.27-6.73,15-15,15c-2.64,0-5.12-0.69-7.27-1.89L25,55l1.89-7.03C25.69,45.12,25,42.64,25,40c0-8.27,6.73-15,15-15S55,31.73,55,40z M40,30c-5.51,0-10,4.49-10,10c0,2.2,0.72,4.23,1.94,5.87l-1.25,4.67l4.86-1.25c1.59,1.05,3.48,1.66,5.52,1.66c5.51,0,10-4.49,10-10C50,34.49,45.51,30,40,30z M45,42.5c0,0.28-0.22,0.5-0.5,0.5H42v2.5c0,0.28-0.22,0.5-0.5,0.5h-3c-0.28,0-0.5-0.22-0.5-0.5V43h-2.5c-0.28,0-0.5-0.22-0.5-0.5v-3c0-0.28,0.22-0.5,0.5-0.5H38v-2.5c0-0.28,0.22-0.5,0.5-0.5h3c0.28,0,0.5,0.22,0.5,0.5V39h2.5c0.28,0,0.5,0.22,0.5,0.5V42.5z\\' fill=\\'white\\'/></svg>';">
            </div>` : ''}
            <h3>通过WhatsApp下单</h3>
            <p>点击下方按钮，我们的客服将通过WhatsApp与您联系</p>
            <p>订单总金额: <strong>RM${total.toFixed(2)}</strong></p>
            <div class="whatsapp-orders-preview">
                <h4>您的订单详情：</h4>
                <div class="whatsapp-order-items">
                    ${cart.map(item => `
                        <div class="whatsapp-order-item">
                            <span class="item-name">${item.name}</span>
                            <span class="item-quantity">x ${item.quantity}</span>
                            <span class="item-price">RM${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="whatsapp-contacts">
                <a href="https://wa.me/60164492534?text=${encodedMessage}" target="_blank" class="whatsapp-button">
                    <span class="whatsapp-button-icon"></span>
                    联系商家一 (016-4492534)
                </a>
                <a href="https://wa.me/60124265411?text=${encodedMessage}" target="_blank" class="whatsapp-button whatsapp-button-alt">
                    <span class="whatsapp-button-icon"></span>
                    联系商家二 (012-4265411)
                </a>
            </div>
        </div>
    `;
    
    // WhatsApp按钮点击事件
    const whatsappBtns = container.querySelectorAll('.whatsapp-button');
    if (whatsappBtns.length > 0) {
        whatsappBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // 关闭支付面板
                const paymentOverlay = container.closest('.payment-overlay');
                setTimeout(() => {
                    paymentOverlay.classList.remove('show');
                    setTimeout(() => {
                        paymentOverlay.remove();
                    }, 400);
                }, 500);
                
                // 清空购物车
                clearCart();
            });
        });
    }
}

// 显示支付成功
function showPaymentSuccess(panel, paymentMethod) {
    // 确保panel是DOM元素
    if (typeof panel === 'string') {
        panel = document.querySelector(panel);
    }

    let paymentMethodText = '完成支付';
    if (paymentMethod === 'WhatsApp') {
        paymentMethodText = '选择通过WhatsApp联系';
    } else if (paymentMethod === 'TNG eWallet') {
        paymentMethodText = '通过TNG eWallet支付';
    }

    panel.innerHTML = `
        <div class="payment-success">
            <span class="material-icons">check_circle</span>
            <h3>订单提交成功!</h3>
            <p>您已成功${paymentMethodText}。</p>
            <p>订单号: #${Math.floor(Math.random() * 100000)}</p>
            <p>我们会尽快为您安排发货。</p>
            <button class="payment-button" id="success-close-btn">完成</button>
        </div>
    `;
    
    // 关闭按钮事件
    const closeBtn = panel.querySelector('#success-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const paymentOverlay = panel.closest('.payment-overlay');
            paymentOverlay.classList.remove('show');
            setTimeout(() => {
                paymentOverlay.remove();
            }, 400);
        });
    }
}

// 滚动效果
document.addEventListener('DOMContentLoaded', function() {
    // 处理图片加载问题
    handleMissingImages();
    
    // 平滑滚动
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });

    // 添加滚动动画效果
    const animateElements = document.querySelectorAll('.product-card, .about-content, .contact-content, h2');
    
    // 初始隐藏所有需要动画的元素
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // 滚动时检测元素是否在视窗内，如果是则添加动画
    function checkScroll() {
        animateElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }
    
    // 页面加载时检查一次
    checkScroll();
    
    // 滚动时检查
    window.addEventListener('scroll', checkScroll);
});

// 处理缺失的图片
function handleMissingImages() {
    const productImages = document.querySelectorAll('.product-image-container img, .about-image-container img');
    
    productImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.display = 'block';
            this.parentNode.classList.remove('placeholder-active');
        });
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
            this.parentNode.classList.add('placeholder-active');
            
            const colorAttr = this.getAttribute('data-color');
            if (colorAttr) {
                const color = colorAttr;
                const placeholderEl = this.parentNode.querySelector('.product-image-placeholder, .about-image-placeholder');
                if (placeholderEl) {
                    placeholderEl.style.backgroundColor = `${color}20`;
                }
            }
        });
        
        if (img.complete) {
            if (img.naturalWidth === 0) {
                img.style.display = 'none';
                img.parentNode.classList.add('placeholder-active');
            } else {
                img.style.display = 'block';
                img.parentNode.classList.remove('placeholder-active');
            }
        }
    });
    
    const placeholderTexts = document.querySelectorAll('.placeholder-text');
    placeholderTexts.forEach(textEl => {
        const placeholderContent = textEl.closest('.product-image-placeholder, .about-image-placeholder')
                                       .previousElementSibling.getAttribute('data-placeholder');
        textEl.textContent = placeholderContent || '图片加载失败';
    });
}

// 处理结算按钮点击
function handleCheckout() {
    if (cart.length === 0) {
        alert('购物车是空的，请先添加商品');
        return;
    }
    
    showPaymentOptions(calculateTotal());
}

// 确认支付
function confirmPayment(paymentMethod) {
    const customerInfo = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        address: document.getElementById('customer-address').value
    };
    
    // 验证客户信息
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
        alert('请填写完整的客户信息');
        return;
    }
    
    const orderData = {
        customer: customerInfo,
        items: cart,
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod,
        notes: document.getElementById('order-notes') ? document.getElementById('order-notes').value : ''
    };
    
    // 发送订单数据到服务器
    fetch('js/process-order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // 显示成功信息
            const panel = document.querySelector('.payment-panel');
            showPaymentSuccess(panel, paymentMethod);
            // 清空购物车
            clearCart();
        } else {
            alert('订单提交失败: ' + data.message);
            // 恢复提交按钮状态
            const submitBtn = document.querySelector('.payment-button');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '确认订单 RM' + calculateTotal().toFixed(2);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('提交订单时发生错误，请稍后再试');
        // 恢复提交按钮状态
        const submitBtn = document.querySelector('.payment-button');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '确认订单 RM' + calculateTotal().toFixed(2);
        }
    });
}

// 确认TNG支付
function confirmTngPayment() {
    // 显示成功信息
    const panel = document.querySelector('.payment-panel');
    showPaymentSuccess(panel, 'TNG eWallet');
    // 清空购物车
    clearCart();
} 