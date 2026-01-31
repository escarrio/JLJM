// ==================== HEADER SCROLL EFFECT ====================
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ==================== TABLE ROW ANIMATIONS (for Dashboard page) ====================
if (document.querySelector("tbody")) {
  window.addEventListener("load", () => {
    const rows = document.querySelectorAll("tbody tr");
    
    rows.forEach((row, index) => {
      row.style.opacity = "0";
      row.style.transform = "translateX(-30px)";
      row.style.transition = "all 0.5s ease";
      
      setTimeout(() => {
        row.style.opacity = "1";
        row.style.transform = "translateX(0)";
      }, index * 80);
    });
  });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// ==================== PARALLAX EFFECT FOR HERO ====================
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  const scrolled = window.pageYOffset;
  
  if (hero) {
    hero.style.backgroundPositionY = scrolled * 0.5 + "px";
  }
});

// ==================== FEATURE CARDS SCROLL ANIMATION ====================
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe feature cards
document.querySelectorAll(".feature-card").forEach(card => {
  observer.observe(card);
});

// ==================== COFFEE BEAN CURSOR TRAIL (Optional) ====================
let lastX = 0;
let lastY = 0;
let isMoving = false;

document.addEventListener("mousemove", (e) => {
  lastX = e.clientX;
  lastY = e.clientY;
  
  if (!isMoving) {
    isMoving = true;
    setTimeout(() => {
      isMoving = false;
    }, 100);
  }
});

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// ==================== CONSOLE WELCOME MESSAGE ====================
console.log("%c☕ Welcome to JLJM Timeless Cup! ☕", 
  "color: #ba8a5c; font-size: 20px; font-weight: bold; padding: 10px;");
console.log("%cWhere every sip tells a timeless story.", 
  "color: #5b3a29; font-size: 14px; font-style: italic;");
