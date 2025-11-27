/**
 * xQubit.AI - Main JavaScript
 * Navigation, Preloader, and Core Functionality
 */

// ==========================================
// DOM Content Loaded
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initTheme();
    initPreloader();
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    initScrollEffects();
});

// ==========================================
// Theme Toggle
// ==========================================
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// ==========================================
// Preloader
// ==========================================
function initPreloader() {
    const preloader = document.getElementById('preloader');

    // Hide preloader when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';

            // Remove preloader from DOM after animation
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });

    // Fallback: hide preloader after 3 seconds max
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }
    }, 3000);
}

// ==========================================
// Navigation
// ==========================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Set active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const setActiveLink = () => {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', setActiveLink);
}

// ==========================================
// Mobile Menu
// ==========================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!menuBtn || !mobileMenu) return;

    const toggleMenu = () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// ==========================================
// Smooth Scroll
// ==========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (!target) return;

            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ==========================================
// Scroll Effects
// ==========================================
function initScrollEffects() {
    // Fade in hero scroll indicator
    const scrollIndicator = document.querySelector('.hero-scroll');

    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const opacity = Math.max(0, 1 - scrollY / 300);
            scrollIndicator.style.opacity = opacity;
        });
    }

    // Parallax effect for hero background
    const heroCanvas = document.getElementById('hero-canvas');

    if (heroCanvas) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroCanvas.style.transform = `translateY(${scrollY * 0.3}px)`;
        });
    }
}

// ==========================================
// Utility Functions
// ==========================================

// Debounce function
function debounce(func, wait = 100) {
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

// Throttle function
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Lerp (linear interpolation)
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Map value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// ==========================================
// Form Handling (for future use)
// ==========================================
function initContactForm() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showNotification('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ==========================================
// Notification System
// ==========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00F0FF, #8B5CF6)' : '#EC4899'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
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

    body.menu-open {
        overflow: hidden;
    }

    .navbar {
        transition: transform 0.3s ease, background-color 0.3s ease, backdrop-filter 0.3s ease;
    }

    .nav-links a.active {
        color: var(--color-text-primary);
    }

    .nav-links a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(notificationStyles);

// ==========================================
// Easter Egg - Konami Code
// ==========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateQuantumMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateQuantumMode() {
    document.body.style.animation = 'quantumShift 0.5s ease';
    showNotification('Quantum Mode Activated! 🌌', 'success');

    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
}

const quantumStyles = document.createElement('style');
quantumStyles.textContent = `
    @keyframes quantumShift {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(180deg); }
    }
`;
document.head.appendChild(quantumStyles);

// ==========================================
// Performance Optimization
// ==========================================

// Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// ==========================================
// Accessibility
// ==========================================

// Add keyboard navigation support
function initAccessibility() {
    // Focus visible styles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
}

const accessibilityStyles = document.createElement('style');
accessibilityStyles.textContent = `
    body.keyboard-nav *:focus {
        outline: 2px solid var(--color-accent-cyan);
        outline-offset: 2px;
    }

    *:focus {
        outline: none;
    }
`;
document.head.appendChild(accessibilityStyles);

document.addEventListener('DOMContentLoaded', initAccessibility);
