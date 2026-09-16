/**
 * Soulverse - Master JavaScript
 * Handles cosmic canvas starfield, trailer modal, GSAP animations, 
 * smooth scrolling, config binding, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    hydrateConfigData();
    initCanvasStarfield();
    initGSAPAnimations();
    initTrailerModal();
    initWhatsAppModal(); // NEW: WhatsApp Enquiry Modal
    initEnquiryForm();
    initNavbarScroll();
    initMobileMenu();
    initSmoothScrolling();
});

/**
 * 1. Global Config Hydration Engine
 * Dynamically replaces text and links across the site based on data-config attributes.
 */
function hydrateConfigData() {
    console.log("Hydration engine started");
    if (typeof SOULVERSE_CONFIG === 'undefined') {
        console.error("SOULVERSE_CONFIG is undefined!");
        return;
    }
    console.log("SOULVERSE_CONFIG found:", SOULVERSE_CONFIG);

    // Replace Text Content
    document.querySelectorAll('[data-config]').forEach(el => {
        const path = el.getAttribute('data-config').split('.');
        let value = SOULVERSE_CONFIG;
        for (const p of path) {
            value = value?.[p];
        }
        if (value !== undefined) {
            el.textContent = value;
        }
    });

    // Replace Links/Hrefs
    document.querySelectorAll('[data-config-href]').forEach(el => {
        const path = el.getAttribute('data-config-href').split('.');
        let value = SOULVERSE_CONFIG;
        for (const p of path) {
            value = value?.[p];
        }
        if (value !== undefined) {
            if (path.includes('email')) {
                el.href = 'mailto:' + value;
            } else if (path.includes('phoneTel')) {
                el.href = 'tel:' + value.replace(/\s+/g, '');
            } else {
                el.href = value;
            }
        }
    });

    // We no longer bind WhatsApp CTAs here directly to links.
    // Instead, the initWhatsAppModal() intercepts clicks and handles the modal form.
    // The General WA buttons that don't need a modal (if any) could still be handled, 
    // but the plan says ALL WhatsApp links open the modal.
}

/**
 * 1.5 WhatsApp Enquiry Modal
 * Injects modal into DOM and intercepts WhatsApp clicks to collect Name, Email, Phone, Need.
 */
function initWhatsAppModal() {
    // 1. Inject the Modal HTML
    const modalHTML = `
    <div id="wa-modal-overlay" class="modal-overlay hidden" aria-hidden="true" role="dialog" style="z-index: 100; position: fixed; inset: 0; background: rgba(5,6,18,0.95); backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;">
      <div class="modal-content relative p-8 max-w-lg w-full mx-4 rounded-2xl border border-gold-500/20" style="background: #0c0f28; transform: translateY(20px); transition: transform 0.3s ease;">
        <button id="wa-modal-close" class="absolute top-4 right-4 text-gray-400 hover:text-white p-2 focus:outline-none" aria-label="Close form">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="text-center mb-6">
          <span class="text-gold-400 text-2xl font-serif block mb-2">✦</span>
          <h2 class="font-serif text-2xl sm:text-3xl font-medium text-white">Enquire on WhatsApp</h2>
          <p class="text-gray-400 text-sm mt-2">Please share your details so our team can guide you perfectly.</p>
        </div>
        <form id="wa-enquiry-form" class="space-y-4">
          <input type="hidden" id="wa-course-type" value="">
          <div>
            <label class="block text-xs uppercase tracking-widest text-gold-300 font-semibold mb-1">Full Name *</label>
            <input type="text" id="wa-name" required class="input-cosmic w-full px-4 py-3 bg-space-900 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50" placeholder="e.g. Priya Sharma">
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-gold-300 font-semibold mb-1">Email Address *</label>
            <input type="email" id="wa-email" required class="input-cosmic w-full px-4 py-3 bg-space-900 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50" placeholder="you@domain.com">
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-gold-300 font-semibold mb-1">Mobile Phone *</label>
            <input type="tel" id="wa-phone" required class="input-cosmic w-full px-4 py-3 bg-space-900 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50" placeholder="+91 98765 43210">
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-gold-300 font-semibold mb-1">Your Needs</label>
            <textarea id="wa-needs" rows="3" class="input-cosmic w-full px-4 py-3 bg-space-900 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50" placeholder="E.g. I am looking for a new job..."></textarea>
          </div>
          <button type="submit" class="btn-gold-primary w-full py-4 mt-4 text-sm uppercase tracking-wider font-semibold rounded-full bg-gold-400 text-space-950 hover:bg-gold-300 transition-colors">
            Continue to WhatsApp →
          </button>
        </form>
      </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('wa-modal-overlay');
    const content = overlay.querySelector('.modal-content');
    const closeBtn = document.getElementById('wa-modal-close');
    const form = document.getElementById('wa-enquiry-form');
    const typeInput = document.getElementById('wa-course-type');

    function openModal(courseType) {
        typeInput.value = courseType || 'general';
        overlay.classList.remove('hidden');
        // Small delay to allow display block to render before opacity transition
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
            content.style.transform = 'translateY(0)';
        }, 10);
    }

    function closeModal() {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        content.style.transform = 'translateY(20px)';
        setTimeout(() => {
            overlay.classList.add('hidden');
            form.reset();
        }, 300);
    }

    // 2. Intercept WhatsApp button clicks
    const waButtons = document.querySelectorAll('[data-wa-action], .wa-cta');
    waButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const courseType = btn.getAttribute('data-wa-type') || btn.getAttribute('data-course-id') || 'general';
            openModal(courseType);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // 3. Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('wa-name').value.trim();
        const email = document.getElementById('wa-email').value.trim();
        const phone = document.getElementById('wa-phone').value.trim();
        const needs = document.getElementById('wa-needs').value.trim() || 'N/A';
        const type = typeInput.value;

        // Determine course name based on type
        let courseName = "Manifestation Journeys";
        if (type === 'jobMoneyCourse') courseName = "Job / Money Manifestation Video Course";
        if (type === 'supernaturalCourse') courseName = "The Supernatural 6-Month Personal Mentorship Course";

        // Exact format requested
        const rawMessage = `Hello Prathiba Senthil, I would like to enquire about enrolling in the ${courseName}. Please share the details. ( My Details: Name: ${name} Email: ${email} Mobile: ${phone} Needs: ${needs})`;
        
        const whatsappNumber = SOULVERSE_CONFIG?.contact?.whatsappNumber || "916381083284";
        const finalUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rawMessage)}`;

        // Redirect to WhatsApp
        window.location.href = finalUrl;
        
        // Optional: close modal
        closeModal();
    });
}

/**
 * 2. Cosmic Canvas Starfield
 * Creates a realistic moving starfield with nebula effects
 */
function initCanvasStarfield() {
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    
    const config = {
        starCount: window.innerWidth < 768 ? 100 : 250,
        speed: 0.05,
        baseSize: 1.5
    };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < config.starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * width,
                size: Math.random() * config.baseSize + 0.1,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * 0.05 + 0.01
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        ctx.fillStyle = 'rgba(212, 175, 55, 0.8)'; // Champagne gold stars
        
        stars.forEach(star => {
            // Movement
            star.y -= config.speed * (star.size * 0.5);
            if (star.y < 0) {
                star.y = height;
                star.x = Math.random() * width;
            }

            // Twinkle
            star.opacity += star.twinkleSpeed;
            if (star.opacity > 1 || star.opacity < 0.2) {
                star.twinkleSpeed = -star.twinkleSpeed;
            }

            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        // Debounce resize
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(resize, 200);
    });

    resize();
    draw();
}

/**
 * 3. GSAP Animations
 * Handles scroll-triggered animations and entrance effects
 */
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Parallax
    gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Fade up animations
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Staggered lists/cards
    const staggerGroups = document.querySelectorAll('.stagger-group');
    staggerGroups.forEach(group => {
        const items = group.querySelectorAll('.stagger-item');
        gsap.fromTo(items,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: group,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}

/**
 * 4. Trailer Modal
 * Handles YouTube/Vimeo trailer popups
 */
function initTrailerModal() {
    const modal = document.getElementById('trailer-modal');
    const playBtns = document.querySelectorAll('.play-trailer-btn');
    const closeBtn = document.querySelector('.close-modal');
    const iframe = document.getElementById('trailer-iframe');
    
    if (!modal || !iframe) return;

    playBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const videoUrl = btn.getAttribute('data-video-url');
            if (videoUrl) {
                iframe.src = videoUrl;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => iframe.src = '', 300); // clear src after animation
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * 5. Navbar Scroll Effect
 * Adds glassmorphism background to navbar on scroll
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * 6. Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-links');
    
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        });
    });
}

/**
 * 7. Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * 8. Destiny Enquiry Form
 * Handles submission of the main enquiry form on enquiry.html
 */
function initEnquiryForm() {
    const form = document.getElementById('destiny-enquiry-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const phone = document.getElementById('user-phone').value.trim();
        const needs = document.getElementById('user-description').value.trim() || 'N/A';
        const reason = document.querySelector('input[name="enquiry_reason"]:checked').value;

        let courseType = "general";
        if (reason === "VIDEO COURSE") {
            courseType = "jobMoneyCourse";
        } else if (reason === "PERSONAL COURSE") {
            courseType = "supernaturalCourse";
        }

        // Get the base message from config
        let baseMessage = SOULVERSE_CONFIG?.whatsappMessages?.[courseType] || SOULVERSE_CONFIG?.whatsappMessages?.general || "Hello, I would like to enquire.";
        
        // Append user details
        const rawMessage = `${baseMessage} ( My Details: Name: ${name} Email: ${email} Mobile: ${phone} Needs: ${needs})`;
        
        const whatsappNumber = SOULVERSE_CONFIG?.contact?.whatsappNumber || "916381083284";
        const finalUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rawMessage)}`;

        // Redirect to WhatsApp
        window.location.href = finalUrl;
    });

    // Handle radio pill selection styling
    const radioPills = document.querySelectorAll('.enquiry-radio-pill');
    if (radioPills.length > 0) {
        radioPills.forEach(pill => {
            const radio = pill.querySelector('input[type="radio"]');
            radio.addEventListener('change', () => {
                radioPills.forEach(p => p.classList.remove('selected'));
                if (radio.checked) {
                    pill.classList.add('selected');
                }
            });
        });
    }
}
