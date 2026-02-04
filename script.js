
// toggle menu button
function toggleMenu(){
    console.log("toggleMenu() called");
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.main-nav');
    if (menuBtn) menuBtn.classList.toggle('active');
    if (nav) nav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

function closeMenu(){
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.main-nav');
    if (menuBtn) menuBtn.classList.remove('active');
    if (nav) nav.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function setActiveNavLink(hash){
    const links = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
    if (links.length === 0) return;

    links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const active = href === hash;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
        
        // Add click handler to close menu when nav link clicked
        if (!link.dataset.navHandler) {
            link.dataset.navHandler = 'true';
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 100);
            });
        }
    });
}

function initNavSpy(){
    const links = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
    const sectionIds = links
        .map((link) => (link.getAttribute('href') || '').slice(1))
        .filter(Boolean);

    const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el) => el instanceof Element);

    if (sections.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        // Fallback: set based on current hash.
        setActiveNavLink(location.hash || '#home');
        return;
    }

    let lastActive = '';
    const observer = new IntersectionObserver(
        (entries) => {
            // Pick the most visible intersecting section.
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

            const best = visible[0];
            const id = best?.target?.id;
            if (!id) return;

            const nextHash = `#${id}`;
            if (nextHash === lastActive) return;
            lastActive = nextHash;
            setActiveNavLink(nextHash);
        },
        {
            root: null,
            // Treat the center band of the viewport as "active".
            rootMargin: '-35% 0px -55% 0px',
            threshold: [0.08, 0.12, 0.2, 0.3, 0.45],
        }
    );

    sections.forEach((section) => observer.observe(section));
}

document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const navLink = target.closest('.nav a');
    if (!navLink) return;

    const href = navLink.getAttribute('href') || '';
    if (!href.startsWith('#') || href === '#') {
        closeMenu();
        return;
    }

    const destination = document.querySelector(href);
    if (destination) {
        event.preventDefault();
        setActiveNavLink(href);
        try {
            history.pushState(null, '', href);
        } catch (_) {
            // ignore
        }
        destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    closeMenu();
});


// To change the bg videos by clicking on the gallery images..

const slideContent = {
    'service-1': {
        description: `At NexxusLab, we transform ideas into interactive digital blueprints through our professional Mock-ups & Prototypes service. By creating clickable, user-friendly prototypes, we help you validate concepts and identify usability gaps before you invest in full-scale development, ensuring every project is guided with clarity and precision. Our three-tiered approach ensures there is a package for every stage of growth. The Starter tier is ideal for early-stage ideas and solo founders, offering essential wireframe sketches, UI flows, and a basic clickable Figma prototype. The Growth tier suits teams refining their user experience by providing high-fidelity prototypes, user testing feedback, and annotated flow designs. For enterprises or investor-ready projects, our Scale tier delivers fully interactive prototypes, comprehensive UX audits, and a complete design system library to confidently align stakeholders and bring your vision to life efficiently.`,
    },
    'service-2': {
        description: `Our Software Development service turns your digital ideas into high-performance, fully functioning applications, ranging from responsive websites to mobile and cross-platform solutions. We design scalable, secure, and maintainable systems tailored specifically to your business needs, translating your vision into a digital reality. To support different business phases, the Starter tier is perfect for MVPs or early product launches, including core web or app builds, essential API integrations, and deployment support. The Growth tier is designed for businesses scaling their user base, featuring complete backend and frontend development, analytics integration, and staging deployment for quality assurance. Finally, the Scale tier targets enterprise-level projects with advanced system architecture, security hardening, and continuous integration/continuous deployment (CI/CD) setups to ensure your product succeeds in a competitive market.`,
    },
    'service-3': {
        description: `Protecting your business from digital threats is critical to long-term success, and our Network Security services ensure your data and infrastructure remain safe. We provide a comprehensive shield for your enterprise against digital intrusions through proactive monitoring, risk assessments, and secure infrastructure implementation. The Starter tier is designed for small teams with basic security needs, offering a thorough security audit and a detailed risk report. The Growth tier supports expanding companies by providing firewall configurations, secure access setups, and active monitoring solutions. For large enterprises or highly regulated industries, our Scale tier delivers fully managed security operations, including 24/7 monitoring and advanced threat detection to ensure business continuity and peace of mind.`,
    },
    'service-4': {
        description: `Our IT Support Training empowers teams with the knowledge and skills needed to maintain efficient IT operations through interactive webinars and hands-on sessions. We provide top-tier technical support and industry-standard customer service training to elevate your team’s potential in the digital landscape. The Starter tier is aimed at small teams new to IT support, offering introductory webinars and foundational training. The Growth tier is designed for tech teams looking to upskill with role-based training and supporting materials. Finally, the Scale tier caters to large organizations and enterprise clients, delivering custom sessions, certifications, and advanced support strategies to handle technical challenges with service quality.`,
    },
    'service-5': {
        description: `Our Automata Development service leverages AI-powered systems to automate processes, streamline workflows, and deliver predictive insights that scale with your business. We specialize in cutting-edge AI that enhances customer experiences and unlocks transformative potential. The Starter tier focuses on basic process automation with rule-based workflows and simple bots for immediate efficiency gains. The Growth tier provides predictive analytics and advanced integrations for data-driven operations. For enterprises requiring full AI integration, the Scale tier delivers custom machine learning models and complete automation frameworks to make your operations smarter and faster.`,
    },
    'service-6': {
        description: `NexxusLab’s AI Marketing Services help businesses grow faster using data-driven strategies and intelligent automation to optimize campaigns and predict audience behavior. By enhancing lead conversions through AI-powered tools, we ensure your marketing becomes results-driven and highly efficient. The Starter tier is perfect for small businesses or early-stage campaigns, providing automated campaigns and basic analytics setup. The Growth tier is tailored for companies optimizing performance through AI audience targeting, retargeting, and campaign refinement. The Scale tier is designed for high-volume operations, delivering full automation, advanced optimization, and continuous performance improvements.`,
    },
};

function changeVideo(name){
    const bgVideoList = document.querySelectorAll('.bg-video');
    const trailers = document.querySelectorAll('.trailer');
    const models = document.querySelectorAll('.model');
    const contentParagraph = document.querySelector('.content p');


//JavaScript higher order array function forEach
// makes easier to mapp data
    bgVideoList.forEach(video =>{
        video.classList.remove('active');
        if(video.classList.contains(name)){
            video.classList.add('active')
        }
    });

//Changing model names 

models.forEach(model =>{
    model.classList.remove('active');
    if(model.classList.contains(name)){
        model.classList.add('active')
    }
});

//Changing trailers per model

trailers.forEach(trailer =>{
    trailer.classList.remove('active');
    if(trailer.classList.contains(name)){
        trailer.classList.add('active')
    }
});

    const nextDescription = slideContent?.[name]?.description;
    if (contentParagraph && nextDescription) {
        contentParagraph.textContent = nextDescription;
    }

}

// ========== HERO CAROUSEL CONTROLLER ==========
const heroCarousel = (function() {
    const services = ['service-1', 'service-2', 'service-3', 'service-4', 'service-5', 'service-6'];
    let currentIndex = 0;
    let autoPlayInterval = null;
    let progressInterval = null;
    let progressValue = 0;
    const autoPlayDelay = 6000; // 6 seconds per slide
    const progressStep = 50; // Update progress every 50ms
    let isPaused = false;

    function init() {
        const carousel = document.querySelector('.service-carousel');
        
        if (!carousel) return;

        // Add hover pause/resume functionality
        carousel.addEventListener('mouseenter', pause);
        carousel.addEventListener('mouseleave', resume);

        // Handle window resize
        window.addEventListener('resize', debounce(slideToCurrentIndex, 150));

        // Start auto-play
        startAutoPlay();

        // Update initial state
        updateActiveState();
    }

    // Debounce helper
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

    function goTo(index) {
        if (index < 0) index = services.length - 1;
        if (index >= services.length) index = 0;
        
        currentIndex = index;
        const serviceName = services[currentIndex];
        
        // Use existing changeVideo function
        changeVideo(serviceName);
        
        // Update carousel active state
        updateActiveState();
        
        // Reset progress
        resetProgress();
    }

    function next() {
        goTo(currentIndex + 1);
    }

    function prev() {
        goTo(currentIndex - 1);
    }

    function updateActiveState() {
        // Update service cards
        const items = document.querySelectorAll('.service-carousel .service-card');
        items.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Slide the carousel track
        slideToCurrentIndex();
    }

    function slideToCurrentIndex() {
        const track = document.querySelector('.carousel-track');
        const viewport = document.querySelector('.carousel-viewport');
        const cards = document.querySelectorAll('.service-card');
        
        if (!track || !viewport || cards.length === 0) return;

        const card = cards[0];
        const cardStyle = window.getComputedStyle(card);
        const cardWidth = card.offsetWidth;
        const gap = parseInt(cardStyle.marginRight) || 10;
        const cardTotalWidth = cardWidth + gap;

        const viewportWidth = viewport.offsetWidth;
        const visibleCards = Math.floor(viewportWidth / cardTotalWidth);
        
        // Calculate the offset to center the active card or slide appropriately
        let offset = 0;
        
        if (currentIndex >= visibleCards) {
            // Slide to show the current card
            offset = (currentIndex - visibleCards + 1) * cardTotalWidth;
        }
        
        // Make sure we don't scroll past the end
        const maxOffset = (cards.length * cardTotalWidth) - viewportWidth;
        offset = Math.min(offset, Math.max(0, maxOffset));

        track.style.transform = `translateX(-${offset}px)`;
    }

    function startAutoPlay() {
        stopAutoPlay();
        
        autoPlayInterval = setInterval(() => {
            if (!isPaused) {
                next();
            }
        }, autoPlayDelay);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        stopProgress();
    }

    function startProgress() {
        stopProgress();
        progressValue = 0;
        
        const progressBar = document.getElementById('carouselProgress');
        if (!progressBar) return;

        progressInterval = setInterval(() => {
            if (!isPaused) {
                progressValue += (progressStep / autoPlayDelay) * 100;
                if (progressValue > 100) progressValue = 100;
                progressBar.style.width = progressValue + '%';
            }
        }, progressStep);
    }

    function stopProgress() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    function resetProgress() {
        progressValue = 0;
        const progressBar = document.getElementById('carouselProgress');
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            // Force reflow
            progressBar.offsetHeight;
            progressBar.style.transition = 'width 0.1s linear';
        }
        
        // Restart auto-play timer
        startAutoPlay();
    }

    function pause() {
        isPaused = true;
    }

    function resume() {
        isPaused = false;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        goTo,
        next,
        prev,
        pause,
        resume
    };
})();

document.addEventListener('submit', async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.classList.contains('contact-form')) return;

    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusDiv = form.querySelector('#formStatus');

    if (!name || !email || !message) {
        if (statusDiv) {
            statusDiv.textContent = 'Please fill out all fields.';
            statusDiv.className = 'form-status error';
        }
        return;
    }

    // Disable button and show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }
    if (statusDiv) {
        statusDiv.textContent = '';
        statusDiv.className = 'form-status';
    }

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            if (statusDiv) {
                statusDiv.textContent = 'Thank you! Your message has been sent successfully.';
                statusDiv.className = 'form-status success';
            }
            form.reset();
        } else {
            const data = await response.json();
            if (statusDiv) {
                statusDiv.textContent = data.errors ? data.errors.map(e => e.message).join(', ') : 'Oops! Something went wrong. Please try again.';
                statusDiv.className = 'form-status error';
            }
        }
    } catch (error) {
        if (statusDiv) {
            statusDiv.textContent = 'Network error. Please check your connection and try again.';
            statusDiv.className = 'form-status error';
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    }
});

function initPortfolioSlider(){
    const slider = document.querySelector('.portfolio-slider');
    if (!slider) return;

    const track = slider.querySelector('.portfolio-track');
    const slides = Array.from(slider.querySelectorAll('.portfolio-slide'));
    const prevButton = slider.querySelector('.portfolio-nav.prev');
    const nextButton = slider.querySelector('.portfolio-nav.next');
    const dotsContainer = slider.querySelector('.portfolio-dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let intervalId = null;
    let isAnimating = false;
    let isPaused = false;

    const intervalMs = Math.max(2500, Number(slider.getAttribute('data-interval')) || 4500);

    function updateSlider() {
        if (isAnimating) return;
        isAnimating = true;

        // Update slide positions for 3D effect
        slides.forEach((slide, index) => {
            // Remove all position classes
            slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
            
            // Calculate relative position
            let diff = index - currentIndex;
            
            // Handle wrapping for infinite loop effect
            if (diff > slides.length / 2) diff -= slides.length;
            if (diff < -slides.length / 2) diff += slides.length;
            
            // Assign position classes based on relative position
            if (diff === 0) {
                slide.classList.add('active');
            } else if (diff === -1) {
                slide.classList.add('prev');
            } else if (diff === 1) {
                slide.classList.add('next');
            } else if (diff === -2) {
                slide.classList.add('far-prev');
            } else if (diff === 2) {
                slide.classList.add('far-next');
            }
        });
        
        // Update dots
        if (dotsContainer) {
            const dots = Array.from(dotsContainer.querySelectorAll('.portfolio-dot'));
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
        }

        // Update slide counter
        const counterCurrent = slider.querySelector('.counter-current');
        const counterTotal = slider.querySelector('.counter-total');
        if (counterCurrent) {
            counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
        }
        if (counterTotal) {
            counterTotal.textContent = String(slides.length).padStart(2, '0');
        }

        // Reset animation lock after transition
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    function goToSlide(index) {
        if (isAnimating) return;
        
        // Wrap around
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
        stopAutoplay();
        intervalId = setInterval(nextSlide, intervalMs);
    }

    function stopAutoplay() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function pauseAutoplay() {
        isPaused = true;
        stopAutoplay();
    }

    function resumeAutoplay() {
        isPaused = false;
        startAutoplay();
    }

    // Create dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'portfolio-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(index);
                resumeAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Button events
    prevButton?.addEventListener('click', () => {
        prevSlide();
        resumeAutoplay();
    });
    
    nextButton?.addEventListener('click', () => {
        nextSlide();
        resumeAutoplay();
    });

    // Pause on hover, resume on leave
    slider.addEventListener('mouseenter', pauseAutoplay);
    slider.addEventListener('mouseleave', resumeAutoplay);

    // Keyboard navigation
    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
            resumeAutoplay();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
            resumeAutoplay();
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pauseAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        resumeAutoplay();
    }, { passive: true });

    // Initialize - always start autoplay loop
    updateSlider();
    startAutoplay();
}

function initScrollProgress(){
    const bar = document.querySelector('.scroll-progress__bar');
    if (!bar) return;

    let ticking = false;
    function update(){
        ticking = false;
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
        bar.style.width = `${(progress * 100).toFixed(2)}%`;
    }

    function onScroll(){
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
}

function initScrollReveal(){
    const targets = Array.from(
        document.querySelectorAll(
            [
                '.banner .content',
                '.screen.screen-logo',
                '.gallery',
                '.page-section .section-title',
                '.page-section .section-subtitle',
                '.info-card',
                '.portfolio-slider',
                '.team-reveal',
                '.contact-booking',
                '.contact-form',
                '#footer .footer-inner',
            ].join(',')
        )
    );

    // Also observe page-sections for animation triggers
    const sections = document.querySelectorAll('.page-section');

    if (targets.length === 0) return;
    targets.forEach((el) => el.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-visible'));
        sections.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        },
        {
            root: null,
            rootMargin: '0px 0px -12% 0px',
            threshold: 0.12,
        }
    );

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        { threshold: 0.1 }
    );

    targets.forEach((el) => observer.observe(el));
    sections.forEach((el) => sectionObserver.observe(el));
}

function initBackToTop(){
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    let ticking = false;
    function update(){
        ticking = false;
        const show = (window.scrollY || 0) > 520;
        button.classList.toggle('is-visible', show);
        button.setAttribute('aria-hidden', show ? 'false' : 'true');
    }

    function onScroll(){
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    }

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
}

function initCalendlyPopup(){
    const triggers = Array.from(document.querySelectorAll('[data-calendly-popup]'));
    if (triggers.length === 0) return;

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            if (!window.Calendly || typeof window.Calendly.initPopupWidget !== 'function') return;
            event.preventDefault();
            window.Calendly.initPopupWidget({ url: 'https://calendly.com/acseleon1/30min' });
        });
    });
}

function initFuturisticBackgroundCursor(){
    const root = document.documentElement;
    let rafId = null;
    let lastX = window.innerWidth * 0.5;
    let lastY = window.innerHeight * 0.3;

    function commit(){
        rafId = null;
        root.style.setProperty('--cursor-x', `${lastX}px`);
        root.style.setProperty('--cursor-y', `${lastY}px`);
    }

    function onMove(event){
        lastX = event.clientX;
        lastY = event.clientY;
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(commit);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    commit();
}

function initHoverTiltEffects(){
    // Avoid on touch-only devices.
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

    const targets = Array.from(
        document.querySelectorAll(
            [
                '.header-cta',
                '.banner .content a',
                '.btn-primary',
                '.info-card',
                '.portfolio-nav',
                '.portfolio-dot',
                '.team-reveal__toggle',
            ].join(',')
        )
    );
    if (targets.length === 0) return;

    targets.forEach((el) => {
        el.classList.add('cursor-tilt');

        function onMove(event){
            const rect = el.getBoundingClientRect();
            const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
            const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));

            const px = rect.width ? (x / rect.width) : 0.5;
            const py = rect.height ? (y / rect.height) : 0.5;

            // Variables for CSS radial gradient origin.
            el.style.setProperty('--px', `${(px * 100).toFixed(2)}%`);
            el.style.setProperty('--py', `${(py * 100).toFixed(2)}%`);

            // Small tilt based on pointer position.
            const max = 7; // degrees
            const ry = (px - 0.5) * (max * 2);
            const rx = (0.5 - py) * (max * 2);
            el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
            el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
        }

        function onLeave(){
            el.style.setProperty('--px', '50%');
            el.style.setProperty('--py', '50%');
            el.style.setProperty('--rx', '0deg');
            el.style.setProperty('--ry', '0deg');
        }

        el.addEventListener('pointermove', onMove, { passive: true });
        el.addEventListener('pointerleave', onLeave, { passive: true });
    });
}

function initFuturisticBackgroundParticles(){
    // Kept name for compatibility with existing init call.
    // Renders a neon wireframe tunnel with floating cubes (retro-futuristic).
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = !reduceMotion;

    const canvas = document.querySelector('.futuristic-bg__canvas');
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const state = {
        w: 0,
        h: 0,
        dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
        t: 0,
        mouseX: window.innerWidth * 0.5,
        mouseY: window.innerHeight * 0.5,
        cubes: [],
        zOffset: 0,
        raf: 0,
    };

    function rand(min, max){
        return min + Math.random() * (max - min);
    }

    function resize(){
        state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        state.w = Math.max(1, Math.floor(window.innerWidth));
        state.h = Math.max(1, Math.floor(window.innerHeight));
        canvas.width = Math.floor(state.w * state.dpr);
        canvas.height = Math.floor(state.h * state.dpr);
        canvas.style.width = `${state.w}px`;
        canvas.style.height = `${state.h}px`;
        ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    function makeCubes(){
        const area = state.w * state.h;
        const count = Math.max(40, Math.min(120, Math.round(area / 16000)));

        // World size (tunnel bounds) in arbitrary units.
        const halfW = 380;
        const halfH = 260;
        const zNear = 80;
        const zFar = 3200;

        state.cubes = Array.from({ length: count }, () => {
            const size = rand(34, 120);
            return {
                x: rand(-halfW * 0.95, halfW * 0.95),
                y: rand(-halfH * 0.95, halfH * 0.95),
                z: rand(zNear, zFar),
                size,
                spin: rand(-0.0018, 0.0018),
                phase: rand(0, Math.PI * 2),
            };
        });

        state._world = { halfW, halfH, zNear, zFar };
    }

    function project(x, y, z, vpX, vpY, f){
        const s = f / z;
        return {
            x: vpX + x * s,
            y: vpY + y * s,
            s,
        };
    }

    function strokeGlowPath(strokeStyle, glowStyle, width, glowWidth){
        // Glow pass
        ctx.strokeStyle = glowStyle;
        ctx.lineWidth = glowWidth;
        ctx.stroke();
        // Core pass
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = width;
        ctx.stroke();
    }

    function drawTunnel(vpX, vpY, f){
        const { halfW, halfH, zFar } = state._world;
        const colorCore = 'rgba(0, 210, 220, 0.85)';
        const colorGlow = 'rgba(0, 210, 220, 0.18)';

        // Tunnel edges (four long lines)
        const corners = [
            { x: -halfW, y: -halfH },
            { x: halfW, y: -halfH },
            { x: halfW, y: halfH },
            { x: -halfW, y: halfH },
        ];

        for (let i = 0; i < corners.length; i++) {
            const a = corners[i];
            const b = corners[(i + 1) % corners.length];
            // draw the near rectangle as a guide? (subtle)
            const zNear = 180;
            const pa = project(a.x, a.y, zNear, vpX, vpY, f);
            const pb = project(b.x, b.y, zNear, vpX, vpY, f);
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            strokeGlowPath(colorCore, colorGlow, 1.4, 6);

            // connect to far
            const pf = project(a.x, a.y, zFar, vpX, vpY, f);
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pf.x, pf.y);
            strokeGlowPath(colorCore, colorGlow, 1.1, 5);
        }

        // Depth slices (like the reference grid)
        const sliceCount = 28;
        for (let i = 0; i < sliceCount; i++) {
            const p = i / (sliceCount - 1);
            const z = 160 + p * (zFar - 160);

            const tl = project(-halfW, -halfH, z, vpX, vpY, f);
            const tr = project(halfW, -halfH, z, vpX, vpY, f);
            const br = project(halfW, halfH, z, vpX, vpY, f);
            const bl = project(-halfW, halfH, z, vpX, vpY, f);

            const alpha = Math.max(0.06, 0.22 * (1 - p));
            const core = `rgba(0, 210, 220, ${0.55 * alpha})`;
            const glow = `rgba(0, 210, 220, ${0.18 * alpha})`;

            ctx.beginPath();
            ctx.moveTo(tl.x, tl.y);
            ctx.lineTo(tr.x, tr.y);
            ctx.lineTo(br.x, br.y);
            ctx.lineTo(bl.x, bl.y);
            ctx.closePath();
            strokeGlowPath(core, glow, 1.0, 5);
        }

        // Floor grid lines (extra perspective depth)
        const floorY = halfH;
        const lanes = 10;
        for (let i = 0; i <= lanes; i++) {
            const x = -halfW + (i / lanes) * (halfW * 2);
            const pNear = project(x, floorY, 200, vpX, vpY, f);
            const pFar = project(x, floorY, zFar, vpX, vpY, f);
            ctx.beginPath();
            ctx.moveTo(pNear.x, pNear.y);
            ctx.lineTo(pFar.x, pFar.y);
            strokeGlowPath('rgba(0, 210, 220, 0.26)', 'rgba(0, 210, 220, 0.08)', 0.9, 4);
        }
    }

    function drawCube(cube, vpX, vpY, f, now){
        const hue = 188;
        const { zNear, zFar, halfW, halfH } = state._world;
        const z = cube.z;
        if (z <= zNear || z >= zFar) return;

        // A little sway/spin for life
        const ang = (now * cube.spin) + cube.phase;
        const ca = Math.cos(ang);
        const sa = Math.sin(ang);

        const hs = cube.size * 0.5;
        const verts = [
            { x: -hs, y: -hs, z: -hs },
            { x: hs, y: -hs, z: -hs },
            { x: hs, y: hs, z: -hs },
            { x: -hs, y: hs, z: -hs },
            { x: -hs, y: -hs, z: hs },
            { x: hs, y: -hs, z: hs },
            { x: hs, y: hs, z: hs },
            { x: -hs, y: hs, z: hs },
        ];

        // rotate around Y (cheap, looks good)
        for (const v of verts) {
            const rx = v.x * ca - v.z * sa;
            const rz = v.x * sa + v.z * ca;
            v.x = rx;
            v.z = rz;
        }

        // translate into tunnel bounds
        const wx = Math.max(-halfW * 0.96, Math.min(halfW * 0.96, cube.x));
        const wy = Math.max(-halfH * 0.96, Math.min(halfH * 0.96, cube.y));

        const pts = verts.map((v) => project(wx + v.x, wy + v.y, z + v.z, vpX, vpY, f));

        const depth = (z - zNear) / (zFar - zNear);
        const alpha = Math.max(0.12, 0.55 * (1 - depth));
        const core = `hsla(${hue}, 100%, 60%, ${alpha})`;
        const glow = `hsla(${hue}, 100%, 60%, ${alpha * 0.22})`;

        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        ctx.beginPath();
        for (const [a, b] of edges) {
            ctx.moveTo(pts[a].x, pts[a].y);
            ctx.lineTo(pts[b].x, pts[b].y);
        }
        strokeGlowPath(core, glow, 1.2, 6);
    }

    function step(now){
        state.t = now;

        // Clear each frame for crisp wireframe look.
        ctx.clearRect(0, 0, state.w, state.h);

        // Vanishing point responds to cursor (subtle)
        const cx = state.w * 0.5;
        const cy = state.h * 0.52;
        const vx = cx + (state.mouseX - cx) * 0.08;
        const vy = cy + (state.mouseY - cy) * 0.06;
        const f = Math.max(420, Math.min(860, Math.min(state.w, state.h) * 0.95));

        // Background fill
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, 0, state.w, state.h);

        drawTunnel(vx, vy, f);

        // Move cubes forward
        const speed = 5.4;
        for (const cube of state.cubes) {
            cube.z -= speed;
            if (cube.z < state._world.zNear) {
                cube.z = state._world.zFar;
                cube.x = rand(-state._world.halfW * 0.95, state._world.halfW * 0.95);
                cube.y = rand(-state._world.halfH * 0.95, state._world.halfH * 0.95);
                cube.size = rand(34, 120);
            }
        }

        // Draw far-to-near for proper layering
        const ordered = state.cubes.slice().sort((a, b) => b.z - a.z);
        for (const cube of ordered) drawCube(cube, vx, vy, f, now);

        if (animate) state.raf = window.requestAnimationFrame(step);
    }

    function onPointerMove(event){
        state.mouseX = event.clientX;
        state.mouseY = event.clientY;
    }

    window.addEventListener('resize', () => {
        resize();
        makeCubes();
    });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    resize();
    makeCubes();

    // Render immediately so the background appears even if animation is disabled.
    step(performance.now());
}

function initTeamReveal(){
    const cards = Array.from(document.querySelectorAll('.team-reveal'));
    if (cards.length === 0) return;

    function triggerClickEffect(card, pointerEvent){
        const btn = card.querySelector('.team-reveal__toggle');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const clientX = typeof pointerEvent?.clientX === 'number' ? pointerEvent.clientX : rect.left + rect.width / 2;
        const clientY = typeof pointerEvent?.clientY === 'number' ? pointerEvent.clientY : rect.top + rect.height / 2;
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

        btn.style.setProperty('--ripple-x', `${x}px`);
        btn.style.setProperty('--ripple-y', `${y}px`);

        // Also expose as percentages on the card for richer effects.
        const px = rect.width ? (x / rect.width) : 0.5;
        const py = rect.height ? (y / rect.height) : 0.5;
        card.style.setProperty('--click-x', `${(px * 100).toFixed(2)}%`);
        card.style.setProperty('--click-y', `${(py * 100).toFixed(2)}%`);

        card.classList.add('is-rippling', 'is-pressed');
        window.setTimeout(() => card.classList.remove('is-pressed'), 160);
        window.setTimeout(() => card.classList.remove('is-rippling'), 850);
    }

    function setOpen(card, open){
        card.classList.toggle('is-open', open);
        const btn = card.querySelector('.team-reveal__toggle');
        if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function closeAll(except){
        cards.forEach((card) => {
            if (except && card === except) return;
            setOpen(card, false);
        });
    }

    cards.forEach((card) => {
        const btn = card.querySelector('.team-reveal__toggle');
        if (!btn) return;

        btn.addEventListener('pointerdown', (event) => {
            triggerClickEffect(card, event);
        });

        btn.addEventListener('click', (event) => {
            event.preventDefault();
            const willOpen = !card.classList.contains('is-open');
            closeAll(card);
            setOpen(card, willOpen);
        });
    });

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (target.closest('.team-reveal')) return;
        closeAll(null);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeAll(null);
    });
}

function initChatbot(){
    const root = document.getElementById('chatbot');
    if (!root) return;

    const launch = root.querySelector('.chatbot-launch');
    const panel = root.querySelector('.chatbot-panel');
    const closeBtn = root.querySelector('.chatbot-close');
    const resetBtn = root.querySelector('.chatbot-reset');
    const form = root.querySelector('.chatbot-form');
    const input = root.querySelector('.chatbot-input');
    const messages = root.querySelector('.chatbot-messages');

    if (!launch || !panel || !form || !input || !messages) return;

    const STORAGE_KEY = 'nexxus_chat_history_v1';
    const MAX_MESSAGES = 60;

    function loadHistory(){
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed
                .filter((m) => m && (m.role === 'user' || m.role === 'bot') && typeof m.text === 'string')
                .slice(-MAX_MESSAGES);
        } catch (_) {
            return [];
        }
    }

    function saveHistory(list){
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-MAX_MESSAGES)));
        } catch (_) {
            // ignore
        }
    }

    let history = loadHistory();

    function scrollToBottom(){
        messages.scrollTop = messages.scrollHeight;
    }

    function renderActions(container, actions){
        if (!actions || actions.length === 0) return;
        const wrap = document.createElement('div');
        wrap.className = 'chatbot-actions';

        actions.forEach((action) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chatbot-chip';
            btn.textContent = action.label;
            btn.addEventListener('click', () => {
                if (action.type === 'link' && action.href) {
                    window.location.hash = action.href;
                    const dest = document.querySelector(action.href);
                    dest?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    closeChat();
                } else if (action.type === 'say' && action.text) {
                    sendUserMessage(action.text);
                }
            });
            wrap.appendChild(btn);
        });

        container.appendChild(wrap);
    }

    function addMessage(role, text, actions){
        const bubble = document.createElement('div');
        bubble.className = `chatbot-bubble ${role === 'user' ? 'is-user' : 'is-bot'}`;

        const p = document.createElement('div');
        p.textContent = text;
        bubble.appendChild(p);

        renderActions(bubble, actions);
        messages.appendChild(bubble);

        history.push({ role, text, ts: Date.now() });
        saveHistory(history);
        scrollToBottom();
    }

    function renderHistory(){
        messages.innerHTML = '';
        history.forEach((m) => {
            const bubble = document.createElement('div');
            bubble.className = `chatbot-bubble ${m.role === 'user' ? 'is-user' : 'is-bot'}`;
            bubble.textContent = m.text;
            messages.appendChild(bubble);
        });
        scrollToBottom();
    }

    function ensureGreeting(){
        if (history.length > 0) return;
        addMessage(
            'bot',
            "Hi! I'm the Nexxus Assistant. Ask me about services, projects, or how to contact us.",
            [
                { type: 'say', label: 'What services do you offer?', text: 'What services do you offer?' },
                { type: 'say', label: 'How can I contact you?', text: 'How can I contact you?' },
                { type: 'link', label: 'Open Portfolio', href: '#portfolio' },
            ]
        );
    }

    function resetChat(){
        history = [];
        saveHistory(history);
        messages.innerHTML = '';
        ensureGreeting();
        scrollToBottom();
    }

    function getBotReply(rawText){
        const text = String(rawText || '').trim();
        const lower = text.toLowerCase();

        if (lower === 'clear' || lower === 'reset') {
            return {
                text: 'Chat cleared. How can I help you today?',
                actions: [
                    { type: 'say', label: 'Services', text: 'What services do you offer?' },
                    { type: 'say', label: 'Contact', text: 'How can I contact you?' },
                ],
                clear: true,
            };
        }

        if (/\b(hi|hello|hey|good\s*morning|good\s*afternoon|good\s*evening)\b/i.test(lower)) {
            return {
                text: 'Hello! What can I help you with?',
                actions: [
                    { type: 'say', label: 'Services', text: 'What services do you offer?' },
                    { type: 'say', label: 'Projects', text: 'Show me your projects' },
                    { type: 'say', label: 'Contact', text: 'How can I contact you?' },
                ],
            };
        }

        if (
            (lower.includes('who') &&
                (lower.includes('created') || lower.includes('made') || lower.includes('built')) &&
                (lower.includes('website') || lower.includes('site'))) ||
            lower.includes('who created this website')
        ) {
            return {
                text:
                    'This website was created by:\n' +
                    'Andreas Harold Molina\n' +
                    'Kyle Avinante\n' +
                    'Kim Andry De Leon\n' +
                    'Rodj Rogacion\n' +
                    'Ramon Danielle Frando\n' +
                    'John Joseph Paje\n' +
                    'Joshua Dacasin',
                actions: [{ type: 'link', label: 'Contact Us', href: '#contact' }],
            };
        }

        if (lower.includes('service') || lower.includes('offer') || lower.includes('do you do')) {
            return {
                text:
                    'We provide design (mock-ups & prototypes), web/hybrid/native app development, network security, technical support/webinars, and AI solutions.',
                actions: [
                    { type: 'link', label: 'View Services', href: '#services' },
                    { type: 'say', label: 'Contact details', text: 'How can I contact you?' },
                ],
            };
        }

        if (lower.includes('project') || lower.includes('portfolio') || lower.includes('work') || lower.includes('samples')) {
            return {
                text: 'You can see our recent work in the Portfolio section.',
                actions: [{ type: 'link', label: 'Open Portfolio', href: '#portfolio' }],
            };
        }

        if (lower.includes('email')) {
            return { text: 'You can email us at team@nexxuslab.com.' };
        }

        if (lower.includes('phone') || lower.includes('call') || lower.includes('number')) {
            return { text: 'You can reach us at +63 927-143-0884.' };
        }

        if (lower.includes('address') || lower.includes('location') || lower.includes('map') || lower.includes('where')) {
            return {
                text: 'Our address is Salcedo St., Legaspi Village, Makati City 1299, Philippines.',
                actions: [
                    {
                        type: 'say',
                        label: 'Open map link?',
                        text: 'Open the map',
                    },
                ],
            };
        }

        if (lower === 'open the map' || lower.includes('open map')) {
            window.open(
                'https://www.google.com/maps/place/Salcedo,+Legazpi+Village,+Makati,+Kalakhang+Maynila/@14.5557701,121.0146225,17z/data=!4m6!3m5!1s0x3397c90dddabdcd5:0x444d8d85b989df55!8m2!3d14.556767!4d121.0153735!16s%2Fg%2F1tx_3x9t?entry=ttu',
                '_blank',
                'noopener,noreferrer'
            );
            return { text: 'Opening Google Maps in a new tab.' };
        }

        if (lower.includes('hours') || lower.includes('time') || lower.includes('schedule')) {
            return { text: 'Our demo hours are Mon–Fri, 9am–6pm.' };
        }

        if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost')) {
            return {
                text: 'Pricing depends on your scope. Share a few details and we can estimate quickly.',
                actions: [{ type: 'link', label: 'Go to Contact', href: '#contact' }],
            };
        }

        if (lower.includes('thanks') || lower.includes('thank you')) {
            return { text: "You're welcome! Anything else you want to know?" };
        }

        return {
            text:
                "I can help with services, portfolio, or contact info. If you want, tell me what you're building and your timeline.",
            actions: [
                { type: 'link', label: 'Services', href: '#services' },
                { type: 'link', label: 'Contact', href: '#contact' },
                { type: 'say', label: 'Clear chat', text: 'clear' },
            ],
        };
    }

    function openChat(){
        panel.hidden = false;
        panel.removeAttribute('hidden');
        launch.setAttribute('aria-expanded', 'true');
        window.setTimeout(() => input.focus(), 0);
    }

    function closeChat(){
        panel.hidden = true;
        panel.setAttribute('hidden', '');
        launch.setAttribute('aria-expanded', 'false');
        launch.focus();
    }

    function toggleChat(){
        if (panel.hidden) openChat();
        else closeChat();
    }

    function sendUserMessage(text){
        const trimmed = String(text || '').trim();
        if (!trimmed) return;

        addMessage('user', trimmed);
        input.value = '';

        const reply = getBotReply(trimmed);
        if (reply?.clear) {
            history = [];
            saveHistory(history);
            messages.innerHTML = '';
        }

        window.setTimeout(() => {
            addMessage('bot', reply?.text || "I'm here to help.", reply?.actions);
        }, 220);
    }

    launch.addEventListener('click', toggleChat);
    
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeChat();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetChat);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !panel.hidden) closeChat();
    });

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (panel.hidden) return;
        if (target.closest('#chatbot')) return;
        closeChat();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        sendUserMessage(input.value);
    });

    // Ensure panel is hidden on load
    panel.hidden = true;
    panel.setAttribute('hidden', '');
    launch.setAttribute('aria-expanded', 'false');

    renderHistory();
    ensureGreeting();
}

document.addEventListener('DOMContentLoaded', () => {
    function safeCall(name, fn){
        try {
            fn();
        } catch (error) {
            // Keep the rest of the page functional even if one module fails.
            console.error(`[Init] ${name} failed`, error);
        }
    }

    // Background first so it's visible even if another init fails.
    safeCall('initFuturisticBackgroundCursor', initFuturisticBackgroundCursor);
    safeCall('initFuturisticBackgroundParticles', initFuturisticBackgroundParticles);
    safeCall('initHoverTiltEffects', initHoverTiltEffects);

    safeCall('setActiveNavLink', () => setActiveNavLink(location.hash || '#home'));
    safeCall('initNavSpy', initNavSpy);
    safeCall('initPortfolioSlider', initPortfolioSlider);
    safeCall('initTeamReveal', initTeamReveal);
    safeCall('initChatbot', initChatbot);
    safeCall('initScrollReveal', initScrollReveal);
    safeCall('initScrollProgress', initScrollProgress);
    safeCall('initBackToTop', initBackToTop);
    safeCall('initCalendlyPopup', initCalendlyPopup);
    
    // New effects
    safeCall('initTypingEffect', initTypingEffect);
    safeCall('initAnimatedCounters', initAnimatedCounters);
    safeCall('initMagneticButtons', initMagneticButtons);
    safeCall('initCursorSparkles', initCursorSparkles);
    safeCall('initParallaxSections', initParallaxSections);
    safeCall('initGlowingText', initGlowingText);
    
    // Loading screen & cursor
    safeCall('initLoadingScreen', initLoadingScreen);
    safeCall('initCustomCursor', initCustomCursor);
    safeCall('initRippleEffect', initRippleEffect);
    safeCall('initScrollIndicator', initScrollIndicator);
    safeCall('initTextScramble', initTextScramble);
    safeCall('initSectionReveal', initSectionReveal);
    safeCall('initFloatingParticles', initFloatingParticles);
    safeCall('initCardTilt', initCardTilt);
    
    // New enhanced effects
    safeCall('initMouseTrail', initMouseTrail);
    safeCall('initSmoothReveal', initSmoothReveal);
    safeCall('initInteractiveOrbs', initInteractiveOrbs);
    safeCall('initTextSplit', initTextSplit);
});

// ========== TYPING EFFECT ==========
function initTypingEffect() {
    const models = document.querySelectorAll('.model');
    if (models.length === 0) return;
    
    // Add typing cursor to active model
    models.forEach(model => {
        if (model.classList.contains('active')) {
            model.classList.add('typing-active');
        }
    });
}

// ========== ANIMATED COUNTERS ==========
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.team-stat__number');
    if (counters.length === 0) return;
    
    const animateCounter = (el) => {
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)/);
        if (!match) return;
        
        const target = parseInt(match[1], 10);
        const suffix = text.replace(/^\d+/, '');
        const duration = 2000;
        const start = performance.now();
        
        el.dataset.animated = 'true';
        
        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);
            el.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        };
        
        requestAnimationFrame(step);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ========== MAGNETIC BUTTONS ==========
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.header-cta, .info-card, .team-reveal');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = 0.15;
            btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ========== CURSOR SPARKLES ==========
function initCursorSparkles() {
    const sparkleContainer = document.createElement('div');
    sparkleContainer.className = 'sparkle-container';
    document.body.appendChild(sparkleContainer);
    
    let lastSparkle = 0;
    const sparkleInterval = 50;
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkle < sparkleInterval) return;
        lastSparkle = now;
        
        // Only create sparkles sometimes for subtlety
        if (Math.random() > 0.3) return;
        
        const sparkle = document.createElement('div');
        sparkle.className = 'cursor-sparkle';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.setProperty('--sparkle-color', `hsl(${180 + Math.random() * 40}, 100%, 70%)`);
        sparkleContainer.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    });
}

// ========== PARALLAX SECTIONS ==========
function initParallaxSections() {
    const sections = document.querySelectorAll('.page-section');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const offset = (scrollY - sectionTop) * 0.05;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.style.setProperty('--parallax-offset', `${offset}px`);
            }
        });
    });
}

// ========== GLOWING TEXT ==========
function initGlowingText() {
    const titles = document.querySelectorAll('.section-title');
    
    titles.forEach(title => {
        title.classList.add('glow-text');
        
        // Create glow layers
        const glowBg = document.createElement('span');
        glowBg.className = 'glow-bg';
        glowBg.textContent = title.textContent;
        title.appendChild(glowBg);
    });
}

// ========== LOADING SCREEN ==========
function initLoadingScreen() {
    const loader = document.getElementById('loaderScreen');
    if (!loader) return;
    
    // Hide loader after content is ready
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2200); // Wait for loader animation
    });
    
    // Fallback in case load event already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2200);
    }
}

// ========== CUSTOM CURSOR ==========
function initCustomCursor() {
    // Skip on touch devices or small screens
    if (window.matchMedia('(max-width: 1024px)').matches || 
        window.matchMedia('(hover: none)').matches ||
        window.matchMedia('(pointer: coarse)').matches) {
        return;
    }
    
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;
    
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    
    if (!dot || !ring) return;
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isVisible = true;
    
    // Portfolio section detection
    const portfolioSection = document.getElementById('portfolio');
    
    // Update cursor position
    const updateCursor = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Direct dot positioning for responsiveness
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        
        // Check if over portfolio section
        if (portfolioSection) {
            const rect = portfolioSection.getBoundingClientRect();
            const overPortfolio = mouseY >= rect.top && mouseY <= rect.bottom;
            
            if (overPortfolio && isVisible) {
                isVisible = false;
                document.body.classList.add('cursor-hidden');
            } else if (!overPortfolio && !isVisible) {
                isVisible = true;
                document.body.classList.remove('cursor-hidden');
            }
        }
    };
    
    document.addEventListener('mousemove', updateCursor, { passive: true });
    
    // Smooth ring follow with RAF
    let rafId;
    const animateRing = () => {
        const ease = 0.18;
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;
        
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        
        rafId = requestAnimationFrame(animateRing);
    };
    animateRing();
    
    // Hover effects for interactive elements
    const addHoverListeners = () => {
        const interactiveSelectors = [
            'a:not(#portfolio a)',
            'button:not(#portfolio button)',
            '.info-card',
            '.team-reveal',
            '.carousel-item',
            'input',
            'textarea',
            '.header-cta',
            '.menu-btn'
        ].join(', ');
        
        const elements = document.querySelectorAll(interactiveSelectors);
        
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            }, { passive: true });
            
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            }, { passive: true });
        });
    };
    
    addHoverListeners();
    
    // Click effects
    document.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
    }, { passive: true });
    
    document.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-click');
    }, { passive: true });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    }, { passive: true });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    }, { passive: true });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
    });
}

// ========== RIPPLE EFFECT ON CLICK ==========
function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.info-card, .team-reveal, .header-cta, .main-nav a');
    
    rippleElements.forEach(el => {
        el.classList.add('ripple-effect');
        
        el.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ========== SCROLL INDICATOR ==========
function initScrollIndicator() {
    const banner = document.querySelector('.banner');
    if (!banner) return;
    
    // Check if scroll indicator already exists
    if (banner.querySelector('.scroll-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = `
        <div class="scroll-indicator__mouse"></div>
        <span class="scroll-indicator__text">Scroll Down</span>
    `;
    
    banner.appendChild(indicator);
    
    // Hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            indicator.style.opacity = '0';
        } else {
            indicator.style.opacity = '1';
        }
    });
}

// ========== TEXT SCRAMBLE EFFECT ==========
function initTextScramble() {
    // Exclude portfolio section from scramble effect
    const scrambleElements = document.querySelectorAll('.section-title:not(.portfolio-title)');
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    
    scrambleElements.forEach(el => {
        const originalText = el.textContent;
        
        el.addEventListener('mouseenter', function() {
            let iteration = 0;
            const interval = setInterval(() => {
                this.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }
                
                iteration += 1/3;
            }, 30);
        });
    });
}

// ========== SECTION REVEAL ON SCROLL ==========
function initSectionReveal() {
    const sections = document.querySelectorAll('.page-section');
    
    // First, add the animate class to enable CSS transitions
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Animate children with stagger
                const cards = entry.target.querySelectorAll('.info-card, .team-reveal, .contact-booking, .contact-form');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('card-visible');
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    sections.forEach(section => observer.observe(section));
    
    // Fallback: make all sections visible after 2 seconds in case observer doesn't trigger
    setTimeout(() => {
        sections.forEach(section => {
            section.classList.add('section-visible');
        });
    }, 2000);
}

// ========== HOVER SOUND EFFECTS (optional - silent by default) ==========
function initHoverSounds() {
    // Create audio context on user interaction
    let audioContext = null;
    
    const createHoverSound = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.03;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.1);
    };
    
    // Uncomment below to enable hover sounds
    // document.querySelectorAll('.info-card, .team-reveal, a, button').forEach(el => {
    //     el.addEventListener('mouseenter', createHoverSound);
    // });
}

// ========== FLOATING PARTICLES ==========
function initFloatingParticles() {
    const sections = document.querySelectorAll('.page-section');
    
    sections.forEach(section => {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'floating-particles';
        particleContainer.setAttribute('aria-hidden', 'true');
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (5 + Math.random() * 5) + 's';
            particleContainer.appendChild(particle);
        }
        
        section.style.position = 'relative';
        section.appendChild(particleContainer);
    });
}

// ========== CARD TILT ON MOUSE MOVE ==========
function initCardTilt() {
    const tiltCards = document.querySelectorAll('.info-card, .team-reveal');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}
// ========== MOUSE TRAIL EFFECT ==========
function initMouseTrail() {
    const canvas = document.getElementById('mouseTrail');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };
    let isMoving = false;
    let moveTimeout;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        isMoving = true;
        
        // Add particles
        for (let i = 0; i < 2; i++) {
            particles.push({
                x: mouse.x,
                y: mouse.y,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                life: 1,
                color: Math.random() > 0.5 ? '#00c2de' : '#ff00ff'
            });
        }
        
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => { isMoving = false; }, 100);
    });
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= 0.02;
            p.size *= 0.97;
            
            if (p.life <= 0) {
                particles.splice(index, 1);
                return;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life * 0.6;
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        
        // Limit particles
        if (particles.length > 100) {
            particles = particles.slice(-100);
        }
        
        requestAnimationFrame(animate);
    }
    animate();
}

// ========== SMOOTH REVEAL ON SCROLL ==========
function initSmoothReveal() {
    const elements = document.querySelectorAll('.info-card, .team-reveal, .portfolio-slide, .contact-booking, .contact-form');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });
    
    elements.forEach(el => {
        el.classList.add('reveal-element');
        observer.observe(el);
    });
}

// ========== INTERACTIVE ORBS ==========
function initInteractiveOrbs() {
    const orbs = document.querySelectorAll('.orb');
    if (orbs.length === 0) return;
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 10;
            const offsetX = (x - 0.5) * speed;
            const offsetY = (y - 0.5) * speed;
            
            orb.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
}

// ========== TEXT SPLIT ANIMATION ==========
function initTextSplit() {
    const titles = document.querySelectorAll('.hero-main-title');
    
    titles.forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = 'char';
            span.style.animationDelay = `${index * 0.05}s`;
            title.appendChild(span);
        });
    });
}

// ========== VIDEO AUTOMATION CONTROLLER ==========
const videoAutomation = (function() {
    let video = null;
    let playPauseBtn = null;
    let muteBtn = null;
    let fullscreenBtn = null;
    let videoOverlay = null;
    let videoPlayBtn = null;
    let progressBar = null;
    let progressContainer = null;
    let timeDisplay = null;
    let thumbnails = [];
    let autoplayToggle = null;
    let currentIndex = 0;
    let isInitialized = false;

    const videoSources = [
        './assets/mclaren-1.mp4',
        './assets/mclaren-2.mp4',
        './assets/mclaren-3.mp4',
        './assets/mclaren-4.mp4',
        './assets/mclaren-5.mp4'
    ];

    function init() {
        if (isInitialized) return;
        
        video = document.getElementById('showcaseVideo');
        playPauseBtn = document.getElementById('playPauseBtn');
        muteBtn = document.getElementById('muteBtn');
        fullscreenBtn = document.getElementById('fullscreenBtn');
        videoOverlay = document.getElementById('videoOverlay');
        videoPlayBtn = document.getElementById('videoPlayBtn');
        progressBar = document.getElementById('videoProgressBar');
        progressContainer = document.getElementById('videoProgress');
        timeDisplay = document.getElementById('videoTime');
        thumbnails = document.querySelectorAll('.video-thumbnail');
        autoplayToggle = document.getElementById('autoplayToggle');

        if (!video) return;

        isInitialized = true;

        // Event Listeners
        if (videoPlayBtn) {
            videoPlayBtn.addEventListener('click', handlePlayClick);
        }

        if (videoOverlay) {
            videoOverlay.addEventListener('click', handlePlayClick);
        }

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', togglePlay);
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', toggleMute);
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
        }

        if (progressContainer) {
            progressContainer.addEventListener('click', seekVideo);
        }

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('ended', handleVideoEnd);
        video.addEventListener('loadedmetadata', updateTimeDisplay);
        video.addEventListener('play', updatePlayPauseIcon);
        video.addEventListener('pause', updatePlayPauseIcon);

        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => selectVideo(index));
        });

        // Initial state
        updatePlayPauseIcon();
    }

    function handlePlayClick(e) {
        e.stopPropagation();
        if (videoOverlay) {
            videoOverlay.classList.add('hidden');
        }
        video.play();
    }

    function togglePlay() {
        if (video.paused) {
            video.play();
            if (videoOverlay) videoOverlay.classList.add('hidden');
        } else {
            video.pause();
        }
    }

    function updatePlayPauseIcon() {
        if (!playPauseBtn) return;
        const icon = playPauseBtn.querySelector('i');
        if (video.paused) {
            icon.className = 'bi bi-play-fill';
        } else {
            icon.className = 'bi bi-pause-fill';
        }
    }

    function toggleMute() {
        video.muted = !video.muted;
        if (!muteBtn) return;
        const icon = muteBtn.querySelector('i');
        if (video.muted) {
            icon.className = 'bi bi-volume-mute-fill';
        } else {
            icon.className = 'bi bi-volume-up-fill';
        }
    }

    function toggleFullscreen() {
        const player = document.querySelector('.video-player');
        if (!player) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            player.requestFullscreen();
        }
    }

    function updateProgress() {
        if (!progressBar || !video.duration) return;
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = percent + '%';
        updateTimeDisplay();
    }

    function updateTimeDisplay() {
        if (!timeDisplay || !video.duration) return;
        const current = formatTime(video.currentTime);
        const duration = formatTime(video.duration);
        timeDisplay.textContent = `${current} / ${duration}`;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function seekVideo(e) {
        if (!progressContainer || !video.duration) return;
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    }

    function handleVideoEnd() {
        if (autoplayToggle && autoplayToggle.checked) {
            // Auto-play next video
            const nextIndex = (currentIndex + 1) % videoSources.length;
            selectVideo(nextIndex);
            video.play();
        } else {
            // Show overlay again
            if (videoOverlay) videoOverlay.classList.remove('hidden');
        }
    }

    function selectVideo(index) {
        currentIndex = index;
        const src = videoSources[index];
        
        if (video) {
            video.src = src;
            video.load();
        }

        // Update thumbnail active state
        thumbnails.forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });

        // Reset overlay
        if (videoOverlay) {
            videoOverlay.classList.remove('hidden');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init,
        selectVideo,
        togglePlay
    };
})();

// ========== PARALLAX MOUSE EFFECT ==========
function initParallaxMouse() {
    const heroSection = document.querySelector('.banner');
    if (!heroSection) return;
    
    const parallaxElements = heroSection.querySelectorAll('.hero-title, .screen-logo');
    
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        parallaxElements.forEach((el, index) => {
            const speed = (index + 1) * 20;
            const moveX = x * speed;
            const moveY = y * speed;
            
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    heroSection.addEventListener('mouseleave', () => {
        parallaxElements.forEach(el => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.5s ease';
        });
    });
}