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

    // Default website is dark, but the user's toggle choice still persists.
    const themeDefaultVersion = "dark-default-v1";
    const savedTheme = localStorage.getItem("theme");
    const savedThemeDefaultVersion = localStorage.getItem("themeDefaultVersion");

    if (savedThemeDefaultVersion !== themeDefaultVersion) {
        localStorage.setItem("theme", "dark");
        localStorage.setItem("themeDefaultVersion", themeDefaultVersion);
        applyTheme("dark");
    } else if (savedTheme === "light") {
        applyTheme("light");
    } else {
        applyTheme("dark");
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
        } else if (hour >= 12 && hour < 16) {
            activeGreetings = greetingsPool.afternoon;
        } else if (hour >= 16 && hour < 19) {
            activeGreetings = greetingsPool.evening;
        } else {
            activeGreetings = greetingsPool.night;
        }

        // Set initial first language greeting
        if (statusText) statusText.textContent = activeGreetings[0];

        // Start cycling every 8 seconds
        startGreetingCycle();

        // Interactive click: cycle to the next greeting immediately
        greetingWidget.addEventListener("click", () => {
            if (isScrollGreetingActive || !activeGreetings.length) return;
            currentLangIndex = (currentLangIndex + 1) % activeGreetings.length;
            animateWidgetText(activeGreetings[currentLangIndex]);
            startGreetingCycle();
        });
    }

    // =======================================
    // 1.2 ONE-TIME SCROLL GREETING TRIGGER
    // =======================================
    let hasTriggeredScrollWelcome = false;
    // Scroll welcome trigger — will fire from the unified scroll handler below

    // =======================================
    // 2. BACK TO TOP BUTTON
    // =======================================
    const mybutton = document.getElementById("myBtn");
    // Back-to-top button visibility — handled in unified scroll handler below

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

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
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
        "stats": "Numbers",
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
        "stats": "📊",
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

    // Interactive Dynamic Pill click: jump smoothly to the next section
    if (activeTextPill) {
        const sectionOrder = ["home", "about", "stats", "skills", "journey", "projects", "side-write", "certificates", "footer"];
        activeTextPill.setAttribute("title", "Click to jump to next section");
        activeTextPill.addEventListener("click", () => {
            if (isAlertActive) return;
            const currentIndex = sectionOrder.indexOf(lastActiveSectionId);
            const nextId = sectionOrder[(currentIndex + 1) % sectionOrder.length];
            const targetEl = document.getElementById(nextId);
            if (!targetEl) return;

            const top = nextId === "home"
                ? 0
                : targetEl.getBoundingClientRect().top + window.pageYOffset - HEADER_HEIGHT_OFFSET;
            window.scrollTo({ top, behavior: "smooth" });
        });
    }

    // =======================================
    // 4.1 GLOBAL READING PROGRESS BAR (ON PILL BOTTOM)
    // =======================================
    const progressLine = document.querySelector(".nav-active-pill .nav-progress-line");
    const updateScrollProgress = () => {
        if (isAlertActive) return; // Prevent overwriting 100% alert progress
        if (!progressLine) return;

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;

        const percentage = (window.scrollY / totalHeight) * 100;
        progressLine.style.width = `${percentage}%`;
    };

    // =======================================
    // UNIFIED SCROLL HANDLER (rAF-throttled — replaces all individual scroll listeners)
    // =======================================
    const header = document.querySelector(".header");
    const welcomeMessages = [
        "yuhu, you start scrolling! 🚀",
        "Hold on tight, let's explore! 🧭",
        "Vibe check: scrolling activated! 😎",
        "Welcome! Enjoy the scroll! ✨"
    ];

    let rafPending = false;
    const onScroll = () => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            // 1. Scroll welcome trigger (one-time)
            if (scrollY > 150 && !hasTriggeredScrollWelcome) {
                hasTriggeredScrollWelcome = true;
                isScrollGreetingActive = true;
                const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
                if (greetingWidget) {
                    animateWidgetText(randomMessage);
                    setTimeout(() => {
                        isScrollGreetingActive = false;
                        animateWidgetText(activeGreetings[currentLangIndex]);
                        startGreetingCycle();
                    }, 3000);
                }
            }

            // 2. Back-to-top button
            if (mybutton) {
                mybutton.style.display = (scrollY > 200) ? "block" : "none";
            }

            // 3. Header fused state + home pill reset
            if (scrollY < 100) {
                lastActiveSectionId = "home";
                updatePillText("home");
                if (header) header.classList.remove("fused");
            } else {
                if (header) header.classList.add("fused");
            }

            // 4. Reading progress bar
            updateScrollProgress();

            rafPending = false;
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Re-use updateScrollProgress reference for alert restoration

    // Aktifkan teks & icon awal saat pertama kali dimuat jika berada di paling atas, dan inisialisasi status .fused
    if (window.scrollY < 100) {
        if (activeTextSpan) activeTextSpan.textContent = "Home";
        if (activeIconSpan) activeIconSpan.textContent = "🏠";
        if (header) header.classList.remove("fused");
    } else {
        if (header) header.classList.add("fused");
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

    if (cvBtn && cvModal && !cvBtn.hasAttribute('download')) {
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

    // =======================================
    // LIQUID GLASS CLICK EFFECT FOR BUTTONS
    // Creates an expanding soft blob + sheen sweep
    // =======================================
    const createLiquidClickEffect = (btn, clientX, clientY) => {
        // Create blob element
        const blob = document.createElement('span');
        blob.className = 'liquid-blob';

        // Compute position relative to button
        const rect = btn.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        blob.style.left = `${x}px`;
        blob.style.top = `${y}px`;

        // Size scaling based on button dimensions
        const maxDim = Math.max(rect.width, rect.height);
        const baseSize = Math.max(24, Math.min(48, Math.round(maxDim * 0.12)));
        blob.style.width = `${baseSize}px`;
        blob.style.height = `${baseSize}px`;

        btn.appendChild(blob);

        // Force reflow then expand
        requestAnimationFrame(() => {
            blob.classList.add('expand');
            // sheen sweep
            btn.classList.add('sheen');
        });

        // Cleanup after animation
        const remove = () => {
            blob.remove();
            btn.classList.remove('sheen');
        };

        blob.addEventListener('transitionend', remove, { once: true });
        // Fallback removal in case transitionend doesn't fire
        setTimeout(remove, 800);
    };

    // Attach to all .btn elements
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(b => {
        b.addEventListener('click', (ev) => {
            // Use event client coords; if keyboard-activated, center the effect
            let cx = ev.clientX;
            let cy = ev.clientY;
            if (typeof cx !== 'number' || cx === 0) {
                const r = b.getBoundingClientRect();
                cx = r.left + r.width / 2;
                cy = r.top + r.height / 2;
            }
            createLiquidClickEffect(b, cx, cy);
        });
    });

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

    const footerEmailBtn = document.querySelector('.footer-socials-centered a[href*="mail.google.com"]');
    if (footerEmailBtn) {
        footerEmailBtn.addEventListener('click', () => {
            triggerPillAlert("Sending Email... ✉️", "✉️", 3000);
        });
    }



    // =======================================
    // 5. HERO TITLE TYPEWRITER
    // =======================================
    const heroTitle = document.querySelector(".hero-title-typing");
    const heroTypeText = document.querySelector(".hero-type-text");
    const heroTypeCursor = document.querySelector(".hero-type-cursor");
    const heroPhrases = [
        "Hey, I’m Bagus Rizky",
        "I’m ICT Support",
        "I’m Technical Support",
        "I Tame Daily IT Chaos",
        "Keeping Systems Alive",
        "Your Go-To Tech Guy"
    ];

    if (heroTitle && heroTypeText && heroTypeCursor && heroPhrases.length) {
        let heroPhraseIndex = 0;
        let heroCharIndex = 0;
        let isHeroDeleting = false;

        const heroTypingDelay = 115;
        const heroDeletingDelay = 65;
        const heroHoldDelay = 1850;
        const heroStartDelay = 480;
        const heroSwapDelay = 480;

        const setHeroTypingState = (typing) => {
            heroTitle.classList.toggle("is-typing", typing);
        };

        const tickHeroTypewriter = () => {
            const currentPhrase = heroPhrases[heroPhraseIndex];
            heroTypeText.textContent = currentPhrase.slice(0, heroCharIndex);

            if (!isHeroDeleting) {
                setHeroTypingState(true);
                if (heroCharIndex < currentPhrase.length) {
                    heroCharIndex++;
                    setTimeout(tickHeroTypewriter, heroTypingDelay);
                } else {
                    setHeroTypingState(false);
                    isHeroDeleting = true;
                    setTimeout(tickHeroTypewriter, heroHoldDelay);
                }
                return;
            }

            if (isHeroDeleting && heroCharIndex > 0) {
                heroCharIndex--;
                setHeroTypingState(true);
                setTimeout(tickHeroTypewriter, heroDeletingDelay);
                return;
            }

            isHeroDeleting = false;
            heroPhraseIndex = (heroPhraseIndex + 1) % heroPhrases.length;
            heroTypeText.textContent = "";
            setHeroTypingState(false);
            setTimeout(tickHeroTypewriter, heroSwapDelay);
        };

        heroTypeText.textContent = "";
        setTimeout(tickHeroTypewriter, heroStartDelay);
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
    // 9. INTERACTIVE FOOTER: DROP A VIBE & QUICK CONNECT
    // =======================================
    const createParticleBurst = (emoji, x, y) => {
        for (let i = 0; i < 18; i++) {
            const particle = document.createElement("span");
            particle.className = "vibe-particle";
            particle.textContent = emoji;
            
            // Random velocity & angle
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 120;
            
            // Calculate offsets
            const targetX = Math.cos(angle) * velocity;
            const targetY = Math.sin(angle) * velocity - 20; // pull upwards slightly
            const targetRotation = Math.random() * 360 - 180;
            
            // Apply inline styles for GPU transition
            particle.style.setProperty("--x", `${targetX}px`);
            particle.style.setProperty("--y", `${targetY}px`);
            particle.style.setProperty("--r", `${targetRotation}deg`);
            
            // Position at click center
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            document.body.appendChild(particle);
            
            // Cleanup after animation finishes
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    };

    // Drop a Vibe Click Handler
    const vibeButtons = document.querySelectorAll(".vibe-btn");
    vibeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const emoji = btn.getAttribute("data-emoji");
            const rect = btn.getBoundingClientRect();
            const clickX = rect.left + rect.width / 2;
            const clickY = rect.top + rect.height / 2;
            
            // 1. Fire Particle Burst
            createParticleBurst(emoji, clickX, clickY);
            
            // 2. Trigger Dynamic Island Alert
            triggerPillAlert(`+1 Vibe dropped: ${emoji}!`, emoji, 2500);
        });
    });

    // =======================================
    // 10. PAUSE CERTIFICATE SLIDER WHEN OFF-SCREEN
    // Continuous CSS animation wastes GPU compositor resources when not visible
    // =======================================
    const slideTrack = document.querySelector('.slide-track');
    if (slideTrack && 'IntersectionObserver' in window) {
        const certSection = document.querySelector('.certificate-section');
        const sliderObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                slideTrack.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        }, {
            threshold: 0,
            rootMargin: '150px 0px 150px 0px'
        });
        if (certSection) sliderObserver.observe(certSection);
    }

    // =======================================
    // 11. REDUCE MOTION ACCESSIBILITY SUPPORT
    // Respect OS-level "Reduce Motion" preference
    // =======================================
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (slideTrack) slideTrack.style.animationPlayState = 'paused';
    }

    // =======================================
    // 12. LAZY LOADING FOR IMAGES
    // =======================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger actual load
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Count stats when the new numbers section enters the viewport.
    (function animateStatsWhenVisible(){
        const statsSection = document.querySelector('.stats-section');
        const statEls = document.querySelectorAll('.stats-section .stat-value');
        if (!statEls.length) return;

        const animateValue = (el) => {
            if (el.dataset.counted === 'true') return;
            el.dataset.counted = 'true';

            const target = Number(el.getAttribute('data-target') || 0);
            const duration = 1100;
            const startTime = Date.now();

            const tick = () => {
                const progress = Math.min((Date.now() - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);

                if (progress < 1) {
                    setTimeout(tick, 24);
                } else {
                    el.textContent = target;
                }
            };

            tick();
        };

        if ('IntersectionObserver' in window && statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        statEls.forEach(animateValue);
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.35 });

            statsObserver.observe(statsSection);
        } else {
            setTimeout(() => statEls.forEach(animateValue), 500);
        }
    })();

    // =======================================
    // 15. SMOOTH SCROLL REVEAL FOR SECTIONS
    // =======================================
    (function setupScrollReveal(){
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const revealTargets = new Set();

        const revealSets = [
            {
                selector: '.hero-text h1, .hero-summary, .cta-buttons, .skills-section h2, .journey-section h2, .journey-subtitle, .projects-section h2, .side-write-section h2, .certificate-section h2, .footer-logo-centered, .footer-bio-centered, .vibe-title',
                effect: 'reveal-soft'
            },
            {
                selector: '.hero-image, .about-image',
                effect: 'reveal-from-left'
            },
            {
                selector: '.about-text h2, .about-text p',
                effect: 'reveal-from-right'
            },
            {
                selector: '.stats-section .stat-card, .skill-card, .journey-card, .project-item, .side-write-card, .footer-content-wrapper',
                effect: 'reveal-card'
            },
            {
                selector: '.stat-icon, .skill-icon, .project-kicker, .side-write-cta, .social-btn-centered, .vibe-btn, .cert-tag',
                effect: 'reveal-icon'
            },
            {
                selector: '.slider-navigation, .slider-wrapper',
                effect: 'reveal-soft'
            }
        ];

        revealSets.forEach(({ selector, effect }) => {
            document.querySelectorAll(selector).forEach((element) => {
                element.classList.add('scroll-reveal', effect);
                revealTargets.add(element);
            });
        });

        document.querySelectorAll('.journey-dot').forEach((element) => {
            element.classList.add('scroll-reveal-dot');
            revealTargets.add(element);
        });

        document.querySelectorAll('.hero-section, section, footer').forEach((section) => {
            const sectionItems = Array.from(section.querySelectorAll('.scroll-reveal, .scroll-reveal-dot'))
                .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

            sectionItems.forEach((element, index) => {
                element.style.setProperty('--reveal-delay', `${Math.min(index * 65, 390)}ms`);
            });
        });

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealTargets.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.14,
            rootMargin: '0px 0px -72px 0px'
        });

        revealTargets.forEach((element) => revealObserver.observe(element));

        const revealGroupedItems = (sectionSelector, targetsSelector) => {
            const section = document.querySelector(sectionSelector);
            if (!section) return;

            const groupObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        section.querySelectorAll(targetsSelector).forEach((element) => {
                            element.classList.add('is-visible');
                            revealObserver.unobserve(element);
                        });
                        groupObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -72px 0px'
            });

            groupObserver.observe(section);
        };

        revealGroupedItems('.projects-section', '.project-item, .project-kicker, .slider-navigation');
        revealGroupedItems('.certificate-section', '.slider-wrapper, .cert-tag');
    })();

    // =======================================
    // 16. SKILL BARS ANIMATION
    // =======================================
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.bar-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideIn 1s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => observer.observe(bar));
    };

    animateSkillBars();

    // =======================================
    // 17. ADD FADE-IN ANIMATION CSS
    // =======================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideIn {
            from {
                width: 0;
            }
            to {
                width: var(--width, 100%);
            }
        }

        .fade-in {
            animation: fadeIn 0.6s ease-out forwards !important;
        }
    `;
    document.head.appendChild(style);

    // =======================================
    // 18. INTERACTIVE IT DIAGNOSTICS CONSOLE
    // =======================================
    const consoleStage = document.getElementById("it-console-stage");
    const consoleCard = document.getElementById("it-console-card");
    const consoleCmdText = document.getElementById("console-cmd-text");
    const consoleLogs = document.getElementById("console-logs");
    const consoleRunBtn = document.getElementById("console-run-btn");
    const floatLatencyText = document.getElementById("float-latency-text");
    const metricVal1 = document.getElementById("metric-val-1");
    const metricVal2 = document.getElementById("metric-val-2");
    const metricVal3 = document.getElementById("metric-val-3");
    const metricFill1 = document.getElementById("metric-fill-1");
    const metricFill2 = document.getElementById("metric-fill-2");
    const metricFill3 = document.getElementById("metric-fill-3");

    if (consoleStage && consoleCard && consoleCmdText && consoleLogs) {
        const itModules = {
            network: {
                label: "Network & VPN",
                alert: "Network Diagnostics OK",
                cmd: "net-diag --check-vpn --uplink=mining-site",
                logs: [
                    { badge: "[OK]", cls: "ok", msg: "Core LAN & Branch Wi-Fi gateway reachable (12ms)" },
                    { badge: "[ACTIVE]", cls: "ok", msg: "FortiClient / Sophos VPN tunnel encrypted & stable" },
                    { badge: "[SYNC]", cls: "info", msg: "DNS & DHCP lease pool healthy across all nodes" }
                ],
                metrics: [
                    { val: "99.98%", fill: 99 },
                    { val: "Optimal", fill: 94 },
                    { val: "98.5%", fill: 98 }
                ]
            },
            security: {
                label: "Endpoint Security",
                alert: "Endpoint Guard Verified",
                cmd: "sec-audit --endpoint=sophos --policy=enforced",
                logs: [
                    { badge: "[SECURE]", cls: "ok", msg: "Sophos Endpoint Protection definitions up to date" },
                    { badge: "[OK]", cls: "ok", msg: "Domain access control & MFA policies verified" },
                    { badge: "[INFO]", cls: "info", msg: "Zero unresolved endpoint threat alerts today" }
                ],
                metrics: [
                    { val: "100%", fill: 100 },
                    { val: "Hardened", fill: 96 },
                    { val: "0 Alerts", fill: 100 }
                ]
            },
            hardware: {
                label: "Hardware & OS",
                alert: "Workstations Healthy",
                cmd: "sys-health --scan=workstations --os=win11",
                logs: [
                    { badge: "[OK]", cls: "ok", msg: "Laptop, RAM & NVMe health checks passed" },
                    { badge: "[VERIFIED]", cls: "ok", msg: "Windows OS & office apps patched for daily ops" },
                    { badge: "[READY]", cls: "info", msg: "Onsite & remote ticketing queue under SLA" }
                ],
                metrics: [
                    { val: "99.4%", fill: 99 },
                    { val: "Healthy", fill: 95 },
                    { val: "< 15m", fill: 92 }
                ]
            },
            asset: {
                label: "IT Asset Ops",
                alert: "Asset Registry Synced",
                cmd: "asset-ctl --inventory --audit=active",
                logs: [
                    { badge: "[AUDIT]", cls: "ok", msg: "Device serials & user assignments reconciled" },
                    { badge: "[OK]", cls: "ok", msg: "New employee workstation provisioning ready" },
                    { badge: "[SYNC]", cls: "info", msg: "GLPI / IT asset lifecycle log updated" }
                ],
                metrics: [
                    { val: "100%", fill: 100 },
                    { val: "Tracked", fill: 97 },
                    { val: "Synced", fill: 95 }
                ]
            }
        };

        const moduleOrder = ["network", "security", "hardware", "asset"];
        let activeModuleKey = "network";
        let consoleCycleInterval = null;
        let isConsoleHovering = false;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const consoleTabs = document.querySelectorAll(".console-tab[data-module]");
        const floatChips = document.querySelectorAll(".it-float-chip[data-module]");

        const renderItModule = (moduleKey, notify = false) => {
            const mod = itModules[moduleKey];
            if (!mod) return;
            activeModuleKey = moduleKey;

            consoleTabs.forEach((tab) => {
                const isActive = tab.dataset.module === moduleKey;
                tab.classList.toggle("active", isActive);
                tab.setAttribute("aria-selected", String(isActive));
            });

            consoleCmdText.textContent = mod.cmd;
            consoleLogs.innerHTML = "";
            mod.logs.forEach((entry) => {
                const row = document.createElement("div");
                row.className = "log-line";

                const badge = document.createElement("span");
                badge.className = `log-badge ${entry.cls}`;
                badge.textContent = entry.badge;

                const msg = document.createElement("span");
                msg.className = "log-msg";
                msg.textContent = entry.msg;

                row.appendChild(badge);
                row.appendChild(msg);
                consoleLogs.appendChild(row);
            });

            if (metricVal1 && metricFill1) {
                metricVal1.textContent = mod.metrics[0].val;
                metricFill1.style.width = `${mod.metrics[0].fill}%`;
            }
            if (metricVal2 && metricFill2) {
                metricVal2.textContent = mod.metrics[1].val;
                metricFill2.style.width = `${mod.metrics[1].fill}%`;
            }
            if (metricVal3 && metricFill3) {
                metricVal3.textContent = mod.metrics[2].val;
                metricFill3.style.width = `${mod.metrics[2].fill}%`;
            }

            if (notify) {
                triggerPillAlert(mod.alert, "🖥️", 1800);
            }
        };

        const resetConsoleCycle = () => {
            clearInterval(consoleCycleInterval);
            consoleCycleInterval = setInterval(() => {
                if (isConsoleHovering) return;
                const nextIdx = (moduleOrder.indexOf(activeModuleKey) + 1) % moduleOrder.length;
                renderItModule(moduleOrder[nextIdx], false);
            }, 6500);
        };

        const runDiagnosticsScan = () => {
            const latency = Math.floor(Math.random() * 9) + 10; // 10ms - 18ms
            if (consoleRunBtn) consoleRunBtn.classList.add("is-scanning");
            if (floatLatencyText) floatLatencyText.textContent = `Latency ${latency}ms • Stable`;

            renderItModule(activeModuleKey, false);
            triggerPillAlert(`Diagnostics OK (${latency}ms)`, "⚡", 2200);

            setTimeout(() => {
                if (consoleRunBtn) consoleRunBtn.classList.remove("is-scanning");
            }, 650);
            resetConsoleCycle();
        };

        [...consoleTabs, ...floatChips].forEach((trigger) => {
            trigger.addEventListener("click", () => {
                const moduleKey = trigger.dataset.module;
                if (!moduleKey) return;
                renderItModule(moduleKey, true);
                resetConsoleCycle();
            });
        });

        if (consoleRunBtn) {
            consoleRunBtn.addEventListener("click", runDiagnosticsScan);
        }

        consoleStage.addEventListener("mouseenter", () => { isConsoleHovering = true; });
        consoleStage.addEventListener("mouseleave", () => { isConsoleHovering = false; });

        if (!prefersReducedMotion) {
            consoleStage.addEventListener("mousemove", (e) => {
                if (window.innerWidth <= 992) return;
                const rect = consoleStage.getBoundingClientRect();
                const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
                const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
                consoleCard.style.setProperty("--rx", `${(-yRatio * 6).toFixed(2)}deg`);
                consoleCard.style.setProperty("--ry", `${(xRatio * 7).toFixed(2)}deg`);
            });

            consoleStage.addEventListener("mouseleave", () => {
                consoleCard.style.setProperty("--rx", "0deg");
                consoleCard.style.setProperty("--ry", "0deg");
            });
        }

        renderItModule("network", false);
        resetConsoleCycle();
    }

});
