// Global variables
let currentSection = 1;
const totalSections = 7;
let searchTimeout;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing application...');
    
    // Wait a moment for DOM to be fully ready
    setTimeout(() => {
        initializeNavigation();
        initializeExpandableSections();
        initializeSearch();
        initializeNavigationControls();
        updateNavigationButtons();
        createProgressBar();
        
        // Handle initial URL hash
        handleInitialHash();
        
        console.log('Application initialized successfully');
    }, 100);
});

// Navigation functionality
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    
    console.log(`Found ${navButtons.length} nav buttons and ${sections.length} sections`);
    
    navButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionNumber = parseInt(this.getAttribute('data-section'));
            console.log(`Navigation button clicked: Section ${sectionNumber}`);
            navigateToSection(sectionNumber);
        });
    });
}

function navigateToSection(sectionNumber) {
    console.log(`Navigating to section ${sectionNumber}`);
    
    if (sectionNumber < 1 || sectionNumber > totalSections) {
        console.log(`Invalid section number: ${sectionNumber}`);
        return;
    }
    
    try {
        const sections = document.querySelectorAll('.content-section');
        const navButtons = document.querySelectorAll('.nav-btn');
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Remove active class from all nav buttons
        navButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(`section-${sectionNumber}`);
        const targetNavButton = document.querySelector(`[data-section="${sectionNumber}"]`);
        
        if (targetSection && targetNavButton) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
            targetNavButton.classList.add('active');
            currentSection = sectionNumber;
            
            console.log(`Successfully navigated to section ${sectionNumber}`);
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            updateNavigationButtons();
            updateProgressBar();
            
            // Update URL hash
            window.history.pushState(null, null, `#section-${sectionNumber}`);
            
            // Clear any existing search highlights
            clearSearchHighlights();
            
            // Announce page change for accessibility
            announcePageChange(sectionNumber);
        } else {
            console.error(`Could not find section or nav button for section ${sectionNumber}`);
        }
    } catch (error) {
        console.error('Error navigating to section:', error);
        handleError(error, 'navigation');
    }
}

// Expandable sections functionality
function initializeExpandableSections() {
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    console.log(`Found ${expandButtons.length} expandable buttons`);
    
    expandButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            console.log(`Expand button clicked for target: ${targetId}`);
            
            if (!targetId) {
                console.error('No data-target attribute found on expand button');
                return;
            }
            
            const targetContent = document.getElementById(targetId);
            const expandIcon = this.querySelector('.expand-icon');
            
            if (targetContent && expandIcon) {
                const isExpanded = targetContent.classList.contains('expanded');
                
                if (isExpanded) {
                    // Collapse
                    targetContent.classList.remove('expanded');
                    this.classList.remove('expanded');
                    targetContent.style.maxHeight = '0';
                    targetContent.style.paddingTop = '0';
                    expandIcon.style.transform = 'rotate(0deg)';
                    console.log(`Collapsed section: ${targetId}`);
                } else {
                    // Expand
                    targetContent.classList.add('expanded');
                    this.classList.add('expanded');
                    targetContent.style.maxHeight = 'none';
                    targetContent.style.paddingTop = 'var(--space-16)';
                    expandIcon.style.transform = 'rotate(180deg)';
                    console.log(`Expanded section: ${targetId}`);
                    
                    // Smooth scroll to the expanded content
                    setTimeout(() => {
                        const rect = this.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const targetTop = rect.top + scrollTop - 100;
                        
                        window.scrollTo({
                            top: targetTop,
                            behavior: 'smooth'
                        });
                    }, 150);
                }
            } else {
                console.error(`Could not find target content or expand icon for: ${targetId}`);
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    
    console.log('Initializing search functionality');
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value.trim());
        }, 300);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value.trim());
        }
    });
}

function performSearch(searchTerm) {
    console.log(`Performing search for: "${searchTerm}"`);
    
    if (!searchTerm) {
        clearSearchHighlights();
        return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    let foundResults = [];
    const sections = document.querySelectorAll('.content-section');
    
    // Search through all sections
    sections.forEach((section, sectionIndex) => {
        const sectionNumber = sectionIndex + 1;
        const textContent = section.textContent.toLowerCase();
        
        if (textContent.includes(searchTermLower)) {
            foundResults.push({
                section: sectionNumber,
                element: section
            });
        }
    });
    
    console.log(`Found ${foundResults.length} search results`);
    
    if (foundResults.length > 0) {
        // Navigate to first result
        navigateToSection(foundResults[0].section);
        
        // Highlight search terms after navigation
        setTimeout(() => {
            highlightSearchTerms(searchTerm);
        }, 200);
        
        // Show search results count
        showSearchResults(foundResults.length, searchTerm);
    } else {
        showNoResults(searchTerm);
    }
}

function highlightSearchTerms(searchTerm) {
    clearSearchHighlights();
    
    const currentSectionElement = document.getElementById(`section-${currentSection}`);
    if (!currentSectionElement) return;
    
    const walker = document.createTreeWalker(
        currentSectionElement,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        if (node.nodeValue.toLowerCase().includes(searchTerm.toLowerCase())) {
            textNodes.push(node);
        }
    }
    
    textNodes.forEach(textNode => {
        const parent = textNode.parentNode;
        if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;
        
        const text = textNode.nodeValue;
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
        
        if (highlightedText !== text) {
            const span = document.createElement('span');
            span.innerHTML = highlightedText;
            parent.replaceChild(span, textNode);
        }
    });
}

function clearSearchHighlights() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        if (parent) {
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        }
    });
}

function showSearchResults(count, term) {
    showNotification(`Encontrados ${count} resultado${count !== 1 ? 's' : ''} para "${term}"`, 'success');
}

function showNoResults(term) {
    showNotification(`No se encontraron resultados para "${term}"`, 'warning');
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.getElementById('search-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'search-notification';
    notification.textContent = message;
    
    const bgColor = type === 'success' ? 'var(--color-success)' : 
                   type === 'warning' ? 'var(--color-warning)' : 
                   'var(--color-info)';
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${bgColor};
        color: var(--color-btn-primary-text);
        padding: var(--space-8) var(--space-12);
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-md);
        z-index: 1000;
        font-size: var(--font-size-sm);
        max-width: 300px;
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        if (notification) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Navigation controls functionality
function initializeNavigationControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!prevBtn || !nextBtn) {
        console.error('Navigation buttons not found');
        return;
    }
    
    console.log('Initializing navigation controls');
    
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Previous button clicked');
        if (currentSection > 1) {
            navigateToSection(currentSection - 1);
        }
    });
    
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Next button clicked');
        if (currentSection < totalSections) {
            navigateToSection(currentSection + 1);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Only handle navigation if not in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (currentSection > 1) {
                    navigateToSection(currentSection - 1);
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (currentSection < totalSections) {
                    navigateToSection(currentSection + 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                navigateToSection(1);
                break;
            case 'End':
                e.preventDefault();
                navigateToSection(totalSections);
                break;
            case 'Escape':
                e.preventDefault();
                clearSearchHighlights();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.blur();
                }
                break;
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!prevBtn || !nextBtn) return;
    
    // Update previous button
    if (currentSection <= 1) {
        prevBtn.disabled = true;
        prevBtn.classList.add('btn--disabled');
    } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove('btn--disabled');
    }
    
    // Update next button
    if (currentSection >= totalSections) {
        nextBtn.disabled = true;
        nextBtn.classList.add('btn--disabled');
        nextBtn.innerHTML = 'Fin del Tema';
    } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('btn--disabled');
        nextBtn.innerHTML = 'Siguiente →';
    }
    
    console.log(`Updated navigation buttons for section ${currentSection}`);
}

// Progress bar functionality
function createProgressBar() {
    const existingProgress = document.getElementById('progress-container');
    if (existingProgress) return;
    
    const progressContainer = document.createElement('div');
    progressContainer.id = 'progress-container';
    progressContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--color-border);
        z-index: 1001;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.cssText = `
        height: 100%;
        background: var(--color-primary);
        width: ${(currentSection / totalSections) * 100}%;
        transition: width var(--duration-normal) var(--ease-standard);
    `;
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    console.log('Progress bar created');
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${(currentSection / totalSections) * 100}%`;
    }
}

// Handle browser navigation
function handleInitialHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#section-')) {
        const sectionNumber = parseInt(hash.replace('#section-', ''));
        if (sectionNumber >= 1 && sectionNumber <= totalSections) {
            navigateToSection(sectionNumber);
        }
    }
}

window.addEventListener('popstate', function(e) {
    handleInitialHash();
});

// Accessibility functions
function announcePageChange(sectionNumber) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Navegando a la sección ${sectionNumber}`;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

// Error handling
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    showNotification(`Ha ocurrido un error en ${context}. Por favor, recarga la página.`, 'warning');
}

// Add required CSS dynamically
function addRequiredStyles() {
    const styles = `
        .search-highlight {
            background: var(--color-warning);
            color: var(--color-text);
            padding: 2px 4px;
            border-radius: var(--radius-sm);
            font-weight: var(--font-weight-bold);
        }
        
        .btn--disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .btn--disabled:hover {
            background: var(--color-secondary);
            transform: none;
        }
        
        .content-section {
            display: none;
        }
        
        .content-section.active {
            display: block;
            animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
            from { 
                opacity: 0; 
                transform: translateY(20px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        .expandable-content {
            max-height: 0;
            overflow: hidden;
            padding-top: 0;
            transition: all 0.3s ease;
        }
        
        .expandable-content.expanded {
            max-height: none;
            padding-top: var(--space-16);
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// Initialize styles immediately
addRequiredStyles();

console.log('JavaScript file loaded successfully');