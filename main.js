/* ========================================
   NIMESH SOLANKI — PORTFOLIO MAIN JS
   Three.js + GSAP animations
   ======================================== */

// ========== LOADER ==========
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const loaderSpans = document.querySelectorAll('.loader-text span');
    const loaderProgress = document.querySelector('.loader-progress');

    // Animate loader letters
    gsap.to(loaderSpans, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.7)'
    });

    // Animate progress bar
    gsap.to(loaderProgress, {
        width: '100%',
        duration: 1.8,
        ease: 'power2.inOut',
        delay: 0.3,
        onComplete: () => {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    loader.style.display = 'none';
                    // Start hero animations after loader
                    animateHero();
                    initScrollAnimations();
                }
            });
        }
    });
});

// ========== CUSTOM CURSOR ==========
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth follow for outline
    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.width = '12px';
            cursorDot.style.height = '12px';
            cursorOutline.style.width = '50px';
            cursorOutline.style.height = '50px';
            cursorOutline.style.borderColor = 'rgba(108,99,255,0.6)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.width = '8px';
            cursorDot.style.height = '8px';
            cursorOutline.style.width = '36px';
            cursorOutline.style.height = '36px';
            cursorOutline.style.borderColor = 'rgba(108,99,255,0.4)';
        });
    });
}

// ========== NAVIGATION ==========
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Scroll behavior for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});

// Active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ========== THREE.JS — HERO PARTICLE GLOBE ==========
function initThreeJS() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle globe
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const radius = 4;

    for (let i = 0; i < particleCount; i++) {
        // Fibonacci sphere distribution
        const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Gradient colors: purple to cyan
        const t = i / particleCount;
        colors[i * 3] = 0.42 + t * 0.1;     // R
        colors[i * 3 + 1] = 0.39 + t * 0.35; // G
        colors[i * 3 + 2] = 1.0;              // B
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
    });

    const globe = new THREE.Points(geometry, material);
    scene.add(globe);

    // Floating particles in background
    const bgParticleCount = 500;
    const bgPositions = new Float32Array(bgParticleCount * 3);
    for (let i = 0; i < bgParticleCount; i++) {
        bgPositions[i * 3] = (Math.random() - 0.5) * 20;
        bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    const bgMat = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x6c63ff,
        transparent: true,
        opacity: 0.4
    });
    const bgParticles = new THREE.Points(bgGeo, bgMat);
    scene.add(bgParticles);

    camera.position.z = 7;

    // Mouse interactivity
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        globe.rotation.y += 0.002;
        globe.rotation.x += 0.0005;

        // Mouse-driven rotation
        globe.rotation.y += mouseX * 0.003;
        globe.rotation.x += mouseY * 0.002;

        bgParticles.rotation.y += 0.0003;
        bgParticles.rotation.x += 0.0002;

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

initThreeJS();

// ========== TYPING EFFECT ==========
const roles = [
    'modern web apps.',
    'full-stack solutions.',
    'beautiful interfaces.',
    'scalable backends.',
    'AI-powered tools.'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedText = document.getElementById('typedText');

function typeEffect() {
    if (!typedText) return;
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        typedText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000); // Pause at full text
            return;
        }
    } else {
        typedText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }
    setTimeout(typeEffect, isDeleting ? 40 : 80);
}

typeEffect();

// ========== HERO ANIMATION ==========
function animateHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-badge', { opacity: 0, y: 30, duration: 0.6 })
      .from('.hero-greeting', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-name', { opacity: 0, y: 30, duration: 0.7 }, '-=0.3')
      .from('.hero-role-wrapper', { opacity: 0, y: 20, duration: 0.5 }, '-=0.4')
      .from('.hero-desc', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-buttons', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-stats .stat', { opacity: 0, y: 20, duration: 0.5, stagger: 0.15 }, '-=0.3')
      .from('.scroll-indicator', { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Generic scroll reveal for [data-animate] elements
    document.querySelectorAll('[data-animate]').forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => el.classList.add('animated'),
            once: true
        });
    });

    // Skill bar fill animations
    document.querySelectorAll('.skill-fill').forEach(bar => {
        const width = bar.getAttribute('data-width');
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 90%',
            onEnter: () => { bar.style.transform = 'scaleX(' + (width / 100) + ')'; },
            once: true
        });
    });

    // Counter animation for stats
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            onEnter: () => {
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: 'power2.out'
                });
            },
            once: true
        });
    });

    // Parallax on hero canvas
    gsap.to('#heroCanvas', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 150,
        opacity: 0.3
    });
}

// ========== 3D TILT EFFECT ON CARDS ==========
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });
});

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== CONTACT FORM (basic UI feedback) ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.form-btn span');
        const originalText = btn.textContent;
        btn.textContent = 'Sent!';
        btn.closest('.btn').style.background = 'linear-gradient(135deg, #00e676, #00bcd4)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.closest('.btn').style.background = '';
            contactForm.reset();
        }, 2500);
    });
}

// ========== PLACEHOLDER FIX FOR FLOATING LABELS ==========
// Inputs need a placeholder=" " for the CSS :not(:placeholder-shown) trick
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    if (!input.getAttribute('placeholder')) {
        input.setAttribute('placeholder', ' ');
    }
});
