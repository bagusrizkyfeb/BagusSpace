$( document ).ready(function() {
            
    $(".toggle").on("click", function(){

        if($(".item").hasClass("active")){
            $(".item").removeClass("active")

        }
        else {
            $(".item").addClass("active")

        }
    
    })

});

//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || 
      document.documentElement.scrollTop > 20 || 
      window.pageYOffset > 20
     ) {
    // Tambahkan !important pada inline style untuk memaksa tampilan
    mybutton.style.setProperty('display', 'block', 'important');
  } else {
    mybutton.style.setProperty('display', 'none', 'important');
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  // Menggunakan window.scrollTo dengan behavior 'smooth' untuk scroll yang mulus
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}




const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

// GANTI ISI ARRAY INI dengan daftar pekerjaan/kesempatan yang kamu cari
const textArray = ["New Experience", "New Journey", "New Opportunities", "New Knowledge"];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000; // Jeda antara teks saat ini dan teks berikutnya

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

document.addEventListener("DOMContentLoaded", function() { // Menjalankan efek setelah DOM selesai di-load
  // Pastikan ada teks yang akan diketik
  if(textArray.length) {
    // Tunda sebentar sebelum mulai mengetik
    setTimeout(type, newTextDelay + 250); 
  }
});