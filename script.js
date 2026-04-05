document.addEventListener('DOMContentLoaded', () => {
    // Global Mouse Tracking for Interactive Grid
    window.addEventListener('mousemove', e => {
        document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // 3D Tilt & Spotlight Effect for Premium Cards
    const glowCards = document.querySelectorAll('.glass-card, .mvp-box, .stat-box');
    glowCards.forEach(card => {
        if (!card.querySelector('.spotlight')) {
            const spotlight = document.createElement('div');
            spotlight.classList.add('spotlight');
            card.appendChild(spotlight);
        }
        
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // 3D Tilt calculation (only for glass-card)
            if (card.classList.contains('glass-card')) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
                const rotateY = ((x - centerX) / centerX) * 10;
                card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('glass-card')) {
                card.style.transform = `perspective(1500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            }
        });
    });

    // Magnetic Buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            // translate scaled down by 0.3 for a subtle magnetic pulling effect
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // Intersection Observer for scroll animations with advanced staggered reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Navbar glassmorphism, ScrollSpy, & Scroll Progress
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        // Update Scroll Progress
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.body.offsetHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);
            scrollProgress.style.width = Math.max(0, Math.min(100, scrollPercent * 100)) + '%';
        }

        // Navbar styling
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(3, 7, 18, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            navbar.style.padding = '12px 0';
        } else {
            navbar.style.background = 'rgba(3, 7, 18, 0.5)';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '20px 0';
        }

        // ScrollSpy logic
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = ''; // Reset
            link.style.fontWeight = '500';
            link.style.textShadow = 'none';
            if (current && link.getAttribute('href').includes(current)) {
                link.style.color = '#fff';
                link.style.fontWeight = '700';
                link.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';
            }
        });
    });

    // Enhanced Mockup Data Simulation (Dynamic charts & numbers)
    const bars = document.querySelectorAll('.dash-chart .bar:not(.alert)');
    const statValues = document.querySelectorAll('.stat-box b');
    
    setInterval(() => {
        // Run bars fluctuation
        bars.forEach(bar => {
            const currentHeight = parseInt(bar.style.height || 50);
            const change = (Math.random() * 20 - 10);
            const newHeight = Math.max(20, Math.min(90, currentHeight + change));
            bar.style.height = `${newHeight}%`;
        });
        
        // Slightly tweak stat texts occasionally
        if (statValues.length >= 3 && Math.random() > 0.5) {
            const speedBox = statValues[1];
            const presBox = statValues[2];
            
            let speed = parseFloat(speedBox.innerText);
            speed = Math.max(1.8, Math.min(2.5, speed + (Math.random() * 0.2 - 0.1))).toFixed(1);
            speedBox.innerHTML = `${speed} м/с ${speed > 2.1 ? '&uarr;' : '&darr;'}`;
            
            let pres = parseFloat(presBox.innerText);
            pres = Math.max(1.1, Math.min(1.6, pres + (Math.random() * 0.1 - 0.05))).toFixed(2);
            presBox.innerHTML = `${pres} atm ${pres > 1.3 ? '&uarr;' : '&darr;'}`;
        }
    }, 2000);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const yOffset = -80; // offset for fixed navbar
                const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorDot && cursorGlow) {
        window.addEventListener('mousemove', e => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            
            cursorGlow.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 300, fill: "forwards" });
        });
        
        document.querySelectorAll('a, button, .glass-card, .mvp-box').forEach(el => {
            el.addEventListener('mouseenter', () => cursorGlow.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hovering'));
        });
    }
});
