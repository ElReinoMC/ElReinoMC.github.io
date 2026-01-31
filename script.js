document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const config = {
        currentSection: 0,
        totalSections: 4,
        isTransitioning: false,
        touchThreshold: 50,
        sidebarOpen: false,
        discordUrl: 'https://discord.gg/TU_INVITACION_AQUI' // Reemplazar con tu enlace
    };

    // DOM Elements
    const sections = document.querySelectorAll('.section');
    const dots = document.querySelectorAll('.dot');
    const terminalContent = document.getElementById('terminalContent');
    const discordBtn = document.getElementById('discordBtn');
    const digitalClockDisplay = document.getElementById('digitalClockDisplay');
    const hoursDisplay = document.getElementById('hoursDisplay');
    const minutesDisplay = document.getElementById('minutesDisplay');
    const secondsDisplay = document.getElementById('secondsDisplay');
    const dateDisplay = document.getElementById('dateDisplay');
    const particleContainer = document.getElementById('particleContainer');
    const sidebarRight = document.getElementById('sidebarRight');
    const closeSidebar = document.getElementById('closeSidebar');

    // Terminal Messages (preserved state)
    let terminalMessageIndex = 3; // Start after initial messages
    const terminalMessages = [
        '$ Conectando...',
        '$ Autenticando usuario...',
        '$ Cargando recursos...',
        '$ Optimizando rendimiento...',
        '$ Sistema listo',
        '$ Bienvenido a El Reino',
        '$ Verificando módulos...',
        '$ Inicializando mundo...',
        '$ Cargando configuración...',
        '$ Sistema estable'
    ];
    
    // Store terminal messages to preserve them
    const preservedMessages = [
        '$ Iniciando sistema...',
        '$ Cargando módulos del reino...',
        '$ Verificando conexión...'
    ];

    // Initialize
    function init() {
        showSection(0);
        initializeTerminal();
        startTerminalAnimation();
        startClock();
        createParticles();
        setupEventListeners();
        setupScrollIndicator();
    }

    // Section Navigation
    function showSection(index) {
        if (config.isTransitioning || index < 0 || index >= config.totalSections) return;
        
        config.isTransitioning = true;
        config.currentSection = index;

        // Update sections with enhanced smooth transitions
        sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add('active');
                section.style.transform = 'translateY(0) scale(1)';
                section.style.opacity = '1';
                section.style.filter = 'blur(0px)';
            } else if (i < index) {
                section.classList.remove('active');
                section.style.transform = 'translateY(-100%) scale(0.95)';
                section.style.opacity = '0';
                section.style.filter = 'blur(10px)';
            } else {
                section.classList.remove('active');
                section.style.transform = 'translateY(100%) scale(0.95)';
                section.style.opacity = '0';
                section.style.filter = 'blur(10px)';
            }
        });

        // Update dots with enhanced animation
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
                dot.style.transform = 'scale(1.2)';
            } else {
                dot.classList.remove('active');
                dot.style.transform = 'scale(1)';
            }
        });

        // Special handling for terminal section
        if (index === 0) {
            restartTerminalAnimation();
        }

        setTimeout(() => {
            config.isTransitioning = false;
        }, 600);
    }

    // Touch/Mouse Navigation
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        touchStartX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    function handleTouchEnd(e) {
        touchEndY = e.type.includes('mouse') ? e.clientY : e.changedTouches[0].clientY;
        touchEndX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        const deltaY = touchStartY - touchEndY;
        const deltaX = touchEndX - touchStartX;

        // Handle horizontal swipe for sidebar (swipe-only access)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > config.touchThreshold) {
            if (deltaX > 0 && config.currentSection >= 0 && config.currentSection <= 3) {
                // Swipe right - open sidebar
                openSidebar();
            } else if (deltaX < 0 && config.sidebarOpen) {
                // Swipe left - close sidebar
                closeSidebar();
            }
        } 
        // Handle vertical swipe for sections (only when sidebar is closed)
        else if (Math.abs(deltaY) > config.touchThreshold && !config.sidebarOpen) {
            if (deltaY > 0) {
                navigateToSection(config.currentSection + 1); // Swipe up - next section
            } else {
                navigateToSection(config.currentSection - 1); // Swipe down - previous section
            }
        }
    }

    function navigateToSection(targetIndex) {
        if (targetIndex >= 0 && targetIndex < config.totalSections) {
            showSection(targetIndex);
        }
    }

    // Keyboard Navigation
    function handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                navigateToSection(config.currentSection - 1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                navigateToSection(config.currentSection + 1);
                break;
            case 'Home':
                e.preventDefault();
                navigateToSection(0);
                break;
            case 'End':
                e.preventDefault();
                navigateToSection(config.totalSections - 1);
                break;
        }
    }

    // Terminal Animation (Preserved State)
    function initializeTerminal() {
        if (terminalContent.children.length === 0) {
            // Initialize with preserved messages
            preservedMessages.forEach((message, index) => {
                const line = document.createElement('div');
                line.className = 'terminal-line';
                line.textContent = message;
                line.style.animationDelay = `${index * 0.5}s`;
                terminalContent.appendChild(line);
            });

            // Add cursor line
            const cursorLine = document.createElement('div');
            cursorLine.className = 'terminal-line cursor-line';
            cursorLine.innerHTML = '$ <span class="cursor"></span>';
            terminalContent.appendChild(cursorLine);
        }
    }

    function startTerminalAnimation() {
        initializeTerminal();
        
        setInterval(() => {
            if (config.currentSection === 0 && terminalMessageIndex < terminalMessages.length) {
                // Remove old cursor line
                const oldCursor = terminalContent.querySelector('.cursor-line');
                if (oldCursor) {
                    oldCursor.remove();
                }

                // Add new message
                const newLine = document.createElement('div');
                newLine.className = 'terminal-line';
                newLine.textContent = terminalMessages[terminalMessageIndex];
                newLine.style.animationDelay = '0s';
                terminalContent.appendChild(newLine);

                // Add cursor line
                const cursorLine = document.createElement('div');
                cursorLine.className = 'terminal-line cursor-line';
                cursorLine.innerHTML = '$ <span class="cursor"></span>';
                terminalContent.appendChild(cursorLine);

                terminalMessageIndex++;

                // Remove old lines if too many
                const allLines = terminalContent.querySelectorAll('.terminal-line');
                if (allLines.length > 8) {
                    allLines[0].remove();
                }

                // Scroll to bottom
                terminalContent.scrollTop = terminalContent.scrollHeight;
            }
        }, 2500);
    }

    function restartTerminalAnimation() {
        // Don't restart, just show the terminal with preserved messages
        initializeTerminal();
        
        // Re-trigger animations for preserved messages
        const lines = terminalContent.querySelectorAll('.terminal-line:not(.cursor-line)');
        lines.forEach((line, index) => {
            line.style.animation = 'none';
            line.offsetHeight; // Force reflow
            line.style.animation = `typeIn 0.5s ease ${index * 0.3}s forwards`;
        });
    }

    // Digital Clock Functionality
    function startClock() {
        updateDigitalClock();
        setInterval(updateDigitalClock, 1000);
    }

    function updateDigitalClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Update digital clock display
        if (hoursDisplay) hoursDisplay.textContent = hours;
        if (minutesDisplay) minutesDisplay.textContent = minutes;
        if (secondsDisplay) secondsDisplay.textContent = seconds;

        // Update date display
        if (dateDisplay) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = now.toLocaleDateString('es-ES', options);
            dateDisplay.textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        }
    }

    // Particle System
    function createParticles() {
        setInterval(() => {
            if (particleContainer.children.length < 20) {
                createParticle();
            }
        }, 500);
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particleContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 20000);
    }

    // Scroll Indicator
    function setupScrollIndicator() {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                navigateToSection(index);
            });
        });
    }

    // Sidebar Functions
    function openSidebar() {
        if (config.currentSection >= 1 && config.currentSection <= 2) {
            config.sidebarOpen = true;
            sidebarRight.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSidebarFunction() {
        config.sidebarOpen = false;
        sidebarRight.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Event Listeners
    function setupEventListeners() {
        // Touch events
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Mouse events
        document.addEventListener('mousedown', handleTouchStart);
        document.addEventListener('mouseup', handleTouchEnd);

        // Keyboard events
        document.addEventListener('keydown', handleKeyboard);

        // Discord button
        discordBtn?.addEventListener('click', () => {
            window.open(config.discordUrl, '_blank');
        });

        // Sidebar close button
        closeSidebar?.addEventListener('click', closeSidebarFunction);

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && config.sidebarOpen) {
                closeSidebarFunction();
            }
        });

        // Click outside sidebar to close
        document.addEventListener('click', (e) => {
            if (config.sidebarOpen && !sidebarRight.contains(e.target) && !e.target.closest('.nav-hint.right')) {
                closeSidebarFunction();
            }
        });



        // Wheel events (with debouncing)
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (!config.sidebarOpen) {
                e.preventDefault();
                clearTimeout(wheelTimeout);
                wheelTimeout = setTimeout(() => {
                    if (e.deltaY > 0) {
                        navigateToSection(config.currentSection + 1);
                    } else {
                        navigateToSection(config.currentSection - 1);
                    }
                }, 50);
            }
        }, { passive: false });
    }

    // Performance optimization
    function optimizePerformance() {
        // Use Intersection Observer for lazy loading if needed
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add animations or other performance optimizations
                        entry.target.classList.add('in-view');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.widget').forEach(widget => {
                observer.observe(widget);
            });
        }
    }

    // Initialize everything
    init();
    optimizePerformance();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        // Clean up any timers or listeners
    });
});