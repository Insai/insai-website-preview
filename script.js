/**
 * Insai 2.0 Landing Page — JavaScript
 * Navigation, scroll animations, active section, counter animations
 */

const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================================================
// Throttle / Debounce helpers
// ==========================================================================
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// ==========================================================================
// Mobile Navigation
// ==========================================================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu) {
        hamburger?.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ==========================================================================
// Smooth Scrolling
// ==========================================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navHeight = document.querySelector('.navbar')?.offsetHeight || 72;
        const targetPosition = target.offsetTop - navHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
    });
});

// ==========================================================================
// Navbar — Transparent on hero, solid on scroll
// ==========================================================================
const navbar = document.querySelector('.navbar');
const heroSection = document.querySelector('.hero');

function updateNavbar() {
    if (!navbar) return;
    const scrollY = window.scrollY;
    const heroBottom = heroSection ? heroSection.offsetHeight - 80 : 400;

    if (scrollY > heroBottom) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
}

window.addEventListener('scroll', throttle(updateNavbar, 16));
updateNavbar();

// ==========================================================================
// Intersection Observer — Fade-in-up animations
// ==========================================================================
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (!prefersReducedMotion) {
            entry.target.classList.add('fade-in-up');
        } else {
            entry.target.style.opacity = '1';
        }

        animationObserver.unobserve(entry.target);
    });
}, observerOptions);

// Elements to animate on scroll — grouped with staggered delays
const animatedSelectors = [
    '.problem-card',
    '.pipeline-step',
    '.credibility-item',
    '.sleep-stat',
    '.sleep-feature',
    '.shift-card',
    '.pharma-card',
    '.bm-phase',
    '.diff-card',
    '.funnel-level',
    '.component-item',
    '.commercial-item',
];

document.addEventListener('DOMContentLoaded', () => {
    // Group elements by their parent container for staggered delays
    const allAnimated = document.querySelectorAll(animatedSelectors.join(', '));

    // Track index within each parent for staggering
    const parentIndexMap = new Map();

    allAnimated.forEach((el) => {
        const parentKey = el.parentElement;
        if (!parentIndexMap.has(parentKey)) {
            parentIndexMap.set(parentKey, 0);
        }
        const idx = parentIndexMap.get(parentKey);
        parentIndexMap.set(parentKey, idx + 1);

        if (!prefersReducedMotion) {
            el.style.opacity = '0';
            el.style.animationDelay = `${idx * 0.08}s`;
        }
        animationObserver.observe(el);
    });

    // Section-level fade-ins (headers, callouts, etc.)
    const sectionFadeEls = document.querySelectorAll(
        '.section-header, .stat-banner, .problem-callout, .sleep-insight, ' +
        '.platform-outcome, .sleep-hero-image, .platform-visual, .bm-insight, ' +
        '.why-now-close, .vision-block, .mission-block, .market-funnel, ' +
        '.business-model, .components-grid, .cta-content'
    );

    sectionFadeEls.forEach((el) => {
        if (!prefersReducedMotion) {
            el.style.opacity = '0';
        }
        animationObserver.observe(el);
    });

    // Hero content — immediate fade in
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    if (heroContent && !prefersReducedMotion) {
        heroContent.classList.add('fade-in-up');
    }
    if (heroVisual && !prefersReducedMotion) {
        heroVisual.style.animationDelay = '0.25s';
        heroVisual.classList.add('fade-in-up');
    }
});

// ==========================================================================
// Active Nav Link Highlighting (scrollspy)
// ==========================================================================
const sectionIds = [
    'hero',
    'vision',
    'problem',
    'sleep',
    'platform',
    'pharma',
    'market',
    'why-now',
    'why-insai',
    'contact',
];

const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));

function setActiveLink(activeId) {
    navLinks.forEach((a) => {
        const href = a.getAttribute('href')?.replace('#', '');
        if (!href) return;
        a.classList.toggle('is-active', href === activeId);
    });
}

function updateActiveSection() {
    const navHeight = document.querySelector('.navbar')?.offsetHeight || 72;
    const fromTop = window.scrollY + navHeight + 100;

    let current = sectionIds[0];
    sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= fromTop) current = id;
    });

    setActiveLink(current);
}

window.addEventListener('scroll', throttle(updateActiveSection, 100));
document.addEventListener('DOMContentLoaded', updateActiveSection);

// ==========================================================================

// ==========================================================================
// Subtle parallax on hero EEG waves
// ==========================================================================
if (!prefersReducedMotion) {
    const eegWave = document.querySelector('.hero-eeg-wave');
    if (eegWave) {
        window.addEventListener(
            'scroll',
            throttle(() => {
                const scrollY = window.scrollY;
                if (scrollY < window.innerHeight) {
                    eegWave.style.transform = `translateY(${scrollY * 0.15}px)`;
                }
            }, 16)
        );
    }
}

// ==========================================================================
// Partners logo infinite scroll (optional subtle float)
// ==========================================================================
// Handled in CSS only for simplicity

// ==========================================================================
// Console Greeting
// ==========================================================================
console.log('%cInsai', 'color: #1FA6A0; font-size: 24px; font-weight: bold;');
console.log(
    '%cBrain Foundation Models for Life Sciences',
    'color: #8CA0AE; font-size: 14px;'
);
