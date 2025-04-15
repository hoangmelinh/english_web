// Resources Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // View options (grid/list toggle)
    const viewOptions = document.querySelectorAll('.view-option');
    
    if (viewOptions.length > 0) {
        viewOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Get parent section
                const parentSection = this.closest('.resource-section');
                
                // Get resource grid
                const resourceGrid = parentSection.querySelector('.resource-grid');
                
                // Get view type
                const viewType = this.getAttribute('data-view');
                
                // Update active button
                parentSection.querySelectorAll('.view-option').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update grid view
                if (viewType === 'grid') {
                    resourceGrid.classList.remove('list-view');
                    resourceGrid.classList.add('grid-view');
                } else {
                    resourceGrid.classList.remove('grid-view');
                    resourceGrid.classList.add('list-view');
                }
            });
        });
    }
    
    // Resource search functionality
    const searchInput = document.getElementById('resource-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            // Get all resource cards across sections
            const resourceCards = document.querySelectorAll('.resource-card');
            
            resourceCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Check if any section is empty
            document.querySelectorAll('.resource-section').forEach(section => {
                const visibleCards = section.querySelectorAll('.resource-card[style="display: flex"]').length;
                
                if (visibleCards === 0) {
                    section.querySelector('.view-more').style.display = 'none';
                    
                    // Add no results message if doesn't exist
                    if (!section.querySelector('.no-results')) {
                        const noResults = document.createElement('p');
                        noResults.className = 'no-results';
                        noResults.textContent = 'Không tìm thấy tài liệu phù hợp với từ khóa này.';
                        section.querySelector('.resource-grid').after(noResults);
                    }
                } else {
                    section.querySelector('.view-more').style.display = 'block';
                    
                    // Remove no results message if exists
                    const noResults = section.querySelector('.no-results');
                    if (noResults) {
                        noResults.remove();
                    }
                }
            });
        });
    }
    
    // Flashcard functionality
    const flashcard = document.querySelector('.flashcard');
    
    if (flashcard) {
        // Flip on click
        flashcard.addEventListener('click', function() {
            this.querySelector('.flashcard-inner').classList.toggle('flipped');
        });
        
        // Audio button
        const audioBtn = flashcard.querySelector('.card-btn:nth-child(1)');
        
        if (audioBtn) {
            audioBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card flip
                
                // In a real implementation, this would play the word's audio
                const word = flashcard.querySelector('.card-word').textContent;
                playWordAudio(word);
            });
        }
        
        // Known button (green checkmark)
        const knownBtn = flashcard.querySelector('.card-btn:nth-child(2)');
        
        if (knownBtn) {
            knownBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card flip
                
                // In a real implementation, this would mark the word as known
                const word = flashcard.querySelector('.card-word').textContent;
                markWordAsKnown(word);
                
                // Show notification
                showNotification('Từ vựng đã được đánh dấu là đã biết!', 'success');
                
                // Load next card
                setTimeout(loadNextFlashcard, 1000);
            });
        }
        
        // Unknown button (red X)
        const unknownBtn = flashcard.querySelector('.card-btn:nth-child(3)');
        
        if (unknownBtn) {
            unknownBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card flip
                
                // In a real implementation, this would mark the word for review
                const word = flashcard.querySelector('.card-word').textContent;
                markWordForReview(word);
                
                // Show notification
                showNotification('Từ vựng sẽ xuất hiện lại sau để ôn tập!', 'info');
                
                // Load next card
                setTimeout(loadNextFlashcard, 1000);
            });
        }
    }
    
    // Category card hover animation
    const categoryCards = document.querySelectorAll('.category-card');
    
    if (categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.category-icon i');
                animateIcon(icon);
            });
        });
    }
    
    // Dark mode toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        // Check if user preference is already set
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
                showNotification('Chế độ tối đã được bật!', 'info');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
                showNotification('Chế độ tối đã được tắt!', 'info');
            }
        });
    }
    
    // Smooth scroll for category links
    const categoryLinks = document.querySelectorAll('.category-card');
    
    if (categoryLinks.length > 0) {
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Topic buttons in flashcard section
    const topicButtons = document.querySelectorAll('.topic-btn');
    
    if (topicButtons.length > 0) {
        topicButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all buttons
                topicButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // In a real implementation, this would load flashcards for the selected topic
                const topic = this.textContent;
                loadFlashcardsForTopic(topic);
            });
        });
    }
    
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('.newsletter-form, .newsletter-big-form');
    
    if (newsletterForms.length > 0) {
        newsletterForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (validateEmail(email)) {
                    // In a real implementation, this would send the email to the server
                    subscribeToNewsletter(email);
                    
                    // Show success notification
                    showNotification('Đăng ký nhận thông tin thành công!', 'success');
                    
                    // Clear input
                    emailInput.value = '';
                } else {
                    // Show error notification
                    showNotification('Vui lòng nhập địa chỉ email hợp lệ!', 'error');
                }
            });
        });
    }
    
    // Helper Functions
    
    // Play word audio (simulated)
    function playWordAudio(word) {
        console.log(`Playing audio for word: ${word}`);
        // In a real implementation, this would play the actual audio file
    }
    
    // Mark word as known (simulated)
    function markWordAsKnown(word) {
        console.log(`Marking word as known: ${word}`);
        // In a real implementation, this would update the user's progress
    }
    
    // Mark word for review (simulated)
    function markWordForReview(word) {
        console.log(`Marking word for review: ${word}`);
        // In a real implementation, this would add the word to review list
    }
    
    // Load next flashcard (simulated)
    function loadNextFlashcard() {
        console.log('Loading next flashcard');
        // In a real implementation, this would load a new word from the database
        // For demo purposes, we'll just reset the current card
        const flashcardInner = document.querySelector('.flashcard-inner');
        if (flashcardInner) {
            flashcardInner.classList.remove('flipped');
        }
    }
    
    // Load flashcards for topic (simulated)
    function loadFlashcardsForTopic(topic) {
        console.log(`Loading flashcards for topic: ${topic}`);
        // In a real implementation, this would load words for the selected topic
        showNotification(`Đã chọn chủ đề: ${topic}`, 'info');
    }
    
    // Subscribe to newsletter (simulated)
    function subscribeToNewsletter(email) {
        console.log(`Subscribing email to newsletter: ${email}`);
        // In a real implementation, this would send the request to the server
    }
    
    // Email validation
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Animate icon
    function animateIcon(icon) {
        icon.classList.add('animated');
        setTimeout(() => {
            icon.classList.remove('animated');
        }, 1000);
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Check if notification container exists
        let container = document.querySelector('.notification-container');
        
        // Create container if it doesn't exist
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        notification.appendChild(closeBtn);
        
        // Add to container
        container.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}); 