
// 🚩 CATATAN: Blok JQuery yang tidak relevan ('toggle' dan 'item') telah dihapus.
// Fungsi jQuery lainnya (smooth scroll) tetap dipertahankan.

// ===========================================
// GET BUTTONS/ELEMENTS
// ===========================================

const mybutton = document.getElementById("myBtn");
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");
const menuToggle = document.getElementById("menu-toggle");

// ===========================================
// 1. FUNGSI BACK TO TOP (Native JS)
// ===========================================

// Ketika user scroll 20px dari atas dokumen, show/hide tombol
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || 
      document.documentElement.scrollTop > 20 || 
      window.pageYOffset > 20
     ) {
    // Tombol Back to Top tampil
    mybutton.style.setProperty('display', 'block', 'important');
  } else {
    // Tombol Back to Top hilang
    mybutton.style.setProperty('display', 'none', 'important');
  }
}

// Ketika user klik tombol, scroll ke atas
function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ===========================================
// 2. FUNGSI SMOOTH SCROLL (jQuery)
// ===========================================

const HEADER_HEIGHT_OFFSET = 80; // Offset untuk mengimbangi header

// Gunakan jQuery untuk Smooth Scroll
$('.nav a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href'); 
    const targetElement = $(targetId);
    
    if (targetElement.length) {
        // Hitung posisi scroll: Posisi elemen target - Tinggi offset
        const scrollToPosition = targetElement.offset().top - HEADER_HEIGHT_OFFSET;
        
        $('html, body').animate({
            scrollTop: scrollToPosition
        }, 600); 

        // TUTUP HAMBURGER MENU JIKA SEDANG TERBUKA (Mobile)
        if (window.innerWidth <= 992 && menuToggle) {
            menuToggle.checked = false;
        }
    }
});


// ===========================================
// 3. FUNGSI TYPEWRITER EFFECT (Native JS)
// ===========================================

const textArray = ["New Experience", "New Journey", "New Opportunities", "New Knowledge"];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000; 

let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
    if (charIndex > 0) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex>=textArray.length) textArrayIndex=0;
    setTimeout(type, typingDelay + 1100);
  }
}



// ===========================================
// 4. ACTIVE NAV STATE DENGAN INTERSECTION OBSERVER
// ===========================================

// Variabel sections dan navLinks (Pastikan sudah didefinisikan secara global di awal file)
const sections = document.querySelectorAll('section[id]'); 
const navLinks = document.querySelectorAll('.nav a[href^="#"]'); 

const options = {
    root: null, 
    // rootMargin: Menggunakan 60% margin negatif di bawah. 
    // Ini memastikan section aktif sampai 40% bagian bawahnya terlihat.
    rootMargin: '0px 0px -60% 0px', 
    threshold: 0 
};

const observer = new IntersectionObserver(entries => {
    
    // Logika 1: Hapus semua kelas active terlebih dahulu
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Logika 2: Aktifkan link berdasarkan Section yang sedang terlihat
    entries.forEach(entry => {
        
        // Hanya proses jika section sedang memasuki viewport (isIntersecting)
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const correspondingLink = document.querySelector(`.nav a[href="#${id}"]`);
            
            // Tambahkan kelas 'active' pada link yang sesuai
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });

    // Catatan: Pengecekan Home Fallback (window.scrollY) dilakukan di listener terpisah di bawah.

}, options);


// ===========================================
// KASUS KHUSUS HOME FALLBACK (Listener Paling Kuat)
// ===========================================

const homeLink = document.querySelector('.nav a[href="#home"]');

// Tambahkan listener terpisah untuk memastikan Home aktif di puncak
// Ini mengatasi masalah Home yang hilang saat scroll kembali ke atas (di bawah 100px)
window.addEventListener('scroll', function() {
    
    // Jika scroll di dekat puncak (di bawah 100px)
    if (window.scrollY < 100) { 
         if (homeLink) {
             // Paksa Home aktif
             navLinks.forEach(link => link.classList.remove('active'));
             homeLink.classList.add('active');
         }
    }
});


// ===========================================
// INISIALISASI AKHIR (DOMContentLoaded)
// Memastikan semua script yang bergantung pada elemen berjalan setelah DOM siap
// ===========================================

document.addEventListener("DOMContentLoaded", function() {
    
    // Inisialisasi Typewriter Effect (Jika kode ini masih ada di DOMContentLoaded)
    /*
    if(textArray.length) {
      setTimeout(type, newTextDelay + 250); 
    }
    */
    
    // Inisialisasi Intersection Observer (Active Nav State)
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Pastikan Home aktif saat halaman baru dibuka (scrollY = 0)
    if (homeLink) {
        homeLink.classList.add('active');
    }
});


document.addEventListener("DOMContentLoaded", function() {
    
    // Inisialisasi Typewriter Effect
    if(textArray.length) {
      setTimeout(type, newTextDelay + 250); 
    }
    
    // Inisialisasi Intersection Observer (Active Nav State)
    sections.forEach(section => {
        observer.observe(section);
    });
});