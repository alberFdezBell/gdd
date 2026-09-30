/**
 * app.js
 * Controlador principal simplificado para GDD Studio Professional con Modales Personalizados
 */

const AppModule = {
    currentView: 'dashboard', // 'dashboard' | 'questionnaire' | 'preview'
    activeGdd: null,

    init() {
        const list = StorageService.getAllGdds();
        const activeId = StorageService.getActiveGddId();

        if (list.length > 0) {
            this.activeGdd = list.find(item => item.id === activeId) || list[0];
            StorageService.setActiveGddId(this.activeGdd.id);
            QuestionnaireModule.init(this.activeGdd, (updatedData) => this.onDataChanged(updatedData));
            PreviewModule.render(this.activeGdd);
        }

        this.bindEvents();
        this.renderDashboard();
        this.updateHeaderState();
        
        // Vista inicial por defecto
        this.switchView('dashboard');
    },

    bindEvents() {
        const importInput = document.getElementById('import-json-input');
        if (importInput) {
            importInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    StorageService.importFromJsonFile(e.target.files[0])
                        .then(importedGdd => {
                            StorageService.saveGdd(importedGdd);
                            this.activeGdd = importedGdd;
                            QuestionnaireModule.init(this.activeGdd, (updatedData) => this.onDataChanged(updatedData));
                            PreviewModule.render(this.activeGdd);
                            this.renderDashboard();
                            this.switchView('questionnaire');
                            ModalModule.alert("Importación Exitosa", `Se ha importado el GDD "${importedGdd.cover.title}" con éxito.`);
                        })
                        .catch(err => ModalModule.alert("Error de Importación", 'No se pudo importar el archivo JSON: ' + err.message));
                }
            });
        }
    },

    switchView(viewName) {
        if (!this.activeGdd && (viewName === 'questionnaire' || viewName === 'preview')) {
            this.createNewGdd();
            return;
        }

        this.currentView = viewName;

        document.getElementById('view-dashboard').style.display = 'none';
        document.getElementById('view-questionnaire').style.display = 'none';
        document.getElementById('view-preview').style.display = 'none';

        document.querySelectorAll('.app-nav-btn').forEach(btn => btn.classList.remove('active'));

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
        
        if (this.currentView === 'preview') {
            PreviewModule.render(this.activeGdd);
        }
    },

    updateHeaderState() {
        const titleEl = document.getElementById('header-active-title');
        const badgeEl = document.getElementById('header-completion-badge');
        const progressBarEl = document.getElementById('header-progress-bar');
        const gddActionsEl = document.getElementById('gdd-nav-actions');

        // Mostrar el grupo de acciones sólo cuando hay un GDD activo
        // y no estamos en el dashboard
        if (gddActionsEl) {
            const showActions = !!(this.activeGdd && this.currentView !== 'dashboard');
            gddActionsEl.style.display = showActions ? 'flex' : 'none';
        }

        if (!this.activeGdd) {
            if (titleEl) titleEl.textContent = "Sin GDD Seleccionado";
            if (badgeEl) {
                badgeEl.className = 'status-badge status-draft';
                badgeEl.textContent = 'Sin documento';
            }
            if (progressBarEl) progressBarEl.style.width = "0%";
            return;
        }

        const completion = calculateGddCompletion(this.activeGdd);

        if (titleEl) titleEl.textContent = this.activeGdd.cover.title || 'Sin Título';

        if (badgeEl) {
            if (completion === 100) {
                badgeEl.className = 'status-badge status-complete';
                badgeEl.textContent = 'Completado (100%)';
            } else {
                badgeEl.className = 'status-badge status-draft';
                badgeEl.textContent = `Borrador (${completion}%)`;
            }
        }

        if (progressBarEl) progressBarEl.style.width = `${completion}%`;
    },

    renderDashboard() {
        const gridContainer = document.getElementById('gdd-cards-grid');
        if (!gridContainer) return;

        const list = StorageService.getAllGdds();

        if (list.length === 0) {
            gridContainer.innerHTML = `
                <div class="empty-dashboard-card" onclick="AppModule.createNewGdd()">
                    <i class="fa-solid fa-file-circle-plus empty-card-icon icon-gray"></i>
                    <h3>Crear tu primer GDD</h3>
                    <p>No tienes ningún documento creado. Haz clic aquí para comenzar una plantilla limpia desde cero.</p>
                    <button class="btn btn-primary" style="margin-top: 14px;">
                        <i class="fa-solid fa-plus"></i> Crear Nuevo GDD
                    </button>
                </div>
            `;
            return;
        }

        let html = `
            <div class="gdd-card create-card" onclick="AppModule.createNewGdd()">
                <i class="fa-solid fa-plus create-card-icon icon-gray"></i>
                <h3>Crear Nuevo GDD</h3>
                <p>Comienza una plantilla limpia desde cero</p>
            </div>
        `;

        list.forEach(gdd => {
            const completion = calculateGddCompletion(gdd);
            const isCurrentActive = this.activeGdd && this.activeGdd.id === gdd.id;
            const updatedDate = new Date(gdd.updatedAt).toLocaleDateString('es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            });

            html += `
                <div class="gdd-card ${isCurrentActive ? 'is-active' : ''}">
                    <div class="card-top">
                        <div class="card-logo-thumb">
                            ${gdd.cover.logo ? `<img src="${gdd.cover.logo}" alt="Logo">` : '<i class="fa-solid fa-gamepad icon-gray"></i>'}
                        </div>
                        <div class="card-status">
                            ${completion === 100 ? '<span class="badge badge-success">Completado</span>' : `<span class="badge badge-warning">${completion}% Relleno</span>`}
                        </div>
                    </div>

                    <h3 class="card-title">${this.escapeHtml(gdd.cover.title || 'Sin título')}</h3>
                    <p class="card-studio"><i class="fa-solid fa-building icon-gray"></i> ${this.escapeHtml(gdd.cover.studio || 'Sin estudio')}</p>
                    <p class="card-date"><i class="fa-solid fa-clock icon-gray"></i> ${updatedDate}</p>

                    <div class="card-progress-outer">
                        <div class="card-progress-inner" style="width: ${completion}%"></div>
                    </div>

                    <div class="card-actions">
                        <button class="btn btn-sm btn-primary" onclick="AppModule.selectGdd('${gdd.id}', 'questionnaire')"><i class="fa-solid fa-pen"></i> Editar</button>
                        <button class="btn btn-sm btn-ghost" onclick="AppModule.selectGdd('${gdd.id}', 'preview')"><i class="fa-solid fa-eye icon-gray"></i> Ver</button>
                        <button class="btn btn-sm btn-ghost" title="Duplicar" onclick="AppModule.duplicateGdd('${gdd.id}')"><i class="fa-solid fa-copy icon-gray"></i></button>
                        <button class="btn btn-sm btn-ghost" title="Exportar JSON" onclick="AppModule.exportGddJson('${gdd.id}')"><i class="fa-solid fa-floppy-disk icon-gray"></i></button>
                        <button class="btn btn-sm btn-danger-ghost" title="Eliminar" onclick="AppModule.deleteGdd('${gdd.id}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        });

        gridContainer.innerHTML = html;
    },

    async createNewGdd() {
        const promptData = await ModalModule.createGddPrompt();
        if (!promptData) return;
        
        const newGdd = createEmptyGdd(promptData.title, promptData.studio);
        StorageService.saveGdd(newGdd);
        this.activeGdd = newGdd;
        QuestionnaireModule.init(this.activeGdd, (updatedData) => this.onDataChanged(updatedData));
        PreviewModule.render(this.activeGdd);
        this.switchView('questionnaire');
    },

    selectGdd(id, viewToSwitch = 'questionnaire') {
        const gdd = StorageService.getGddById(id);
        if (gdd) {
            this.activeGdd = gdd;
            StorageService.setActiveGddId(id);
            QuestionnaireModule.init(this.activeGdd, (updatedData) => this.onDataChanged(updatedData));
            PreviewModule.render(this.activeGdd);
            this.switchView(viewToSwitch);
        }
    },

    duplicateGdd(id) {
        const duplicated = StorageService.duplicateGdd(id);
        if (duplicated) {
            this.renderDashboard();
            ModalModule.alert("Copia Creada", `Se ha duplicado el documento: "${duplicated.cover.title}".`);
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

    async deleteGdd(id) {
        const gdd = StorageService.getGddById(id);
        if (!gdd) return;
        
        const confirmed = await ModalModule.confirm(
            "Eliminar GDD",
            `¿Estás seguro de que deseas eliminar permanentemente el GDD "${gdd.cover.title}"? Esta acción no se puede deshacer.`,
            "Eliminar Documento",
            true
        );

        if (confirmed) {
            StorageService.deleteGdd(id);
            const remaining = StorageService.getAllGdds();
            if (remaining.length > 0) {
                this.selectGdd(remaining[0].id, 'dashboard');
            } else {
                this.activeGdd = null;
                this.renderDashboard();
                this.updateHeaderState();
            }
        }
    },

    triggerImportJson() {
        const fileInput = document.getElementById('import-json-input');
        if (fileInput) fileInput.click();
    },

    exportActivePdf() {
        if (!this.activeGdd) return;
        PreviewModule.render(this.activeGdd);
        PreviewModule.exportPdf();
    },

    escapeHtml(str) {
        if (typeof str !== 'string') return str || '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AppModule.init();
});
