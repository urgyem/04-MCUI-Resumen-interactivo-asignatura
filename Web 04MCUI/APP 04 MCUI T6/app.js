document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const progressFill = document.getElementById('progressFill');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const expandButtons = document.querySelectorAll('.expand-btn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    let currentSectionIndex = 0;
    const totalSections = navItems.length;

    // --- FUNCTIONS ---

    const updateUI = () => {
        // Update Navigation Items
        navItems.forEach((item, index) => {
            if (index === currentSectionIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update Content Sections
        contentSections.forEach((section, index) => {
            if (index === currentSectionIndex) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update Progress Bar
        const progressPercentage = ((currentSectionIndex + 1) / totalSections) * 100;
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        // Update Prev/Next Buttons
        if (prevBtn) {
            prevBtn.disabled = currentSectionIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentSectionIndex === totalSections - 1;
        }
        
        // Scroll to top of content
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const navigateToSection = (index) => {
        if (index >= 0 && index < totalSections) {
            currentSectionIndex = index;
            updateUI();
        }
    };
    
    const handleSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // Clear previous highlights
        document.querySelectorAll('mark.highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });

        if (!searchTerm) return;

        let firstMatch = null;
        
        contentSections.forEach(section => {
            const textElements = section.querySelectorAll('p, li, h3, h4');
            textElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    const regex = new RegExp(searchTerm, 'gi');
                    const newHTML = element.innerHTML.replace(regex, `<mark class="highlight">$&</mark>`);
                    element.innerHTML = newHTML;
                    if (!firstMatch) {
                        firstMatch = element;
                    }
                }
            });
        });

        if (firstMatch) {
            const section = firstMatch.closest('.content-section');
            const sectionId = section.id;
            const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
            if (navItem) {
                const index = Array.from(navItems).indexOf(navItem);
                navigateToSection(index);
                setTimeout(() => {
                    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            }
        }
    };


    // --- EVENT LISTENERS ---

    // Navigation items
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            navigateToSection(index);
        });
    });

    // Prev/Next buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigateToSection(currentSectionIndex - 1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigateToSection(currentSectionIndex + 1);
        });
    }

    // Expandable content buttons
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                button.classList.toggle('expanded');
                if (button.classList.contains('expanded')) {
                    targetSection.style.display = 'block';
                } else {
                    targetSection.style.display = 'none';
                }
            }
        });
    });
    
    // Search functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // --- INITIALIZATION ---
    updateUI();
});