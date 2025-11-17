// D3.js Interactive Elements for Portfolio

// Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initSmoothReveal();
    initParticleBackground();
    initNavHighlight();
    initSkillsVisualization();
    initScrollProgress();
    initProjectExpand();
    initSmoothScroll();
    initParallax();
});

// Custom Cursor
function initCustomCursor() {
    // Only on desktop
    if (window.innerWidth <= 768) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor follow
    function animateCursor() {
        // Main cursor follows with lag
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
        
        // Dot follows faster
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;
        cursorDot.style.transform = `translate(${dotX - 5}px, ${dotY - 5}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .tag, .skill-list li');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    // Click effect
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

// Project Expand/Collapse with D3
function initProjectExpand() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const expandBtn = card.querySelector('.project-expand-btn');
        const expandedContent = card.querySelector('.project-expanded-content');
        
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const isExpanded = card.classList.contains('expanded');
            
            // Close all other cards
            projectCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                    otherCard.querySelector('.project-expand-btn').textContent = 'View More';
                }
            });
            
            // Toggle current card
            card.classList.toggle('expanded');
            expandBtn.textContent = isExpanded ? 'View More' : 'View Less';
            
            // Animate images when expanding
            if (!isExpanded) {
                const images = card.querySelectorAll('.project-image');
                d3.selectAll(images)
                    .style('opacity', 0)
                    .style('transform', 'translateY(20px)')
                    .transition()
                    .delay((d, i) => i * 150)
                    .duration(500)
                    .style('opacity', 1)
                    .style('transform', 'translateY(0)');
                
                // Scroll to expanded card
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });
}

// Smooth scroll reveal animations
function initSmoothReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Add reveal class to elements
    const revealElements = document.querySelectorAll('.project-card, .skill-category, .contact-content');
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// Particle background using D3
function initParticleBackground() {
    const hero = d3.select('.hero-section');
    
    const svg = hero.insert('svg', ':first-child')
        .attr('class', 'particle-canvas')
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', 0)
        .style('width', '100%')
        .style('height', '100%')
        .style('pointer-events', 'none')
        .style('opacity', 0.3);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create subtle floating particles
    const particles = d3.range(20).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
    }));

    const circles = svg.selectAll('circle')
        .data(particles)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .style('fill', '#A0876C')
        .style('opacity', 0.4);

    // Animate particles
    function animateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        });

        circles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// Navigation highlight based on scroll position
function initNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Skills visualization with D3
function initSkillsVisualization() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach((category, index) => {
        const skills = category.querySelectorAll('.skill-list li');
        
        // Stagger animation for skill items
        skills.forEach((skill, i) => {
            d3.select(skill)
                .style('opacity', 0)
                .style('transform', 'translateX(-20px)')
                .transition()
                .delay(index * 200 + i * 50)
                .duration(500)
                .style('opacity', 1)
                .style('transform', 'translateX(0)');
        });
    });
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = d3.select('body')
        .append('div')
        .attr('class', 'scroll-progress')
        .style('position', 'fixed')
        .style('top', 0)
        .style('left', 0)
        .style('height', '3px')
        .style('background', 'linear-gradient(90deg, #A0876C, #2A2A2A)')
        .style('width', '0%')
        .style('z-index', 9999)
        .style('transition', 'width 0.1s ease-out');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style('width', scrolled + '%');
    });
}

// Project card hover effects with D3
function initProjectCardHoverEffects() {
    const projectCards = d3.selectAll('.project-card');
    
    projectCards
        .on('mouseenter', function() {
            d3.select(this)
                .select('.project-number')
                .transition()
                .duration(300)
                .style('color', '#A0876C')
                .style('transform', 'scale(1.1)');
        })
        .on('mouseleave', function() {
            d3.select(this)
                .select('.project-number')
                .transition()
                .duration(300)
                .style('color', '#D4C5B9')
                .style('transform', 'scale(1)');
        });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initProjectCardHoverEffects();
});

// Interactive tag hover effect
document.addEventListener('DOMContentLoaded', () => {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            d3.select(tag)
                .transition()
                .duration(300)
                .style('transform', 'translateY(-2px)');
        });
        
        tag.addEventListener('mouseleave', () => {
            d3.select(tag)
                .transition()
                .duration(300)
                .style('transform', 'translateY(0)');
        });
    });
});

// Smooth scroll for navigation
function initSmoothScroll() {
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
}

// Parallax effect for hero section
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - scrolled / 700;
        }
    });
}

// Cursor trail effect (subtle luxury touch)
function createCursorTrail() {
    // Only on desktop
    if (window.innerWidth <= 768) return;
    
    const canvas = d3.select('body')
        .append('canvas')
        .attr('class', 'cursor-trail')
        .style('position', 'fixed')
        .style('top', 0)
        .style('left', 0)
        .style('width', '100%')
        .style('height', '100%')
        .style('pointer-events', 'none')
        .style('z-index', 9998)
        .node();

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 15;

    document.addEventListener('mousemove', (e) => {
        particles.push({
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 2 + 1,
            life: 1
        });

        if (particles.length > particleCount) {
            particles.shift();
        }
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            p.life -= 0.02;
            p.size *= 0.95;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(160, 135, 108, ${p.life * 0.3})`;
            ctx.fill();

            if (p.life <= 0) {
                particles.splice(index, 1);
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize cursor trail
createCursorTrail();

// Fade in animation on load
window.addEventListener('load', () => {
    document.body.style.opacity = 0;
    d3.select('body')
        .transition()
        .duration(600)
        .style('opacity', 1);
});
