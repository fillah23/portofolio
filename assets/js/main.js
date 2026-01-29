/*=============== FILTERS TABS ===============*/
const tabs = document.querySelectorAll('[data-target]'),
      tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab =>{
    tab.addEventListener('click', () =>{
        const target = document.querySelector(tab.dataset.target)

        tabContents.forEach(tc =>{
            tc.classList.remove('filters__active')
        })
        target.classList.add('filters__active')

        tabs.forEach(t =>{
            t.classList.remove('filter-tab-active')
        })
        tab.classList.add('filter-tab-active')
    })
})

/*=============== IMAGE GALLERY ===============*/
let currentCardImages = [];
let currentCardIndex = 0;
let activeCard = null;

document.querySelectorAll('.projects__card').forEach(card => {
    const images = card.querySelectorAll('.projects__img');
    const indicators = card.querySelectorAll('.indicator');
    const prevBtn = card.querySelector('.gallery__prev');
    const nextBtn = card.querySelector('.gallery__next');
    const zoomBtn = card.querySelector('.gallery__zoom');
    let currentIndex = 0;

    function showImage(index) {
        // Remove active class from all images and indicators
        images.forEach(img => img.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        // Add active class to current image and indicator
        images[index].classList.add('active');
        indicators[index].classList.add('active');
        currentIndex = index;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    // Click card to show navigation buttons
    card.addEventListener('click', (e) => {
        // Don't toggle if clicking on buttons or links
        if (e.target.closest('.gallery__prev, .gallery__next, .gallery__zoom, .projects__button, .indicator')) {
            return;
        }
        
        // Remove active from all cards
        document.querySelectorAll('.projects__card').forEach(c => {
            if (c !== card) c.classList.remove('active');
        });
        
        // Toggle active on this card
        card.classList.toggle('active');
        activeCard = card.classList.contains('active') ? card : null;
    });

    // Next button
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    // Previous button
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    // Zoom button - open lightbox
    zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(images, currentIndex);
    });

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = index;
            showImage(currentIndex);
        });
    });

    // Auto-advance every 5 seconds only if card is active
    setInterval(() => {
        if (card.classList.contains('active')) {
            nextImage();
        }
    }, 5000);
});

// Close navigation when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.projects__card')) {
        document.querySelectorAll('.projects__card').forEach(card => {
            card.classList.remove('active');
        });
        activeCard = null;
    }
});

/*=============== LIGHTBOX (FULLSCREEN) ===============*/
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox__img');
const lightboxClose = lightbox.querySelector('.lightbox__close');
const lightboxPrev = lightbox.querySelector('.lightbox__prev');
const lightboxNext = lightbox.querySelector('.lightbox__next');
const lightboxCounter = lightbox.querySelector('.lightbox__counter');

function openLightbox(images, startIndex) {
    currentCardImages = Array.from(images).map(img => img.src);
    currentCardIndex = startIndex;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    lightboxImg.src = currentCardImages[currentCardIndex];
    lightboxCounter.textContent = `${currentCardIndex + 1} / ${currentCardImages.length}`;
}

function nextLightboxImage() {
    currentCardIndex = (currentCardIndex + 1) % currentCardImages.length;
    updateLightboxImage();
}

function prevLightboxImage() {
    currentCardIndex = (currentCardIndex - 1 + currentCardImages.length) % currentCardImages.length;
    updateLightboxImage();
}

// Lightbox event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextLightboxImage);
lightboxPrev.addEventListener('click', prevLightboxImage);

// Close lightbox when clicking outside image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'ArrowLeft') prevLightboxImage();
});

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
})

sr.reveal(`.profile__border`)
sr.reveal(`.profile__name`, {delay: 500})
sr.reveal(`.profile__profession`, {delay: 600})
sr.reveal(`.profile__social`, {delay: 700})
sr.reveal(`.profile__info-group`, {interval: 100, delay: 700})
sr.reveal(`.profile__buttons`, {delay: 800})
sr.reveal(`.filters__content`, {delay: 900})
sr.reveal(`.filters`, {delay: 1000})