
// toggle menu button
function toggleMenu(){
    console.log("toggleMenu() called");
    const menu = document.querySelector('.menu');
    const nav = document.querySelector('.nav');
    menu.classList.toggle('active');
    nav.classList.toggle('active');
}

function closeMenu(){
    const menu = document.querySelector('.menu');
    const nav = document.querySelector('.nav');
    if (menu) menu.classList.remove('active');
    if (nav) nav.classList.remove('active');
}

function setActiveNavLink(hash){
    const links = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
    if (links.length === 0) return;

    links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const active = href === hash;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

function initNavSpy(){
    const links = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
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
        description:
            'We transform visions into experiences with our Mock-ups & Prototypes services. Our designers create detailed, interactive prototypes as blueprints for your projects. Each prototype guides development with clarity and precision.',
    },
    'service-2': {
        description:
            'Our developers craft cutting-edge web, hybrid, and native applications. We translate your needs into digital realities, ensuring each application fits your vision. Let us shape your digital future.',
    },
    'service-3': {
        description:
            'We offer comprehensive Network Security services to shield your enterprise from cyber threats. Our proactive approach ensures your business is safeguarded against digital intrusions. Trust us to protect your network and provide peace of mind.',
    },
    'service-4': {
        description:
            'We offer top-tier technical support and industry-standard customer service through interactive webinars. Join us for support that elevates your potential in the digital landscape.',
    },
    'service-5': {
        description:
            "We specialize in cutting-edge AI services that automate processes, provide predictive analytics, and enhance customer experiences. Partner with us to unlock AI's transformative potential for your business.",
    },
    'service-6': {
        description:
            'We offer cutting-edge AI services for smart automation, predictive analytics, and advanced data processing. Partner with us to transform your business with AI-driven strategies.',
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

document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.classList.contains('contact-form')) return;

    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
    }

    alert('Thanks! Your message has been captured (demo form).');
    form.reset();
});

function initPortfolioSlider(){
    const slider = document.querySelector('.portfolio-slider');
    if (!slider) return;

    const track = slider.querySelector('.portfolio-track');
    const slides = Array.from(slider.querySelectorAll('.portfolio-slide'));
    const prevButton = slider.querySelector('.portfolio-nav.prev');
    const nextButton = slider.querySelector('.portfolio-nav.next');
    const dotsContainer = slider.querySelector('.portfolio-dots');
    const viewport = slider.querySelector('.portfolio-viewport');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let intervalId = null;
    let theta = 360 / slides.length;
    let radius = 560;

    const intervalMs = Math.max(1500, Number(slider.getAttribute('data-interval')) || 4500);
    const autoplay = (slider.getAttribute('data-autoplay') || 'false') === 'true';

    function updateDots(){
        if (!dotsContainer) return;
        const dots = Array.from(dotsContainer.querySelectorAll('.portfolio-dot'));
        dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
    }

    function setIndex(nextIndex){
        const normalized = ((nextIndex % slides.length) + slides.length) % slides.length;
        currentIndex = normalized;

        track.style.setProperty('--rotation', `${-theta * currentIndex}deg`);

        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        updateDots();
    }

    function layout(){
        theta = 360 / slides.length;

        // Use slide width to compute a reasonable radius.
        const sample = slides[0];
        const rect = sample.getBoundingClientRect();
        const slideWidth = rect.width || slider.clientWidth || 800;
        const ideal = (slideWidth / 2) / Math.tan(Math.PI / slides.length);
        // With more slides, we need a larger radius to prevent overlap.
        const maxRadius = Math.max(980, Math.min(1800, slides.length * 160));
        radius = Math.round(Math.max(360, Math.min(maxRadius, ideal + 90)));

        slider.style.setProperty('--portfolio-radius', `${radius}px`);

        slides.forEach((slide, index) => {
            slide.style.setProperty('--angle', `${theta * index}deg`);
        });

        setIndex(currentIndex);
    }

    function startAutoplay(){
        if (!autoplay) return;
        stopAutoplay();
        intervalId = window.setInterval(() => setIndex(currentIndex + 1), intervalMs);
    }

    function stopAutoplay(){
        if (intervalId !== null) {
            window.clearInterval(intervalId);
            intervalId = null;
        }
    }

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'portfolio-dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                setIndex(index);
                startAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    prevButton?.addEventListener('click', () => {
        setIndex(currentIndex - 1);
        startAutoplay();
    });
    nextButton?.addEventListener('click', () => {
        setIndex(currentIndex + 1);
        startAutoplay();
    });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Click a non-active slide to bring it forward; click the active one to follow the link.
    track.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest('.portfolio-link');
        if (!link) return;

        const slide = link.closest('.portfolio-slide');
        if (!slide) return;

        const index = slides.indexOf(slide);
        if (index === -1) return;

        if (index !== currentIndex) {
            event.preventDefault();
            setIndex(index);
            startAutoplay();
        }
    });

    // Keyboard controls when the carousel is focused.
    slider.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            setIndex(currentIndex - 1);
            startAutoplay();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            setIndex(currentIndex + 1);
            startAutoplay();
        }
    });

    // Pointer drag/swipe.
    let dragStartX = null;
    let lastDragX = null;
    const dragTarget = viewport || slider;

    dragTarget.addEventListener('pointerdown', (event) => {
        dragStartX = event.clientX;
        lastDragX = event.clientX;
        stopAutoplay();
        try { dragTarget.setPointerCapture(event.pointerId); } catch (_) {}
    });

    dragTarget.addEventListener('pointermove', (event) => {
        if (dragStartX === null || lastDragX === null) return;

        const dx = event.clientX - lastDragX;
        const threshold = 40;
        if (Math.abs(dx) >= threshold) {
            // Drag left -> next, drag right -> prev
            setIndex(currentIndex + (dx < 0 ? 1 : -1));
            lastDragX = event.clientX;
        }
    });

    function endDrag(){
        if (dragStartX === null) return;
        dragStartX = null;
        lastDragX = null;
        startAutoplay();
    }

    dragTarget.addEventListener('pointerup', endDrag);
    dragTarget.addEventListener('pointercancel', endDrag);
    dragTarget.addEventListener('pointerleave', endDrag);

    window.addEventListener('resize', () => {
        window.requestAnimationFrame(layout);
    });

    layout();
    setIndex(0);
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

    if (targets.length === 0) return;
    targets.forEach((el) => el.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-visible'));
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

    targets.forEach((el) => observer.observe(el));
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

        card.classList.add('is-rippling', 'is-pressed');
        window.setTimeout(() => card.classList.remove('is-pressed'), 140);
        window.setTimeout(() => card.classList.remove('is-rippling'), 560);
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
        launch.setAttribute('aria-expanded', 'true');
        window.setTimeout(() => input.focus(), 0);
    }

    function closeChat(){
        panel.hidden = true;
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
    closeBtn?.addEventListener('click', closeChat);
    resetBtn?.addEventListener('click', resetChat);

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

    renderHistory();
    ensureGreeting();
}

document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink(location.hash || '#home');
    initNavSpy();
    initPortfolioSlider();
    initTeamReveal();
    initChatbot();
    initScrollReveal();
    initScrollProgress();
    initBackToTop();
    initCalendlyPopup();
});


