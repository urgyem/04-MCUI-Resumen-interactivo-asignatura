#  - RCS-ACLS: Registro de casos de simulación de soporte vital cardiovascular avanzado

Aplicación web interactiva diseñada para registrar y analizar las intervenciones realizadas durante simulaciones de reanimación avanzada (ACLS).  
Creada por **Elena Plaza Moreno – Urgencias y Emergencias®**  
🔗 [www.urgenciasyemergen.com](https://www.urgenciasyemergen.com)

---

## 🧩 Descripción

Esta aplicación permite **registrar cronológicamente las acciones** realizadas durante un caso de simulación clínica (ACLS) y generar informes automáticos.  
Está optimizada para su uso en **formación en emergencias, reanimación y cuidados críticos**. 
Responde a la necesidad de un registro de acciones con anotación de tiempo para poder realizar un debrifing estructurado en casos en los que se dispone de maniquíes de baja fidelidad que no registran acciones.

Los datos se almacenan localmente en el navegador del usuario (no se requiere servidor) y pueden **exportarse o importarse** en formato JSON para conservar el historial de casos.

---

## ⚙️ Funcionalidades principales

- **Formulario inicial:** registro de datos del caso (fecha, grupo, centro, curso, briefing, etc.).
  <img width="1084" height="361" alt="image" src="https://github.com/user-attachments/assets/ad322268-982a-4372-b759-7ea637686c85" />

- **Cronómetros sincronizados:**
  - Tiempo total del caso.
  - Tiempo de PCR.
  <img width="1084" height="433" alt="image" src="https://github.com/user-attachments/assets/a87566db-aa41-48fb-9d93-5926ff99376d" />

- **Registro de acciones con marca temporal:** desfibrilación, vía aérea, adrenalina, amiodarona, etc.
- **Acciones adicionales:** cardioversión, marcapasos, adenosina, atropina, etc.
- **Observaciones cualitativas** del instructor.
  <img width="1048" height="920" alt="image" src="https://github.com/user-attachments/assets/fc82f673-84c6-4ffb-b3ef-1ce62f9aea1d" />
- **Generación automática de informe** con todos los eventos y tiempos.
- **Histórico de informes** consultable y eliminable.
- **Importación y exportación JSON** para copia de seguridad.
- **Modo seguro:** bloqueo de clic derecho y selección de texto para evitar duplicación o copia de código no autorizada.
<img width="812" height="912" alt="image" src="https://github.com/user-attachments/assets/ae52f91f-2b38-4c0f-9cf2-5af4bc1abf2b" />

---

## 🧠 Instrucciones de uso

1. Completa los datos del formulario principal.  
2. Pulsa **▶️ Iniciar caso** para comenzar el cronómetro general.  
3. Pulsa **🤍 Inicio PCR** cuando empiece la parada cardiorrespiratoria.  
4. Usa los botones de acción para registrar cada intervención.  
5. Añade observaciones al final si lo deseas.  
6. Al finalizar, pulsa **Finalizar caso** para ver el informe.  
7. Guarda o descarta el caso.  
8. Desde el histórico puedes exportar todos los informes en formato JSON o importarlos nuevamente.

> 💾 **Nota:** los informes se guardan localmente en tu navegador. Si borras la caché o usas otro dispositivo, perderás los registros a menos que los exportes antes.

---

## 🛠️ Tecnologías utilizadas

- **HTML5 + TailwindCSS** (interfaz responsiva)
- **JavaScript puro (Vanilla JS)** para la lógica de cronómetros, eventos y almacenamiento local
- **LocalStorage API** para persistencia de datos en el navegador

---

## 🧾 Licencia

Proyecto distribuido bajo la licencia MIT.
© 2025 Elena Plaza Moreno – Urgencias y Emergencias®

---

## 💡 Créditos

Desarrollado por Elena Plaza Moreno, docente y enfermera especializada en urgencias, emergencias y cuidados críticos.
Inspirado en la necesidad de contar con herramientas docentes digitales que mejoren la precisión, evaluación y retroalimentación en simulaciones clínicas.
