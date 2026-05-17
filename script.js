/**
 * Sandhya Homoeopathic Clinic - Interactive UI Engine
 * Doctor: Dr. Sachin More
 * Location: Nashik, Maharashtra, India
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initMobileMenu();
    initActiveNavObserver();
    initScrollCounter();
    initTestimonialSlider();
    initVideoModal();
    initPhotoLightbox();
    initAppointmentForm();
});

/* ==========================================
   1. NAVBAR SCROLL EFFECT
   ========================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once on load in case page was refreshed halfway
}

/* ==========================================
   2. MOBILE HAMBURGER MENU
   ========================================== */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!mobileToggle || !navMenu) return;

    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('open');
        
        // Animate hamburger lines
        const lines = mobileToggle.querySelectorAll('span');
        if (mobileToggle.classList.contains('open')) {
            lines[0].style.transform = 'translateY(9px) rotate(45deg)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'translateY(-9px) rotate(-45deg)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/* ==========================================
   3. ACTIVE NAVIGATION LINK OBSERVER
   ========================================== */
function initActiveNavObserver() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the sweet spot of viewport
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}` || (id === 'hero' && link.getAttribute('href') === '#')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
}

/* ==========================================
   4. STATS COUNTER ANIMATION
   ========================================== */
function initScrollCounter() {
    const statsStrip = document.querySelector('.stats-strip');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    if (!statsStrip || statNumbers.length === 0) return;

    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds animation
        const frameRate = 1000 / 60; // 60 FPS
        const totalFrames = Math.round(duration / frameRate);
        let currentFrame = 0;

        const animate = () => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            // Ease out quad formula for smooth decelerating animation
            const easeProgress = progress * (2 - progress);
            const currentValue = Math.floor(easeProgress * target);

            element.textContent = currentValue.toLocaleString('en-IN') + suffix;

            if (currentFrame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target.toLocaleString('en-IN') + suffix;
            }
        };

        requestAnimationFrame(animate);
    };

    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                statNumbers.forEach(num => countUp(num));
                animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(statsStrip);
}

/* ==========================================
   5. TESTIMONIAL SLIDER / CAROUSEL
   ========================================== */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayTimer;

    // Create Navigation Dots dynamically
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dotsContainer.appendChild(dot);

        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
    });

    const dots = document.querySelectorAll('.slider-dot');

    const updateSlider = () => {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            dots[index].classList.remove('active');
            if (index === currentIndex) {
                slide.classList.add('active');
                dots[index].classList.add('active');
            }
        });
    };

    const goToSlide = (index) => {
        currentIndex = index;
        updateSlider();
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

    // Autoplay feature
    const startAutoPlay = () => {
        autoPlayTimer = setInterval(nextSlide, 6000); // Change testimonial every 6 seconds
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    };

    startAutoPlay();
}

/* ==========================================
   6. CLINIC VIDEO MODAL PLAYER
   ========================================== */
function initVideoModal() {
    const videoThumbs = document.querySelectorAll('.video-thumbnail-wrapper');
    const videoModal = document.getElementById('video-modal');
    const modalBody = videoModal ? videoModal.querySelector('.modal-body') : null;
    const modalClose = videoModal ? videoModal.querySelector('.modal-close') : null;

    if (!videoThumbs || !videoModal || !modalBody || !modalClose) return;

    videoThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const videoType = thumb.getAttribute('data-video-type');
            const videoUrl = thumb.getAttribute('data-video-url');
            
            modalBody.innerHTML = ''; // Clear previous contents

            if (videoType === 'youtube') {
                modalBody.innerHTML = `
                    <iframe src="${videoUrl}?autoplay=1&rel=0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen></iframe>`;
            } else if (videoType === 'local') {
                modalBody.innerHTML = `
                    <video controls autoplay>
                        <source src="${videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`;
            } else {
                // High fidelity CSS + SVG Animated Clinical Presentation Fallback
                modalBody.innerHTML = `
                    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #0E4B43 0%, #082E29 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; padding: 40px; text-align: center;">
                        <div style="font-size: 3rem; color: #D4AF37; margin-bottom: 20px;"><i class="fas fa-heartbeat"></i></div>
                        <h3 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 12px;">Sandhya Homoeopathic Clinic Tour</h3>
                        <p style="max-width: 500px; font-size: 1rem; color: #E8F3F1; line-height: 1.6; margin-bottom: 24px;">Experience the welcoming and healing atmosphere of our advanced homeopathy center in Nashik. Our patient-first approach prioritizes your health and safety.</p>
                        <div style="display: flex; gap: 12px;">
                            <span style="padding: 8px 16px; border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; font-size: 0.8rem; background: rgba(255,255,255,0.05);">Canada Corner, Nashik</span>
                            <span style="padding: 8px 16px; border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; font-size: 0.8rem; background: rgba(255,255,255,0.05);">Safe & Effective</span>
                        </div>
                    </div>`;
            }

            videoModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Lock background scroll
        });
    });

    const closeModal = () => {
        videoModal.style.display = 'none';
        modalBody.innerHTML = ''; // Stop video play immediately
        document.body.style.overflow = 'auto'; // Restore background scroll
    };

    modalClose.addEventListener('click', closeModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeModal();
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.style.display === 'flex') {
            closeModal();
        }
    });
}

/* ==========================================
   7. PHOTO GALLERY LIGHTBOX
   ========================================== */
function initPhotoLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const modalBody = lightboxModal ? lightboxModal.querySelector('.modal-body') : null;
    const modalClose = lightboxModal ? lightboxModal.querySelector('.modal-close') : null;

    if (!galleryItems || !lightboxModal || !modalBody || !modalClose) return;

    let galleryImages = [];
    let currentImgIndex = 0;

    // Cache gallery details
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-img');
        const caption = item.querySelector('.gallery-caption').textContent;
        galleryImages.push({
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt') || 'Clinic Image',
            caption: caption
        });

        item.addEventListener('click', () => {
            currentImgIndex = index;
            openLightbox();
        });
    });

    const openLightbox = () => {
        updateLightboxContent();
        lightboxModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const updateLightboxContent = () => {
        const imgData = galleryImages[currentImgIndex];
        modalBody.innerHTML = `
            <img class="lightbox-img" src="${imgData.src}" alt="${imgData.alt}">
            <div class="lightbox-caption">${imgData.caption}</div>
            
            <button class="slider-btn prev" style="position: absolute; left: 24px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.15); border: none; color: white;" onclick="event.stopPropagation(); changeLightboxImage(-1)">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="slider-btn next" style="position: absolute; right: 24px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.15); border: none; color: white;" onclick="event.stopPropagation(); changeLightboxImage(1)">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    };

    // Expose changeLightboxImage to window scope for standard HTML onclick handlers inside string literal templates
    window.changeLightboxImage = (direction) => {
        currentImgIndex = (currentImgIndex + direction + galleryImages.length) % galleryImages.length;
        updateLightboxContent();
    };

    const closeLightbox = () => {
        lightboxModal.style.display = 'none';
        modalBody.innerHTML = '';
        document.body.style.overflow = 'auto';
    };

    modalClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('modal-body')) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (lightboxModal.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') window.changeLightboxImage(1);
            if (e.key === 'ArrowLeft') window.changeLightboxImage(-1);
        }
    });
}

/* ==========================================
   8. CLINIC APPOINTMENT FORM & WHATSAPP LINKING
   ========================================== */
function initAppointmentForm() {
    const form = document.getElementById('clinic-appointment-form');
    const formContent = document.getElementById('appointment-form-content');
    const successDialog = document.getElementById('appointment-success-dialog');
    const whatsAppBtn = document.getElementById('whatsapp-booking-btn');

    if (!form || !successDialog || !formContent) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Extract Form Values
        const name = document.getElementById('patient-name').value.trim();
        const phone = document.getElementById('patient-phone').value.trim();
        const email = document.getElementById('patient-email').value.trim();
        const condition = document.getElementById('patient-condition').value;
        const message = document.getElementById('patient-message').value.trim();

        // Basic Client Side Validation
        if (!name || !phone || !condition) {
            alert('Please fill out all mandatory fields: Name, Phone Number, and Specialization.');
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
            alert('Please enter a valid 10-digit Indian phone number.');
            return;
        }

        // 2. Simulate Secure API Posting
        const submitButton = form.querySelector('button[type="submit"]');
        const originalBtnText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing Booking...';

        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalBtnText;

            // Hide Form, Show Premium Custom Styled Success Dialog
            formContent.style.display = 'none';
            successDialog.style.display = 'block';

            // Custom Timing Feedback in Dialog
            const patientGreeting = document.getElementById('success-patient-name');
            if (patientGreeting) patientGreeting.textContent = name;
            
            const conditionBadge = document.getElementById('success-condition-badge');
            if (conditionBadge) conditionBadge.textContent = condition;

            // 3. Configure Immediate WhatsApp Chat Link
            if (whatsAppBtn) {
                // Formulate customized message
                const clinicWhatsAppNumber = '919822452366'; // Dr. Sachin More Contact Phone Number (simulate official India country code format)
                const formattedMessage = `Hello Dr. Sachin More, I would like to book a Homeopathy appointment at Sandhya Clinic.\n\n*Patient Details:*\n- *Name:* ${name}\n- *Phone:* ${phone}\n- *Email:* ${email || 'Not provided'}\n- *Treatment/Condition:* ${condition}\n- *Message:* ${message || 'Looking forward to consultation.'}\n\nPlease confirm my slot timing. Thank you!`;
                
                const encodedMsg = encodeURIComponent(formattedMessage);
                const whatsAppUrl = `https://wa.me/${clinicWhatsAppNumber}?text=${encodedMsg}`;
                
                whatsAppBtn.setAttribute('href', whatsAppUrl);
            }
        }, 1500); // Simulate network latency
    });
}
