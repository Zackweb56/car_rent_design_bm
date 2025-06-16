const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('header');
const sections = document.querySelectorAll('section[id]');

// Mobile Navigation
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Sticky header on scroll
window.addEventListener('scroll', () => {
    header.classList.toggle('sticky', window.scrollY > 0);
});

// Car filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const carCards = document.querySelectorAll('.car-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        carCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Merci pour votre message! Nous vous contacterons bientôt.');
        this.reset();
    });
}

// Booking form date validation
const pickupDate = document.getElementById('pickup-date');
const returnDate = document.getElementById('return-date');

if (pickupDate && returnDate) {
    const today = new Date().toISOString().split('T')[0];
    pickupDate.setAttribute('min', today);
    
    pickupDate.addEventListener('change', function() {
        returnDate.setAttribute('min', this.value);
    });
}

// Car Image Gallery
let currentImageIndex = 0;
const images = document.querySelectorAll('.car-thumbs img');
const mainImage = document.getElementById('mainCarImg');
const currentImageSpan = document.getElementById('currentImage');
const totalImagesSpan = document.getElementById('totalImages');

// Initialize gallery
function initGallery() {
    if (mainImage && images.length > 0) {
        totalImagesSpan.textContent = images.length;
        updateImageCounter();
    }
}

function changeImage(thumb, index) {
    // Update main image
    mainImage.src = thumb.src;
    
    // Update active state
    images.forEach(img => img.classList.remove('active'));
    thumb.classList.add('active');
    
    // Update current index and counter
    currentImageIndex = index;
    updateImageCounter();
}

function prevImage() {
    if (!images || images.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    const thumb = images[currentImageIndex];
    changeImage(thumb, currentImageIndex);
}

function nextImage() {
    if (!images || images.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const thumb = images[currentImageIndex];
    changeImage(thumb, currentImageIndex);
}

function updateImageCounter() {
    if (currentImageSpan) {
        currentImageSpan.textContent = currentImageIndex + 1;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    if (document.querySelector('.car-details-section')) {
        if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    }
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const carMainImgElement = document.querySelector('.car-main-img');
if (carMainImgElement) {
    carMainImgElement.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carMainImgElement.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        nextImage();
    } else if (touchEndX > touchStartX + swipeThreshold) {
        prevImage();
    }
}

// Highlight active navigation link on scroll
function activateNavLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - header.offsetHeight; // Adjust for fixed header
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    // Select all individual navigation links inside the .nav-links UL
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);
window.addEventListener('load', activateNavLink); // Activate on page load

// Reservation Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('reservationModal');
    const closeBtn = modal.querySelector('.close-modal');
    const reservationForm = document.getElementById('reservationForm');
    const reserveButtons = document.querySelectorAll('.btn-primary');
    console.log(reserveButtons);

    // Set minimum date for pickup and return dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickupDate').min = today;
    document.getElementById('returnDate').min = today;

    // Update return date minimum when pickup date changes
    document.getElementById('pickupDate').addEventListener('change', function() {
        document.getElementById('returnDate').min = this.value;
    });

    // Open modal when reserve button is clicked
    reserveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const carCard = this.closest('.car-card');
            
            // Get car details
            const carImage = carCard.querySelector('.car-img img').src;
            const carName = carCard.querySelector('.car-title').textContent;
            const carYear = carCard.querySelector('.car-year').textContent;
            const carTransmission = carCard.querySelector('.car-transmission').textContent;
            const carSeats = carCard.querySelector('.spec-item:nth-child(2) span').textContent;
            const carPrice = carCard.querySelector('.price').textContent;

            // Update modal content
            document.getElementById('modalCarImage').src = carImage;
            document.getElementById('modalCarName').textContent = carName;
            document.getElementById('modalCarYear').textContent = carYear;
            document.getElementById('modalCarTransmission').textContent = carTransmission;
            document.getElementById('modalCarSeats').textContent = carSeats;
            document.getElementById('modalCarPrice').textContent = carPrice;

            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal when close button is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Handle form submission
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            carName: document.getElementById('modalCarName').textContent,
            pickupDate: document.getElementById('pickupDate').value,
            pickupTime: document.getElementById('pickupTime').value,
            returnDate: document.getElementById('returnDate').value,
            returnTime: document.getElementById('returnTime').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            drivingLicense: document.getElementById('drivingLicense').value,
            additionalNotes: document.getElementById('additionalNotes').value
        };

        // Here you would typically send the form data to your server
        console.log('Reservation submitted:', formData);

        // Show success message
        alert('Votre réservation a été soumise avec succès! Nous vous contacterons bientôt pour confirmer.');
        
        // Close modal and reset form
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        reservationForm.reset();
    });
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
