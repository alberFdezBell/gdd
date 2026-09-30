/**
 * app.js
 * Controlador principal de la aplicación GDD Studio Professional
 */

const AppModule = {
    currentView: 'dashboard', // 'dashboard' | 'questionnaire' | 'preview'
    activeGdd: null,

    init() {
        // Cargar el GDD activo o crear uno inicial si la lista está vacía
        const list = StorageService.getAllGdds();
        const activeId = StorageService.getActiveGddId();

        if (list.length === 0) {
            // Crear el primer GDD de ejemplo
            const defaultGdd = createEmptyGdd("Mi Primer Videojuego", "Mi Estudio Studio");
            StorageService.saveGdd(defaultGdd);
            this.activeGdd = defaultGdd;
        } else {
            this.activeGdd = list.find(item => item.id === activeId) || list[0];
            StorageService.setActiveGddId(this.activeGdd.id);
        }

        this.bindEvents();
        this.renderDashboard();
        this.updateHeaderState();

        // Iniciar el cuestionario y el renderizado
        QuestionnaireModule.init(this.activeGdd, (updatedData) => {
            this.onDataChanged(updatedData);
        });

        PreviewModule.render(this.activeGdd);
        
        // Vista por defecto
        this.switchView('dashboard');
    },

    bindEvents() {
        // Evento de importación JSON
        const importInput = document.getElementById('import-json-input');
        if (importInput) {
            importInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    StorageService.importFromJsonFile(e.target.files[0])
                        .then(importedGdd => {
                            StorageService.saveGdd(importedGdd);
                            this.activeGdd = importedGdd;
                            QuestionnaireModule.setGdd(this.activeGdd);
                            PreviewModule.render(this.activeGdd);
                            this.renderDashboard();
                            this.switchView('questionnaire');
                            alert('¡GDD importado con éxito!');
                        })
                        .catch(err => {
                            alert('Error al importar el archivo JSON: ' + err.message);
                        });
                }
            });
        }
    },

    switchView(viewName) {
        this.currentView = viewName;

        // Ocultar todas las vistas
        document.getElementById('view-dashboard').style.display = 'none';
        document.getElementById('view-questionnaire').style.display = 'none';
        document.getElementById('view-preview').style.display = 'none';

        // Desactivar estado activo en nav
        document.querySelectorAll('.app-nav-btn').forEach(btn => btn.classList.remove('active'));

        // Mostrar la vista seleccionada
        if (viewName === 'dashboard') {
            document.getElementById('view-dashboard').style.display = 'block';
            document.getElementById('nav-dashboard').classList.add('active');
            this.renderDashboard();
        } else if (viewName === 'questionnaire') {
            document.getElementById('view-questionnaire').style.display = 'grid';
            document.getElementById('nav-questionnaire').classList.add('active');
            QuestionnaireModule.renderCurrentStep();
        } else if (viewName === 'preview') {
            document.getElementById('view-preview').style.display = 'block';
            document.getElementById('nav-preview').classList.add('active');
            PreviewModule.render(this.activeGdd);
        }

        this.updateHeaderState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    onDataChanged(updatedGdd) {
        this.activeGdd = updatedGdd;
        StorageService.saveGdd(this.activeGdd);
        this.updateHeaderState();
        
        // Si la vista previa está visible, actualizarla dinámicamente
        if (this.currentView === 'preview') {
            PreviewModule.render(this.activeGdd);
        }
    },

    updateHeaderState() {
        if (!this.activeGdd) return;

        const titleEl = document.getElementById('header-active-title');
        const badgeEl = document.getElementById('header-completion-badge');
        const progressBarEl = document.getElementById('header-progress-bar');

        const completion = calculateGddCompletion(this.activeGdd);

        if (titleEl) {
            titleEl.textContent = this.activeGdd.cover.title || 'Sin Título';
        }

        if (badgeEl) {
            if (completion === 100) {
                badgeEl.className = 'status-badge status-complete';
                badgeEl.textContent = '✅ Completado (100%)';
            } else {
                badgeEl.className = 'status-badge status-draft';
                badgeEl.textContent = `📝 Borrador (${completion}% completado)`;
            }
        }

        if (progressBarEl) {
            progressBarEl.style.width = `${completion}%`;
        }
    },

    renderDashboard() {
        const gridContainer = document.getElementById('gdd-cards-grid');
        if (!gridContainer) return;

        const list = StorageService.getAllGdds();

        let html = `
            <!-- Card para Crear Nuevo GDD -->
            <div class="gdd-card create-card" onclick="AppModule.createNewGdd()">
                <div class="create-card-icon">➕</div>
                <h3>Crear Nuevo GDD</h3>
                <p>Comienza una plantilla profesional desde cero</p>
            </div>
        `;

        list.forEach(gdd => {
            const completion = calculateGddCompletion(gdd);
            const isCurrentActive = this.activeGdd && this.activeGdd.id === gdd.id;
            const updatedDate = new Date(gdd.updatedAt).toLocaleDateString('es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            html += `
                <div class="gdd-card ${isCurrentActive ? 'is-active' : ''}">
                    <div class="card-top">
                        <div class="card-logo-thumb">
                            ${gdd.cover.logo ? `<img src="${gdd.cover.logo}" alt="Logo">` : '🎮'}
                        </div>
                        <div class="card-status">
                            ${completion === 100 ? '<span class="badge badge-success">Completado</span>' : `<span class="badge badge-warning">${completion}% Relleno</span>`}
                        </div>
                    </div>

                    <h3 class="card-title">${this.escapeHtml(gdd.cover.title || 'Sin título')}</h3>
                    <p class="card-studio">🏢 ${this.escapeHtml(gdd.cover.studio || 'Sin estudio')}</p>
                    <p class="card-date">🕒 Modificado: ${updatedDate}</p>

                    <div class="card-progress-outer">
                        <div class="card-progress-inner" style="width: ${completion}%"></div>
                    </div>

                    <div class="card-actions">
                        <button class="btn btn-sm btn-primary" onclick="AppModule.selectGdd('${gdd.id}', 'questionnaire')">✏️ Editar</button>
                        <button class="btn btn-sm btn-ghost" onclick="AppModule.selectGdd('${gdd.id}', 'preview')">👁️ Ver</button>
                        <button class="btn btn-sm btn-ghost" title="Duplicar" onclick="AppModule.duplicateGdd('${gdd.id}')">📋</button>
                        <button class="btn btn-sm btn-ghost" title="Exportar JSON" onclick="AppModule.exportGddJson('${gdd.id}')">💾</button>
                        <button class="btn btn-sm btn-danger-ghost" title="Eliminar" onclick="AppModule.deleteGdd('${gdd.id}')">🗑️</button>
                    </div>
                </div>
            `;
        });

        gridContainer.innerHTML = html;
    },

    createNewGdd() {
        const name = prompt("Escribe el nombre de tu nuevo videojuego:", "Nuevo Proyecto");
        if (name === null) return; // Cancelado
        const studio = prompt("Escribe el nombre de tu estudio o equipo:", "Mi Estudio");
        
        const newGdd = createEmptyGdd(name || "Nuevo Proyecto", studio || "Mi Estudio");
        StorageService.saveGdd(newGdd);
        this.activeGdd = newGdd;
        QuestionnaireModule.setGdd(this.activeGdd);
        PreviewModule.render(this.activeGdd);
        this.switchView('questionnaire');
    },

    selectGdd(id, viewToSwitch = 'questionnaire') {
        const gdd = StorageService.getGddById(id);
        if (gdd) {
            this.activeGdd = gdd;
            StorageService.setActiveGddId(id);
            QuestionnaireModule.setGdd(this.activeGdd);
            PreviewModule.render(this.activeGdd);
            this.switchView(viewToSwitch);
        }
    },

    duplicateGdd(id) {
        const duplicated = StorageService.duplicateGdd(id);
        if (duplicated) {
            this.renderDashboard();
            alert(`Se ha creado una copia: "${duplicated.cover.title}"`);
        }
    },

    exportGddJson(id) {
        const gdd = StorageService.getGddById(id);
        if (gdd) {
            StorageService.exportToJson(gdd);
        }
    },

    exportActiveGddJson() {
        if (this.activeGdd) {
            StorageService.exportToJson(this.activeGdd);
        }
    },

    deleteGdd(id) {
        const gdd = StorageService.getGddById(id);
        if (!gdd) return;
        if (confirm(`¿Estás seguro de que deseas eliminar el GDD "${gdd.cover.title}"? Esta acción no se puede deshacer.`)) {
            StorageService.deleteGdd(id);
            const remaining = StorageService.getAllGdds();
            if (remaining.length > 0) {
                this.selectGdd(remaining[0].id, 'dashboard');
            } else {
                this.createNewGdd();
            }
            this.renderDashboard();
        }
    },

    triggerImportJson() {
        const fileInput = document.getElementById('import-json-input');
        if (fileInput) fileInput.click();
    },

    exportActivePdf() {
        PreviewModule.render(this.activeGdd);
        PreviewModule.exportPdf();
    },

    escapeHtml(str) {
        if (typeof str !== 'string') return str || '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
};

// Iniciar aplicación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    AppModule.init();
});
