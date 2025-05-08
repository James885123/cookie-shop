// 语言切换器

// 可用的语言
const languages = ['zh', 'en'];

// 获取/设置当前语言
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'zh'; // 默认为中文
}

function setCurrentLanguage(lang) {
    localStorage.setItem('language', lang);
}

// 获取下一个语言
function getNextLanguage(currentLang) {
    const currentIndex = languages.indexOf(currentLang);
    return languages[(currentIndex + 1) % languages.length];
}

// 更新页面上的文本
function updatePageText() {
    const currentLang = getCurrentLanguage();
    const langData = translations[currentLang];
    
    if (!langData) return;

    // 更新所有带data-i18n属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (langData[key]) {
            // 检查元素类型，决定如何设置文本
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.setAttribute('placeholder', langData[key]);
                } else {
                    element.value = langData[key];
                }
            } else {
                element.textContent = langData[key];
            }
        }
    });
    
    // 更新语言切换器
    const switcherText = document.querySelector('.lang-switcher-text');
    if (switcherText) {
        switcherText.textContent = translations[currentLang][`lang_${currentLang}`];
    }
}

// 切换语言
function switchLanguage() {
    const currentLang = getCurrentLanguage();
    const nextLang = getNextLanguage(currentLang);
    setCurrentLanguage(nextLang);
    updatePageText();
}

// 初始化语言切换器
function initLanguageSwitcher() {
    // 在导航栏添加语言切换器
    const nav = document.querySelector('nav ul');
    if (nav) {
        const langSwitcher = document.createElement('li');
        langSwitcher.className = 'language-switcher';
        
        const currentLang = getCurrentLanguage();
        
        // 创建语言切换按钮
        const switcherBtn = document.createElement('a');
        switcherBtn.href = '#';
        switcherBtn.className = 'lang-switcher-btn';
        
        // 添加语言文本
        const langText = document.createElement('span');
        langText.className = 'lang-switcher-text';
        langText.textContent = translations[currentLang][`lang_${currentLang}`];
        
        // 添加箭头图标
        const arrowIcon = document.createElement('span');
        arrowIcon.className = 'lang-switcher-arrow';
        arrowIcon.innerHTML = '→';
        
        switcherBtn.appendChild(langText);
        switcherBtn.appendChild(arrowIcon);
        
        // 点击切换语言
        switcherBtn.addEventListener('click', function(e) {
            e.preventDefault();
            switchLanguage();
            
            // 添加动画效果
            arrowIcon.classList.add('rotate');
            setTimeout(() => {
                arrowIcon.classList.remove('rotate');
            }, 500);
        });
        
        langSwitcher.appendChild(switcherBtn);
        nav.appendChild(langSwitcher);
    }
    
    // 设置页面上所有需要翻译的元素的data-i18n属性
    setupTranslationAttributes();
    
    // 初始化页面文本
    updatePageText();
}

// 设置页面上所有需要翻译的元素的data-i18n属性
function setupTranslationAttributes() {
    // 导航栏
    const navLinks = document.querySelectorAll('nav ul li a');
    const navKeys = ['nav_home', 'nav_products', 'nav_about', 'nav_contact'];
    navLinks.forEach((link, index) => {
        if (index < navKeys.length) {
            link.setAttribute('data-i18n', navKeys[index]);
        }
    });
    
    // 英雄区域
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        const heroTitle = heroSection.querySelector('h2');
        const heroSubtitle = heroSection.querySelector('p');
        const heroButton = heroSection.querySelector('.btn');
        
        if (heroTitle) heroTitle.setAttribute('data-i18n', 'hero_title');
        if (heroSubtitle) heroSubtitle.setAttribute('data-i18n', 'hero_subtitle');
        if (heroButton) heroButton.setAttribute('data-i18n', 'hero_button');
    }
    
    // 产品区域
    const productsSection = document.querySelector('#products');
    if (productsSection) {
        const productsTitle = productsSection.querySelector('h2');
        const paymentBadge = productsSection.querySelector('.badge span');
        
        if (productsTitle) productsTitle.setAttribute('data-i18n', 'products_title');
        if (paymentBadge) paymentBadge.setAttribute('data-i18n', 'products_payment_badge');
        
        // 产品卡片
        const productCards = productsSection.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            const desc = card.querySelector('p:not(.price)');
            const price = card.querySelector('.price');
            const button = card.querySelector('.add-to-cart');
            
            const productNum = index + 1;
            
            if (title) title.setAttribute('data-i18n', `product${productNum}_title`);
            if (desc) desc.setAttribute('data-i18n', `product${productNum}_desc`);
            if (price) price.setAttribute('data-i18n', `product${productNum}_price`);
            if (button) button.setAttribute('data-i18n', 'add_to_cart');
        });
    }
    
    // 关于我们
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const aboutTitle = aboutSection.querySelector('h2');
        const aboutTextParas = aboutSection.querySelectorAll('.about-text p');
        
        if (aboutTitle) aboutTitle.setAttribute('data-i18n', 'about_title');
        
        aboutTextParas.forEach((para, index) => {
            para.setAttribute('data-i18n', `about_p${index + 1}`);
        });
    }
    
    // 联系我们
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        const contactTitle = contactSection.querySelector('h2');
        const contactSubtitle = contactSection.querySelector('.contact-info h3');
        const contactForm = contactSection.querySelector('.contact-form h3');
        
        if (contactTitle) contactTitle.setAttribute('data-i18n', 'contact_title');
        if (contactSubtitle) contactSubtitle.setAttribute('data-i18n', 'contact_subtitle');
        if (contactForm) contactForm.setAttribute('data-i18n', 'contact_form_title');
        
        // 联系信息
        const addressLabel = contactSection.querySelector('.contact-info p:nth-of-type(1) strong');
        const phoneLabel = contactSection.querySelector('.contact-info p:nth-of-type(2) strong');
        const emailLabel = contactSection.querySelector('.contact-info p:nth-of-type(3) strong');
        const hoursLabel = contactSection.querySelector('.contact-info p:nth-of-type(4) strong');
        
        if (addressLabel) addressLabel.setAttribute('data-i18n', 'contact_address_label');
        if (phoneLabel) phoneLabel.setAttribute('data-i18n', 'contact_phone_label');
        if (emailLabel) emailLabel.setAttribute('data-i18n', 'contact_email_label');
        if (hoursLabel) hoursLabel.setAttribute('data-i18n', 'contact_hours_label');
        
        // 表单
        const nameLabel = contactSection.querySelector('label[for="name"]');
        const emailInputLabel = contactSection.querySelector('label[for="email"]');
        const messageLabel = contactSection.querySelector('label[for="message"]');
        const submitButton = contactSection.querySelector('button[type="submit"]');
        
        if (nameLabel) nameLabel.setAttribute('data-i18n', 'contact_form_name');
        if (emailInputLabel) emailInputLabel.setAttribute('data-i18n', 'contact_form_email');
        if (messageLabel) messageLabel.setAttribute('data-i18n', 'contact_form_message');
        if (submitButton) submitButton.setAttribute('data-i18n', 'contact_form_submit');
    }
    
    // 页脚
    const footer = document.querySelector('footer');
    if (footer) {
        const footerColumns = footer.querySelectorAll('.footer-column');
        
        // 第一列 - 公司信息
        if (footerColumns[0]) {
            const companyName = footerColumns[0].querySelector('h3');
            const tagline = footerColumns[0].querySelector('p');
            
            if (companyName) companyName.setAttribute('data-i18n', 'footer_company');
            if (tagline) tagline.setAttribute('data-i18n', 'footer_tagline');
        }
        
        // 第二列 - 支付方式
        if (footerColumns[1]) {
            const paymentTitle = footerColumns[1].querySelector('h3');
            
            if (paymentTitle) paymentTitle.setAttribute('data-i18n', 'footer_payment');
        }
        
        // 第三列 - 联系方式
        if (footerColumns[2]) {
            const contactTitle = footerColumns[2].querySelector('h3');
            const phone = footerColumns[2].querySelector('p:nth-of-type(1)');
            const email = footerColumns[2].querySelector('p:nth-of-type(2)');
            
            if (contactTitle) contactTitle.setAttribute('data-i18n', 'footer_contact');
            if (phone && phone.firstChild.textContent.includes('电话')) {
                phone.firstChild.textContent = '';
                const phoneStrong = document.createElement('strong');
                phoneStrong.setAttribute('data-i18n', 'footer_phone');
                phone.insertBefore(phoneStrong, phone.firstChild);
            }
            if (email && email.firstChild.textContent.includes('邮箱')) {
                email.firstChild.textContent = '';
                const emailStrong = document.createElement('strong');
                emailStrong.setAttribute('data-i18n', 'footer_email');
                email.insertBefore(emailStrong, email.firstChild);
            }
        }
        
        // 版权信息
        const copyright = footer.querySelector('.copyright');
        if (copyright) {
            const copyrightText = copyright.textContent.replace(/^.*(\d{4}).*$/, '$1');
            copyright.textContent = '';
            copyright.innerHTML = `&copy; ${copyrightText} <span data-i18n="footer_company">美味曲奇</span> <span data-i18n="footer_copyright">版权所有</span>`;
        }
    }
    
    // 购物车和支付面板
    setupCartTranslationAttributes();
}

// 设置购物车和支付面板的翻译属性
function setupCartTranslationAttributes() {
    // 购物车面板
    const cartPanel = document.querySelector('.cart-panel');
    if (cartPanel) {
        const cartTitle = cartPanel.querySelector('.cart-panel-header h3');
        const cartTotalLabel = cartPanel.querySelector('.cart-total .total-label');
        const checkoutBtn = cartPanel.querySelector('.checkout-btn');
        const clearCartBtn = cartPanel.querySelector('.clear-cart');
        const emptyCartText = cartPanel.querySelector('.empty-cart p');
        
        if (cartTitle) cartTitle.setAttribute('data-i18n', 'cart_title');
        if (cartTotalLabel) cartTotalLabel.setAttribute('data-i18n', 'cart_total');
        if (checkoutBtn) checkoutBtn.setAttribute('data-i18n', 'cart_checkout');
        if (clearCartBtn) clearCartBtn.setAttribute('data-i18n', 'clear_cart');
        if (emptyCartText) emptyCartText.setAttribute('data-i18n', 'cart_empty');
    }
    
    // 支付面板
    const paymentPanel = document.querySelector('.payment-panel');
    if (paymentPanel) {
        const paymentTitle = paymentPanel.querySelector('.payment-header h3');
        const paymentTotalLabel = paymentPanel.querySelector('.payment-total-label');
        const tngOption = paymentPanel.querySelector('.payment-option:nth-child(1) span:not(.material-icons)');
        const cashOption = paymentPanel.querySelector('.payment-option:nth-child(2) span:not(.material-icons)');
        
        if (paymentTitle) paymentTitle.setAttribute('data-i18n', 'payment_title');
        if (paymentTotalLabel) paymentTotalLabel.setAttribute('data-i18n', 'payment_total');
        if (tngOption) tngOption.setAttribute('data-i18n', 'payment_tng');
        if (cashOption) cashOption.setAttribute('data-i18n', 'payment_cash');
    }
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initLanguageSwitcher); 