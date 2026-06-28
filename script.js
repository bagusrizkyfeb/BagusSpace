document.addEventListener("DOMContentLoaded", () => {
    // =======================================
    // HERO LOTTIE ANIMATION (LOCAL, FILE-SAFE)
    // =======================================
    const heroLottieContainer = document.getElementById("hero-lottie");
    if (heroLottieContainer && window.lottie && window.HERO_LOTTIE_DATA) {
        window.lottie.loadAnimation({
            container: heroLottieContainer,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: window.HERO_LOTTIE_DATA,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet"
            }
        });
    }

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
        "skills": "Skills",
        "journey": "Journey",
        "projects": "Projects",
        "side-write": "Exploration",
        "certificates": "Certificates",
        "stats": "Stats",
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
        "stats": "📊",
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

    // Attach liquid click effect to project boxes (pointer + touch support)
    const projectCards = document.querySelectorAll('.project-item');
    projectCards.forEach(card => {
        card.style.cursor = 'pointer';

        card.addEventListener('pointerdown', (ev) => {
            // If invoked by keyboard or programmatically, center the effect
            const cx = (ev.clientX && ev.clientY) ? ev.clientX : (card.getBoundingClientRect().left + card.offsetWidth / 2);
            const cy = (ev.clientX && ev.clientY) ? ev.clientY : (card.getBoundingClientRect().top + card.offsetHeight / 2);
            createLiquidClickEffect(card, cx, cy);
        }, { passive: true });

        // Also support touchstart for some mobile browsers
        card.addEventListener('touchstart', (ev) => {
            const t = ev.touches[0];
            if (t) createLiquidClickEffect(card, t.clientX, t.clientY);
        }, { passive: true });

        // Optional: keyboard activation (Enter / Space)
        card.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                const r = card.getBoundingClientRect();
                createLiquidClickEffect(card, r.left + r.width / 2, r.top + r.height / 2);
            }
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

    // Count stats when the section enters the viewport.
    (function animateStatsOnScroll(){
        const statEls = document.querySelectorAll('.stat-value');
        const statsSection = document.querySelector('.stats-section');
        if (!statEls.length || !statsSection) return;

        const animateValue = (el) => {
            if (el.dataset.counted === 'true') return;
            el.dataset.counted = 'true';

            const target = Number(el.getAttribute('data-target') || 0);
            const duration = 1200;
            const startTime = Date.now();

            const tick = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);

                if (progress < 1) {
                    setTimeout(tick, 16);
                } else {
                    el.textContent = target;
                }
            };

            tick();
        };

        if ('IntersectionObserver' in window) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        statEls.forEach(animateValue);
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.35 });

            statsObserver.observe(statsSection);
        } else {
            statEls.forEach(animateValue);
        }
    })();

    // =======================================
    // 15. SMOOTH SCROLL ANIMATIONS FOR SECTIONS
    // =======================================
    const observeElements = (selector, animationClass) => {
        if ('IntersectionObserver' in window) {
            const elements = document.querySelectorAll(selector);
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(animationClass);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

            elements.forEach(el => observer.observe(el));
        }
    };

    // Add fade-in animation to cards
    observeElements('.testimonial-card, .stat-card, .contact-item', 'fade-in');

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

});
