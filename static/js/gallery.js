/**
 * Premium Gallery - JavaScript
 * Ultra-modern, cinematic gallery with advanced animations
 */

// ============================================
// GLOBAL STATE
// ============================================

const GalleryState = {
    currentFilter: 'all',
    currentLightboxIndex: 0,
    galleryItems: [],
    isLightboxOpen: false,
    touchStartX: 0,
    touchEndX: 0,
    observers: {}
};

// ============================================
// INITIALIZE ON DOM LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeHeroParticles();
    initializeGalleryItems();
    initializeFilters();
    initializeLightbox();
    initializeBackToTop();
    initializeScrollAnimations();
    initializeLazyLoading();
});

// ============================================
// NAVIGATION MENU
// ============================================
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}



// ============================================
// HERO PARTICLES ANIMATION
// ============================================
function initializeHeroParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    const particleCount = 30;
    const colors = ['#D4AF6A', '#8F2D3A', '#F5E6D3', '#E8D5C4'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4;
        
        Object.assign(particle.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.2,
            animation: `particleFloat ${Math.random() * 15 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
        });

        container.appendChild(particle);
    }

    // Add particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(30px, -30px) rotate(90deg);
            }
            50% {
                transform: translate(-20px, -50px) rotate(180deg);
            }
            75% {
                transform: translate(-40px, -20px) rotate(270deg);
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// GALLERY ITEMS INITIALIZATION
// ============================================
function initializeGalleryItems() {
    const items = document.querySelectorAll('.gallery-item');
    
    GalleryState.galleryItems = Array.from(items).map((item, index) => {
        const img = item.querySelector('.gallery-item__img');
        const title = item.querySelector('.gallery-item__title')?.textContent || '';
        const category = item.querySelector('.gallery-item__category')?.textContent || '';
        const filterCategory = item.getAttribute('data-category') || '';

        return {
            element: item,
            img: img,
            src: img.dataset.src || img.src,
            alt: img.alt,
            title: title,
            category: filterCategory,
            displayCategory: category,
            index: index
        };
    });

    // Add click event to gallery items
    items.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
}

// ============================================
// FILTER FUNCTIONALITY
// ============================================
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.gallery-filter__btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            handleFilterChange(filter);
            
            // Update active button
            filterBtns.forEach(b => {
                b.classList.remove('gallery-filter__btn--active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('gallery-filter__btn--active');
            btn.setAttribute('aria-selected', 'true');
        });
    });
}

function handleFilterChange(filter) {
    GalleryState.currentFilter = filter;
    const items = document.querySelectorAll('.gallery-item');

    items.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || itemCategory === filter;

        if (shouldShow) {
            item.classList.remove('hidden');
            // Re-trigger reveal animation with delay
            setTimeout(() => {
                item.style.animation = 'none';
                setTimeout(() => {
                    item.style.animation = '';
                }, 10);
            }, index * 50);
        } else {
            item.classList.add('hidden');
        }
    });
}

// ============================================
// LAZY LOADING
// ============================================
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        },
        {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        }
    );

    GalleryState.observers.imageObserver = imageObserver;

    // Observe all gallery images
    document.querySelectorAll('.gallery-item__img').forEach(img => {
        imageObserver.observe(img);
    });
}

function loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    const tempImg = new Image();
    
    tempImg.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        
        // Hide placeholder
        const placeholder = img.parentElement.querySelector('.gallery-item__placeholder');
        if (placeholder) {
            setTimeout(() => {
                placeholder.style.opacity = '0';
                setTimeout(() => placeholder.remove(), 300);
            }, 100);
        }
    };

    tempImg.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        img.alt = 'Image failed to load';
    };

    tempImg.src = src;
}

// ============================================
// LIGHTBOX
// ============================================
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav--next');
    const downloadBtn = lightbox.querySelector('.lightbox__control-btn:first-child');
    const shareBtn = lightbox.querySelector('.lightbox__control-btn:last-child');
    const background = lightbox.querySelector('.lightbox__background');

    // Event listeners
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (background) background.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadCurrentImage);
    if (shareBtn) shareBtn.addEventListener('click', shareCurrentImage);

    // Keyboard navigation
    document.addEventListener('keydown', handleLightboxKeyboard);

    // Touch support
    const container = lightbox.querySelector('.lightbox__container');
    if (container) {
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    GalleryState.currentLightboxIndex = index;
    GalleryState.isLightboxOpen = true;

    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    GalleryState.isLightboxOpen = false;
}

function showNextImage() {
    const visibleItems = GalleryState.galleryItems.filter(item => 
        !item.element.classList.contains('hidden')
    );
    
    let currentIndex = visibleItems.findIndex(
        item => item.index === GalleryState.currentLightboxIndex
    );
    
    currentIndex = (currentIndex + 1) % visibleItems.length;
    GalleryState.currentLightboxIndex = visibleItems[currentIndex].index;
    
    updateLightboxContent();
}

function showPrevImage() {
    const visibleItems = GalleryState.galleryItems.filter(item => 
        !item.element.classList.contains('hidden')
    );
    
    let currentIndex = visibleItems.findIndex(
        item => item.index === GalleryState.currentLightboxIndex
    );
    
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    GalleryState.currentLightboxIndex = visibleItems[currentIndex].index;
    
    updateLightboxContent();
}

function updateLightboxContent() {
    const item = GalleryState.galleryItems[GalleryState.currentLightboxIndex];
    if (!item) return;

    const lightbox = document.getElementById('lightbox');
    const img = lightbox.querySelector('.lightbox__image');
    const category = lightbox.querySelector('.lightbox__category');
    const title = lightbox.querySelector('.lightbox__title');
    const counter = lightbox.querySelector('.lightbox__counter');

    // Update image with fade effect
    img.style.opacity = '0';
    
    setTimeout(() => {
        img.src = item.src;
        img.alt = item.alt;
        img.style.opacity = '1';
    }, 150);

    // Update caption
    if (category) category.textContent = item.displayCategory;
    if (title) title.textContent = item.title;

    // Update counter
    const visibleItems = GalleryState.galleryItems.filter(item => 
        !item.element.classList.contains('hidden')
    );
    const currentPos = visibleItems.findIndex(
        item => item.index === GalleryState.currentLightboxIndex
    ) + 1;
    
    if (counter) {
        counter.textContent = `${currentPos} / ${visibleItems.length}`;
    }
}

function handleLightboxKeyboard(e) {
    if (!GalleryState.isLightboxOpen) return;

    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
    }
}

function handleTouchStart(e) {
    GalleryState.touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    GalleryState.touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = GalleryState.touchStartX - GalleryState.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            showNextImage();
        } else {
            showPrevImage();
        }
    }
}

function downloadCurrentImage() {
    const item = GalleryState.galleryItems[GalleryState.currentLightboxIndex];
    if (!item) return;

    const link = document.createElement('a');
    link.href = item.src;
    link.download = `parampara-wedding-${item.index + 1}.jpg`;
    link.click();
}

function shareCurrentImage() {
    const item = GalleryState.galleryItems[GalleryState.currentLightboxIndex];
    if (!item) return;

    const shareData = {
        title: 'Parampara Wedding Gallery',
        text: `Check out: ${item.title}`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(item.src);
        });
    } else {
        fallbackShare(item.src);
    }
}

function fallbackShare(url) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!');
        });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    Object.assign(notification.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(143, 45, 58, 0.95)',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '50px',
        zIndex: '99999',
        fontFamily: 'Quintessential, serif',
        animation: 'notificationFade 2s ease forwards'
    });

    document.body.appendChild(notification);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes notificationFade {
            0%, 80% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => notification.remove(), 2000);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initializeScrollAnimations() {
    const scrollObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    GalleryState.observers.scrollObserver = scrollObserver;

    // Observe filter section
    const filterSection = document.querySelector('.gallery-filter');
    if (filterSection) {
        scrollObserver.observe(filterSection);
    }
}

// ============================================
// BACK TO TOP
// ============================================
function initializeBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    let scrollTimeout;

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            if (window.pageYOffset > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, 100);
    }, { passive: true });

    btn.addEventListener('click', scrollToTop);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================
let ticking = false;
let lastScrollY = 0;

function handleParallax() {
    lastScrollY = window.pageYOffset;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax(lastScrollY);
            ticking = false;
        });
        ticking = true;
    }
}

function updateParallax(scrollY) {
    const hero = document.querySelector('.hero-gallery__content');
    if (hero && scrollY < window.innerHeight) {
        const parallaxSpeed = 0.5;
        const opacity = 1 - (scrollY / (window.innerHeight * 0.8));
        
        hero.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        hero.style.opacity = Math.max(0, opacity);
    }
}

window.addEventListener('scroll', handleParallax, { passive: true });

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce utility
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
}

// Throttle utility
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Error handling for images
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.error('Image failed to load:', e.target.src);
        e.target.style.display = 'none';
    }
}, true);

// ============================================
// INTERSECTION OBSERVER POLYFILL FALLBACK
// ============================================
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported, loading all images immediately');
    document.querySelectorAll('.gallery-item__img').forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        }
    });
}

// ============================================
// PAGE VISIBILITY API
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations when tab is not visible
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// ============================================
// CONSOLE BRANDING
// ============================================
console.log(
    '%c🎉 Parampara Wedding Gallery - Premium Edition 🎉',
    'color: #8F2D3A; font-size: 18px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
);
console.log(
    '%cCrafted with ❤️ by WebVibe Studios',
    'color: #D4AF6A; font-size: 14px; font-style: italic;'
);

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================
window.addEventListener('beforeunload', () => {
    // Disconnect all observers
    Object.values(GalleryState.observers).forEach(observer => {
        if (observer && observer.disconnect) {
            observer.disconnect();
        }
    });

});
