document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       NAVBAR SCROLL EFFECT
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    /* ==========================================================================
       INTERSECTION OBSERVER (INDIVIDUALIZED REVEAL ANIMATIONS)
       ========================================================================== */
    const revealElements = document.querySelectorAll(
        '.reveal-fade, .reveal-slide, .reveal-slide-delay, .reveal-fade-delay, .reveal-element'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       LIGHTBOX FUNCTIONALITY FOR ROOM BATHROOMS & GALLERY
       ========================================================================== */
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger, .gallery-item img');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = trigger.tagName === 'IMG' ? trigger.src : trigger.getAttribute('href');
            lightboxImg.src = imgSrc;
            lightboxModal.classList.add('active');
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.remove('active');
        }
    });

    /* ==========================================================================
       BOOKING BAR & FORM INTERACTION (VISUAL FEEDBACK)
       ========================================================================== */
    const btnSearch = document.getElementById('btn-search');
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            
            if (!checkin || !checkout) {
                alert('Por favor, seleccione sus fechas de llegada y salida.');
                return;
            }
            
            btnSearch.textContent = 'Buscando...';
            setTimeout(() => {
                btnSearch.textContent = 'Disponibilidad Confirmada';
                btnSearch.style.backgroundColor = '#28a745';
                btnSearch.style.borderColor = '#28a745';
                
                setTimeout(() => {
                    const contactSection = document.getElementById('contacto');
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }, 800);
            }, 1000);
        });
    }

    const mainForm = document.getElementById('main-form');
    if (mainForm) {
        mainForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = mainForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Enviando Solicitud...';
            
            setTimeout(() => {
                submitBtn.textContent = 'Solicitud Enviada con Éxito';
                submitBtn.style.backgroundColor = '#28a745';
                submitBtn.style.borderColor = '#28a745';
                mainForm.reset();
            }, 1200);
        });
    }

    /* Set default dates in booking bar */
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 3);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput && checkoutInput) {
        checkinInput.value = today;
        checkoutInput.value = tomorrow;
    }
});