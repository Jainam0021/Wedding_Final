// ========================================
// Scroll Animation with Intersection Observer
// ========================================

// Create Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all elements that need animation on scroll
function initScrollAnimations() {
    // About section text
    const aboutTexts = document.querySelectorAll('.about-text');
    aboutTexts.forEach(text => observer.observe(text));

    // Service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Why choose cards
    const whyCards = document.querySelectorAll('.why-card');
    whyCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
}

// ========================================
// Testimonials Carousel
// ========================================

class ReviewCarousel {
    constructor() {
        this.currentIndex = 0;
        this.reviews = document.querySelectorAll('.review-card');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        // Add event listeners to navigation buttons
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Add event listeners to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Start autoplay
        this.startAutoPlay();

        // Pause autoplay on hover
        const carousel = document.querySelector('.reviews-carousel');
        carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goToSlide(index) {
        // Remove active class from current slide and dot
        this.reviews[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');

        // Update current index
        this.currentIndex = index;

        // Add active class to new slide and dot
        this.reviews[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.reviews.length;
        this.goToSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.reviews.length) % this.reviews.length;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 5000); // Change slide every 5 seconds
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ========================================
// Smooth Scroll for Navigation Links
// ========================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                // Smooth scroll to target
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Navbar Scroll Effect
// ========================================

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// Gallery Lightbox Effect (Optional Enhancement)
// ========================================

function initGalleryInteraction() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add a subtle animation on click
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// ========================================
// Parallax Effect for Hero Video
// ========================================

function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxSpeed = 0.5;
            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// ========================================
// Add Hover Effects for Service Cards
// ========================================

function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add tilt effect
            this.style.transform = 'translateY(-10px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ========================================
// Loading Animation
// ========================================

function initLoadingAnimation() {
    // Add fade-in effect to body
    document.body.style.opacity = '0';
    
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
}

// ========================================
// Counter Animation for Stats (Future Enhancement)
// ========================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// ========================================
// Initialize All Features on DOM Load
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initScrollAnimations();
    initSmoothScroll();
    initNavbarScroll();
    initGalleryInteraction();
    initParallax();
    initServiceCardEffects();
    initLoadingAnimation();
    
    // Initialize carousel
    new ReviewCarousel();
    
    // Log initialization
    console.log('🎉 Parampara Wedding Planner - All features initialized');
});

// ========================================
// Handle Window Resize
// ========================================

let resizeTimer;
window.addEventListener('resize', () => {
    // Clear the timeout
    clearTimeout(resizeTimer);
    
    // Set a new timeout
    resizeTimer = setTimeout(() => {
        // Recalculate positions and sizes if needed
        console.log('Window resized');
    }, 250);
});

// ========================================
// Prevent Default Behavior for Empty Links
// ========================================

document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
        e.preventDefault();
    }
});

// ========================================
// Add Loading State for Images
// ========================================

function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading class
        img.classList.add('loading');
        
        // Remove loading class when image is loaded
        img.addEventListener('load', function() {
            this.classList.remove('loading');
            this.style.opacity = '0';
            setTimeout(() => {
                this.style.transition = 'opacity 0.5s ease';
                this.style.opacity = '1';
            }, 100);
        });
        
        // Handle error
        img.addEventListener('error', function() {
            this.classList.remove('loading');
            console.warn('Failed to load image:', this.src);
        });
    });
}

// Initialize image loading
initImageLoading();

// ========================================
// Accessibility Enhancements
// ========================================

// Add keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    const carousel = document.querySelector('.reviews-carousel');
    if (!carousel) return;
    
    if (e.key === 'ArrowLeft') {
        document.querySelector('.carousel-btn.prev').click();
    } else if (e.key === 'ArrowRight') {
        document.querySelector('.carousel-btn.next').click();
    }
});

// Add focus styles for better accessibility
const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--secondary-color)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
});