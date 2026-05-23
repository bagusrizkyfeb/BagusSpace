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
            } else {
                applyTheme("dark");
                localStorage.setItem("theme", "dark");
            }
        });
    }

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
    });
    
    // topFunction dipanggil via atribut onclick di HTML
    window.topFunction = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =======================================
    // 3. SMOOTH SCROLL (Vanilla JS)
    // =======================================
    const HEADER_HEIGHT_OFFSET = 80; // Offset untuk mengimbangi header
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    const menuToggle = document.getElementById("menu-toggle");

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

                // TUTUP HAMBURGER MENU JIKA SEDANG TERBUKA (Mobile)
                if (window.innerWidth <= 992 && menuToggle) {
                    menuToggle.checked = false;
                }
            }
        });
    });

    // =======================================
    // 4. HIGHLIGHT NAVIGATION AKTIF SAAT SCROLL
    // =======================================
    const navSections = document.querySelectorAll("#home, section[id], footer[id]");
    const homeLink = document.querySelector('.nav a[href="#home"]');
    const navContainer = document.querySelector(".nav");
    
    // Membuat elemen kapsul geser secara dinamis
    let navCapsule = null;
    if (navContainer) {
        navCapsule = document.createElement("div");
        navCapsule.className = "nav-capsule";
        navContainer.appendChild(navCapsule);
    }
    
    // Memperbarui posisi kapsul secara dinamis berbasis letak & ukuran link aktif
    const updateCapsulePosition = () => {
        if (!navCapsule || window.innerWidth <= 992) {
            if (navCapsule) navCapsule.style.opacity = "0";
            return;
        }
        
        const activeLink = document.querySelector(".nav a.active");
        if (activeLink) {
            navCapsule.style.opacity = "1";
            navCapsule.style.left = `${activeLink.offsetLeft}px`;
            navCapsule.style.width = `${activeLink.offsetWidth}px`;
            navCapsule.style.height = `${activeLink.offsetHeight}px`;
            navCapsule.style.top = `${activeLink.offsetTop}px`;
        } else {
            navCapsule.style.opacity = "0";
        }
    };

    const setActiveLink = (targetLink) => {
        if (!targetLink || targetLink.classList.contains("active")) return;
        
        navLinks.forEach(link => link.classList.remove("active"));
        targetLink.classList.add("active");
        
        updateCapsulePosition();
    };
    
    window.addEventListener("scroll", () => {
        let scrollY = window.pageYOffset || window.scrollY;
        
        // Jika scroll di dekat puncak (di bawah 100px), aktifkan Home secara manual
        if (scrollY < 100) {
            if (homeLink) {
                setActiveLink(homeLink);
            }
            return;
        }
        
        navSections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Sesuaikan offset dengan tinggi header
            const sectionId = current.getAttribute("id");
            // Cari link navigasi yang cocok dengan ID bagian ini
            const navLink = document.querySelector(`.nav a[href*="${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    setActiveLink(navLink);
                }
            }
        });
    });

    // Aktifkan tautan home saat pertama kali dimuat jika berada di paling atas
    if (homeLink && window.scrollY < 100) {
        homeLink.classList.add('active');
    }
    
    // Jalankan posisi awal kapsul
    setTimeout(updateCapsulePosition, 150);
    
    window.addEventListener("resize", () => {
        updateCapsulePosition();
    });

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
    });
    
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
});