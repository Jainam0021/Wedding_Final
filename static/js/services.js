// Services Page JavaScript - Scroll-based Animations

document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe timeline items with staggered delay
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        observer.observe(item);
    });

    // Observe split services
    const splitServices = document.querySelectorAll('.split-service');
    splitServices.forEach((service, index) => {
        service.style.animationDelay = `${index * 0.3}s`;
        observer.observe(service);
    });

    // Observe full-width service
    const fullWidthService = document.querySelector('.full-width-service');
    if (fullWidthService) {
        observer.observe(fullWidthService);
    }

    // Observe celebration cards with staggered animation
    const celebrationCards = document.querySelectorAll('.celebration-card');
    celebrationCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });

    // Observe feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        observer.observe(item);
    });

    // Observe closing section
    const closingContent = document.querySelector('.closing-content');
    if (closingContent) {
        observer.observe(closingContent);
    }

    // Enhanced hover effects for service cards
    const serviceContents = document.querySelectorAll('.service-content');
    serviceContents.forEach(content => {
        content.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Smooth scroll for better user experience
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < heroSection.offsetHeight) {
                heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    // Timeline marker animation on scroll
    const timelineMarkers = document.querySelectorAll('.timeline-marker');
    const markerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'pulse 1s ease-in-out';
            }
        });
    }, { threshold: 0.5 });

    timelineMarkers.forEach(marker => {
        markerObserver.observe(marker);
    });

    // Add pulse animation to markers
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: translateX(-50%) scale(1);
                box-shadow: 0 0 0 8px rgba(143, 45, 58, 0.1);
            }
            50% {
                transform: translateX(-50%) scale(1.2);
                box-shadow: 0 0 0 12px rgba(143, 45, 58, 0.2);
            }
        }
    `;
    document.head.appendChild(style);

    // Service content interaction
    const allServiceContents = document.querySelectorAll('.service-content, .split-content, .full-content');
    allServiceContents.forEach(content => {
        content.addEventListener('mouseenter', function() {
            this.querySelector('.service-title, .split-title, .full-title').style.color = '#D4AF6A';
        });
        
        content.addEventListener('mouseleave', function() {
            this.querySelector('.service-title, .split-title, .full-title').style.color = '#8F2D3A';
        });
    });

    // Celebration card hover effect enhancement
    celebrationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.card-overlay');
            if (overlay) {
                overlay.style.background = 'linear-gradient(180deg, rgba(143, 45, 58, 0.2) 0%, rgba(143, 45, 58, 0.5) 50%, rgba(46, 46, 46, 0.8) 100%)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.card-overlay');
            if (overlay) {
                overlay.style.background = 'linear-gradient(180deg, rgba(143, 45, 58, 0) 0%, rgba(143, 45, 58, 0.3) 50%, rgba(46, 46, 46, 0.7) 100%)';
            }
        });
    });

    // Service icon rotation on hover
    const serviceIcons = document.querySelectorAll('.service-icon');
    serviceIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(360deg) scale(1.1)';
            this.style.transition = 'transform 0.6s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
        });
    });

    // Performance optimization: Reduce animations on low-performance devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.timeline-item, .split-service, .celebration-card, .feature-item').forEach(el => {
            el.style.animation = 'none';
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // Add loading complete class to body
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Scroll progress indicator for timeline
    const timeline = document.querySelector('.timeline-container');
    if (timeline) {
        window.addEventListener('scroll', function() {
            const timelineTop = timeline.offsetTop;
            const timelineHeight = timeline.offsetHeight;
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            if (scrolled > timelineTop - windowHeight && scrolled < timelineTop + timelineHeight) {
                const progress = ((scrolled - (timelineTop - windowHeight)) / (timelineHeight + windowHeight)) * 100;
                const timelineLine = timeline.querySelector('::before');
                // This would require a separate element for the progress indicator
            }
        });
    }

    // Console message for developers
    console.log('%c🎊 Parampara Wedding Planner Services Page Loaded Successfully', 'color: #8F2D3A; font-size: 16px; font-weight: bold;');
    console.log('%cAnimations and interactions are ready!', 'color: #D4AF6A; font-size: 14px;');

});