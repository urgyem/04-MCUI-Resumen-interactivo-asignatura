document.addEventListener('DOMContentLoaded', function() {
    const sections = ['introduccion', 'registros', 'resistencia', 'neumonia', 'itu', 'bacteriemia', 'higiene'];
    let currentSectionIndex = 0;
    
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const progressFill = document.getElementById('progressFill');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function init() {
        setupNavigation();
        setupNavigationButtons();
        setupSearch();
        setupExpandableContent();
        showSection(0);
    }
    
    function setupNavigation() {
        navItems.forEach((navItem, index) => {
            navItem.addEventListener('click', () => {
                showSection(index);
            });
        });
    }
    
    function showSection(index) {
        if (index < 0 || index >= sections.length) return;
        currentSectionIndex = index;

        navItems.forEach((item, idx) => {
            item.classList.toggle('active', idx === index);
        });
        
        contentSections.forEach((section, idx) => {
            section.classList.toggle('active', idx === index);
        });
        
        updateProgressBar();
        updateNavigationButtons();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function updateProgressBar() {
        const progressPercent = ((currentSectionIndex + 1) / sections.length) * 100;
        progressFill.style.width = progressPercent + '%';
    }
    
    function setupNavigationButtons() {
        prevBtn.addEventListener('click', () => {
            if (currentSectionIndex > 0) {
                showSection(currentSectionIndex - 1);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentSectionIndex < sections.length - 1) {
                showSection(currentSectionIndex + 1);
            }
        });
    }
    
    function updateNavigationButtons() {
        prevBtn.disabled = currentSectionIndex === 0;
        nextBtn.disabled = currentSectionIndex === sections.length - 1;
        prevBtn.textContent = '← Anterior';
        nextBtn.textContent = 'Siguiente →';
    }
    
    function setupSearch() {
        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            clearSearchResults();
            if (searchTerm === '') return;
            
            const results = searchContent(searchTerm);
            displaySearchResults(results, searchTerm);
        };
        
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
    
    function searchContent(searchTerm) {
        const results = [];
        contentSections.forEach((section, sectionIndex) => {
            const textContent = section.textContent.toLowerCase();
            if (textContent.includes(searchTerm)) {
                const elements = section.querySelectorAll('p, h3, h4, li');
                elements.forEach(element => {
                    if (element.textContent.toLowerCase().includes(searchTerm)) {
                        results.push({ sectionIndex, element });
                    }
                });
            }
        });
        return results;
    }
    
    function displaySearchResults(results, searchTerm) {
        if (results.length === 0) {
            showNoResultsMessage(searchTerm);
            return;
        }
        
        results.forEach(result => {
            highlightText(result.element, searchTerm);
        });
        
        showSection(results[0].sectionIndex);
        setTimeout(() => {
            results[0].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
    
    function clearSearchResults() {
        document.querySelectorAll('.search-highlight').forEach(element => {
            const parent = element.parentNode;
            parent.replaceChild(document.createTextNode(element.textContent), element);
            parent.normalize();
        });
    }
    
    function highlightText(element, searchTerm) {
        const text = element.innerHTML;
        const regex = new RegExp(`(?<!<[^>]*)${searchTerm}(?![^<]*>)`, 'gi');
        element.innerHTML = text.replace(regex, '<span class="search-highlight">$&</span>');
    }

    function showNoResultsMessage(searchTerm) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 20px; border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 1000;
            text-align: center; border: 2px solid #F15418;
        `;
        message.innerHTML = `<p>No se encontraron resultados para "<strong>${searchTerm}</strong>"</p>`;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }
    
    function setupExpandableContent() {
        const expandButtons = document.querySelectorAll('.expand-btn');
        expandButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const isExpanded = targetElement.classList.contains('expanded');
                    
                    // Alternar clase en botón y contenido
                    button.classList.toggle('expanded', !isExpanded);
                    targetElement.classList.toggle('expanded', !isExpanded);
                    
                    // Actualizar texto del botón
                    if (!isExpanded) {
                        button.textContent = button.textContent.replace('Ver', 'Ocultar');
                    } else {
                        button.textContent = button.textContent.replace('Ocultar', 'Ver');
                    }
                }
            });
        });
    }

    function addSearchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-highlight {
                background-color: #F15418; /* Naranja */
                color: white;
                padding: 2px 4px;
                border-radius: 3px;
            }
        `;
        document.head.appendChild(style);
    }
    
    addSearchStyles();
    init();
});