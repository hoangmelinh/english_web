// Learning Path JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Path Tabs
    const pathTabs = document.querySelectorAll('.path-tab');
    const pathTimelines = document.querySelectorAll('.path-timeline');
    
    if (pathTabs.length > 0) {
        pathTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                pathTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get the tab data attribute
                const tabId = this.getAttribute('data-tab');
                
                // Hide all timelines
                pathTimelines.forEach(timeline => {
                    timeline.classList.remove('active');
                });
                
                // Show selected timeline
                document.getElementById(`${tabId}-path`).classList.add('active');
            });
        });
    }
    
    // Smooth scroll to assessment section when clicking the hero button
    const assessmentBtn = document.querySelector('.learning-path-hero .btn');
    
    if (assessmentBtn) {
        assessmentBtn.addEventListener('click', function(e) {
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
    }
    
    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function checkTimelineVisibility() {
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );
            
            if (isVisible) {
                setTimeout(() => {
                    item.classList.add('animated');
                }, index * 200); // Staggered animation
            }
        });
    }
    
    // Add animation class for initial visible items
    window.addEventListener('load', checkTimelineVisibility);
    
    // Check visibility on scroll
    window.addEventListener('scroll', checkTimelineVisibility);
    
    // Progress bar simulation
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressBars.length > 0) {
        progressBars.forEach(bar => {
            const percentage = bar.getAttribute('data-progress');
            
            // Animate progress bar
            setTimeout(() => {
                bar.style.width = `${percentage}%`;
                
                // Update progress text if exists
                const progressText = bar.parentElement.querySelector('.progress-text');
                if (progressText) {
                    progressText.textContent = `${percentage}%`;
                }
            }, 500);
        });
    }
    
    // Course completion simulation
    const completionCheckboxes = document.querySelectorAll('.course-checkbox');
    
    if (completionCheckboxes.length > 0) {
        completionCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const courseItem = this.closest('.timeline-course');
                
                if (this.checked) {
                    courseItem.classList.add('completed');
                } else {
                    courseItem.classList.remove('completed');
                }
                
                // Update progress if there's a progress bar
                updateProgress();
            });
        });
    }
    
    function updateProgress() {
        const totalCourses = document.querySelectorAll('.timeline-course').length;
        const completedCourses = document.querySelectorAll('.timeline-course.completed').length;
        
        if (totalCourses > 0) {
            const progressPercentage = Math.round((completedCourses / totalCourses) * 100);
            const progressBar = document.querySelector('.path-progress .progress-bar');
            
            if (progressBar) {
                progressBar.style.width = `${progressPercentage}%`;
                
                // Update progress text
                const progressText = document.querySelector('.path-progress .progress-text');
                if (progressText) {
                    progressText.textContent = `${progressPercentage}%`;
                }
            }
        }
    }
}); 