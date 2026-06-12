// Sticky Navbar on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) { // Add sticky class after scrolling down 50px
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});


var navLinks = document.getElementById("navLinks");
function showMenu(){
    navLinks.style.right = "0";
}
function hideMenu(){
    navLinks.style.right = "-200px";
}

// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.mission-vision-section .col, .team-member');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize elements
    const elementsToAnimate = document.querySelectorAll('.mission-vision-section .col, .team-member');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    // Initial check for elements in view
    animateOnScroll();

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Category filtering with animation
function filterCategory(category) {
    const items = document.querySelectorAll('.category-item');
    items.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 50);
            }, 300);
        } else {
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Add parallax effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;
    header.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Animate team member cards on hover
document.querySelectorAll('.team-member').forEach(member => {
    member.addEventListener('mouseenter', function() {
        this.querySelector('img').style.transform = 'scale(1.05)';
        this.style.transform = 'translateY(-10px)';
    });

    member.addEventListener('mouseleave', function() {
        this.querySelector('img').style.transform = 'scale(1)';
        this.style.transform = 'translateY(0)';
    });
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Add active class to current page link
const currentPage = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href').includes(currentPage)) {
        link.classList.add('active');
    }
});

// ===== ADDED: click sound + speech for nav links =====

// Play a short click sound (Web Audio)
function playClickSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'square';
        o.frequency.value = 1200;
        g.gain.value = 0.00001;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.006);
        g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.09);
        o.stop(ctx.currentTime + 0.095);
        setTimeout(() => { if (ctx.close) ctx.close(); }, 250);
    } catch (e) { /* ignore */ }
}

// Prefer a clear English voice (improved selection)
let selectedVoice = null;
function chooseBestEnglishVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return;

    // prefer exact high-quality English voices
    const preferredNames = [
        'Google US English',
        'Google UK English Female',
        'Microsoft Zira Desktop - English (United States)',
        'Microsoft Zira - English (United States)',
        'Anna', 'Zira', 'Alloy' // some Windows/mac fallbacks
    ];

    for (const name of preferredNames) {
        const v = voices.find(voice => voice.name && voice.name.toLowerCase().includes(name.toLowerCase()));
        if (v) { selectedVoice = v; return; }
    }

    // fallback: prefer en-US then en-GB then any English
    selectedVoice = voices.find(v => /^en-?us/i.test(v.lang)) ||
                    voices.find(v => /^en-?gb/i.test(v.lang)) ||
                    voices.find(v => /en\b/i.test(v.lang)) ||
                    voices[0];
}
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = chooseBestEnglishVoice;
    // try immediately in case voices already loaded
    setTimeout(chooseBestEnglishVoice, 150);
}

// Speak a single word clearly and resolve when done.
// For the specific word "home" use a respelling that produces a clearer final "m".
function speakText(text, lang = 'en-US') {
    return new Promise(resolve => {
        if (!('speechSynthesis' in window)) {
            resolve();
            return;
        }

        const raw = String(text).trim();
        // respell "home" to encourage final 'm' to be audible
        const utterText = raw.toLowerCase() === 'home' ? 'hohm' : raw;

        try { window.speechSynthesis.cancel(); } catch (e) {}

        const u = new SpeechSynthesisUtterance(utterText);
        u.lang = lang;
        if (selectedVoice) u.voice = selectedVoice;
        u.rate = 0.9;   // slightly slower for clarity
        u.pitch = 1.0;
        u.volume = 1.0;

        u.onend = () => resolve();
        u.onerror = () => resolve();

        window.speechSynthesis.speak(u);
    });
}

// Helper: extract a full speakable label from an element (prefers data-speak/aria-label)
function getSpeakWordFromElement(element) {
    const source = (element && (
        element.getAttribute && (element.getAttribute('data-speak') || element.getAttribute('aria-label'))
    )) || (element && (element.innerText || element.textContent)) || '';
    const raw = String(source).trim().replace(/\s+/g, ' ');
    if (!raw) return 'Home';
    // If the entire label is exactly "home", keep the special handling
    return raw.toLowerCase() === 'home' ? 'Home' : raw;
}

// Delegated handler (capture): apply to ALL links and buttons
document.body.addEventListener('click', async function (e) {
    const anchor = e.target.closest && e.target.closest('a');
    const buttonLike = e.target.closest && e.target.closest('button, [role="button"]');
    const hamburger = e.target.closest && e.target.closest('.hamburger');

    // Play a click for the hamburger toggle (no speech)
    if (hamburger) {
        // don't interfere with existing toggle behavior
        playClickSound();
        return;
    }

    // If neither anchor nor button-like, ignore
    if (!anchor && !buttonLike) return;

    // Allow opting-out
    const actionable = anchor || buttonLike;
    if (actionable && actionable.hasAttribute('data-no-tts')) return;

    // Buttons: speak + click sound, but do NOT prevent default (so existing handlers still run)
    if (buttonLike && !anchor) {
        const speakWord = getSpeakWordFromElement(buttonLike);
        await speakText(speakWord, 'en-US');
        playClickSound();
        return; // let default/button handlers proceed
    }

    // Anchors: speak + click sound, then perform controlled navigation
    if (anchor) {
        const href = anchor.getAttribute('href') || '';
        const target = (anchor.getAttribute('target') || '').toLowerCase();
        const isDownload = anchor.hasAttribute('download');
        const isHash = href.startsWith('#') || href === '';

        // Prevent default so we can finish TTS first
        e.preventDefault();

        const speakWord = getSpeakWordFromElement(anchor);
        await speakText(speakWord, 'en-US');
        playClickSound();

        setTimeout(() => {
            try {
                if (!href) return;

                // Downloads: open directly
                if (isDownload) {
                    const abs = new URL(href, window.location.href).href;
                    if (target === '_blank') {
                        window.open(abs, '_blank', 'noopener');
                    } else {
                        window.location.href = abs;
                    }
                    return;
                }

                if (isHash) {
                    if (href === '#') return;
                    const id = href.replace(/^#/, '');
                    const el = document.getElementById(id) || document.querySelector(href);
                    if (el && el.scrollIntoView) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        location.hash = href.startsWith('#') ? href : ('#' + href);
                    }
                    return;
                }

                const abs = new URL(href, window.location.href).href;
                if (target === '_blank') {
                    window.open(abs, '_blank', 'noopener');
                } else {
                    window.location.href = abs;
                }
            } catch (err) { /* ignore */ }
        }, 120);
    }
}, { passive: false, capture: true });
