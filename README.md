# 🎮 GDD Studio Professional - Gestor y Cuestionario de GDDs

Plataforma web ligera y profesional para crear, gestionar, rellenar y exportar **Game Design Documents (GDD)** de videojuegos. Esta aplicación toma como base la **Plantilla GDD Profesional** y la convierte en un cuestionario interactivo, visual e intuitivo que genera documentos "vivos" y listos para exportar a PDF con formato corporativo e impecable.

---

## 🌟 Características Principales

- 📝 **Cuestionario Interactivo por Pasos (Wizard):** Organizado en 17 secciones oficiales (Portada, Resumen Ejecutivo, Gameplay, Sistemas, Niveles, Narrativa, Arte, Audio, Técnico, Monetización, QA, Riesgos, etc.).
- 🏢 **Imagen del Estudio / Equipo en Portada:** En el Paso 0 puedes subir o arrastrar la imagen/logo de tu estudio o equipo, la cual se mostrará exactamente en el cuadro de *Confidencialidad / Notas* de la primera página del GDD.
- 🔄 **Documento Vivo y Salto de Pasos:** Puedes saltarte campos o secciones y completarlos más adelante. Puedes visualizar el documento completo o exportarlo a PDF en cualquier momento aunque no esté relleno al 100%.
- 📊 **Indicador de Estado:** La aplicación calcula automáticamente el porcentaje de completitud de tu GDD y marca si está en estado *Borrador* o *Completado*.
- 🖨️ **Exportación e Impresión a PDF Profesional:**
  - Paginación limpia sin texto cortado entre páginas (`page-break-inside: avoid`).
  - Encabezado superior derecho en todas las páginas: `[Nombre del Videojuego] - GDD`.
  - Portada ejecutiva elegante con logo del estudio y metadatos.
- 💾 **Gestión de Múltiples GDDs y Almacenamiento Local:** Permite crear varios GDDs, editarlos, duplicarlos, eliminarlos, o importar y exportar copias de seguridad en formato JSON sin necesidad de bases de datos complejas.
- ⚡ **Sin Frameworks (Vanilla Web):** Desarrollado con HTML5, CSS3 y JavaScript vanilla, limpio, separado por archivos y altamente optimizado.

---

## 🔄 Flujo de Trabajo para Realizar Cambios

Sigue estos pasos cada vez que quieras realizar modificaciones o añadir mejoras a la web:

1. **Descargar el código del repositorio:**
   ```bash
   git clone https://github.com/alberFdezBell/gdd.git
   cd gdd
   ```

2. **Hacer los cambios deseados:**
   Modifica los archivos HTML, CSS o JS según tus necesidades (por ejemplo en `css/styles.css`, `js/questionnaire.js`, etc.).

3. **Abrir servidor local y probar en localhost:**
   Puedes usar cualquiera de estas opciones simples en la carpeta del proyecto:
   - Con Python:
     ```bash
     python -m http.server 9095
     ```
   - Con la extensión **Live Server** de VS Code.
   - Con Docker local:
     ```bash
     docker compose up --build
     ```

4. **Probar en el navegador:**
   Abre [http://localhost:9095](http://localhost:9095) en tu navegador y verifica que los cambios funcionen correctamente.

5. **Subir los cambios a GitHub:**
   ```bash
   git add .
   git commit -m "Descripción de los cambios realizados"
   git push origin main
   ```

6. **Desplegar los cambios en Portainer:**
   Entra en tu panel de Portainer, ve a tu **Stack** o **Contenedor** y haz clic en **Pull and redeploy** (o **Re-deploy**) para aplicar la última versión del repositorio.

---

## 🚀 Primer Despliegue en Portainer (Paso a Paso)

Para desplegar la aplicación en Portainer escuchando en el puerto **9095**:

### Opción A: Despliegue mediante Stack (Recomendado)

1. Entra a tu panel web de **Portainer**.
2. En el menú lateral, selecciona tu entorno (ej. **local**) y ve a **Stacks** -> **Add stack**.
3. Ponle un nombre al Stack (ej. `gdd-app`).
4. En el método de compilación, elige **Repository**:
   - **Repository URL:** `https://github.com/alberFdezBell/gdd`
   - **Repository reference:** `refs/heads/main`
   - **Compose path:** `docker-compose.yml`
5. (Opcional) Activa la casilla **Automatic updates** si deseas despliegue continuo al hacer push en GitHub.
6. Haz clic en el botón **Deploy the stack**.
7. ¡Listo! Abre tu navegador en **`http://localhost:9095`** para acceder a tu gestor de GDDs.

### Opción B: Despliegue usando Dockerfile

1. En Portainer, ve a **Stacks** -> **Add stack**.
2. Selecciona **Web editor** y pega el contenido del archivo `docker-compose.yml`:
   ```yaml
   version: '3.8'
   services:
     gdd-web:
       build: https://github.com/alberFdezBell/gdd.git#main
       container_name: gdd_web_app
       ports:
         - "9095:9095"
       restart: always
   ```
3. Haz clic en **Deploy the stack**.

---

## 📁 Estructura del Proyecto

```
gdd/
├── index.html              # Estructura principal HTML5
├── css/
│   ├── main.css            # Estilos base, topbar, dashboard y botones
│   ├── questionnaire.css   # Estilos del wizard, inputs y tablas dinámicas
│   ├── preview.css         # Estilos de renderizado del documento en pantalla
│   └── print.css           # Estilos de impresión y PDF (@media print)
├── js/
│   ├── template-data.js    # Esquema de datos predeterminado y utilidades
│   ├── storage.js          # Gestión de localStorage e importación/exportación JSON
│   ├── questionnaire.js    # Lógica del formulario/wizard e imágenes
│   ├── preview.js          # Renderizado dinámico del GDD estilo documento profesional
│   └── app.js              # Controlador global y cambio de vistas
├── Dockerfile              # Configuración de Docker con Nginx
├── docker-compose.yml      # Mapeo de puertos (9095:9095)
├── nginx.conf              # Configuración del servidor web Nginx
├── .gitignore              # Archivos ignorados por Git
├── Plantilla_GDD_Profesional.docx # Plantilla base original
└── README.md               # Documentación e instrucciones
```
