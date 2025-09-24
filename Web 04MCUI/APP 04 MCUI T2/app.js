document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const navContainer = document.querySelector('.nav-container');
    const contentSections = document.querySelectorAll('.content-section');
    const progressFill = document.getElementById('progressFill');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const expandButtons = document.querySelectorAll('.expand-btn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const mainContent = document.querySelector('.main-content');
    
    // Convertir NodeList a Array para usar findIndex y otros métodos de array
    const navItems = Array.from(document.querySelectorAll('.nav-item'));
    const totalSections = navItems.length;

    /**
     * Muestra una sección y actualiza todos los elementos de la UI.
     * @param {string} sectionId - El ID de la sección a mostrar (ej. "seccion1").
     * @param {boolean} [scroll=true] - Controla si la página debe hacer scroll.
     */
    function showSection(sectionId, scroll = true) {
        const activeIndex = navItems.findIndex(item => item.getAttribute('data-section') === sectionId);

        if (activeIndex === -1) {
            console.error(`Error: No se encontró la sección con el id: ${sectionId}`);
            return;
        }

        // Actualizar botones de navegación
        navItems.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
        });

        // Actualizar visibilidad de las secciones
        contentSections.forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });

        // Actualizar barra de progreso
        if (progressFill) {
            const progressPercentage = ((activeIndex + 1) / totalSections) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        // Actualizar botones Anterior/Siguiente
        if (prevBtn) prevBtn.disabled = activeIndex === 0;
        if (nextBtn) nextBtn.disabled = activeIndex === totalSections - 1;

        // Hacer scroll si es necesario
        if (scroll && mainContent) {
            window.scrollTo({
                top: mainContent.offsetTop - 30, // Pequeño margen
                behavior: 'smooth'
            });
        }
    }

    // --- ASIGNACIÓN DE EVENTOS ---

    // Navegación principal (usando delegación de eventos para más eficiencia)
    if (navContainer) {
        navContainer.addEventListener('click', (e) => {
            const navButton = e.target.closest('.nav-item');
            if (navButton) {
                const sectionId = navButton.getAttribute('data-section');
                showSection(sectionId);
            }
        });
    }

    // Botones Anterior/Siguiente
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const currentActiveIndex = navItems.findIndex(item => item.classList.contains('active'));
            if (currentActiveIndex > 0) {
                const prevSectionId = navItems[currentActiveIndex - 1].getAttribute('data-section');
                showSection(prevSectionId);
            }
        });

        nextBtn.addEventListener('click', () => {
            const currentActiveIndex = navItems.findIndex(item => item.classList.contains('active'));
            if (currentActiveIndex < totalSections - 1) {
                const nextSectionId = navItems[currentActiveIndex + 1].getAttribute('data-section');
                showSection(nextSectionId);
            }
        });
    }

    // Botones desplegables
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                button.classList.toggle('expanded');
                targetSection.style.display = button.classList.contains('expanded') ? 'block' : 'none';
            }
        });
    });

    // Búsqueda
    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // Limpiar resaltados anteriores de forma segura
        document.querySelectorAll('mark.highlight').forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent), el);
                parent.normalize(); // Une nodos de texto adyacentes
            }
        });

        if (!searchTerm) return;

        let firstMatch = null;
        
        contentSections.forEach((section, sectionIndex) => {
            const textElements = section.querySelectorAll('p, li, h3, h4, td');
            textElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                if (text.includes(searchTerm) && !firstMatch) {
                     firstMatch = { element, sectionId: section.id };
                }
            });
        });

        if (firstMatch) {
            showSection(firstMatch.sectionId, false);
            setTimeout(() => {
                // Re-hacer la búsqueda solo en la sección activa para resaltar
                const activeSection = document.getElementById(firstMatch.sectionId);
                const textElements = activeSection.querySelectorAll('p, li, h3, h4, td');
                let elementToScrollTo = null;

                textElements.forEach(element => {
                    if (element.textContent.toLowerCase().includes(searchTerm)) {
                        const regex = new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
                        
                        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
                        let node;
                        const nodesToReplace = [];
                        while(node = walker.nextNode()) {
                            if (node.textContent.toLowerCase().includes(searchTerm)) {
                               nodesToReplace.push(node);
                            }
                        }
                        
                        nodesToReplace.forEach(textNode => {
                             const parent = textNode.parentNode;
                             if(parent && parent.tagName !== 'MARK'){
                                const newHtml = textNode.textContent.replace(regex, `<mark class="highlight">$&</mark>`);
                                const newFragment = document.createRange().createContextualFragment(newHtml);
                                parent.replaceChild(newFragment, textNode);
                                 if (!elementToScrollTo) {
                                    elementToScrollTo = parent.querySelector('mark.highlight');
                                }
                             }
                        });
                    }
                });

                if (elementToScrollTo) {
                    elementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

            }, 150); // Ligero aumento del retardo para asegurar renderizado
        }
    }
    
    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(); });

    // --- INICIALIZACIÓN ---
    showSection('seccion1', false); // Cargar la primera sección sin hacer scroll

});