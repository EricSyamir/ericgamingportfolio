// ==========================================
// Hamburger Menu Toggle
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// ==========================================
// Smooth Scroll Animation on Scroll
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// ==========================================
// Project Video Hover Effects
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const video = card.querySelector('.project-video');
        const videoContainer = card.querySelector('.project-video-container');
        
        if (video) {
            // Check if video can be loaded
            video.addEventListener('loadeddata', function() {
                video.classList.add('loaded');
            });
            
            // Handle video load error
            video.addEventListener('error', function() {
                console.log('Video failed to load:', video.src);
                // Fallback is already visible, no action needed
            });
            
            // Play video on hover
            card.addEventListener('mouseenter', function() {
                if (video.readyState >= 2) { // Check if video is loaded enough to play
                    video.play().catch(error => {
                        console.log('Video play failed:', error);
                    });
                }
            });
            
            // Pause and reset video on mouse leave
            card.addEventListener('mouseleave', function() {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
});

// ==========================================
// Enhanced Header Scroll Effect
// ==========================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    const isDark = document.body.classList.contains('dark-mode');
    
    // Add shadow and backdrop blur on scroll
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.background = isDark ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.background = isDark ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// Active Navigation Link Highlighting
// ==========================================
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active-link');
        }
    });
});

// ==========================================
// Lazy Loading for Videos (Performance Optimization)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('.project-video');
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector('source');
                
                // Load video only when it's near viewport
                if (source && source.dataset.src) {
                    source.src = source.dataset.src;
                    video.load();
                }
                
                videoObserver.unobserve(video);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    videos.forEach(video => {
        videoObserver.observe(video);
    });
});

// ==========================================
// Preload Critical Videos (Optional)
// ==========================================
// Uncomment if you want to preload the first few project videos
/*
document.addEventListener('DOMContentLoaded', function() {
    const firstVideos = document.querySelectorAll('.project-video');
    const preloadCount = 3; // Preload first 3 videos
    
    for (let i = 0; i < Math.min(preloadCount, firstVideos.length); i++) {
        firstVideos[i].load();
    }
});
*/

// ==========================================
// About Me Gallery
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const galleryScroll = document.getElementById('galleryScroll');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const galleryDots = document.querySelectorAll('.gallery-dot');
    
    if (!galleryScroll) return;
    
    let currentIndex = 0;
    const totalImages = galleryDots.length;
    
    function updateGallery(index) {
        const scrollAmount = index * galleryScroll.clientWidth;
        galleryScroll.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        // Update dots
        galleryDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // Previous button
    galleryPrev.addEventListener('click', function() {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : totalImages - 1;
        updateGallery(newIndex);
    });
    
    // Next button
    galleryNext.addEventListener('click', function() {
        const newIndex = currentIndex < totalImages - 1 ? currentIndex + 1 : 0;
        updateGallery(newIndex);
    });
    
    // Dot navigation
    galleryDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            updateGallery(index);
        });
    });
    
    // Touch/swipe support
    let startX = 0;
    let scrollLeft = 0;
    
    galleryScroll.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX - galleryScroll.offsetLeft;
        scrollLeft = galleryScroll.scrollLeft;
    });
    
    galleryScroll.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const x = e.touches[0].pageX - galleryScroll.offsetLeft;
        const walk = (x - startX) * 2;
        galleryScroll.scrollLeft = scrollLeft - walk;
    });
    
    galleryScroll.addEventListener('touchend', function() {
        const newIndex = Math.round(galleryScroll.scrollLeft / galleryScroll.clientWidth);
        updateGallery(Math.max(0, Math.min(newIndex, totalImages - 1)));
    });
    
    // Auto-play (optional)
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            const newIndex = currentIndex < totalImages - 1 ? currentIndex + 1 : 0;
            updateGallery(newIndex);
        }, 5000); // Change image every 5 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Start auto-play
    startAutoPlay();
    
    // Pause auto-play on hover
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.addEventListener('mouseenter', stopAutoPlay);
    galleryContainer.addEventListener('mouseleave', startAutoPlay);
});

// ==========================================
// Dark Mode Toggle
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolio-theme');

    // Set initial theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Save theme preference
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('portfolio-theme', isDarkMode ? 'dark' : 'light');

            // Re-apply header styles for the new theme
            window.dispatchEvent(new Event('scroll'));
        });
    }
});

// ==========================================
// Dynamic Background Gradient Based on Scroll
// ==========================================
let scrollGradientTl;
function initScrollGradient() {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ];
    
    window.addEventListener('scroll', () => {
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        const gradientIndex = Math.floor(scrollPercent * (gradients.length - 1));
        const nextIndex = Math.min(gradientIndex + 1, gradients.length - 1);
        
        document.body.style.setProperty('--current-gradient', gradients[gradientIndex]);
        
        // Update particles based on scroll
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = (scrollPercent * 100) + (index * 10);
            particle.style.transform = `translateY(${speed}px) rotate(${speed}deg)`;
        });
    });
}

// ==========================================
// Enhanced Scroll Animations with Parallax
// ==========================================
function initParallaxEffects() {
    // Disabled parallax effects - all sections are now static
    return;
}

// ==========================================
// Advanced Intersection Observer Animations
// ==========================================
function initAdvancedAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Different animations based on element type
                if (element.classList.contains('skill-card')) {
                    anime({
                        targets: element,
                        scale: [0.8, 1],
                        opacity: [0, 1],
                        rotateY: [-15, 0],
                        duration: 800,
                        easing: 'easeOutElastic(1, .8)',
                        delay: Math.random() * 200
                    });
                } else if (element.classList.contains('project-card')) {
                    anime({
                        targets: element,
                        translateY: [100, 0],
                        opacity: [0, 1],
                        rotateX: [15, 0],
                        duration: 1000,
                        easing: 'easeOutQuart'
                    });
                } else if (element.classList.contains('award-card')) {
                    anime({
                        targets: element,
                        scale: [0.5, 1],
                        opacity: [0, 1],
                        rotate: [180, 0],
                        duration: 1200,
                        easing: 'easeOutElastic(1, .6)'
                    });
                } else if (element.classList.contains('experience-item')) {
                    anime({
                        targets: element,
                        translateX: [-200, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutQuart'
                    });
                }
                
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.skill-card, .project-card, .award-card, .experience-item').forEach(el => {
        animationObserver.observe(el);
    });
}

// ==========================================
// Mouse Trail Effect
// ==========================================
function initMouseTrail() {
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX;
        let y = mouseY;
        
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];
            
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            dot.style.scale = (trailLength - index) / trailLength;
            dot.style.opacity = (trailLength - index) / trailLength * 0.5;
            
            x += (nextDot.offsetLeft - x) * 0.3;
            y += (nextDot.offsetTop - y) * 0.3;
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// ==========================================
// Anime.js Enhanced Animations
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all new effects (parallax disabled)
    initScrollGradient();
    // initParallaxEffects(); // Disabled for static sections
    initAdvancedAnimations();
    initMouseTrail();
    
    // Hero Section Entrance Animation
    anime.timeline({
        easing: 'easeOutExpo',
        duration: 750
    })
    .add({
        targets: '.profile-image-container',
        scale: [0, 1],
        opacity: [0, 1],
        rotate: [180, 0]
    })
    .add({
        targets: '.hero-title',
        opacity: [0, 1],
        translateY: [50, 0]
    }, '-=500')
    .add({
        targets: '.hero-role, .hero-scholarship',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(100)
    }, '-=400')
    .add({
        targets: '.social-link',
        scale: [0, 1],
        opacity: [0, 1],
        delay: anime.stagger(100)
    }, '-=200');
    
    // Enhanced Skill Cards Hover
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this.querySelectorAll('i'),
                scale: [1, 1.2],
                rotate: [0, 360],
                duration: 600,
                delay: anime.stagger(50),
                easing: 'easeOutElastic(1, .8)'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this.querySelectorAll('i'),
                scale: [1.2, 1],
                rotate: [360, 0],
                duration: 400,
                delay: anime.stagger(30)
            });
        });
    });
    
    // Section Titles Animation on Scroll
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    duration: 1000,
                    easing: 'easeOutElastic(1, .8)'
                });
                titleObserver.unobserve(entry.target);
            }
        });
    });
    
    sectionTitles.forEach(title => titleObserver.observe(title));
});

// ==========================================
// Page Loading Animation
// ==========================================
window.addEventListener('load', function() {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
        loader.classList.add('hidden');
        // Remove loader from DOM after animation
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 1000);
});

// ==========================================
// Scroll Progress Indicator
// ==========================================
function updateScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollIndicator.style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateScrollIndicator);

// ==========================================
// Floating Action Buttons
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const toggleAnimationsBtn = document.getElementById('toggleAnimations');
    let animationsEnabled = true;
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        anime({
            targets: 'html, body',
            scrollTop: 0,
            duration: 1000,
            easing: 'easeOutQuart'
        });
    });
    
    // Toggle animations
    toggleAnimationsBtn.addEventListener('click', function() {
        animationsEnabled = !animationsEnabled;
        document.body.style.setProperty('--transition-speed', animationsEnabled ? '0.3s' : '0s');
        this.style.opacity = animationsEnabled ? '1' : '0.5';
    });
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none';
        }
    });
});

// ==========================================
// Skill Progress Bars Animation
// ==========================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
                skillObserver.unobserve(bar);
            }
        });
    });
    
    skillBars.forEach(bar => skillObserver.observe(bar));
}

document.addEventListener('DOMContentLoaded', animateSkillBars);

// ==========================================
// Enhanced Keyboard Navigation
// ==========================================
document.addEventListener('keydown', function(e) {
    // Press 'T' to scroll to top
    if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Press 'D' to toggle dark mode
    if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        document.getElementById('theme-toggle').click();
    }
});

// ==========================================
// Performance Optimization
// ==========================================
// Throttle scroll events for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(function() {
    updateScrollIndicator();
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// ==========================================
// Easter Egg: Konami Code
// ==========================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        anime({
            targets: '.particle',
            scale: [1, 3],
            opacity: [0.1, 1],
            duration: 2000,
            delay: anime.stagger(100),
            direction: 'alternate',
            loop: 3,
            easing: 'easeInOutQuad'
        });
        
        // Show a fun message
        const message = document.createElement('div');
        message.textContent = '🎉 Konami Code Activated! 🎉';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 10001;
            animation: bounce 0.5s ease-in-out;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
        
        konamiCode = [];
    }
});

// Add bounce animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translate(-50%, -50%) translateY(0); }
        40% { transform: translate(-50%, -50%) translateY(-30px); }
        60% { transform: translate(-50%, -50%) translateY(-15px); }
    }
`;
document.head.appendChild(style);

