// Main JavaScript for Arab Tech Academy LMS

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Smooth Scroll to Section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
        
        if (input.type === 'email' && !validateEmail(input.value)) {
            input.classList.add('border-red-500');
            isValid = false;
        }
    });
    
    return isValid;
}

// Loading Spinner
function showLoading() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    spinner.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(spinner);
}

function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.remove();
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('تم النسخ بنجاح!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('فشل النسخ', 'error');
    });
}

// Confirm Dialog
function confirmAction(message) {
    return confirm(message);
}

// Image Preview
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Debounce Function for Search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search Functionality
const searchCourses = debounce(function(query) {
    if (query.length < 2) return;
    
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data);
        })
        .catch(error => {
            console.error('Search error:', error);
        });
}, 300);

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-gray-500 p-4">لم يتم العثور على نتائج</p>';
        return;
    }
    
    results.forEach(course => {
        const item = document.createElement('a');
        item.href = `/courses/${course.id}`;
        item.className = 'block p-3 hover:bg-gray-100 border-b';
        item.innerHTML = `
            <div class="font-bold">${course.title}</div>
            <div class="text-sm text-gray-600">${course.description.substring(0, 100)}...</div>
        `;
        resultsContainer.appendChild(item);
    });
}

// Star Rating System
function setRating(rating) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('text-yellow-400');
            star.classList.remove('text-gray-300');
        } else {
            star.classList.add('text-gray-300');
            star.classList.remove('text-yellow-400');
        }
    });
}

// Video Progress Tracking
let videoProgressInterval;

function trackVideoProgress(videoElement, contentId, courseId) {
    if (videoProgressInterval) {
        clearInterval(videoProgressInterval);
    }
    
    videoProgressInterval = setInterval(() => {
        if (!videoElement.paused) {
            const watchTime = Math.floor(videoElement.currentTime);
            
            fetch('/api/content/watch-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentId, watchTime })
            });
            
            // Auto-complete when 90% watched
            if (videoElement.currentTime / videoElement.duration > 0.9) {
                markContentComplete(contentId, courseId);
                clearInterval(videoProgressInterval);
            }
        }
    }, 10000); // Update every 10 seconds
}

// Mark Content as Complete
async function markContentComplete(contentId, courseId) {
    try {
        const response = await fetch('/api/content/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contentId, courseId })
        });
        
        const data = await response.json();
        if (data.success) {
            showToast('تم وضع علامة كمكتمل!');
            updateProgressBar(data.progress);
        }
    } catch (error) {
        console.error('Error marking complete:', error);
        showToast('حدث خطأ', 'error');
    }
}

// Update Progress Bar
function updateProgressBar(progress) {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        bar.style.width = `${progress}%`;
        const progressText = bar.parentElement.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${progress}%`;
        }
    });
}

// Quiz Timer
let quizTimer;
let timeRemaining;

function startQuizTimer(duration) {
    timeRemaining = duration * 60; // Convert to seconds
    const timerDisplay = document.getElementById('quiz-timer');
    
    if (!timerDisplay) return;
    
    quizTimer = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeRemaining <= 60) {
            timerDisplay.classList.add('text-red-600', 'font-bold');
        }
        
        if (timeRemaining <= 0) {
            clearInterval(quizTimer);
            submitQuizAutomatically();
        }
    }, 1000);
}

function submitQuizAutomatically() {
    showToast('انتهى الوقت! سيتم إرسال إجاباتك تلقائياً', 'warning');
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.dispatchEvent(new Event('submit'));
    }
}

// Lazy Loading Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize Tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const text = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip absolute bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg z-50';
            tooltip.textContent = text;
            tooltip.id = 'active-tooltip';
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.getElementById('active-tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Modal System
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal:not(.hidden)');
        modals.forEach(modal => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
        document.body.style.overflow = 'auto';
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) searchInput.focus();
    }
});

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lazy loading
    lazyLoadImages();
    
    // Initialize tooltips
    initTooltips();
    
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Initialize video progress tracking if video exists
    const video = document.querySelector('video');
    if (video) {
        const contentId = video.dataset.contentId;
        const courseId = video.dataset.courseId;
        if (contentId && courseId) {
            trackVideoProgress(video, contentId, courseId);
        }
    }
    
    // Form validation on submit
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('border-red-500');
                    isValid = false;
                } else {
                    field.classList.remove('border-red-500');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            }
        });
    });
    
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
});

// Export functions for use in inline scripts
window.showToast = showToast;
window.copyToClipboard = copyToClipboard;
window.confirmAction = confirmAction;
window.openModal = openModal;
window.closeModal = closeModal;
window.markContentComplete = markContentComplete;
window.previewImage = previewImage;
