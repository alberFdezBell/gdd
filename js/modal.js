/**
 * modal.js
 * Modales personalizados estilizados en sustitución de alert(), confirm() y prompt()
 */

const ModalModule = {
    overlayEl: null,

    init() {
        if (document.getElementById('custom-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'custom-modal-overlay';
        overlay.className = 'modal-overlay';
        overlay.style.display = 'none';
        overlay.innerHTML = `
            <div class="modal-card" id="custom-modal-card">
                <div class="modal-header">
                    <h3 id="modal-title">Título</h3>
                    <button class="modal-close-btn" id="modal-close-x">&times;</button>
                </div>
                <div class="modal-body" id="modal-body">
                    <!-- Contenido dinámico -->
                </div>
                <div class="modal-footer" id="modal-footer">
                    <!-- Botones dinámicos -->
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.overlayEl = overlay;
    },

    /**
     * Modal de Alerta simple
     */
    alert(title, message) {
        this.init();
        return new Promise((resolve) => {
            const titleEl = document.getElementById('modal-title');
            const bodyEl = document.getElementById('modal-body');
            const footerEl = document.getElementById('modal-footer');
            const closeX = document.getElementById('modal-close-x');

            titleEl.innerHTML = `<i class="fa-solid fa-circle-info icon-gray"></i> ${this.escapeHtml(title)}`;
            bodyEl.innerHTML = `<p>${this.escapeHtml(message).replace(/\n/g, '<br>')}</p>`;
            footerEl.innerHTML = `
                <button class="btn btn-primary" id="modal-btn-ok">Entendido</button>
            `;

            const close = () => {
                this.close();
                resolve(true);
            };

            document.getElementById('modal-btn-ok').onclick = close;
            closeX.onclick = close;

            this.open();
        });
    },

    /**
     * Modal de Confirmación (Sí / No)
     */
    confirm(title, message, confirmText = 'Confirmar', isDanger = false) {
        this.init();
        return new Promise((resolve) => {
            const titleEl = document.getElementById('modal-title');
            const bodyEl = document.getElementById('modal-body');
            const footerEl = document.getElementById('modal-footer');
            const closeX = document.getElementById('modal-close-x');

            const icon = isDanger ? 'fa-solid fa-triangle-exclamation text-danger' : 'fa-solid fa-circle-question icon-gray';
            titleEl.innerHTML = `<i class="${icon}"></i> ${this.escapeHtml(title)}`;
            bodyEl.innerHTML = `<p>${this.escapeHtml(message).replace(/\n/g, '<br>')}</p>`;
            
            const confirmBtnClass = isDanger ? 'btn-danger' : 'btn-primary';

            footerEl.innerHTML = `
                <button class="btn btn-ghost" id="modal-btn-cancel">Cancelar</button>
                <button class="btn ${confirmBtnClass}" id="modal-btn-confirm">${this.escapeHtml(confirmText)}</button>
            `;

            document.getElementById('modal-btn-cancel').onclick = () => {
                this.close();
                resolve(false);
            };

            document.getElementById('modal-btn-confirm').onclick = () => {
                this.close();
                resolve(true);
            };

            closeX.onclick = () => {
                this.close();
                resolve(false);
            };

            this.open();
        });
    },

    /**
     * Modal de Formulario / Prompt personalizado
     */
    createGddPrompt() {
        this.init();
        return new Promise((resolve) => {
            const titleEl = document.getElementById('modal-title');
            const bodyEl = document.getElementById('modal-body');
            const footerEl = document.getElementById('modal-footer');
            const closeX = document.getElementById('modal-close-x');

            titleEl.innerHTML = `<i class="fa-solid fa-plus icon-gray"></i> Crear Nuevo GDD`;
            bodyEl.innerHTML = `
                <div class="modal-form-group">
                    <label>Nombre del Videojuego *</label>
                    <input type="text" id="prompt-game-title" class="modal-input" placeholder="Ej. Cyber Knight" autofocus>
                </div>
                <div class="modal-form-group" style="margin-top: 14px;">
                    <label>Nombre del Estudio o Equipo *</label>
                    <input type="text" id="prompt-studio-name" class="modal-input" placeholder="Ej. Pixel Forge Studios">
                </div>
            `;

            footerEl.innerHTML = `
                <button class="btn btn-ghost" id="modal-btn-cancel">Cancelar</button>
                <button class="btn btn-primary" id="modal-btn-create"><i class="fa-solid fa-check"></i> Crear GDD</button>
            `;

            const handleCreate = () => {
                const gameTitle = document.getElementById('prompt-game-title').value.trim();
                const studioName = document.getElementById('prompt-studio-name').value.trim();
                
                if (!gameTitle) {
                    document.getElementById('prompt-game-title').focus();
                    return;
                }

                this.close();
                resolve({
                    title: gameTitle,
                    studio: studioName || 'Mi Estudio'
                });
            };

            document.getElementById('modal-btn-cancel').onclick = () => {
                this.close();
                resolve(null);
            };

            document.getElementById('modal-btn-create').onclick = handleCreate;

            closeX.onclick = () => {
                this.close();
                resolve(null);
            };

            // Tecla Enter para enviar
            setTimeout(() => {
                const input = document.getElementById('prompt-game-title');
                if (input) input.focus();
            }, 100);

            this.open();
        });
    },

    open() {
        if (this.overlayEl) {
            this.overlayEl.style.display = 'flex';
        }
    },

    close() {
        if (this.overlayEl) {
            this.overlayEl.style.display = 'none';
        }
    },

    escapeHtml(str) {
        if (typeof str !== 'string') return str || '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ModalModule.init();
});
