document.addEventListener("DOMContentLoaded", () => {
    // =======================================
    // 1. DARK MODE / THEME TOGGLE
    // =======================================
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;

    // Fungsi untuk menerapkan tema
    const applyTheme = (theme) => {
        if (theme === "dark") {
            document.body.classList.add("dark-theme");
            if (themeIcon) {
                themeIcon.className = "fa fa-sun-o";
            }
        } else {
            document.body.classList.remove("dark-theme");
            if (themeIcon) {
                themeIcon.className = "fa fa-moon-o";
            }
        }
    };

    // Cek preferensi tema tersimpan atau default sistem
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }

    // Event listener untuk klik toggle tema
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            if (document.body.classList.contains("dark-theme")) {
                applyTheme("light");
                localStorage.setItem("theme", "light");
                triggerPillAlert("Light Mode Active", "☀️", 2000);
            } else {
                applyTheme("dark");
                localStorage.setItem("theme", "dark");
                triggerPillAlert("Dark Mode Active", "🌙", 2000);
            }
        });
    }

    // =======================================
    // 1.1 DYNAMIC HEADER GREETING WIDGET (Next to Logo)
    // =======================================
    const greetingWidget = document.getElementById("system-time-widget");
    let currentLangIndex = 0;
    let greetingInterval = null;
    let isScrollGreetingActive = false;
    let activeGreetings = [];

    const greetingsPool = {
        morning: [
            "Selamat Pagi! 🌅",         // Indonesian
            "Good Morning! 🌅",         // English
            "Ohayou Gozaimasu! 🌅",    // Japanese
            "Bonjour! 🌅",             // French
            "¡Buenos Días! 🌅",         // Spanish
            "Guten Morgen! 🌅",         // German
            "Buongiorno! 🌅"            // Italian
        ],
        afternoon: [
            "Selamat Siang! ☀️",
            "Good Afternoon! ☀️",
            "Konnichiwa! ☀️",
            "Bon Après-midi! ☀️",
            "¡Buenas Tardes! ☀️",
            "Guten Tag! ☀️",
            "Buon Pomeriggio! ☀️"
        ],
        evening: [
            "Selamat Sore! 🌇",
            "Good Evening! 🌇",
            "Konbanwa! 🌇",
            "Bonsoir! 🌇",
            "¡Buenas Tardes! 🌇",
            "Guten Abend! 🌇",
            "Buonasera! 🌇"
        ],
        night: [
            "Selamat Malam! 🌌",
            "Good Night! 🌌",
            "Oyasumi Nasai! 🌌",
            "Bonne Nuit! 🌌",
            "¡Buenas Noches! 🌌",
            "Gute Nacht! 🌌",
            "Buonanotte! 🌌"
        ]
    };

    // Custom Liquid Gel dynamic width transition helper
    const animateWidgetText = (newText) => {
        if (!greetingWidget) return;
        const statusText = greetingWidget.querySelector(".status-text");
        if (!statusText) return;

        // 1. Measure initial start width
        const startWidth = greetingWidget.offsetWidth;
        
        // 2. Lock the widget width to prevent snapping
        greetingWidget.style.width = `${startWidth}px`;

        // 3. Fade out the text
        statusText.style.opacity = "0";
        statusText.style.transform = "translateY(-6px)";

        setTimeout(() => {
            // 4. Update the text content behind the scenes
            statusText.textContent = newText;

            // 5. Measure the natural target width for the new text
            greetingWidget.style.width = "auto";
            const targetWidth = greetingWidget.offsetWidth;
            
            // 6. Restore locked width instantly so it can transition
            greetingWidget.style.width = `${startWidth}px`;
            
            // Force layout reflow
            greetingWidget.offsetHeight;

            // 7. Transition width to target size smoothly
            greetingWidget.style.width = `${targetWidth}px`;
            
            // Fade text back in
            statusText.style.opacity = "1";
            statusText.style.transform = "translateY(0)";

            // 8. After the transition finishes (600ms), unlock width back to auto
            setTimeout(() => {
                if (greetingWidget.style.width === `${targetWidth}px`) {
                    greetingWidget.style.width = "auto";
                }
            }, 600);
        }, 150);
    };

    const startGreetingCycle = () => {
        if (!greetingWidget) return;
        
        clearInterval(greetingInterval);
        greetingInterval = setInterval(() => {
            if (isScrollGreetingActive) return; // Pause cycle during scroll greeting
            
            currentLangIndex = (currentLangIndex + 1) % activeGreetings.length;
            const nextText = activeGreetings[currentLangIndex];
            
            // Smoothly morph widget text using measuring algorithm
            animateWidgetText(nextText);
        }, 8000); // 8 seconds interval
    };

    if (greetingWidget) {
        const statusText = greetingWidget.querySelector(".status-text");
        
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            activeGreetings = greetingsPool.morning;
        } else if (hour >= 12 && hour < 17) {
            activeGreetings = greetingsPool.afternoon;
        } else if (hour >= 17 && hour < 19) {
            activeGreetings = greetingsPool.evening;
        } else {
            activeGreetings = greetingsPool.night;
        }

        // Set initial first language greeting
        if (statusText) statusText.textContent = activeGreetings[0];

        // Start cycling every 8 seconds
        startGreetingCycle();
    }

    // =======================================
    // 1.2 ONE-TIME SCROLL GREETING TRIGGER
    // =======================================
    let hasTriggeredScrollWelcome = false;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 150 && !hasTriggeredScrollWelcome) {
            hasTriggeredScrollWelcome = true;
            isScrollGreetingActive = true; // Pause multi-language interval
            
            // Pool of fun scroll messages
            const welcomeMessages = [
                "yuhu, you start scrolling! 🚀",
                "Hold on tight, let's explore! 🧭",
                "Vibe check: scrolling activated! 😎",
                "Welcome! Enjoy the scroll! ✨"
            ];
            const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            
            if (greetingWidget) {
                // Morph to scroll message smoothly using measuring algorithm
                animateWidgetText(randomMessage);

                // Revert back to language cycling after 3 seconds
                setTimeout(() => {
                    isScrollGreetingActive = false; // Resume cycling
                    
                    // Revert to current index language greeting smoothly
                    animateWidgetText(activeGreetings[currentLangIndex]);
                    
                    // Restart the cycle loop
                    startGreetingCycle();
                }, 3000); // Revert after 3 seconds
            }
        }
    }, { passive: true });

    // =======================================
    // 2. BACK TO TOP BUTTON
    // =======================================
    const mybutton = document.getElementById("myBtn");

    window.addEventListener("scroll", () => {
        if (mybutton) {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                mybutton.style.display = "block";
            } else {
                mybutton.style.display = "none";
            }
        }
    }, { passive: true });

    // topFunction dipanggil via atribut onclick di HTML
    window.topFunction = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =======================================
    // =======================================
    // 3. SMOOTH SCROLL (Vanilla JS)
    // =======================================
    const HEADER_HEIGHT_OFFSET = 80; // Offset untuk mengimbangi header
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Abaikan jika href hanya berupa "#"
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - HEADER_HEIGHT_OFFSET;

                if (window.smoothScrollInstance) {
                    window.smoothScrollInstance.scrollTo(offsetPosition);
                } else {
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // =======================================
    // 4. HIGHLIGHT ACTIVE SECTION (DYNAMIC PILL & INTERACTIVE CONTROLS)
    // =======================================
    const navSections = document.querySelectorAll("#home, section[id], footer[id]");
    const activeTextSpan = document.querySelector(".nav-active-pill .active-text");
    const activeIconSpan = document.querySelector(".nav-active-pill .active-icon");
    const activeTextPill = document.querySelector(".nav-active-pill");

    const sectionNames = {
        "home": "Home",
        "about": "Profile",
        "skills": "Skills",
        "journey": "Journey",
        "projects": "Projects",
        "side-write": "Exploration",
        "certificates": "Certificates",
        "footer": "Contact"
    };

    const sectionIcons = {
        "home": "🏠",
        "about": "👤",
        "skills": "🛠️",
        "journey": "🧭",
        "projects": "💻",
        "side-write": "🚀",
        "certificates": "🎓",
        "footer": "✉️"
    };



    let isAlertActive = false;
    let alertTimeout = null;
    let lastActiveSectionId = "home";

    const updatePillText = (sectionId, force = false) => {
        if (isAlertActive) return; // Prevent scroll overrides during active notification

        const newText = sectionNames[sectionId];
        const newIcon = sectionIcons[sectionId];
        if (!activeTextSpan || !activeIconSpan || !activeTextPill) return;

        const textChanged = activeTextSpan.textContent !== newText || force;
        const iconChanged = activeIconSpan.textContent !== newIcon || force;

        if (textChanged || iconChanged) {




            // 2. Transisi morphing teks (slide-and-fade)
            if (textChanged) {
                activeTextSpan.style.opacity = "0";
                activeTextSpan.style.transform = "translateY(-6px)";
            }

            // 3. Transisi morphing ikon (pop-out-and-fade)
            if (iconChanged) {
                activeIconSpan.style.opacity = "0";
                activeIconSpan.style.transform = "scale(0.5) rotate(-15deg)";
            }

            setTimeout(() => {
                if (textChanged) {
                    activeTextSpan.textContent = newText;
                    activeTextSpan.style.opacity = "1";
                    activeTextSpan.style.transform = "translateY(0)";
                }
                if (iconChanged) {
                    activeIconSpan.style.display = "inline-block"; // Restore display block
                    activeIconSpan.textContent = newIcon;
                    activeIconSpan.style.opacity = "1";
                    activeIconSpan.style.transform = "scale(1) rotate(0deg)";
                }
            }, 150);
        }
    };

    // Logika deteksi bagian aktif menggunakan Intersection Observer dengan Set pelacak interaktivitas
    const intersectingSections = new Set();

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -40% 0px", // Pemicu optimal di area baca utama viewport
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.getAttribute("id");
            if (entry.isIntersecting) {
                intersectingSections.add(sectionId);
            } else {
                intersectingSections.delete(sectionId);
            }
        });

        if (intersectingSections.size > 0) {
            let bestSectionId = null;
            let minDistanceToCenter = Infinity;
            const viewportCenter = window.innerHeight / 2;

            intersectingSections.forEach(sectionId => {
                const el = document.getElementById(sectionId);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const elementCenter = rect.top + rect.height / 2;
                    const distance = Math.abs(elementCenter - viewportCenter);
                    if (distance < minDistanceToCenter) {
                        minDistanceToCenter = distance;
                        bestSectionId = sectionId;
                    }
                }
            });

            if (bestSectionId && sectionNames[bestSectionId]) {
                lastActiveSectionId = bestSectionId;
                updatePillText(bestSectionId);
            }
        }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navSections.forEach(section => {
        if (section) observer.observe(section);
    });

    // Fallback scroll listener (pasif): Reset ke Home jika kembali ke paling atas, dan toggle .fused
    window.addEventListener("scroll", () => {
        const header = document.querySelector(".header");
        if (window.scrollY < 100) {
            lastActiveSectionId = "home";
            updatePillText("home");
            if (header) header.classList.remove("fused");
        } else {
            if (header) header.classList.add("fused");
        }
    }, { passive: true });

    // =======================================
    // 4.1 GLOBAL READING PROGRESS BAR (ON PILL BOTTOM)
    // =======================================
    const updateScrollProgress = () => {
        if (isAlertActive) return; // Prevent overwriting 100% alert progress

        const progressLine = document.querySelector(".nav-active-pill .nav-progress-line");
        if (!progressLine) return;

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;

        const percentage = (window.scrollY / totalHeight) * 100;
        progressLine.style.width = `${percentage}%`;
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    // Aktifkan teks & icon awal saat pertama kali dimuat jika berada di paling atas, dan inisialisasi status .fused
    const initialHeader = document.querySelector(".header");
    if (window.scrollY < 100) {
        if (activeTextSpan) activeTextSpan.textContent = "Home";
        if (activeIconSpan) activeIconSpan.textContent = "🏠";
        if (initialHeader) initialHeader.classList.remove("fused");
    } else {
        if (initialHeader) initialHeader.classList.add("fused");
    }
    setTimeout(updateScrollProgress, 100);



    // =======================================
    // 4.3 OPTION 4: DYNAMIC ISLAND ALERT BUBBLE
    // =======================================
    const triggerPillAlert = (message, emoji, duration = 3000) => {
        if (!activeTextSpan || !activeIconSpan || !activeTextPill) return;

        if (alertTimeout) {
            clearTimeout(alertTimeout);
        }

        isAlertActive = true;
        activeTextPill.classList.add("alert-active");



        // Transition morph out text and icon
        activeTextSpan.style.opacity = "0";
        activeTextSpan.style.transform = "translateY(-6px)";
        activeIconSpan.style.opacity = "0";
        activeIconSpan.style.transform = "scale(0.5) rotate(-15deg)";

        setTimeout(() => {
            activeTextSpan.textContent = message;
            activeTextSpan.style.opacity = "1";
            activeTextSpan.style.transform = "translateY(0)";
            
            if (emoji === "") {
                activeIconSpan.style.display = "none";
            } else {
                activeIconSpan.style.display = "inline-block";
                activeIconSpan.textContent = emoji;
                activeIconSpan.style.opacity = "1";
                activeIconSpan.style.transform = "scale(1) rotate(0deg)";
            }
        }, 150);

        // Solid progress line to 100% during alert
        const progressLine = document.querySelector(".nav-active-pill .nav-progress-line");
        if (progressLine) {
            progressLine.style.width = "100%";
        }

        alertTimeout = setTimeout(() => {
            isAlertActive = false;
            activeTextPill.classList.remove("alert-active");



            // Restore original section and colors
            updatePillText(lastActiveSectionId, true);
            updateScrollProgress();
        }, duration);
    };

    // Connect action buttons to Dynamic Island alerts and Modal Previews
    const cvBtn = document.querySelector('.hero-section .btn.primary');
    const cvModal = document.getElementById('cv-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    const closeModal = () => {
        if (cvModal) {
            cvModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
    };

    if (cvBtn && cvModal) {
        cvBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default tab navigation
            
            // 1. Trigger the Dynamic Island Alert notification (runs for exactly 3 seconds, no icon, custom message)
            triggerPillAlert("Opening my CV...", "", 3000);
            
            // 2. Open the glassmorphic modal overlay after the 3-second alert finishes completely
            setTimeout(() => {
                cvModal.classList.add('show');
                document.body.classList.add('modal-open');
            }, 3000);
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (cvModal) {
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                closeModal();
            }
        });
    }

        // =======================================
    // 4.4 CERTIFICATE PREVIEW MODAL & LIGHTBOX
    // =======================================
    const certSlides = document.querySelectorAll('.certificate-section .slide');
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalTitle = document.getElementById('cert-modal-title');
    const certCloseBtn = document.getElementById('cert-close-btn');

    const closeCertModal = () => {
        if (certModal) {
            certModal.classList.remove('show');
            if (!cvModal || !cvModal.classList.contains('show')) {
                document.body.classList.remove('modal-open');
            }
        }
    };

    if (certSlides && certModal && certModalImg && certModalTitle) {
        certSlides.forEach(slide => {
            slide.style.cursor = 'pointer';
            slide.addEventListener('click', (e) => {
                e.preventDefault();
                const slideImg = slide.querySelector('img');
                const slideTitle = slide.querySelector('.cert-desc h3');
                
                if (slideImg && slideTitle) {
                    const imgSrc = slideImg.getAttribute('src');
                    const titleText = slideTitle.textContent;

                    // 1. Trigger dynamic island alert
                    triggerPillAlert("Loading Certificate...", "🎓", 1500);

                    // 2. Open modal after 1.5s
                    setTimeout(() => {
                        certModalImg.setAttribute('src', imgSrc);
                        certModalImg.setAttribute('alt', `Preview ${titleText}`);
                        certModalTitle.textContent = titleText;
                        certModal.classList.add('show');
                        document.body.classList.add('modal-open');
                    }, 1500);
                }
            });
        });
    }

    if (certCloseBtn) {
        certCloseBtn.addEventListener('click', closeCertModal);
    }

    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                closeCertModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeCertModal();
        }
    });

    const hitMeUpBtn = document.querySelector('.hero-section .btn.secondary');
    if (hitMeUpBtn) {
        hitMeUpBtn.addEventListener('click', () => {
            triggerPillAlert("Sending Email... ✉️", "✉️", 3000);
        });
    }

    const footerEmailBtn = document.querySelector('.footer-social-group a[href*="mail.google.com"]');
    if (footerEmailBtn) {
        footerEmailBtn.addEventListener('click', () => {
            triggerPillAlert("Sending Email... ✉️", "✉️", 3000);
        });
    }



    // =======================================
    // 5. ANIMASI MENGETIK (TYPING EFFECT)
    // =======================================
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = ["New Experience", "New Journey", "New Opportunities", "New Knowledge"];
    const typingDelay = 120;
    const erasingDelay = 60;
    const newTextDelay = 1500; // Jeda sebelum teks mulai dihapus

    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (typedTextSpan && cursorSpan) {
            if (charIndex < textArray[textArrayIndex].length) {
                if (!cursorSpan.classList.contains("typing")) {
                    cursorSpan.classList.add("typing");
                }
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }
    }

    function erase() {
        if (typedTextSpan && cursorSpan) {
            if (charIndex > 0) {
                if (!cursorSpan.classList.contains("typing")) {
                    cursorSpan.classList.add("typing");
                }
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) {
                    textArrayIndex = 0;
                }
                setTimeout(type, typingDelay + 400);
            }
        }
    }

    if (textArray.length && typedTextSpan && cursorSpan) {
        setTimeout(type, 500);
    }

    // =======================================
    // 6. PROJECTS SLIDER (CAROUSEL SLIDER)
    // =======================================
    const projectsTrack = document.getElementById('projects-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const projectItems = document.querySelectorAll('.project-item');

    let currentSlide = 0;
    const totalItems = projectItems.length;

    function updateSlider() {
        if (totalItems === 0 || projectItems.length === 0 || !projectsTrack) return;

        const itemWidth = projectItems[0].offsetWidth;
        const gap = 20; // Jarak antar kartu di CSS
        const step = itemWidth + gap;
        const distance = -currentSlide * step;

        projectsTrack.style.transform = `translateX(${distance}px)`;
        updateButtonStatus();
    }

    function updateButtonStatus() {
        if (projectItems.length === 0 || !prevBtn || !nextBtn || !projectsTrack) return;

        const visibleItems = Math.round(projectsTrack.parentElement.offsetWidth / projectItems[0].offsetWidth);
        const maxSlide = totalItems - visibleItems;

        // Update tombol Prev
        if (currentSlide === 0) {
            prevBtn.disabled = true;
            prevBtn.style.opacity = '0.4';
            prevBtn.style.cursor = 'default';
        } else {
            prevBtn.disabled = false;
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }

        // Update tombol Next
        if (currentSlide >= maxSlide) {
            nextBtn.disabled = true;
            nextBtn.style.opacity = '0.4';
            nextBtn.style.cursor = 'default';
        } else {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    function nextSlide() {
        if (projectItems.length === 0 || !projectsTrack) return;
        const visibleItems = Math.round(projectsTrack.parentElement.offsetWidth / projectItems[0].offsetWidth);
        const maxSlide = totalItems - visibleItems;

        if (currentSlide < maxSlide) {
            currentSlide++;
            updateSlider();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    window.addEventListener('resize', () => {
        currentSlide = 0;
        updateSlider();
    }, { passive: true });

    // Inisialisasi slider awal
    setTimeout(updateSlider, 100);

    // =======================================
    // 7. SWIPE GESTURE UNTUK PROJECTS VIEWPORT
    // =======================================
    const projectsViewport = document.querySelector('.projects-viewport');
    const minSwipeDistance = 50;
    let touchStartX = 0;
    let touchEndX = 0;

    if (projectsViewport) {
        projectsViewport.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        projectsViewport.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const distance = touchStartX - touchEndX;

            if (Math.abs(distance) > minSwipeDistance) {
                if (distance > 0) {
                    nextSlide(); // Swipe kiri -> slide berikutnya
                } else {
                    prevSlide(); // Swipe kanan -> slide sebelumnya
                }
            }
            touchStartX = 0;
            touchEndX = 0;
        }, { passive: true });
    }

    // =======================================
    // 8. MOMENTUM SMOOTH SCROLL (INERTIA)
    // =======================================
    class SmoothMomentumScroll {
        constructor() {
            this.targetY = window.scrollY;
            this.currentY = window.scrollY;
            this.isMoving = false;
            this.ease = 0.08; // Buttery smooth interpolation coefficient

            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (prefersReducedMotion) return;

            // Only apply custom smooth wheel on mouse users, bypass touchpad native smooth scroll
            window.addEventListener("wheel", this.onWheel.bind(this), { passive: false });
            window.addEventListener("scroll", this.onScroll.bind(this), { passive: true });
            window.addEventListener("keydown", this.onKeyDown.bind(this));
        }

        scrollTo(y) {
            this.targetY = Math.max(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight));
            this.startLoop();
        }

        onWheel(e) {
            // Trackpads send tiny micro-movements or support side scrolling. We let them scroll natively.
            const isTouchPad = Math.abs(e.deltaX) > 0 || (Math.abs(e.deltaY) < 40 && Math.abs(e.deltaY) % 1 !== 0);
            if (isTouchPad) {
                this.targetY = window.scrollY;
                return;
            }

            e.preventDefault();

            this.targetY += e.deltaY;
            this.targetY = Math.max(0, Math.min(this.targetY, document.documentElement.scrollHeight - window.innerHeight));

            this.startLoop();
        }

        onScroll() {
            // Sync with browser scroll events (e.g., clicking anchor link or top button)
            if (!this.isMoving) {
                this.targetY = window.scrollY;
                this.currentY = window.scrollY;
            }
        }

        onKeyDown(e) {
            const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Space"];
            if (!keys.includes(e.key)) return;

            // Let inputs or textareas scroll naturally
            if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

            let amount = 0;
            if (e.key === "ArrowUp") amount = -45;
            else if (e.key === "ArrowDown") amount = 45;
            else if (e.key === "PageUp") amount = -window.innerHeight * 0.8;
            else if (e.key === "PageDown") amount = window.innerHeight * 0.8;
            else if (e.key === "Space") amount = e.shiftKey ? -window.innerHeight * 0.8 : window.innerHeight * 0.8;

            e.preventDefault();
            this.targetY += amount;
            this.targetY = Math.max(0, Math.min(this.targetY, document.documentElement.scrollHeight - window.innerHeight));

            this.startLoop();
        }

        startLoop() {
            if (!this.isMoving) {
                this.isMoving = true;
                requestAnimationFrame(this.tick.bind(this));
            }
        }

        tick() {
            const diff = this.targetY - this.currentY;
            this.currentY += diff * this.ease;

            window.scrollTo(0, this.currentY);

            if (Math.abs(diff) > 0.5) {
                requestAnimationFrame(this.tick.bind(this));
            } else {
                this.isMoving = false;
                this.currentY = this.targetY;
                window.scrollTo(0, this.targetY);
            }
        }
    }

    // Inisialisasi Smooth Momentum Scroll secara global agar dapat diakses dari modul lain
    window.smoothScrollInstance = new SmoothMomentumScroll();
});