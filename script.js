// Enhanced JavaScript for the wedding website

// Photo gallery data
const photos = [
    'img001.jpg',
    'img002.jpg',
    'img003.jpg',
    'img004.jpg',
    'img005.jpg'
];

// DOM Elements
const bg = document.querySelector('.hero-background');
const mainGalleryImg = document.getElementById('main-gallery-img');
const galleryThumbs = document.querySelector('.gallery-thumbs');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');
const rsvpForm = document.getElementById('rsvpForm');
const successMessage = document.getElementById('successMessage');
const backToForm = document.getElementById('backToForm');
const countdownDays = document.getElementById('days');
const countdownHours = document.getElementById('hours');
const countdownMinutes = document.getElementById('minutes');
const countdownSeconds = document.getElementById('seconds');

// Variables
let currentIndex = 0;
let galleryIndex = 0;
let autoSlideInterval;
let autoGalleryInterval;

// Initialize the website
function init() {
    // Start background slideshow
    startSlideshow();
    
    // Initialize gallery
    initGallery();
    
    // Initialize countdown
    initCountdown();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set active nav link on scroll
    window.addEventListener('scroll', setActiveNavLink);
    
    // Set current year for footer if needed
    document.querySelector('.footer-date').textContent = `ថ្ងៃទី 01 ខែ មីនា ឆ្នាំ 2026`;
}

// Start the background slideshow
function startSlideshow() {
    let index = 0;
    
    // Set initial background
    bg.style.backgroundImage = `
        linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
        url('${photos[index]}')
    `;
    
    // Change background every 5 seconds
    autoSlideInterval = setInterval(() => {
        index = (index + 1) % photos.length;
        bg.style.backgroundImage = `
            linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
            url('${photos[index]}')
        `;
    }, 5000);
}

// Initialize the photo gallery
function initGallery() {
    // Create thumbnails
    photos.forEach((photo, index) => {
        const thumb = document.createElement('img');
        thumb.src = photo;
        thumb.alt = `Gallery Image ${index + 1}`;
        thumb.classList.add('thumb-img');
        if (index === galleryIndex) thumb.classList.add('active');
        
        thumb.addEventListener('click', () => {
            galleryIndex = index;
            updateGallery();
        });
        
        galleryThumbs.appendChild(thumb);
    });
    
    // Set initial gallery image
    mainGalleryImg.src = photos[galleryIndex];
    
    // Start auto gallery rotation
    startAutoGallery();
}

// Update gallery with current index
function updateGallery() {
    mainGalleryImg.src = photos[galleryIndex];
    
    // Update active thumbnail
    document.querySelectorAll('.thumb-img').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === galleryIndex);
    });
}

// Start auto gallery rotation
function startAutoGallery() {
    autoGalleryInterval = setInterval(() => {
        galleryIndex = (galleryIndex + 1) % photos.length;
        updateGallery();
    }, 4000);
}

// Initialize countdown timer
function initCountdown() {
    // Set the wedding date (March 1, 2026)
    const weddingDate = new Date('March 1, 2026 17:00:00').getTime();
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Display the countdown
        countdownDays.textContent = String(days).padStart(2, '0');
        countdownHours.textContent = String(hours).padStart(2, '0');
        countdownMinutes.textContent = String(minutes).padStart(2, '0');
        countdownSeconds.textContent = String(seconds).padStart(2, '0');
        
        // If countdown is over
        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown h3').textContent = "ពិធីមង្គលការបានចាប់ផ្តើម!";
            document.querySelector('.countdown-container').innerHTML = 
                '<div class="countdown-item"><span>🎉</span><small>សូមអបអរសាទរ!</small></div>';
        }
    }, 1000);
}

// Set up event listeners
function setupEventListeners() {
    // Gallery navigation
    prevBtn.addEventListener('click', () => {
        galleryIndex = (galleryIndex - 1 + photos.length) % photos.length;
        updateGallery();
        resetAutoGallery();
    });
    
    nextBtn.addEventListener('click', () => {
        galleryIndex = (galleryIndex + 1) % photos.length;
        updateGallery();
        resetAutoGallery();
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            
            // Update active nav link
            navLinksItems.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // RSVP form submission
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            guests: document.getElementById('guests').value,
            attendance: document.querySelector('input[name="attendance"]:checked').value,
            message: document.getElementById('message').value,
            submittedAt: new Date().toISOString()
        };
        
        // In a real application, you would send this data to a server
        console.log('RSVP Submitted:', formData);
        
        // Show success message
        rsvpForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Send confirmation email (simulated)
        simulateEmailConfirmation(formData);
    });
    
    // Back to form button
    backToForm.addEventListener('click', () => {
        successMessage.style.display = 'none';
        rsvpForm.style.display = 'block';
        rsvpForm.reset();
    });
    
    // Pause slideshow when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(autoSlideInterval);
            clearInterval(autoGalleryInterval);
        } else {
            startSlideshow();
            startAutoGallery();
        }
    });
}

// Reset auto gallery timer
function resetAutoGallery() {
    clearInterval(autoGalleryInterval);
    startAutoGallery();
}

// Set active nav link based on scroll position
function setActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinksItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Simulate sending confirmation email
function simulateEmailConfirmation(formData) {
    // In a real implementation, you would send this to your server
    // This is just a simulation for demonstration
    console.log(`Confirmation email would be sent to: ${formData.email}`);
    console.log(`Subject: RSVP Confirmation for Davy & Silang's Wedding`);
    console.log(`Body: Thank you ${formData.name} for confirming your attendance!`);
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.backgroundPosition = `center ${rate}px`;
        }
    });
    
    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    document.querySelectorAll('.detail-card, .story-content, .gallery-container').forEach(el => {
        observer.observe(el);
    });
});