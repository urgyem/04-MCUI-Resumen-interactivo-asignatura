document.addEventListener('DOMContentLoaded', function() {
    
    const botones = document.querySelectorAll('.boton-proyecto');
    const visorWeb = document.getElementById('visor-web');
    
    // Función para cargar la página de inicio por defecto
    function cargarInicioPorDefecto() {
        const botonInicio = document.querySelector('button[data-src="inicio.html"]');
        if (botonInicio) {
            const urlInicio = botonInicio.getAttribute('data-src');
            visorWeb.src = urlInicio;
            // Marca el botón de inicio como activo
            botonInicio.classList.add('activo');
        }
    }

    // Llama a la función cuando la página cargue
    cargarInicioPorDefecto();

    // El resto del código sigue igual
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            // Obtener la ruta de la web desde el atributo data-src del botón
            const urlWeb = this.getAttribute('data-src');
            
            // Asignar esa ruta al iframe para que la cargue
            visorWeb.src = urlWeb;

            // Gestionar la clase 'activo' para resaltar el botón presionado
            botones.forEach(btn => btn.classList.remove('activo'));
            this.classList.add('activo');
        });
    });

});