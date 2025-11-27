/**
 * xQubit.AI - Animations and Scroll Effects
 */

// ==========================================
// Intersection Observer for Scroll Animations
// ==========================================
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.init();
    }

    init() {
        this.setupObserver();
        this.observeElements();
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    // Stagger children animations
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 100}ms`;
                        child.classList.add('animate-in');
                    });
                }
            });
        }, this.observerOptions);
    }

    observeElements() {
        // Observe sections
        const sections = document.querySelectorAll('.features, .technology, .agents, .about, .cta');
        sections.forEach(section => {
            section.classList.add('animate-section');
            this.observer.observe(section);
        });

        // Observe cards
        const cards = document.querySelectorAll('.feature-card, .agent-card, .tech-item, .metric');
        cards.forEach(card => {
            card.classList.add('animate-card');
            this.observer.observe(card);
        });
    }
}

// ==========================================
// Counter Animation
// ==========================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = new Set();
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animated.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = target * easeOutQuart;

            element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = isDecimal ? target.toFixed(1) : target;
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// ==========================================
// Magnetic Button Effect
// ==========================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary, .btn-lg');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => this.handleMouseMove(e, button));
            button.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, button));
        });
    }

    handleMouseMove(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    }

    handleMouseLeave(e, button) {
        button.style.transform = 'translate(0, 0)';
    }
}

// ==========================================
// Parallax Effect
// ==========================================
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const scrollY = window.scrollY;

        this.elements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const offset = scrollY * speed;
            element.style.transform = `translateY(${offset}px)`;
        });
    }
}

// ==========================================
// Cursor Trail Effect (optional, subtle)
// ==========================================
class CursorTrail {
    constructor() {
        this.trail = [];
        this.trailLength = 10;
        this.mouseX = 0;
        this.mouseY = 0;
        this.enabled = window.innerWidth > 1024; // Only on desktop

        if (this.enabled) {
            this.init();
        }
    }

    init() {
        // Create trail elements
        for (let i = 0; i < this.trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: ${4 - i * 0.3}px;
                height: ${4 - i * 0.3}px;
                background: linear-gradient(135deg, #00F0FF, #8B5CF6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i * 0.1};
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(dot);
            this.trail.push({
                element: dot,
                x: 0,
                y: 0
            });
        }

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        this.animate();
    }

    animate() {
        let x = this.mouseX;
        let y = this.mouseY;

        this.trail.forEach((dot, index) => {
            dot.x += (x - dot.x) * (0.3 - index * 0.02);
            dot.y += (y - dot.y) * (0.3 - index * 0.02);

            dot.element.style.left = `${dot.x}px`;
            dot.element.style.top = `${dot.y}px`;

            x = dot.x;
            y = dot.y;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// Text Reveal Animation
// ==========================================
class TextReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-text');
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';

            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 30}ms`;
                span.className = 'reveal-char';
                element.appendChild(span);
            });
        });
    }
}

// ==========================================
// Glitch Text Effect
// ==========================================
class GlitchEffect {
    constructor() {
        this.elements = document.querySelectorAll('.glitch-text');
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            const text = element.textContent;
            element.setAttribute('data-text', text);
        });
    }
}

// ==========================================
// Initialize all animations
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    new CounterAnimation();
    new MagneticButtons();
    new ParallaxEffect();
    // new CursorTrail(); // Uncomment for cursor trail effect
    new TextReveal();
    new GlitchEffect();
});

// Add CSS for animation classes
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-section {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }

    .animate-section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .animate-card {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .animate-card.animate-in {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    .stagger-child {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .stagger-child.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .reveal-char {
        display: inline-block;
        opacity: 0;
        transform: translateY(20px);
        animation: revealChar 0.5s ease forwards;
    }

    @keyframes revealChar {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .glitch-text {
        position: relative;
    }

    .glitch-text::before,
    .glitch-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    .glitch-text:hover::before {
        animation: glitch1 0.3s infinite;
        color: #00F0FF;
        opacity: 0.8;
    }

    .glitch-text:hover::after {
        animation: glitch2 0.3s infinite;
        color: #8B5CF6;
        opacity: 0.8;
    }

    @keyframes glitch1 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
    }

    @keyframes glitch2 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(2px, -2px); }
        40% { transform: translate(2px, 2px); }
        60% { transform: translate(-2px, -2px); }
        80% { transform: translate(-2px, 2px); }
    }
`;
document.head.appendChild(animationStyles);
