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
    // 18. 8-BIT PIXEL ART IT ACTIVITY TERMINAL
    // =======================================
    const consoleStage = document.getElementById("it-console-stage");
    const consoleCard = document.getElementById("it-console-card");
    const pixelScreen = document.getElementById("it-pixel-screen");
    const pixelCanvas = document.getElementById("it-pixel-canvas");
    const pixelStatusText = document.getElementById("pixel-status-text");
    const pixelSceneCounter = document.getElementById("pixel-scene-counter");
    const consoleTabs = document.querySelectorAll(".console-tab[data-scene]");

    if (consoleStage && consoleCard && pixelCanvas && pixelCanvas.getContext) {
        const ctx = pixelCanvas.getContext("2d");
        if (ctx) {
            ctx.imageSmoothingEnabled = false;

            const scenes = [
                {
                    name: "Laptop Fix",
                    cmd: "hw-repair --replace-ram --laptop=thinkpad",
                    bubble: "RAM OK!",
                    alert: "8-Bit: Laptop Repair"
                },
                {
                    name: "Network",
                    cmd: "net-cfg --vlan=ops --wifi=up --ping=12ms",
                    bubble: "PING 12ms",
                    alert: "8-Bit: Network Setup"
                },
                {
                    name: "Security",
                    cmd: "sec-guard --sophos=active --block-threats",
                    bubble: "PROTECTED",
                    alert: "8-Bit: Endpoint Guard"
                },
                {
                    name: "IT Asset",
                    cmd: "asset-scan --audit=inventory --tag=ready",
                    bubble: "AUDITED",
                    alert: "8-Bit: IT Asset Audit"
                }
            ];

            // Compact 3x5 pixel bitmap font for crisp 8-bit bubbles and labels
            const PIXEL_FONT = {
                A: ["010", "101", "111", "101", "101"],
                B: ["110", "101", "110", "101", "110"],
                C: ["011", "100", "100", "100", "011"],
                D: ["110", "101", "101", "101", "110"],
                E: ["111", "100", "110", "100", "111"],
                F: ["111", "100", "110", "100", "100"],
                G: ["011", "100", "101", "101", "011"],
                H: ["101", "101", "111", "101", "101"],
                I: ["111", "010", "010", "010", "111"],
                K: ["101", "101", "110", "101", "101"],
                L: ["100", "100", "100", "100", "111"],
                M: ["101", "111", "111", "101", "101"],
                N: ["101", "111", "111", "111", "101"],
                O: ["010", "101", "101", "101", "010"],
                P: ["110", "101", "110", "100", "100"],
                R: ["110", "101", "110", "101", "101"],
                S: ["011", "100", "010", "001", "110"],
                T: ["111", "010", "010", "010", "010"],
                U: ["101", "101", "101", "101", "111"],
                V: ["101", "101", "101", "101", "010"],
                X: ["101", "101", "010", "101", "101"],
                Y: ["101", "101", "010", "010", "010"],
                "0": ["111", "101", "101", "101", "111"],
                "1": ["010", "110", "010", "010", "111"],
                "2": ["110", "001", "010", "100", "111"],
                "3": ["110", "001", "010", "001", "110"],
                "4": ["101", "101", "111", "001", "001"],
                "5": ["111", "100", "110", "001", "110"],
                "6": ["011", "100", "111", "101", "111"],
                "7": ["111", "001", "010", "010", "010"],
                "8": ["111", "101", "111", "101", "111"],
                "9": ["111", "101", "111", "001", "110"],
                "!": ["1", "1", "1", "0", "1"],
                " ": ["00", "00", "00", "00", "00"],
                "m": ["101", "111", "101"],
                "s": ["011", "010", "110"]
            };

            const px = (x, y, w, h, color) => {
                ctx.fillStyle = color;
                ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
            };

            const measurePixelText = (text) => {
                let width = 0;
                for (let i = 0; i < text.length; i++) {
                    const glyph = PIXEL_FONT[text[i]] || PIXEL_FONT[" "];
                    width += glyph[0].length + 1;
                }
                return Math.max(0, width - 1);
            };

            const drawPixelText = (text, x, y, color) => {
                let cursorX = Math.round(x);
                ctx.fillStyle = color;
                for (let i = 0; i < text.length; i++) {
                    const ch = text[i];
                    const glyph = PIXEL_FONT[ch] || PIXEL_FONT[" "];
                    const offsetY = glyph.length === 3 ? 2 : 0;
                    for (let r = 0; r < glyph.length; r++) {
                        for (let c = 0; c < glyph[r].length; c++) {
                            if (glyph[r][c] === "1") {
                                ctx.fillRect(cursorX + c, Math.round(y) + offsetY + r, 1, 1);
                            }
                        }
                    }
                    cursorX += glyph[0].length + 1;
                }
            };

            const drawSpeechBubble = (text, x, y) => {
                const tw = measurePixelText(text);
                const bw = tw + 8;
                const bh = 11;
                px(x, y, bw, bh, "#e8f5ed");
                px(x + 1, y - 1, bw - 2, 1, "#8fcfaf");
                px(x + 1, y + bh, bw - 2, 1, "#8fcfaf");
                px(x - 1, y + 1, 1, bh - 2, "#8fcfaf");
                px(x + bw, y + 1, 1, bh - 2, "#8fcfaf");
                // Bubble tail
                px(x + 6, y + bh + 1, 3, 2, "#e8f5ed");
                px(x + 6, y + bh + 3, 2, 1, "#8fcfaf");
                drawPixelText(text, x + 4, y + 3, "#102119");
            };

            const drawBackdrop = (tick) => {
                // Dark emerald-slate studio wall
                px(0, 0, 160, 96, "#0b1411");
                // Subtle retro wall grid lines
                for (let gx = 16; gx < 160; gx += 24) {
                    px(gx, 0, 1, 70, "#101d18");
                }
                for (let gy = 14; gy < 70; gy += 14) {
                    px(0, gy, 160, 1, "#101d18");
                }

                // Small wall status board (top-left)
                px(8, 8, 26, 15, "#172721");
                px(9, 9, 24, 13, "#08100d");
                px(11, 11, 2, 2, tick % 6 < 3 ? "#4ade80" : "#22c55e");
                px(15, 11, 12, 2, "#325144");
                px(11, 15, 8, 2, "#4f9c7a");
                px(21, 15, 9, 2, tick % 8 < 4 ? "#8fb9ca" : "#325144");
                px(11, 19, 18, 1, "#21382f");

                // Workbench / Desk
                px(0, 70, 160, 3, "#3b5247");
                px(0, 73, 160, 3, "#263830");
                px(0, 76, 160, 20, "#131e19");

                // Steaming coffee mug on left side of desk
                px(11, 63, 7, 7, "#dce8e0");
                px(12, 64, 5, 1, "#5c3b28");
                px(18, 65, 2, 3, "#b9cbc0");
                const steamOffset = tick % 6;
                if (steamOffset < 3) {
                    px(13, 60 - steamOffset, 1, 2, "#6ea88b");
                    px(16, 59 - steamOffset, 1, 2, "#4f7c66");
                } else {
                    px(14, 61 - (steamOffset - 3), 1, 2, "#6ea88b");
                    px(15, 58 - (steamOffset - 3), 1, 2, "#4f7c66");
                }
            };

            // 8-Bit Bagus sprite modeled after asset/about_me.png
            const drawBagus = (tick, pose) => {
                const bob = tick % 8 < 4 ? 0 : 1;
                const blink = tick % 30 === 0;
                const bx = 35;
                const by = 29 + bob;

                // Chair back behind Bagus
                px(bx - 5, by + 18, 24, 22, "#1c2622");
                px(bx - 3, by + 20, 20, 18, "#26332d");

                // Neck & shadow
                px(bx + 5, by + 15, 5, 4, "#cc966c");

                // Center-parted black hair (matches about_me.png)
                px(bx + 1, by - 1, 13, 4, "#111318");
                px(bx, by + 1, 15, 5, "#111318");
                px(bx + 2, by, 4, 2, "#242934"); // hair highlight left
                px(bx + 9, by, 4, 2, "#242934"); // hair highlight right
                px(bx + 6, by, 2, 2, "#0a0c10"); // center part
                // Side hair framing ears
                px(bx, by + 4, 2, 6, "#111318");
                px(bx + 13, by + 4, 2, 6, "#111318");

                // Face & Ears
                px(bx, by + 7, 1, 3, "#cc966c");
                px(bx + 14, by + 7, 1, 3, "#cc966c");
                px(bx + 2, by + 4, 11, 11, "#e5b085");
                px(bx + 3, by + 14, 9, 2, "#cc966c");
                // Center hair swoop dipping slightly on forehead
                px(bx + 2, by + 3, 4, 2, "#111318");
                px(bx + 9, by + 3, 4, 2, "#111318");

                // Eyes & eyebrows
                px(bx + 3, by + 7, 3, 1, "#1a1d24");
                px(bx + 9, by + 7, 3, 1, "#1a1d24");
                if (blink) {
                    px(bx + 4, by + 9, 2, 1, "#2a1d17");
                    px(bx + 9, by + 9, 2, 1, "#2a1d17");
                } else {
                    px(bx + 4, by + 9, 2, 2, "#111318");
                    px(bx + 9, by + 9, 2, 2, "#111318");
                }

                // Nose & friendly smile
                px(bx + 7, by + 10, 1, 2, "#cc966c");
                px(bx + 5, by + 13, 5, 1, "#9c6348");

                // Black collared shirt (matches about_me.png)
                px(bx - 2, by + 19, 19, 22 - bob, "#151820");
                px(bx, by + 18, 15, 4, "#1e222d");
                // Shirt collar & placket
                px(bx + 3, by + 17, 3, 3, "#2b3140");
                px(bx + 9, by + 17, 3, 3, "#2b3140");
                px(bx + 7, by + 20, 1, 14, "#252a36");
                px(bx + 7, by + 23, 1, 1, "#4e5769");
                px(bx + 7, by + 28, 1, 1, "#4e5769");

                // ICT Emerald ID Lanyard
                px(bx + 4, by + 19, 1, 7, "#4f9c7a");
                px(bx + 10, by + 19, 1, 7, "#4f9c7a");
                px(bx + 5, by + 25, 5, 2, "#4f9c7a");
                px(bx + 5, by + 27, 5, 6, "#e6f2eb");
                px(bx + 6, by + 28, 3, 2, "#4f9c7a");

                // Scene-specific animated right arm & tool
                if (pose === "repair") {
                    const toolLift = tick % 4 < 2 ? 0 : 2;
                    px(bx + 14, by + 22, 6, 4, "#1e222d");
                    px(bx + 19, by + 24 + toolLift, 7, 3, "#e5b085");
                    // Pixel screwdriver
                    px(bx + 25, by + 22 + toolLift, 4, 4, "#3b82f6");
                    px(bx + 29, by + 24 + toolLift, 7, 1, "#cbd5e1");
                } else if (pose === "scan") {
                    px(bx + 14, by + 22, 6, 4, "#1e222d");
                    px(bx + 20, by + 22, 6, 3, "#e5b085");
                    // Handheld asset barcode scanner
                    px(bx + 25, by + 19, 5, 4, "#334155");
                    px(bx + 26, by + 23, 2, 4, "#475569");
                    px(bx + 29, by + 20, 1, 2, "#4ade80");
                } else {
                    // Typing hands reaching onto desk/laptop
                    const tap = tick % 2;
                    px(bx + 14, by + 24, 6, 4, "#1e222d");
                    px(bx + 19, by + 26 + tap, 5, 3, "#e5b085");
                    px(bx + 17, by + 29 - tap, 4, 2, "#cc966c");
                }
            };

            const drawLaptop = (x, y, screenColor, accentColor) => {
                // Laptop base
                px(x, y + 10, 26, 3, "#64748b");
                px(x + 2, y + 9, 20, 1, "#94a3b8");
                // Laptop screen lid
                px(x + 4, y - 4, 22, 14, "#334155");
                px(x + 6, y - 2, 18, 10, screenColor);
                px(x + 8, y, 8, 2, accentColor);
                px(x + 8, y + 4, 12, 1, "#8fcfaf");
                px(x + 8, y + 6, 9, 1, "#4f9c7a");
            };

            // Scene 0: Laptop Hardware Repair & RAM Upgrade
            const drawRepairScene = (tick) => {
                drawBagus(tick, "repair");

                // Open Laptop with exposed green motherboard on workbench
                const lx = 70;
                const ly = 56;
                px(lx + 1, ly - 5, 25, 14, "#334155");
                px(lx + 3, ly - 3, 21, 10, "#0b1a14");
                // Diagnostic bars on opened laptop screen
                px(lx + 5, ly - 1, 10, 2, "#4ade80");
                px(lx + 5, ly + 2, 15, 2, tick % 6 < 3 ? "#facc15" : "#4ade80");
                // Base chassis + green PCB + RAM slot
                px(lx - 1, ly + 9, 30, 5, "#475569");
                px(lx + 2, ly + 10, 24, 3, "#15803d");
                px(lx + 6, ly + 10, 9, 2, "#22c55e");
                px(lx + 7, ly + 12, 7, 1, "#facc15"); // RAM gold contacts

                // Flying repair sparks above motherboard
                const sparkTick = tick % 6;
                px(75 + (sparkTick % 3) * 2, 56 - sparkTick * 2, 2, 2, "#facc15");
                px(86 - (sparkTick % 2) * 3, 55 - ((sparkTick + 2) % 5) * 2, 2, 2, "#38bdf8");
                if (sparkTick % 2 === 0) {
                    px(80, 52, 2, 2, "#4ade80");
                }

                // Diagnostic health monitor on right side of desk
                px(114, 39, 34, 24, "#26332d");
                px(116, 41, 30, 18, "#091410");
                px(128, 63, 6, 5, "#334155");
                px(122, 68, 18, 2, "#475569");
                drawPixelText("RAM", 119, 43, "#8fcfaf");
                const fillW = Math.min(24, ((tick * 2) % 26));
                px(119, 51, 24, 4, "#1a3026");
                px(119, 51, fillW, 4, "#4ade80");

                drawSpeechBubble(scenes[0].bubble, 24, 13);
            };

            // Scene 1: Network Setup, Router & Server Rack
            const drawNetworkScene = (tick) => {
                drawBagus(tick, "type");
                drawLaptop(64, 57, "#091612", tick % 4 < 2 ? "#4ade80" : "#38bdf8");

                // LAN cable with flowing data packets
                px(90, 67, 34, 2, "#334d42");
                const pktX = 91 + ((tick * 3) % 31);
                px(pktX, 67, 3, 2, "#4ade80");
                const pktX2 = 122 - ((tick * 2) % 30);
                px(pktX2, 67, 2, 2, "#38bdf8");

                // Wi-Fi Router on desk with expanding signal waves
                px(98, 63, 18, 6, "#1e293b");
                px(101, 56, 2, 7, "#64748b");
                px(111, 56, 2, 7, "#64748b");
                px(101, 65, 2, 2, "#4ade80");
                px(105, 65, 2, 2, tick % 4 < 2 ? "#4ade80" : "#15803d");
                px(109, 65, 2, 2, "#38bdf8");

                const waveStep = tick % 6;
                if (waveStep >= 0) px(104, 51, 6, 1, "#4ade80");
                if (waveStep >= 2) {
                    px(101, 48, 12, 1, "#38bdf8");
                    px(100, 49, 1, 1, "#38bdf8");
                    px(113, 49, 1, 1, "#38bdf8");
                }
                if (waveStep >= 4) {
                    px(98, 45, 18, 1, "#8fcfaf");
                    px(97, 46, 1, 1, "#8fcfaf");
                    px(116, 46, 1, 1, "#8fcfaf");
                }

                // Server Rack on right
                px(124, 18, 28, 52, "#1c2622");
                px(126, 20, 24, 48, "#0c1411");
                for (let slot = 0; slot < 4; slot++) {
                    const sy = 23 + slot * 11;
                    px(128, sy, 20, 8, "#1f2e28");
                    px(130, sy + 2, 8, 2, "#2f473e");
                    const blinkOn = (tick + slot) % 4 < 2;
                    px(141, sy + 2, 2, 2, blinkOn ? "#4ade80" : "#15803d");
                    px(145, sy + 2, 2, 2, (tick + slot * 2) % 5 === 0 ? "#facc15" : "#4ade80");
                }

                drawSpeechBubble(scenes[1].bubble, 21, 13);
            };

            // Scene 2: Endpoint Security & Threat Blocking
            const drawSecurityScene = (tick) => {
                drawBagus(tick, "type");

                // Security console monitor
                drawLaptop(63, 57, "#091712", "#4ade80");

                // Glowing emerald Shield sprite
                const sx = 104;
                const sy = 36;
                px(sx + 2, sy, 14, 3, "#4f9c7a");
                px(sx, sy + 3, 18, 10, "#4f9c7a");
                px(sx + 2, sy + 13, 14, 4, "#4f9c7a");
                px(sx + 4, sy + 17, 10, 3, "#4f9c7a");
                px(sx + 7, sy + 20, 4, 2, "#4f9c7a");
                // Inner bright shield core & checkmark
                px(sx + 3, sy + 3, 12, 11, "#0f291e");
                px(sx + 5, sy + 9, 2, 2, "#4ade80");
                px(sx + 7, sy + 11, 2, 2, "#4ade80");
                px(sx + 9, sy + 9, 2, 2, "#4ade80");
                px(sx + 11, sy + 7, 2, 2, "#4ade80");

                // Incoming red pixel bug/virus sprite blocked by shield laser
                const cycle = tick % 12;
                const bugX = 152 - cycle * 3;
                if (cycle < 9) {
                    // Red pixel bug approaching from right
                    px(bugX, 42, 6, 5, "#ef4444");
                    px(bugX - 1, 41, 2, 2, "#fca5a5");
                    px(bugX + 5, 41, 2, 2, "#fca5a5");
                    px(bugX + 1, 44, 1, 1, "#111");
                    px(bugX + 4, 44, 1, 1, "#111");
                }
                if (cycle >= 6 && cycle <= 9) {
                    // Shield zap beam!
                    px(sx + 18, 44, Math.max(4, bugX - (sx + 18)), 2, "#38bdf8");
                }
                if (cycle >= 9) {
                    // Blocked green check particles
                    px(bugX - 2, 39, 2, 2, "#4ade80");
                    px(bugX + 3, 45, 2, 2, "#4ade80");
                    px(bugX, 36, 2, 2, "#8fcfaf");
                }

                drawSpeechBubble(scenes[2].bubble, 19, 13);
            };

            // Scene 3: IT Asset Audit & Provisioning
            const drawAssetScene = (tick) => {
                drawBagus(tick, "scan");

                // New workstation laptop being provisioned & scanned
                const ax = 82;
                const ay = 57;
                drawLaptop(ax, ay, "#0b1a14", "#4ade80");
                // Asset tag sticker on desk/laptop edge
                px(ax + 8, ay + 11, 8, 2, "#facc15");

                // Green scanner laser beam sweeping across asset tag
                const sweepY = ay + 2 + (tick % 6) * 2;
                px(65, 51, 17, 1, "#4ade80");
                px(ax, sweepY, 16, 1, "#4ade80");

                // Stacked IT device boxes on right
                px(120, 52, 26, 18, "#8c6d46");
                px(122, 54, 22, 2, "#b59060");
                px(129, 57, 8, 5, "#e8ece9"); // shipping/asset label
                px(124, 36, 20, 16, "#755938");
                px(126, 38, 16, 2, "#9c7a4f");
                px(130, 41, 8, 4, "#e8ece9");

                // Floating pixel OK checkmarks
                const floatY = (tick % 8);
                drawPixelText("OK", 104, 34 - floatY, "#4ade80");
                drawPixelText("OK", 132, 28 - ((floatY + 4) % 8), "#8fcfaf");

                drawSpeechBubble(scenes[3].bubble, 24, 13);
            };

            let currentSceneIndex = 0;
            let frameTick = 0;
            let lastFrameTime = 0;
            let autoCycleTimer = null;
            let isHoveringStage = false;
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            const renderPixelFrame = () => {
                ctx.clearRect(0, 0, 160, 96);
                drawBackdrop(frameTick);
                if (currentSceneIndex === 0) drawRepairScene(frameTick);
                else if (currentSceneIndex === 1) drawNetworkScene(frameTick);
                else if (currentSceneIndex === 2) drawSecurityScene(frameTick);
                else drawAssetScene(frameTick);
            };

            const setActiveScene = (index, notify = false) => {
                currentSceneIndex = ((index % scenes.length) + scenes.length) % scenes.length;
                const scene = scenes[currentSceneIndex];

                consoleTabs.forEach((tab) => {
                    const isMatch = Number(tab.dataset.scene) === currentSceneIndex;
                    tab.classList.toggle("active", isMatch);
                    tab.setAttribute("aria-selected", String(isMatch));
                });

                if (pixelStatusText) {
                    pixelStatusText.textContent = scene.cmd;
                }
                if (pixelSceneCounter) {
                    pixelSceneCounter.textContent = `0${currentSceneIndex + 1} / 0${scenes.length}`;
                }

                renderPixelFrame();
                if (notify) {
                    triggerPillAlert(scene.alert, "👾", 1800);
                }
            };

            const resetSceneAutoCycle = () => {
                clearInterval(autoCycleTimer);
                autoCycleTimer = setInterval(() => {
                    if (isHoveringStage) return;
                    setActiveScene(currentSceneIndex + 1, false);
                }, 5200);
            };

            consoleTabs.forEach((tab) => {
                tab.addEventListener("click", () => {
                    const idx = Number(tab.dataset.scene);
                    if (Number.isNaN(idx)) return;
                    setActiveScene(idx, true);
                    resetSceneAutoCycle();
                });
            });

            if (pixelScreen) {
                pixelScreen.addEventListener("click", () => {
                    setActiveScene(currentSceneIndex + 1, true);
                    resetSceneAutoCycle();
                });
            }

            consoleStage.addEventListener("mouseenter", () => { isHoveringStage = true; });
            consoleStage.addEventListener("mouseleave", () => { isHoveringStage = false; });

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

            const animatePixelLoop = (timestamp) => {
                if (timestamp - lastFrameTime >= 130) {
                    lastFrameTime = timestamp;
                    frameTick++;
                    renderPixelFrame();
                }
                requestAnimationFrame(animatePixelLoop);
            };

            setActiveScene(0, false);
            resetSceneAutoCycle();
            requestAnimationFrame(animatePixelLoop);
        }
    }

});
