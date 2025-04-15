// Courses Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const courseCards = document.querySelectorAll('.course-card');
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const applyFilterBtn = document.querySelector('.filter-apply');
    const resetFilterBtn = document.querySelector('.filter-reset');
    const filterTagsContainer = document.getElementById('filter-tags');
    const searchInput = document.getElementById('course-search');
    const sortSelect = document.getElementById('sort-courses');
    
    // Active filters
    let activeFilters = {
        level: [],
        skill: [],
        price: []
    };
    
    // Apply filters when button is clicked
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            // Reset active filters
            activeFilters = {
                level: [],
                skill: [],
                price: []
            };
            
            // Collect checked filters
            filterCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const filterType = checkbox.name;
                    const filterValue = checkbox.value;
                    activeFilters[filterType].push(filterValue);
                }
            });
            
            // Update filter tags
            updateFilterTags();
            
            // Apply filters to cards
            filterCourses();
        });
    }
    
    // Reset filters
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            // Uncheck all checkboxes
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Clear active filters
            activeFilters = {
                level: [],
                skill: [],
                price: []
            };
            
            // Clear filter tags
            filterTagsContainer.innerHTML = '';
            
            // Reset search
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Show all courses
            courseCards.forEach(card => {
                card.style.display = 'block';
            });
        });
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCourses();
        });
    }
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortCourses(this.value);
        });
    }
    
    // Filter courses based on active filters and search
    function filterCourses() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        courseCards.forEach(card => {
            // Get card data
            const cardLevel = card.getAttribute('data-level');
            const cardSkills = card.getAttribute('data-skills').split(',');
            const cardPrice = card.getAttribute('data-price');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDesc = card.querySelector('.course-description p').textContent.toLowerCase();
            
            // Check if card matches all active filters
            let levelMatch = activeFilters.level.length === 0 || activeFilters.level.includes(cardLevel);
            
            let skillMatch = activeFilters.skill.length === 0;
            if (!skillMatch) {
                // Check if card has at least one of the selected skills
                for (let skill of activeFilters.skill) {
                    if (cardSkills.includes(skill)) {
                        skillMatch = true;
                        break;
                    }
                }
            }
            
            let priceMatch = activeFilters.price.length === 0 || activeFilters.price.includes(cardPrice);
            
            // Check if card matches search term
            let searchMatch = searchTerm === '' || 
                cardTitle.includes(searchTerm) || 
                cardDesc.includes(searchTerm);
            
            // Show/hide card based on filters
            if (levelMatch && skillMatch && priceMatch && searchMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update course count
        updateCourseCount();
    }
    
    // Update filter tags
    function updateFilterTags() {
        // Clear existing tags
        filterTagsContainer.innerHTML = '';
        
        // Add tag for each active filter
        for (let type in activeFilters) {
            activeFilters[type].forEach(value => {
                // Get display name based on filter type and value
                let displayName = getLabelForFilter(type, value);
                
                // Create filter tag
                const tagEl = document.createElement('div');
                tagEl.className = 'filter-tag';
                tagEl.innerHTML = `
                    <span>${displayName}</span>
                    <i class="fas fa-times" data-type="${type}" data-value="${value}"></i>
                `;
                
                // Add event listener to remove tag
                tagEl.querySelector('i').addEventListener('click', function() {
                    const filterType = this.getAttribute('data-type');
                    const filterValue = this.getAttribute('data-value');
                    
                    // Remove filter from active filters
                    activeFilters[filterType] = activeFilters[filterType].filter(v => v !== filterValue);
                    
                    // Uncheck the corresponding checkbox
                    document.querySelector(`input[name="${filterType}"][value="${filterValue}"]`).checked = false;
                    
                    // Remove tag
                    tagEl.remove();
                    
                    // Apply updated filters
                    filterCourses();
                });
                
                // Add tag to container
                filterTagsContainer.appendChild(tagEl);
            });
        }
    }
    
    // Get display name for filter
    function getLabelForFilter(type, value) {
        const checkbox = document.querySelector(`input[name="${type}"][value="${value}"]`);
        if (checkbox) {
            const label = checkbox.closest('.filter-option').textContent.trim();
            return label;
        }
        
        // Fallback to capitalized value
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    // Update course count
    function updateCourseCount() {
        const visibleCourses = document.querySelectorAll('.course-card[style="display: block"]').length;
        const courseCountEl = document.querySelector('.courses-header h2');
        
        if (courseCountEl) {
            courseCountEl.textContent = `Tất cả khóa học (${visibleCourses})`;
        }
    }
    
    // Sort courses
    function sortCourses(sortBy) {
        const coursesGrid = document.querySelector('.courses-grid');
        const cards = Array.from(courseCards);
        
        // Sort cards based on selected option
        cards.sort((a, b) => {
            if (sortBy === 'popular') {
                // Sort by student count
                const aStudents = parseInt(a.querySelector('.course-students').textContent.match(/\d+/)[0]);
                const bStudents = parseInt(b.querySelector('.course-students').textContent.match(/\d+/)[0]);
                return bStudents - aStudents;
            } else if (sortBy === 'newest') {
                // Simplified - in real app, would use actual date
                return Math.random() - 0.5;
            } else if (sortBy === 'price-low') {
                // Sort by price (low to high)
                const aPrice = getPriceValue(a);
                const bPrice = getPriceValue(b);
                return aPrice - bPrice;
            } else if (sortBy === 'price-high') {
                // Sort by price (high to low)
                const aPrice = getPriceValue(a);
                const bPrice = getPriceValue(b);
                return bPrice - aPrice;
            }
            
            return 0;
        });
        
        // Reorder cards in the DOM
        cards.forEach(card => {
            coursesGrid.appendChild(card);
        });
    }
    
    // Helper to get price value for sorting
    function getPriceValue(card) {
        const priceType = card.getAttribute('data-price');
        
        if (priceType === 'free') {
            return 0;
        }
        
        const priceEl = card.querySelector('.course-badge');
        if (!priceEl) return 0;
        
        // Extract number from price string
        const priceMatch = priceEl.textContent.match(/\d+/g);
        if (priceMatch) {
            return parseInt(priceMatch.join(''));
        }
        
        return 0;
    }
    
    // Initial sort
    if (sortSelect) {
        sortCourses(sortSelect.value);
    }
}); 