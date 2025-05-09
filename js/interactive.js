// 互动性增强脚本

document.addEventListener('DOMContentLoaded', function() {
    // 为各个区块添加渐入动画
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.classList.add('animated-section');
        observer.observe(section);
    });

    // 联系表单交互效果
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        // 初始状态
        const formGroup = input.parentNode;
        const label = formGroup.querySelector('label');
        
        // 焦点效果
        input.addEventListener('focus', function() {
            formGroup.classList.add('active');
            label.classList.add('active');
        });
        
        // 失焦效果
        input.addEventListener('blur', function() {
            if (input.value === '') {
                formGroup.classList.remove('active');
                label.classList.remove('active');
            }
        });
        
        // 检查初始状态（如果表单有预填内容）
        if (input.value !== '') {
            formGroup.classList.add('active');
            label.classList.add('active');
        }
    });

    // 添加产品卡片悬停效果
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
            const img = this.querySelector('img');
            img.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
            const img = this.querySelector('img');
            img.style.transform = 'scale(1)';
        });
    });

    // 添加联系信息卡片动画效果
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form');
    
    contactInfo.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
    });
    
    contactInfo.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
    });
    
    contactForm.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
    });
    
    contactForm.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
    });

    // 表单提交动画
    const contactFormElement = document.querySelector('.contact-form form');
    if (contactFormElement) {
        contactFormElement.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止默认提交

            // 获取表单数据
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // 创建提交后的感谢信息
            const thankYouMessage = document.createElement('div');
            thankYouMessage.className = 'form-success';
            thankYouMessage.innerHTML = `
                <div class="success-icon">✓</div>
                <h3>消息已发送!</h3>
                <p>谢谢您, ${name}! 我们已收到您的留言，会尽快回复。</p>
                <button class="btn reset-form">再次发送</button>
            `;

            // 隐藏表单，显示感谢信息
            contactFormElement.style.height = contactFormElement.offsetHeight + 'px';
            contactFormElement.classList.add('fade-out');
            
            setTimeout(() => {
                contactFormElement.style.display = 'none';
                contactForm.appendChild(thankYouMessage);
                
                // 添加重置表单的事件监听
                const resetButton = document.querySelector('.reset-form');
                if (resetButton) {
                    resetButton.addEventListener('click', function() {
                        thankYouMessage.remove();
                        contactFormElement.style.display = 'block';
                        contactFormElement.classList.remove('fade-out');
                        contactFormElement.reset();
                    });
                }
            }, 300);
        });
    }
}); 