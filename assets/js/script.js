// ======================
// Mobile Menu Toggle
// ======================
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });
}

// ======================
// Carousel Functionality
// ======================

let slideIndex = 0; // Start at first slide
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    if (!slides.length) return;
    if (n >= slides.length) slideIndex = 0;
    else if (n < 0) slideIndex = slides.length - 1;
    else slideIndex = n;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}

// Navigate to specific slide (for dot clicks)
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        showSlide(i);
    });
});

// Next slide (for auto-slide)
function nextSlide() {
    showSlide(slideIndex + 1);
}

// Initialize carousel
if (slides.length) {
    showSlide(slideIndex);
    setInterval(nextSlide, 3000);
}

// ======================
// Fade-in Animation on Scroll
// ======================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = '0.2s';
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ======================
// City Cards Click (Reviews Navigation)
// ======================
document.querySelectorAll('.city-card').forEach(card => {
    card.addEventListener('click', function() {
        const cityName = this.querySelector('.city-name div:nth-child(2)')?.textContent;
        if (cityName) {
            // Example: navigate to the city folder index.html
            const slug = cityName.toLowerCase().replace(/\s+/g, '-');
            window.location.href = `../${slug}/index.html`;
        }
    });
});

// ======================
// Interactive Star Ratings
// ======================
document.querySelectorAll('.star-rating').forEach(rating => {
    const stars = rating.querySelectorAll('.star');

    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
                s.style.color = i <= index ? '#fbbf24' : '#d1d5db';
                s.style.transform = i <= index ? 'scale(1.1)' : 'scale(1)';
            });
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach(s => {
                s.style.transform = 'scale(1)';
                s.style.color = s.classList.contains('filled') ? '#fbbf24' : '#d1d5db';
            });
        });
    });
});



// Lightbox for gallery
const foodImages = document.querySelectorAll('.food-img');

foodImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    let currentIndex = index;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.95)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 10000;
    overlay.style.transition = 'opacity 0.3s ease';
    
    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        document.removeEventListener("keydown", handleKeyNav);
      }
    });

    // Create image element
    const fullImg = document.createElement('img');
    fullImg.src = foodImages[currentIndex].src;
    fullImg.style.maxWidth = '90%';
    fullImg.style.maxHeight = '90%';
    fullImg.style.borderRadius = '1rem';
    fullImg.style.opacity = 0;
    fullImg.style.transition = 'opacity 0.5s ease';
    overlay.appendChild(fullImg);

    document.body.appendChild(overlay);

    // Animate fade-in
    requestAnimationFrame(() => {
      fullImg.style.opacity = 1;
    });

    // Create navigation arrows
    const createArrow = (direction) => {
      const arrow = document.createElement('div');
      arrow.innerHTML = direction === 'left' ? '&#10094;' : '&#10095;';
      arrow.style.position = 'absolute';
      arrow.style.top = '50%';
      arrow.style[direction] = '20px';
      arrow.style.transform = 'translateY(-50%)';
      arrow.style.fontSize = '3rem';
      arrow.style.color = 'white';
      arrow.style.cursor = 'pointer';
      arrow.style.userSelect = 'none';
      arrow.style.padding = '0 10px';
      arrow.style.backgroundColor = 'rgba(0,0,0,0.3)';
      arrow.style.borderRadius = '50%';
      overlay.appendChild(arrow);

      arrow.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing overlay
        if (direction === 'left') currentIndex = (currentIndex - 1 + foodImages.length) % foodImages.length;
        else currentIndex = (currentIndex + 1) % foodImages.length;
        changeImage();
      });
    };

    const changeImage = () => {
      fullImg.style.opacity = 0;
      setTimeout(() => {
        fullImg.src = foodImages[currentIndex].src;
        fullImg.style.opacity = 1;
      }, 200);
    };

    createArrow('left');
    createArrow('right');

    // --- Keyboard navigation ---
    const handleKeyNav = (e) => {
      if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + foodImages.length) % foodImages.length;
        changeImage();
      } else if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % foodImages.length;
        changeImage();
      } else if (e.key === "Escape") {
        document.body.removeChild(overlay);
        document.removeEventListener("keydown", handleKeyNav);
      }
    };

    document.addEventListener("keydown", handleKeyNav);
  });
});



// ======================
// Portfolio Page
// ======================


// -----------------------------
// Vanilla Lightbox (full-featured)
// Works with <a class="gallery-link" href="FULLSIZE.jpg"><img src="thumb.jpg"></a>
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const links = Array.from(document.querySelectorAll(".gallery-link"));
  if (!links.length) return; // nothing to do on other pages

  // Create lightbox root and inner container
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-hidden", "true");

  const inner = document.createElement("div");
  inner.className = "lightbox-inner";

  // Image element
  const img = document.createElement("img");
  img.className = "lightbox-img";
  img.alt = "";

  inner.appendChild(img);
  lightbox.appendChild(inner);

  // Controls (appended AFTER the image so they sit on top)
  const closeBtn = document.createElement("button");
  closeBtn.className = "lb-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("aria-label", "Close (Esc)");

  const prevBtn = document.createElement("button");
  prevBtn.className = "lb-prev";
  prevBtn.innerHTML = "&#10094;";
  prevBtn.setAttribute("aria-label", "Previous (Left)");

  const nextBtn = document.createElement("button");
  nextBtn.className = "lb-next";
  nextBtn.innerHTML = "&#10095;";
  nextBtn.setAttribute("aria-label", "Next (Right)");

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(prevBtn);
  lightbox.appendChild(nextBtn);

  document.body.appendChild(lightbox);

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const href = links[currentIndex].getAttribute("href");
    // show overlay then set image src so we can fade on load
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    img.style.opacity = 0;
    img.src = href;
    // smooth fade-in when loaded
    img.onload = () => {
      img.style.transition = "opacity 180ms ease";
      img.style.opacity = "1";
    };
    // focus for accessibility (optional)
    closeBtn.focus();
    // prevent page scroll
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    img.src = ""; // free memory
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % links.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + links.length) % links.length;
    openLightbox(currentIndex);
  }

  // Attach click handlers to the anchor links (prevent default navigation)
  links.forEach((link, i) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(i);
    });
  });

  // Controls
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeLightbox();
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });

  // Click outside image (on overlay) to close
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") showNext();
    else if (e.key === "ArrowLeft") showPrev();
  });
});


/* About Us Page */

const contactForm = document.getElementById('contactForm');
const submitBtn = contactForm.querySelector('button[type="submit"]');

const successMessage = document.getElementById('successMessage');

// Optional: add loading text
const originalBtnText = submitBtn.textContent;

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Show loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Submit to Google Forms via hidden iframe
    const iframe = document.getElementById('hidden_iframe');
    iframe.onload = function() {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        // Show success message
        successMessage.classList.add('show');
        contactForm.reset();

        setTimeout(() => successMessage.classList.remove('show'), 5000);
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    contactForm.submit(); // submit normally to iframe
});

// Form input focus styling
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

