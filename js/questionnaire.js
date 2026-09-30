/**
 * questionnaire.js
 * Cuestionario intuitivo simplificado en 6 pasos principales con iconos grises CDN.
 */

const QuestionnaireModule = {
    currentStep: 0,
    activeGdd: null,
    onDataChangeCallback: null,

    init(gdd, onDataChange) {
        this.activeGdd = gdd;
        this.onDataChangeCallback = onDataChange;
        this.renderStepNav();
        this.renderCurrentStep();
    },

    setGdd(gdd) {
        this.activeGdd = gdd;
        this.renderCurrentStep();
        this.renderStepNav();
    },

    steps: [
        { id: 0, title: "1. Portada y Estudio", icon: "fa-solid fa-id-card" },
        { id: 1, title: "2. Resumen Ejecutivo", icon: "fa-solid fa-rocket" },
        { id: 2, title: "3. Gameplay y Mecánicas", icon: "fa-solid fa-gamepad" },
        { id: 3, title: "4. Sistemas y Niveles", icon: "fa-solid fa-cubes" },
        { id: 4, title: "5. Narrativa, Arte y Audio", icon: "fa-solid fa-palette" },
        { id: 5, title: "6. Técnico, Producción y QA", icon: "fa-solid fa-list-check" }
    ],

    goToStep(stepId) {
        if (stepId >= 0 && stepId < this.steps.length) {
            this.currentStep = stepId;
            this.renderStepNav();
            this.renderCurrentStep();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    renderStepNav() {
        const navContainer = document.getElementById('wizard-step-nav');
        if (!navContainer) return;

        navContainer.innerHTML = this.steps.map(s => {
            const isActive = s.id === this.currentStep ? 'active' : '';
            return `
                <button class="step-nav-btn ${isActive}" onclick="QuestionnaireModule.goToStep(${s.id})">
                    <i class="${s.icon} icon-gray"></i>
                    <span class="step-label">${s.title}</span>
                </button>
            `;
        }).join('');
    },

    notifyChange() {
        if (this.onDataChangeCallback) {
            this.onDataChangeCallback(this.activeGdd);
        }
    },

    renderCurrentStep() {
        const bodyContainer = document.getElementById('wizard-step-content');
        if (!bodyContainer || !this.activeGdd) return;

        const s = this.steps[this.currentStep];
        let html = `
            <div class="step-header">
                <h2><i class="${s.icon} icon-gray"></i> ${s.title}</h2>
                <div class="step-info-badge">Paso ${this.currentStep + 1} de ${this.steps.length}</div>
            </div>
            <p class="step-hint">Rellena los apartados que tengas definidos. Puedes dejar campos en blanco y volver a completarlos en cualquier momento.</p>
        `;

        switch (this.currentStep) {
            case 0: html += this.renderStep0(); break;
            case 1: html += this.renderStep1(); break;
            case 2: html += this.renderStep2(); break;
            case 3: html += this.renderStep3(); break;
            case 4: html += this.renderStep4(); break;
            case 5: html += this.renderStep5(); break;
        }

        // Acciones del pie de formulario
        html += `
            <div class="step-footer-actions">
                ${this.currentStep > 0 ? `<button class="btn btn-secondary" onclick="QuestionnaireModule.goToStep(${this.currentStep - 1})"><i class="fa-solid fa-arrow-left icon-gray"></i> Anterior</button>` : '<div></div>'}
                <div class="footer-center-actions">
                    <button class="btn btn-ghost" onclick="AppModule.switchView('preview')"><i class="fa-solid fa-eye icon-gray"></i> Ver Documento Vivo</button>
                </div>
                ${this.currentStep < this.steps.length - 1 ? `<button class="btn btn-primary" onclick="QuestionnaireModule.goToStep(${this.currentStep + 1})">Siguiente <i class="fa-solid fa-arrow-right"></i></button>` : `<button class="btn btn-success" onclick="AppModule.switchView('preview')"><i class="fa-solid fa-check"></i> Finalizar y Ver GDD</button>`}
            </div>
        `;

        bodyContainer.innerHTML = html;
        this.bindInputEvents();
    },

    // --- RENDERIZADO DE PASOS PRINCIPALES ---

    renderStep0() {
        const cover = this.activeGdd.cover;
        return `
            <div class="card-box">
                <h3>Datos Generales de la Portada</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Nombre del Videojuego *</label>
                        <input type="text" data-path="cover.title" value="${this.escapeHtml(cover.title)}" placeholder="Ej. Cyber Knight">
                    </div>
                    <div class="form-group">
                        <label>Estudio / Equipo *</label>
                        <input type="text" data-path="cover.studio" value="${this.escapeHtml(cover.studio)}" placeholder="Ej. Pixel Forge Studios">
                    </div>
                    <div class="form-group">
                        <label>Versión del GDD</label>
                        <input type="text" data-path="cover.version" value="${this.escapeHtml(cover.version)}" placeholder="0.1">
                    </div>
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="text" data-path="cover.date" value="${this.escapeHtml(cover.date)}">
                    </div>
                    <div class="form-group full-width">
                        <label>Responsable del Documento</label>
                        <input type="text" data-path="cover.author" value="${this.escapeHtml(cover.author)}" placeholder="Nombre del diseñador principal">
                    </div>
                </div>

                <div class="form-group full-width" style="margin-top: 20px;">
                    <label><i class="fa-solid fa-image icon-gray"></i> Logo o Imagen del Estudio (Se incluye en la Portada)</label>
                    <p class="field-hint">Esta imagen se mostrará en el cuadro de Confidencialidad / Notas de la primera página.</p>
                    
                    <div class="logo-upload-zone" id="logo-upload-zone">
                        ${cover.logo ? `
                            <div class="logo-preview-container">
                                <img src="${cover.logo}" alt="Logo del estudio" class="logo-preview-img">
                                <button type="button" class="btn btn-danger btn-sm" onclick="QuestionnaireModule.removeLogo()"><i class="fa-solid fa-trash"></i> Eliminar Logo</button>
                            </div>
                        ` : `
                            <div class="drop-zone-prompt">
                                <i class="fa-solid fa-cloud-arrow-up drop-icon icon-gray"></i>
                                <p><strong>Haz clic para seleccionar el logo</strong> o arrastra la imagen aquí</p>
                                <span class="small-text">Soporta PNG, JPG, SVG o WebP</span>
                                <input type="file" id="logo-file-input" accept="image/*" style="display:none;" onchange="QuestionnaireModule.handleLogoUpload(this)">
                            </div>
                        `}
                    </div>
                </div>

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>Notas de Confidencialidad / Texto de Portada</label>
                    <textarea data-path="cover.notes" rows="2" placeholder="Información confidencial para uso interno...">${this.escapeHtml(cover.notes)}</textarea>
                </div>
            </div>

            <div class="card-box">
                <h3>Control de Versiones</h3>
                ${this.renderDynamicTable({
                    arrayPath: 'cover.version_control',
                    cols: [
                        { label: 'Versión', key: 'version', type: 'text', placeholder: '0.1' },
                        { label: 'Fecha', key: 'date', type: 'text', placeholder: '29/09/2026' },
                        { label: 'Autor', key: 'author', type: 'text', placeholder: 'Autor' },
                        { label: 'Cambios realizados', key: 'changes', type: 'text', placeholder: 'Descripción de cambios' }
                    ]
                })}
            </div>

            <div class="card-box">
                <h3>Estado del Documento por Áreas</h3>
                ${this.renderDynamicTable({
                    arrayPath: 'cover.doc_status',
                    cols: [
                        { label: 'Área', key: 'area', type: 'text', placeholder: 'Diseño / Arte / Prog' },
                        { label: 'Responsable', key: 'responsible', type: 'text', placeholder: 'Responsable' },
                        { label: 'Estado', key: 'status', type: 'text', placeholder: 'Borrador / Revisado / Final' },
                        { label: 'Última revisión', key: 'last_review', type: 'text', placeholder: 'Fecha' }
                    ]
                })}
            </div>
        `;
    },

    renderStep1() {
        const s1 = this.activeGdd.section1;
        const ts = s1.technical_sheet;
        return `
            <div class="card-box">
                <h3>1. Resumen Ejecutivo</h3>
                
                <div class="form-group full-width">
                    <label>HIGH CONCEPT (Frase de impacto)</label>
                    <p class="field-hint">Resume el juego en una sola frase clara: qué hace el jugador, qué lo hace especial y la fantasía principal.</p>
                    <textarea data-path="section1.high_concept" rows="2" placeholder="Ej. Un juego de puzzle en 2D donde controlas la gravedad para escapar de un laboratorio.">${this.escapeHtml(s1.high_concept)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>ELEVATOR PITCH (Presentación)</label>
                    <p class="field-hint">Explica el juego en 3–5 líneas como si se lo presentaras a un equipo o publisher.</p>
                    <textarea data-path="section1.elevator_pitch" rows="3" placeholder="Descripción resumida del juego...">${this.escapeHtml(s1.elevator_pitch)}</textarea>
                </div>

                <h4>Ficha Técnica</h4>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Género</label>
                        <input type="text" data-path="section1.technical_sheet.genre" value="${this.escapeHtml(ts.genre)}" placeholder="Ej. Terror / Roguelike">
                    </div>
                    <div class="form-group">
                        <label>Subgénero</label>
                        <input type="text" data-path="section1.technical_sheet.subgenre" value="${this.escapeHtml(ts.subgenre)}" placeholder="Ej. Survival">
                    </div>
                    <div class="form-group">
                        <label>Plataformas</label>
                        <input type="text" data-path="section1.technical_sheet.platforms" value="${this.escapeHtml(ts.platforms)}" placeholder="Ej. PC / Steam">
                    </div>
                    <div class="form-group">
                        <label>Público Objetivo</label>
                        <input type="text" data-path="section1.technical_sheet.target_audience" value="${this.escapeHtml(ts.target_audience)}" placeholder="Ej. Jugadores de 18-35 años">
                    </div>
                    <div class="form-group">
                        <label>Modo</label>
                        <input type="text" data-path="section1.technical_sheet.mode" value="${this.escapeHtml(ts.mode)}" placeholder="Ej. 1 Jugador">
                    </div>
                    <div class="form-group">
                        <label>Perspectiva</label>
                        <input type="text" data-path="section1.technical_sheet.perspective" value="${this.escapeHtml(ts.perspective)}" placeholder="Ej. 1ª Persona / 2D">
                    </div>
                    <div class="form-group">
                        <label>Duración Estimada</label>
                        <input type="text" data-path="section1.technical_sheet.duration" value="${this.escapeHtml(ts.duration)}" placeholder="Ej. 10 horas">
                    </div>
                    <div class="form-group">
                        <label>Motor</label>
                        <input type="text" data-path="section1.technical_sheet.engine" value="${this.escapeHtml(ts.engine)}" placeholder="Ej. Godot / Unity / Unreal">
                    </div>
                    <div class="form-group full-width">
                        <label>Modelo de Negocio</label>
                        <input type="text" data-path="section1.technical_sheet.business_model" value="${this.escapeHtml(ts.business_model)}" placeholder="Ej. Premium">
                    </div>
                </div>

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>PILARES DE DISEÑO</label>
                    <textarea data-path="section1.design_pillars" rows="2" placeholder="Define 3–5 principios clave del juego...">${this.escapeHtml(s1.design_pillars)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>USP / ELEMENTOS DIFERENCIALES</label>
                    <textarea data-path="section1.usp" rows="2" placeholder="¿Qué hace único a tu juego frente a la competencia?">${this.escapeHtml(s1.usp)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>REFERENCIAS</label>
                    <textarea data-path="section1.references" rows="2" placeholder="Juegos o películas de referencia...">${this.escapeHtml(s1.references)}</textarea>
                </div>
            </div>
        `;
    },

    renderStep2() {
        const s2 = this.activeGdd.section2;
        const s3 = this.activeGdd.section3;
        const c = s3.combat || {};
        return `
            <div class="card-box">
                <h3>2. Experiencia del Jugador y Gameplay</h3>

                <div class="form-group full-width">
                    <label>Fantasía Principal</label>
                    <textarea data-path="section2.fantasy_main" rows="2" placeholder="¿Quién siente el jugador que es?">${this.escapeHtml(s2.fantasy_main)}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Emociones Objetivo</label>
                    <input type="text" data-path="section2.emotions_target" value="${this.escapeHtml(s2.emotions_target)}" placeholder="Tensión, curiosidad, logro...">
                </div>

                <h4>Objetivos del Jugador</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section2.objectives',
                    cols: [
                        { label: 'Tipo', key: 'type', type: 'text', placeholder: 'Principal / Secundario' },
                        { label: 'Objetivo', key: 'objective', type: 'text', placeholder: 'Descripción' },
                        { label: 'Cómo se comunica', key: 'communication', type: 'text', placeholder: 'HUD, Diálogo, Marcador' }
                    ]
                })}

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>Core Loop (Bucle Principal)</label>
                    <textarea data-path="section2.core_loop_main" rows="2" placeholder="Explorar -> Encontrar -> Combatir -> Mejorar -> Repetir">${this.escapeHtml(s2.core_loop_main)}</textarea>
                </div>

                <h4>Esquema de Controles</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section3.controls',
                    cols: [
                        { label: 'Acción', key: 'action', type: 'text', placeholder: 'Moverse / Atacar' },
                        { label: 'Teclado/Ratón', key: 'keyboard', type: 'text', placeholder: 'WASD / Clic' },
                        { label: 'Mando', key: 'gamepad', type: 'text', placeholder: 'Stick / R2' },
                        { label: 'Móvil', key: 'mobile', type: 'text', placeholder: 'Táctil' },
                        { label: 'Notas', key: 'notes', type: 'text', placeholder: 'Notas' }
                    ]
                })}

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>Sistema de Movimiento</label>
                    <textarea data-path="section3.movement_system" rows="2" placeholder="Velocidad, salto, físicas, restricciones...">${this.escapeHtml(s3.movement_system)}</textarea>
                </div>

                <h4>Mecánicas Principales</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section3.main_mechanics',
                    cols: [
                        { label: 'Mecánica', key: 'mechanic', type: 'text', placeholder: 'Nombre' },
                        { label: 'Descripción', key: 'description', type: 'text', placeholder: 'Qué hace' },
                        { label: 'Input', key: 'input', type: 'text', placeholder: 'Teclas' },
                        { label: 'Reglas', key: 'rules', type: 'text', placeholder: 'Limitaciones' },
                        { label: 'Prioridad', key: 'priority', type: 'text', placeholder: 'Alta / Media' }
                    ]
                })}

                <h4>Combate (si aplica)</h4>
                <div class="form-grid">
                    <div class="form-group"><label>Ataque</label><input type="text" data-path="section3.combat.attack" value="${this.escapeHtml(c.attack)}"></div>
                    <div class="form-group"><label>Defensa</label><input type="text" data-path="section3.combat.defense" value="${this.escapeHtml(c.defense)}"></div>
                    <div class="form-group"><label>Daño y Vida</label><input type="text" data-path="section3.combat.health" value="${this.escapeHtml(c.health)}"></div>
                    <div class="form-group"><label>Muerte / Respawn</label><input type="text" data-path="section3.combat.death_respawn" value="${this.escapeHtml(c.death_respawn)}"></div>
                </div>
            </div>
        `;
    },

    renderStep3() {
        const s4 = this.activeGdd.section4;
        const s5 = this.activeGdd.section5;
        return `
            <div class="card-box">
                <h3>3. Sistemas del Juego y Niveles</h3>

                <div class="form-group full-width">
                    <label>Progresión del Jugador</label>
                    <textarea data-path="section4.progression" rows="2" placeholder="Niveles, experiencia, habilidades, desbloqueos...">${this.escapeHtml(s4.progression)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>Economía y Recursos</label>
                    <textarea data-path="section4.economy" rows="2" placeholder="Monedas, materiales, fuentes y gasto...">${this.escapeHtml(s4.economy)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>Guardado y Checkpoints</label>
                    <textarea data-path="section4.saves" rows="2" placeholder="Autosave, puntos de control, guardado manual...">${this.escapeHtml(s4.saves)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>Estructura Global del Mundo</label>
                    <textarea data-path="section5.world_structure" rows="2" placeholder="Mundo abierto, niveles lineales, capítulos...">${this.escapeHtml(s5.world_structure)}</textarea>
                </div>

                <h4>Diseño de Niveles</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section5.level_design',
                    cols: [
                        { label: 'Nivel / Zona', key: 'level', type: 'text', placeholder: 'Nivel 1' },
                        { label: 'Objetivo', key: 'objective', type: 'text', placeholder: 'Objetivo' },
                        { label: 'Mecánica Clave', key: 'main_mechanic', type: 'text', placeholder: 'Mecánica' },
                        { label: 'Amenazas', key: 'threats', type: 'text', placeholder: 'Enemigos' },
                        { label: 'Duración', key: 'duration', type: 'text', placeholder: '15 min' }
                    ]
                })}
            </div>
        `;
    },

    renderStep4() {
        const s6 = this.activeGdd.section6;
        const s10 = this.activeGdd.section10;
        const s11 = this.activeGdd.section11;
        return `
            <div class="card-box">
                <h3>4. Narrativa, Arte y Audio</h3>

                <div class="form-group full-width">
                    <label>Sinopsis Narrativa</label>
                    <textarea data-path="section6.synopsis" rows="3" placeholder="Resumen de la historia del juego...">${this.escapeHtml(s6.synopsis)}</textarea>
                </div>

                <h4>Personajes Principales</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section6.characters',
                    cols: [
                        { label: 'Personaje', key: 'character', type: 'text', placeholder: 'Nombre' },
                        { label: 'Rol', key: 'role', type: 'text', placeholder: 'Protagonista / Enemigo' },
                        { label: 'Objetivo', key: 'objective', type: 'text', placeholder: 'Motivación' },
                        { label: 'Personalidad', key: 'personality', type: 'text', placeholder: 'Carácter' }
                    ]
                })}

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>Visión Artística y Estilo Visual</label>
                    <textarea data-path="section10.visual_vision" rows="2" placeholder="Pixel art, 3D Low poly, Cel shading, Realista...">${this.escapeHtml(s10.visual_vision)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>Identidad Sonora y Música</label>
                    <textarea data-path="section11.audio_identity" rows="2" placeholder="Estilo musical, efectos sonoros clave...">${this.escapeHtml(s11.audio_identity)}</textarea>
                </div>
            </div>
        `;
    },

    renderStep5() {
        const s12 = this.activeGdd.section12;
        const tt = s12.technical_table || {};
        const s14 = this.activeGdd.section14;
        const s17 = this.activeGdd.section17;
        return `
            <div class="card-box">
                <h3>5. Técnico, Producción y QA</h3>

                <h4>Ficha Técnica de Desarrollo</h4>
                <div class="form-grid">
                    <div class="form-group"><label>Motor</label><input type="text" data-path="section12.technical_table.engine" value="${this.escapeHtml(tt.engine)}" placeholder="Unity / Godot / Unreal"></div>
                    <div class="form-group"><label>Lenguaje</label><input type="text" data-path="section12.technical_table.language" value="${this.escapeHtml(tt.language)}" placeholder="C# / GDScript"></div>
                    <div class="form-group"><label>Plataformas</label><input type="text" data-path="section12.technical_table.platforms" value="${this.escapeHtml(tt.platforms)}" placeholder="PC / Móvil"></div>
                    <div class="form-group"><label>Control de Versiones</label><input type="text" data-path="section12.technical_table.version_control" value="${this.escapeHtml(tt.version_control)}" placeholder="Git / GitHub"></div>
                </div>

                <h4>Equipo de Trabajo</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section14.team',
                    cols: [
                        { label: 'Persona', key: 'person', type: 'text', placeholder: 'Nombre' },
                        { label: 'Rol', key: 'role', type: 'text', placeholder: 'Diseñador / Programador' },
                        { label: 'Responsabilidades', key: 'responsibilities', type: 'text', placeholder: 'Tareas' }
                    ]
                })}

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>Definition of Done (Criterios de Finalización)</label>
                    <textarea data-path="section14.definition_of_done" rows="2" placeholder="¿Cuándo se considera terminada una tarea o feature?">${this.escapeHtml(s14.definition_of_done)}</textarea>
                </div>

                <h4>Checklist de Revisión del GDD</h4>
                <div class="checklist-box">
                    ${(s17.checklist || []).map((item, idx) => `
                        <label class="checklist-item">
                            <input type="checkbox" data-check-idx="${idx}" ${item.checked ? 'checked' : ''} onchange="QuestionnaireModule.toggleChecklist(${idx}, this.checked)">
                            <span>${this.escapeHtml(item.text)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // --- REUTILIZABLE: TABLAS DINÁMICAS ---

    renderDynamicTable({ arrayPath, cols }) {
        const arr = this.getValueByPath(arrayPath) || [];
        
        let html = `
            <div class="table-responsive">
                <table class="dynamic-table">
                    <thead>
                        <tr>
                            ${cols.map(c => `<th>${c.label}</th>`).join('')}
                            <th style="width: 50px; text-align: center;">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (arr.length === 0) {
            html += `
                <tr>
                    <td colspan="${cols.length + 1}" class="text-center text-muted" style="padding: 12px;">
                        Sin elementos cargados. Haz clic en "➕ Añadir Fila" para agregar datos.
                    </td>
                </tr>
            `;
        } else {
            arr.forEach((item, index) => {
                html += `<tr>`;
                cols.forEach(col => {
                    const val = item[col.key] || '';
                    html += `
                        <td>
                            <input type="${col.type || 'text'}" 
                                   value="${this.escapeHtml(val)}" 
                                   placeholder="${col.placeholder || ''}"
                                   onchange="QuestionnaireModule.updateTableCell('${arrayPath}', ${index}, '${col.key}', this.value)"
                                   onkeyup="QuestionnaireModule.updateTableCell('${arrayPath}', ${index}, '${col.key}', this.value)">
                        </td>
                    `;
                });
                html += `
                    <td class="text-center">
                        <button type="button" class="btn-icon btn-danger-icon" title="Eliminar fila" onclick="QuestionnaireModule.removeTableRow('${arrayPath}', ${index})">
                            <i class="fa-solid fa-trash icon-gray"></i>
                        </button>
                    </td>
                </tr>`;
            });
        }

        html += `
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 8px;">
                <button type="button" class="btn btn-sm btn-secondary" onclick="QuestionnaireModule.addTableRow('${arrayPath}', ${JSON.stringify(cols.map(c => c.key)).replace(/"/g, '&quot;')})">
                    <i class="fa-solid fa-plus icon-gray"></i> Añadir Fila
                </button>
            </div>
        `;

        return html;
    },

    // --- MANEJADORES DE EVENTOS Y BINDINGS ---

    bindInputEvents() {
        const inputs = document.querySelectorAll('#wizard-step-content [data-path]');
        inputs.forEach(input => {
            const handler = (e) => {
                const path = e.target.getAttribute('data-path');
                const val = e.target.value;
                this.setValueByPath(path, val);
                this.notifyChange();
            };
            input.addEventListener('change', handler);
            input.addEventListener('keyup', handler);
        });

        const dropZone = document.getElementById('logo-upload-zone');
        if (dropZone) {
            dropZone.addEventListener('click', (e) => {
                const fileInput = document.getElementById('logo-file-input');
                if (fileInput && e.target !== fileInput) fileInput.click();
            });
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    dropZone.classList.add('drag-over');
                }, false);
            });
            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    dropZone.classList.remove('drag-over');
                }, false);
            });
            dropZone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files && files.length > 0) {
                    this.processImageFile(files[0]);
                }
            });
        }
    },

    handleLogoUpload(input) {
        if (input.files && input.files[0]) {
            this.processImageFile(input.files[0]);
        }
    },

    processImageFile(file) {
        if (!file.type.startsWith('image/')) {
            ModalModule.alert('Archivo no válido', 'Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            this.activeGdd.cover.logo = e.target.result;
            this.notifyChange();
            this.renderCurrentStep();
        };
        reader.readAsDataURL(file);
    },

    removeLogo() {
        this.activeGdd.cover.logo = "";
        this.notifyChange();
        this.renderCurrentStep();
    },

    updateTableCell(arrayPath, index, key, value) {
        const arr = this.getValueByPath(arrayPath);
        if (arr && arr[index]) {
            arr[index][key] = value;
            this.notifyChange();
        }
    },

    addTableRow(arrayPath, keys) {
        let arr = this.getValueByPath(arrayPath);
        if (!arr) {
            arr = [];
            this.setValueByPath(arrayPath, arr);
        }
        const newItem = {};
        keys.forEach(k => newItem[k] = "");
        arr.push(newItem);
        this.notifyChange();
        this.renderCurrentStep();
    },

    removeTableRow(arrayPath, index) {
        const arr = this.getValueByPath(arrayPath);
        if (arr && arr[index] !== undefined) {
            arr.splice(index, 1);
            this.notifyChange();
            this.renderCurrentStep();
        }
    },

    toggleChecklist(index, checked) {
        if (this.activeGdd.section17 && this.activeGdd.section17.checklist[index]) {
            this.activeGdd.section17.checklist[index].checked = checked;
            this.notifyChange();
        }
    },

    getValueByPath(path) {
        return path.split('.').reduce((o, i) => (o ? o[i] : null), this.activeGdd);
    },

    setValueByPath(path, value) {
        const parts = path.split('.');
        let curr = this.activeGdd;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!curr[parts[i]]) curr[parts[i]] = {};
            curr = curr[parts[i]];
        }
        curr[parts[parts.length - 1]] = value;
    },

    escapeHtml(str) {
        if (typeof str !== 'string') return str || '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};
