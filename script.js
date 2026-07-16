document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // Smooth scroll for anchor links
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // =============================================
    // Scroll-triggered fade-in animations
    // =============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // =============================================
    // Floating CTA bar (show after scrolling past hero)
    // =============================================
    const floatingCta = document.getElementById('floatingCta');
    const hero = document.querySelector('.hero');

    if (floatingCta && hero) {
        window.addEventListener('scroll', () => {
            const heroBottom = hero.getBoundingClientRect().bottom;
            const contactSection = document.getElementById('contact');
            const contactTop = contactSection ? contactSection.getBoundingClientRect().top : Infinity;
            const windowHeight = window.innerHeight;

            if (heroBottom < 0 && contactTop > windowHeight) {
                floatingCta.classList.add('show');
            } else {
                floatingCta.classList.remove('show');
            }
        }, { passive: true });
    }

    // =============================================
    // Header shadow on scroll
    // =============================================
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // =============================================
    // Counter animation for trust badges
    // =============================================
    const badges = document.querySelectorAll('.badge-number');
    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                badgeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    badges.forEach(badge => badgeObserver.observe(badge));

    function animateCounter(el) {
        const text = el.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const numValue = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = hasPlus ? '+' : hasPercent ? '%' : '';

        let current = 0;
        const duration = 1500;
        const increment = numValue / (duration / 16);

        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                current = numValue;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    // =============================================
    // Q&A Accordion (open first by default)
    // =============================================
    const qaItems = document.querySelectorAll('.qa-item');
    if (qaItems.length > 0) {
        qaItems[0].classList.add('open');
    }

    document.querySelectorAll('[data-cta-location]').forEach(cta => {
        cta.addEventListener('click', () => {
            const detail = { location: cta.dataset.ctaLocation };
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'line_cta_click', ...detail });
            window.dispatchEvent(new CustomEvent('lineCtaClick', { detail }));
        });
    });
});
