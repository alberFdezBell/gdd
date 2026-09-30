/**
 * questionnaire.js
 * Generador y gestor del cuestionario interactivo para rellenar el GDD.
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
        { id: 0, title: "0. Portada y Estudio", icon: "📌", category: "General" },
        { id: 1, title: "1. Resumen Ejecutivo", icon: "🚀", category: "Visión" },
        { id: 2, title: "2. Experiencia Jugador", icon: "🎯", category: "Visión" },
        { id: 3, title: "3. Gameplay y Mecánicas", icon: "⚔️", category: "Diseño Juego" },
        { id: 4, title: "4. Sistemas del Juego", icon: "⚙️", category: "Diseño Juego" },
        { id: 5, title: "5. Mundo y Niveles", icon: "🗺️", category: "Diseño Juego" },
        { id: 6, title: "6. Narrativa y Personajes", icon: "📖", category: "Contenido" },
        { id: 7, title: "7. Entidades, Enemigos y NPC", icon: "👾", category: "Contenido" },
        { id: 8, title: "8. Objetos y Habilidades", icon: "🎒", category: "Contenido" },
        { id: 9, title: "9. UI, UX y Accesibilidad", icon: "🖥️", category: "Arte y Audio" },
        { id: 10, title: "10. Dirección Artística", icon: "🎨", category: "Arte y Audio" },
        { id: 11, title: "11. Audio y Música", icon: "🎵", category: "Arte y Audio" },
        { id: 12, title: "12. Diseño Técnico", icon: "🛠️", category: "Técnico" },
        { id: 13, title: "13. Monetización y Publicación", icon: "💰", category: "Negocio" },
        { id: 14, title: "14. Producción y Alcance", icon: "📊", category: "Gestión" },
        { id: 15, title: "15. QA, Testing y Balance", icon: "🧪", category: "Gestión" },
        { id: 16, title: "16. Riesgos y Decisiones", icon: "🛡️", category: "Gestión" },
        { id: 17, title: "17. Anexos y Checklist", icon: "📑", category: "Final" }
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
                    <span class="step-icon">${s.icon}</span>
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
                <h2>${s.icon} ${s.title}</h2>
                <div class="step-info-badge">Paso ${this.currentStep + 1} de ${this.steps.length}</div>
            </div>
            <p class="step-hint">Puedes rellenar los datos que desees o saltarte esta sección. El GDD es un documento vivo que se actualiza gradualmente.</p>
        `;

        switch (this.currentStep) {
            case 0: html += this.renderStep0(); break;
            case 1: html += this.renderStep1(); break;
            case 2: html += this.renderStep2(); break;
            case 3: html += this.renderStep3(); break;
            case 4: html += this.renderStep4(); break;
            case 5: html += this.renderStep5(); break;
            case 6: html += this.renderStep6(); break;
            case 7: html += this.renderStep7(); break;
            case 8: html += this.renderStep8(); break;
            case 9: html += this.renderStep9(); break;
            case 10: html += this.renderStep10(); break;
            case 11: html += this.renderStep11(); break;
            case 12: html += this.renderStep12(); break;
            case 13: html += this.renderStep13(); break;
            case 14: html += this.renderStep14(); break;
            case 15: html += this.renderStep15(); break;
            case 16: html += this.renderStep16(); break;
            case 17: html += this.renderStep17(); break;
        }

        // Botones de navegación inferior
        html += `
            <div class="step-footer-actions">
                ${this.currentStep > 0 ? `<button class="btn btn-secondary" onclick="QuestionnaireModule.goToStep(${this.currentStep - 1})">⬅️ Anterior</button>` : '<div></div>'}
                <div class="footer-center-actions">
                    <button class="btn btn-ghost" onclick="AppModule.switchView('preview')">👁️ Ver Documento Vivo</button>
                </div>
                ${this.currentStep < this.steps.length - 1 ? `<button class="btn btn-primary" onclick="QuestionnaireModule.goToStep(${this.currentStep + 1})">Siguiente ➡️</button>` : `<button class="btn btn-success" onclick="AppModule.switchView('preview')">✨ Finalizar / Ver Documento</button>`}
            </div>
        `;

        bodyContainer.innerHTML = html;
        this.bindInputEvents();
    },

    // --- RENDERIZADO DE PASOS INDIVIDUALES ---

    renderStep0() {
        const cover = this.activeGdd.cover;
        return `
            <div class="card-box">
                <h3>Datos Generales del Proyecto</h3>
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
                        <input type="text" data-path="cover.version" value="${this.escapeHtml(cover.version)}" placeholder="Ej. 0.1">
                    </div>
                    <div class="form-group">
                        <label>Fecha de Creación / Actualización</label>
                        <input type="text" data-path="cover.date" value="${this.escapeHtml(cover.date)}">
                    </div>
                    <div class="form-group full-width">
                        <label>Responsable del Documento</label>
                        <input type="text" data-path="cover.author" value="${this.escapeHtml(cover.author)}" placeholder="Ej. Adrián Bautista Ramos">
                    </div>
                </div>

                <div class="form-group full-width" style="margin-top: 20px;">
                    <label>🖼️ Imagen / Logo del Estudio o Equipo (Portada)</label>
                    <p class="field-hint">Esta imagen se incluirá en la primera página del documento impreso/PDF en la sección de Confidencialidad / Notas.</p>
                    
                    <div class="logo-upload-zone" id="logo-upload-zone">
                        ${cover.logo ? `
                            <div class="logo-preview-container">
                                <img src="${cover.logo}" alt="Logo del estudio" class="logo-preview-img">
                                <button type="button" class="btn btn-danger btn-sm" onclick="QuestionnaireModule.removeLogo()">🗑️ Quitar Logo</button>
                            </div>
                        ` : `
                            <div class="drop-zone-prompt">
                                <span class="drop-icon">📁</span>
                                <p><strong>Haz clic para subir imagen</strong> o arrástrala aquí</p>
                                <span class="small-text">(PNG, JPG, SVG o WebP)</span>
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

            <div class="card-box" style="margin-top: 20px;">
                <h3>Control de Versiones</h3>
                ${this.renderDynamicTable({
                    arrayPath: 'cover.version_control',
                    cols: [
                        { label: 'Versión', key: 'version', type: 'text', placeholder: '0.1' },
                        { label: 'Fecha', key: 'date', type: 'text', placeholder: '29/09/2026' },
                        { label: 'Autor', key: 'author', type: 'text', placeholder: 'Nombre' },
                        { label: 'Cambios realizados', key: 'changes', type: 'text', placeholder: 'Descripción de cambios' }
                    ]
                })}
            </div>

            <div class="card-box" style="margin-top: 20px;">
                <h3>Estado del Documento por Áreas</h3>
                ${this.renderDynamicTable({
                    arrayPath: 'cover.doc_status',
                    cols: [
                        { label: 'Área', key: 'area', type: 'text', placeholder: 'Diseño / Arte / Prog' },
                        { label: 'Responsable', key: 'responsible', type: 'text', placeholder: 'Nombre' },
                        { label: 'Estado', key: 'status', type: 'text', placeholder: 'Borrador / Revisado / Final' },
                        { label: 'Última revisión', key: 'last_review', type: 'text', placeholder: '29/09/2026' }
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
                <p class="field-hint">Debe permitir que cualquier persona entienda el juego en 2–3 minutos.</p>

                <div class="form-group full-width">
                    <label>HIGH CONCEPT (Frase de impacto)</label>
                    <p class="field-hint">Resume el juego en una sola frase clara: qué hace el jugador, qué lo hace especial y cuál es la fantasía principal.</p>
                    <textarea data-path="section1.high_concept" rows="2" placeholder="Ej. Un roguelike de terror espacial donde utilizas sonido e iluminación para sobrevivir.">${this.escapeHtml(s1.high_concept)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>ELEVATOR PITCH (Presentación ejecutiva)</label>
                    <p class="field-hint">Explica el juego en 3–5 líneas como si se lo presentaras a un publisher o a un nuevo miembro del equipo.</p>
                    <textarea data-path="section1.elevator_pitch" rows="4" placeholder="Explica el juego rápidamente...">${this.escapeHtml(s1.elevator_pitch)}</textarea>
                </div>

                <h4>Ficha Técnica Resumida</h4>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Género</label>
                        <input type="text" data-path="section1.technical_sheet.genre" value="${this.escapeHtml(ts.genre)}" placeholder="Ej. Terror psicológico / Roguelike">
                    </div>
                    <div class="form-group">
                        <label>Subgénero</label>
                        <input type="text" data-path="section1.technical_sheet.subgenre" value="${this.escapeHtml(ts.subgenre)}" placeholder="Ej. Survival / Deckbuilder">
                    </div>
                    <div class="form-group">
                        <label>Plataformas</label>
                        <input type="text" data-path="section1.technical_sheet.platforms" value="${this.escapeHtml(ts.platforms)}" placeholder="Ej. PC / Steam / Nintendo Switch">
                    </div>
                    <div class="form-group">
                        <label>Público Objetivo</label>
                        <input type="text" data-path="section1.technical_sheet.target_audience" value="${this.escapeHtml(ts.target_audience)}" placeholder="Ej. Jugadores 18+, amantes del desafío">
                    </div>
                    <div class="form-group">
                        <label>Modo de Juego</label>
                        <input type="text" data-path="section1.technical_sheet.mode" value="${this.escapeHtml(ts.mode)}" placeholder="Ej. 1 jugador / Cooperativo">
                    </div>
                    <div class="form-group">
                        <label>Perspectiva</label>
                        <input type="text" data-path="section1.technical_sheet.perspective" value="${this.escapeHtml(ts.perspective)}" placeholder="Ej. 1ª persona / Isometric 2D">
                    </div>
                    <div class="form-group">
                        <label>Duración Estimada</label>
                        <input type="text" data-path="section1.technical_sheet.duration" value="${this.escapeHtml(ts.duration)}" placeholder="Ej. 15-20 horas de campaña">
                    </div>
                    <div class="form-group">
                        <label>Motor de Desarrollo</label>
                        <input type="text" data-path="section1.technical_sheet.engine" value="${this.escapeHtml(ts.engine)}" placeholder="Ej. Unity 6 / Godot 4 / Unreal 5">
                    </div>
                    <div class="form-group full-width">
                        <label>Modelo de Negocio</label>
                        <input type="text" data-path="section1.technical_sheet.business_model" value="${this.escapeHtml(ts.business_model)}" placeholder="Ej. Premium (Buy to Play)">
                    </div>
                </div>

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>PILARES DE DISEÑO</label>
                    <p class="field-hint">Define 3–5 principios que guiarán todas las decisiones. Ej.: tensión constante, decisiones rápidas, exploración recompensada.</p>
                    <textarea data-path="section1.design_pillars" rows="3">${this.escapeHtml(s1.design_pillars)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>USP / ELEMENTOS DIFERENCIALES</label>
                    <p class="field-hint">¿Qué ofrece este juego que lo hace reconocible frente a otros del mismo género?</p>
                    <textarea data-path="section1.usp" rows="3">${this.escapeHtml(s1.usp)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>REFERENCIAS</label>
                    <p class="field-hint">Videojuegos, películas, libros u otras obras de referencia y qué tomas de cada una.</p>
                    <textarea data-path="section1.references" rows="3">${this.escapeHtml(s1.references)}</textarea>
                </div>
            </div>
        `;
    },

    renderStep2() {
        const s2 = this.activeGdd.section2;
        return `
            <div class="card-box">
                <h3>2. Experiencia del Jugador</h3>
                
                <h4>2.1 Fantasía del Jugador</h4>
                <div class="form-group full-width">
                    <label>Fantasía Principal</label>
                    <p class="field-hint">Describe quién siente que es el jugador y qué experiencia emocional quieres provocar.</p>
                    <textarea data-path="section2.fantasy_main" rows="3">${this.escapeHtml(s2.fantasy_main)}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Emociones Objetivo</label>
                    <p class="field-hint">Ej.: tensión, dominio, curiosidad, sorpresa, alivio, competitividad.</p>
                    <input type="text" data-path="section2.emotions_target" value="${this.escapeHtml(s2.emotions_target)}">
                </div>
            </div>

            <div class="card-box" style="margin-top: 20px;">
                <h4>2.2 Objetivos</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section2.objectives',
                    cols: [
                        { label: 'Tipo', key: 'type', type: 'text', placeholder: 'Principal / Secundario / Emergente' },
                        { label: 'Objetivo', key: 'objective', type: 'text', placeholder: 'Descripción del objetivo' },
                        { label: 'Cómo se comunica al jugador', key: 'communication', type: 'text', placeholder: 'HUD, diálogo, brújula...' }
                    ]
                })}
            </div>

            <div class="card-box" style="margin-top: 20px;">
                <h4>2.3 Core Loop</h4>
                <div class="form-group full-width">
                    <label>Bucle Principal</label>
                    <p class="field-hint">Ej.: explorar → encontrar recurso → combatir → mejorar → desbloquear zona → repetir.</p>
                    <textarea data-path="section2.core_loop_main" rows="2">${this.escapeHtml(s2.core_loop_main)}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Bucle de Sesión</label>
                    <p class="field-hint">¿Qué ocurre desde que el jugador abre el juego hasta que termina una sesión?</p>
                    <textarea data-path="section2.core_loop_session" rows="2">${this.escapeHtml(s2.core_loop_session)}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Bucle de Progresión</label>
                    <p class="field-hint">¿Qué cambia a medio/largo plazo? Poder, conocimiento, mapa, historia, colección, rango…</p>
                    <textarea data-path="section2.core_loop_progression" rows="2">${this.escapeHtml(s2.core_loop_progression)}</textarea>
                </div>
            </div>

            <div class="card-box" style="margin-top: 20px;">
                <h4>2.4 Condiciones de Éxito y Fracaso</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section2.success_fail_conditions',
                    cols: [
                        { label: 'Situación', key: 'situation', type: 'text', placeholder: 'Combate / Tiempo / Puzzle' },
                        { label: 'Condición', key: 'condition', type: 'text', placeholder: 'Vida = 0 / Tiempo agotado' },
                        { label: 'Consecuencia', key: 'consequence', type: 'text', placeholder: 'Game Over / Perder objetos' },
                        { label: 'Feedback', key: 'feedback', type: 'text', placeholder: 'Pantalla roja, sonido alarma' }
                    ]
                })}
            </div>
        `;
    },

    renderStep3() {
        const s3 = this.activeGdd.section3;
        const c = s3.combat || {};
        return `
            <div class="card-box">
                <h3>3. Gameplay y Mecánicas</h3>

                <h4>3.1 Esquema de Controles</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section3.controls',
                    cols: [
                        { label: 'Acción', key: 'action', type: 'text', placeholder: 'Atacar / Saltar' },
                        { label: 'Teclado/Ratón', key: 'keyboard', type: 'text', placeholder: 'Click Izq / Espacio' },
                        { label: 'Mando', key: 'gamepad', type: 'text', placeholder: 'R2 / A' },
                        { label: 'Móvil', key: 'mobile', type: 'text', placeholder: 'Botón táctil' },
                        { label: 'Notas', key: 'notes', type: 'text', placeholder: 'Hold para cargar' }
                    ]
                })}
            </div>

            <div class="card-box" style="margin-top: 20px;">
                <h4>3.2 Movimiento</h4>
                <div class="form-group full-width">
                    <label>Sistema de Movimiento</label>
                    <p class="field-hint">Velocidad, aceleración, salto, sprint, agacharse, dash, físicas, restricciones, etc.</p>
                    <textarea data-path="section3.movement_system" rows="3">${this.escapeHtml(s3.movement_system)}</textarea>
                </div>
            </div>

            <div class="card-box" style="margin-top: 20px;">
                <h4>3.3 Mecánicas Principales</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section3.main_mechanics',
                    cols: [
                        { label: 'Mecánica', key: 'mechanic', type: 'text', placeholder: 'Nombre' },
                        { label: 'Descripción', key: 'description', type: 'text', placeholder: 'Qué hace' },
                        { label: 'Input', key: 'input', type: 'text', placeholder: 'Teclas / Gestos' },
                        { label: 'Reglas', key: 'rules', type: 'text', placeholder: 'Cooldown, coste...' },
                        { label: 'Feedback', key: 'feedback', type: 'text', placeholder: 'Sonido, partículas' },
                        { label: 'Prioridad', key: 'priority', type: 'text', placeholder: 'Alta / Media / Baja' }
                    ]
                })}
            </div>

            <div class="card-box" style="margin-top: 20px;">
                <h4>3.4 Mecánicas Secundarias</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section3.secondary_mechanics',
                    cols: [
                        { label: 'Mecánica', key: 'mechanic', type: 'text', placeholder: 'Nombre' },
                        { label: 'Descripción', key: 'description', type: 'text', placeholder: 'Descripción' },
                        { label: 'Cuándo se usa', key: 'when_used', type: 'text', placeholder: 'Contexto de uso' },
                        { label: 'Dependencias', key: 'dependencies', type: 'text', placeholder: 'Requiere nivel X o item Y' }
                    ]
                })}
            </div>

            <div class="card-box" style="margin-top: 20px;">
                <h4>3.5 Interacción con el Mundo</h4>
                <div class="form-group full-width">
                    <label>Sistema de Interacción</label>
                    <p class="field-hint">Qué puede tocar, recoger, activar, empujar, inspeccionar, destruir o combinar el jugador.</p>
                    <textarea data-path="section3.interaction_system" rows="3">${this.escapeHtml(s3.interaction_system)}</textarea>
                </div>
            </div>

            <div class="card-box" style="margin-top: 20px;">
                <h4>3.6 Combate (si aplica)</h4>
                <div class="form-grid">
                    <div class="form-group"><label>Ataque</label><input type="text" data-path="section3.combat.attack" value="${this.escapeHtml(c.attack)}"></div>
                    <div class="form-group"><label>Defensa</label><input type="text" data-path="section3.combat.defense" value="${this.escapeHtml(c.defense)}"></div>
                    <div class="form-group"><label>Daño</label><input type="text" data-path="section3.combat.damage" value="${this.escapeHtml(c.damage)}"></div>
                    <div class="form-group"><label>Vida / Salud</label><input type="text" data-path="section3.combat.health" value="${this.escapeHtml(c.health)}"></div>
                    <div class="form-group"><label>Estados Alterados</label><input type="text" data-path="section3.combat.status_effects" value="${this.escapeHtml(c.status_effects)}"></div>
                    <div class="form-group"><label>Armas</label><input type="text" data-path="section3.combat.weapons" value="${this.escapeHtml(c.weapons)}"></div>
                    <div class="form-group"><label>Munición / Recursos</label><input type="text" data-path="section3.combat.ammo_resources" value="${this.escapeHtml(c.ammo_resources)}"></div>
                    <div class="form-group"><label>IA en Combate</label><input type="text" data-path="section3.combat.combat_ai" value="${this.escapeHtml(c.combat_ai)}"></div>
                    <div class="form-group full-width"><label>Muerte y Respawn</label><input type="text" data-path="section3.combat.death_respawn" value="${this.escapeHtml(c.death_respawn)}"></div>
                </div>
            </div>
        `;
    },

    renderStep4() {
        const s4 = this.activeGdd.section4;
        return `
            <div class="card-box">
                <h3>4. Sistemas del Juego</h3>

                <div class="form-group full-width">
                    <label>4.1 Progresión</label>
                    <p class="field-hint">Niveles, experiencia, habilidades, desbloqueos, metaprogresión.</p>
                    <textarea data-path="section4.progression" rows="3">${this.escapeHtml(s4.progression)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>4.2 Economía y Recursos</label>
                    <p class="field-hint">Monedas, materiales, fuentes, sumideros, precios y balance.</p>
                    <textarea data-path="section4.economy" rows="3">${this.escapeHtml(s4.economy)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>4.3 Inventario y Equipamiento</label>
                    <p class="field-hint">Capacidad, slots, rareza, peso, uso, descarte.</p>
                    <textarea data-path="section4.inventory" rows="3">${this.escapeHtml(s4.inventory)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>4.4 Recompensas</label>
                    <p class="field-hint">Qué obtiene el jugador y con qué frecuencia.</p>
                    <textarea data-path="section4.rewards" rows="3">${this.escapeHtml(s4.rewards)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>4.5 Guardado</label>
                    <p class="field-hint">Autosave, manual, checkpoints, datos persistentes.</p>
                    <textarea data-path="section4.saves" rows="3">${this.escapeHtml(s4.saves)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>4.6 Dificultad y Balance</label>
                    <p class="field-hint">Curva, escalado, modos, ayudas y accesibilidad.</p>
                    <textarea data-path="section4.difficulty_desc" rows="3">${this.escapeHtml(s4.difficulty_desc)}</textarea>
                </div>

                <h4>Variables Principales de Balance</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section4.balance_variables',
                    cols: [
                        { label: 'Variable', key: 'variable', type: 'text', placeholder: 'Velocidad base' },
                        { label: 'Valor Inicial', key: 'initial', type: 'text', placeholder: '10' },
                        { label: 'Mín.', key: 'min', type: 'text', placeholder: '5' },
                        { label: 'Máx.', key: 'max', type: 'text', placeholder: '25' },
                        { label: 'Notas', key: 'notes', type: 'text', placeholder: 'Afectado por bufos' }
                    ]
                })}
            </div>
        `;
    },

    renderStep5() {
        const s5 = this.activeGdd.section5;
        const lt = s5.level_template || {};
        return `
            <div class="card-box">
                <h3>5. Mundo, Niveles y Estructura</h3>

                <div class="form-group full-width">
                    <label>5.1 Estructura Global del Mundo</label>
                    <p class="field-hint">Lineal, hub, mundo abierto, habitaciones, runs, capítulos, noches, niveles, etc.</p>
                    <textarea data-path="section5.world_structure" rows="3">${this.escapeHtml(s5.world_structure)}</textarea>
                </div>

                <h4>5.2 Resumen / Lista de Niveles</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section5.level_design',
                    cols: [
                        { label: 'Nivel / Zona', key: 'level', type: 'text', placeholder: 'Zona 1: Bosque' },
                        { label: 'Objetivo', key: 'objective', type: 'text', placeholder: 'Encontrar templo' },
                        { label: 'Mecánica Profe.', key: 'main_mechanic', type: 'text', placeholder: 'Gancho de agarre' },
                        { label: 'Amenazas', key: 'threats', type: 'text', placeholder: 'Trampas y lobos' },
                        { label: 'Recompensa', key: 'reward', type: 'text', placeholder: 'Reliquia de oro' },
                        { label: 'Duración', key: 'duration', type: 'text', placeholder: '20 min' }
                    ]
                })}

                <h4>5.3 Ficha / Plantilla para cada Nivel</h4>
                <div class="form-grid">
                    <div class="form-group"><label>Nombre / ID Nivel</label><input type="text" data-path="section5.level_template.id" value="${this.escapeHtml(lt.id)}"></div>
                    <div class="form-group"><label>Objetivo Principal</label><input type="text" data-path="section5.level_template.objective" value="${this.escapeHtml(lt.objective)}"></div>
                    <div class="form-group"><label>Punto de Inicio (Spawn)</label><input type="text" data-path="section5.level_template.start" value="${this.escapeHtml(lt.start)}"></div>
                    <div class="form-group"><label>Condición de Final / Salida</label><input type="text" data-path="section5.level_template.end" value="${this.escapeHtml(lt.end)}"></div>
                    <div class="form-group full-width"><label>Layout / Plano / Descripción</label><textarea data-path="section5.level_template.layout" rows="2">${this.escapeHtml(lt.layout)}</textarea></div>
                    <div class="form-group"><label>Mecánicas Introducidas</label><input type="text" data-path="section5.level_template.mechanics" value="${this.escapeHtml(lt.mechanics)}"></div>
                    <div class="form-group"><label>Enemigos / Obstáculos</label><input type="text" data-path="section5.level_template.enemies" value="${this.escapeHtml(lt.enemies)}"></div>
                    <div class="form-group"><label>Coleccionables</label><input type="text" data-path="section5.level_template.collectibles" value="${this.escapeHtml(lt.collectibles)}"></div>
                    <div class="form-group"><label>Eventos / Cinemáticas / Triggers</label><input type="text" data-path="section5.level_template.events" value="${this.escapeHtml(lt.events)}"></div>
                    <div class="form-group full-width"><label>Ubicación de Checkpoints</label><input type="text" data-path="section5.level_template.checkpoint" value="${this.escapeHtml(lt.checkpoint)}"></div>
                </div>

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>Ritmo y Pacing</label>
                    <p class="field-hint">Alternancia entre tensión/descanso, combate/exploración, aprendizaje/desafío.</p>
                    <textarea data-path="section5.pacing" rows="3">${this.escapeHtml(s5.pacing)}</textarea>
                </div>
            </div>
        `;
    },

    renderStep6() {
        const s6 = this.activeGdd.section6;
        return `
            <div class="card-box">
                <h3>6. Narrativa y Personajes</h3>

                <div class="form-group full-width">
                    <label>6.1 Sinopsis / Premisa</label>
                    <p class="field-hint">Resumen de la historia con spoilers para uso interno del equipo.</p>
                    <textarea data-path="section6.synopsis" rows="4">${this.escapeHtml(s6.synopsis)}</textarea>
                </div>

                <h4>6.2 Estructura Narrativa (Actos)</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section6.narrative_structure',
                    cols: [
                        { label: 'Acto / Capítulo', key: 'act', type: 'text', placeholder: 'Acto I' },
                        { label: 'Situación', key: 'situation', type: 'text', placeholder: 'Inicio del viaje' },
                        { label: 'Objetivo Dramático', key: 'dramatic_obj', type: 'text', placeholder: 'Salvar el poblado' },
                        { label: 'Giro / Revelación', key: 'twist', type: 'text', placeholder: 'El aliado era el traidor' },
                        { label: 'Gameplay Asociado', key: 'gameplay', type: 'text', placeholder: 'Infiltración' }
                    ]
                })}

                <h4>6.3 Ficha de Personajes</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section6.characters',
                    cols: [
                        { label: 'Personaje', key: 'character', type: 'text', placeholder: 'Nombre' },
                        { label: 'Rol', key: 'role', type: 'text', placeholder: 'Protagonista / Antagonista' },
                        { label: 'Objetivo', key: 'objective', type: 'text', placeholder: 'Qué desea' },
                        { label: 'Personalidad', key: 'personality', type: 'text', placeholder: 'Rasgos clave' },
                        { label: 'Arco Narrativo', key: 'arc', type: 'text', placeholder: 'Evolución' },
                        { label: 'Relación Gameplay', key: 'gameplay', type: 'text', placeholder: 'Compañero IA / Boss' }
                    ]
                })}

                <h4>6.4 Lore y Worldbuilding</h4>
                <div class="form-group full-width">
                    <label>Reglas del Mundo</label>
                    <textarea data-path="section6.lore_rules" rows="2">${this.escapeHtml(s6.lore_rules)}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Cronología de Eventos</label>
                    <textarea data-path="section6.lore_chronology" rows="2">${this.escapeHtml(s6.lore_chronology)}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Información que Conoce el Jugador</label>
                    <textarea data-path="section6.lore_known_info" rows="2">${this.escapeHtml(s6.lore_known_info)}</textarea>
                </div>

                <h4>6.5 Diálogos y Cinemáticas</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section6.dialogues_cutscenes',
                    cols: [
                        { label: 'ID Escena', key: 'id', type: 'text', placeholder: 'CUT_01' },
                        { label: 'Escena', key: 'scene', type: 'text', placeholder: 'Encuentro con el jefe' },
                        { label: 'Personajes', key: 'characters', type: 'text', placeholder: 'Hero, Boss' },
                        { label: 'Trigger', key: 'trigger', type: 'text', placeholder: 'Entrar a la sala' },
                        { label: 'Duración', key: 'duration', type: 'text', placeholder: '45 seg' },
                        { label: 'Notas', key: 'notes', type: 'text', placeholder: 'In-engine cutscene' }
                    ]
                })}
            </div>
        `;
    },

    renderStep7() {
        const s7 = this.activeGdd.section7;
        return `
            <div class="card-box">
                <h3>7. Entidades, Enemigos y NPC</h3>

                <h4>7.1 Enemigos</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section7.enemies',
                    cols: [
                        { label: 'Nombre', key: 'name', type: 'text', placeholder: 'Soldado de Sombras' },
                        { label: 'Rol', key: 'role', type: 'text', placeholder: 'Tanque / Francotirador' },
                        { label: 'Comportamiento', key: 'behavior', type: 'text', placeholder: 'Carga directo' },
                        { label: 'Ataques', key: 'attacks', type: 'text', placeholder: 'Espadazo triple' },
                        { label: 'Debilidad', key: 'weakness', type: 'text', placeholder: 'Fuego' },
                        { label: 'Stats Clave', key: 'key_stats', type: 'text', placeholder: 'HP: 150, Atk: 20' },
                        { label: 'Drop / Recompensa', key: 'drop', type: 'text', placeholder: '50 Oro' }
                    ]
                })}

                <h4>7.2 Inteligencia Artificial (IA)</h4>
                <div class="form-group full-width">
                    <label>Arquitectura de IA</label>
                    <p class="field-hint">Estados, behavior tree, navegación, percepción, sonido, visión, prioridades.</p>
                    <textarea data-path="section7.ai_architecture" rows="3">${this.escapeHtml(s7.ai_architecture)}</textarea>
                </div>

                <h5>Tabla de Estados de IA</h5>
                ${this.renderDynamicTable({
                    arrayPath: 'section7.ai_states',
                    cols: [
                        { label: 'Estado IA', key: 'state', type: 'text', placeholder: 'Alerta' },
                        { label: 'Entrada / Trigger', key: 'entry', type: 'text', placeholder: 'Escuchar pisada' },
                        { label: 'Comportamiento', key: 'behavior', type: 'text', placeholder: 'Buscar origen del sonido' },
                        { label: 'Salida / Transición', key: 'exit', type: 'text', placeholder: 'Ver al jugador o tiempo expirado' }
                    ]
                })}

                <h4>7.3 Personajes No Jugables (NPC)</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section7.npcs',
                    cols: [
                        { label: 'NPC', key: 'npc', type: 'text', placeholder: 'Mercader Elías' },
                        { label: 'Función', key: 'function', type: 'text', placeholder: 'Venta de pociones' },
                        { label: 'Localización', key: 'location', type: 'text', placeholder: 'Plaza Central' },
                        { label: 'Interacciones', key: 'interactions', type: 'text', placeholder: 'Tienda y diálogos de historia' },
                        { label: 'Recompensa / Info', key: 'reward_info', type: 'text', placeholder: 'Descuento tras misión' }
                    ]
                })}

                <h4>7.4 Jefes (Bosses)</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section7.bosses',
                    cols: [
                        { label: 'Jefe', key: 'boss', type: 'text', placeholder: 'Señor del Abismo' },
                        { label: 'Fases', key: 'phases', type: 'text', placeholder: '3 Fases' },
                        { label: 'Mecánicas', key: 'mechanics', type: 'text', placeholder: 'Lanza proyectiles y crea zonas de fuego' },
                        { label: 'Telegraphs (Avisos)', key: 'telegraphs', type: 'text', placeholder: 'Destello rojo en ojos 1s antes' },
                        { label: 'Condición de Victoria', key: 'victory_cond', type: 'text', placeholder: 'Reducir salud a 0' }
                    ]
                })}
            </div>
        `;
    },

    renderStep8() {
        return `
            <div class="card-box">
                <h3>8. Objetos, Habilidades y Contenido</h3>

                <h4>8.1 Objetos / Consumibles</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section8.items',
                    cols: [
                        { label: 'ID', key: 'id', type: 'text', placeholder: 'ITEM_01' },
                        { label: 'Nombre', key: 'name', type: 'text', placeholder: 'Poción de Salud' },
                        { label: 'Tipo', key: 'type', type: 'text', placeholder: 'Consumible' },
                        { label: 'Efecto', key: 'effect', type: 'text', placeholder: '+50 HP instantáneo' },
                        { label: 'Rareza', key: 'rarity', type: 'text', placeholder: 'Común' },
                        { label: 'Obtención', key: 'how_to_get', type: 'text', placeholder: 'Loot / Tienda' },
                        { label: 'Valor', key: 'value', type: 'text', placeholder: '25 monedas' }
                    ]
                })}

                <h4>8.2 Armas y Herramientas</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section8.weapons_tools',
                    cols: [
                        { label: 'Nombre', key: 'name', type: 'text', placeholder: 'Espada de Acero' },
                        { label: 'Función', key: 'function', type: 'text', placeholder: 'Ataque de melé rápido' },
                        { label: 'Stats', key: 'stats', type: 'text', placeholder: 'Daño: 35 | Cadencia: 1.2s' },
                        { label: 'Coste / Requisito', key: 'cost', type: 'text', placeholder: 'Nivel 3' },
                        { label: 'Mejoras', key: 'upgrades', type: 'text', placeholder: '+10% daño por nivel' },
                        { label: 'Feedback', key: 'feedback', type: 'text', placeholder: 'Chispas al impactar' }
                    ]
                })}

                <h4>8.3 Habilidades y Perks</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section8.skills_perks',
                    cols: [
                        { label: 'Habilidad', key: 'skill', type: 'text', placeholder: 'Golpe Devastador' },
                        { label: 'Descripción', key: 'description', type: 'text', placeholder: 'Ataque con 200% de daño' },
                        { label: 'Requisito', key: 'requirement', type: 'text', placeholder: 'Fuerza 15' },
                        { label: 'Coste', key: 'cost', type: 'text', placeholder: '30 Mana' },
                        { label: 'Sinergias', key: 'synergies', type: 'text', placeholder: 'Combina con quemadura' },
                        { label: 'Balance', key: 'balance', type: 'text', placeholder: 'Cooldown: 10s' }
                    ]
                })}

                <h4>8.4 Coleccionables</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section8.collectibles',
                    cols: [
                        { label: 'Coleccionable', key: 'collectible', type: 'text', placeholder: 'Reliquias de Antaño' },
                        { label: 'Cantidad Total', key: 'count', type: 'text', placeholder: '12' },
                        { label: 'Ubicación', key: 'location', type: 'text', placeholder: 'Ocultos en los niveles' },
                        { label: 'Recompensa', key: 'reward', type: 'text', placeholder: 'Desbloquea skin dorada' },
                        { label: 'Seguimiento UI', key: 'ui_tracking', type: 'text', placeholder: 'Contador en menú de pausa' }
                    ]
                })}
            </div>
        `;
    },

    renderStep9() {
        const s9 = this.activeGdd.section9;
        return `
            <div class="card-box">
                <h3>9. Interfaz, UX y Accesibilidad</h3>

                <div class="form-group full-width">
                    <label>9.1 Flujo de Pantallas</label>
                    <p class="field-hint">Ej.: Splash → Menú Principal → Selección de personaje → Partida → Pausa → Resultados.</p>
                    <textarea data-path="section9.screen_flow" rows="3">${this.escapeHtml(s9.screen_flow)}</textarea>
                </div>

                <h4>9.2 Elementos del HUD (Head-Up Display)</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section9.hud_elements',
                    cols: [
                        { label: 'Elemento', key: 'element', type: 'text', placeholder: 'Barra de Vida' },
                        { label: 'Información', key: 'info', type: 'text', placeholder: 'Salud actual y máxima' },
                        { label: 'Posición', key: 'position', type: 'text', placeholder: 'Arriba Izquierda' },
                        { label: 'Cuándo aparece', key: 'trigger', type: 'text', placeholder: 'Siempre / Al recibir daño' },
                        { label: 'Prioridad', key: 'priority', type: 'text', placeholder: 'Alta' }
                    ]
                })}

                <h4>9.3 Menús e Interfaz</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section9.menus',
                    cols: [
                        { label: 'Pantalla', key: 'screen', type: 'text', placeholder: 'Menú Principal' },
                        { label: 'Opciones', key: 'options', type: 'text', placeholder: 'Jugar, Opciones, Créditos, Salir' },
                        { label: 'Navegación', key: 'navigation', type: 'text', placeholder: 'Ratón / D-Pad' },
                        { label: 'Notas', key: 'notes', type: 'text', placeholder: 'Música de fondo suave' }
                    ]
                })}

                <h4>9.4 Feedback (Juice / Sensaciones)</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section9.feedback_events',
                    cols: [
                        { label: 'Evento', key: 'event', type: 'text', placeholder: 'Recibir Daño' },
                        { label: 'Visual', key: 'visual', type: 'text', placeholder: 'Flash rojo en bordes' },
                        { label: 'Audio', key: 'audio', type: 'text', placeholder: 'Sonido de impacto sordo' },
                        { label: 'Háptico', key: 'haptic', type: 'text', placeholder: 'Vibración corta' },
                        { label: 'Texto', key: 'text', type: 'text', placeholder: 'Pop-up con número de daño' }
                    ]
                })}

                <h4>9.5 Accesibilidad</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section9.accessibility',
                    cols: [
                        { label: 'Necesidad', key: 'need', type: 'text', placeholder: 'Daltonismo' },
                        { label: 'Solución Prevista', key: 'solution', type: 'text', placeholder: 'Modos Deuteranopía / Protanopía' },
                        { label: 'Estado', key: 'status', type: 'text', placeholder: 'En desarrollo' }
                    ]
                })}
            </div>
        `;
    },

    renderStep10() {
        const s10 = this.activeGdd.section10;
        return `
            <div class="card-box">
                <h3>10. Dirección Artística</h3>

                <div class="form-group full-width">
                    <label>Visión Visual</label>
                    <p class="field-hint">Describe el estilo en pocas líneas: realista, low poly, pixel art, cel shading, estilizado, etc.</p>
                    <textarea data-path="section10.visual_vision" rows="3">${this.escapeHtml(s10.visual_vision)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>Mood y Tono</label>
                    <p class="field-hint">Palabras clave que debe transmitir la imagen (ej. opresivo, melancólico, vibrante).</p>
                    <input type="text" data-path="section10.mood_tone" value="${this.escapeHtml(s10.mood_tone)}">
                </div>

                <h4>10.1 Paleta de Colores</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section10.color_palette',
                    cols: [
                        { label: 'Uso / Contexto', key: 'use', type: 'text', placeholder: 'Zonas seguras' },
                        { label: 'Color / Referencia', key: 'color_ref', type: 'text', placeholder: '#2A9D8F / Azul Cálido' },
                        { label: 'Regla', key: 'rule', type: 'text', placeholder: 'Usar solo en interiores con luz' }
                    ]
                })}

                <div class="form-group full-width">
                    <label>10.2 Guía de Arte para Personajes</label>
                    <textarea data-path="section10.character_art_guide" rows="3">${this.escapeHtml(s10.character_art_guide)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>10.3 Guía de Escenarios y Entornos</label>
                    <textarea data-path="section10.environment_art_guide" rows="3">${this.escapeHtml(s10.environment_art_guide)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>10.4 Comportamiento de Cámara</label>
                    <textarea data-path="section10.camera" rows="3">${this.escapeHtml(s10.camera)}</textarea>
                </div>

                <h4>10.5 Efectos Visuales (VFX)</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section10.vfx',
                    cols: [
                        { label: 'Efecto', key: 'effect', type: 'text', placeholder: 'Explosión de Magia' },
                        { label: 'Trigger', key: 'trigger', type: 'text', placeholder: 'Al lanzar hechizo X' },
                        { label: 'Objetivo Visual', key: 'visual_goal', type: 'text', placeholder: 'Transmitir gran poder' },
                        { label: 'Prioridad', key: 'priority', type: 'text', placeholder: 'Alta' }
                    ]
                })}

                <h4>10.6 Lista de Assets de Arte</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section10.asset_list',
                    cols: [
                        { label: 'Asset', key: 'asset', type: 'text', placeholder: 'Modelo Protagonista' },
                        { label: 'Tipo', key: 'type', type: 'text', placeholder: 'Modelo 3D / Sprite' },
                        { label: 'Resolución / Polycount', key: 'resolution', type: 'text', placeholder: '15k polígonos' },
                        { label: 'Estado', key: 'status', type: 'text', placeholder: 'Terminado' },
                        { label: 'Responsable', key: 'owner', type: 'text', placeholder: 'Artista 3D' },
                        { label: 'Ruta / Link', key: 'path', type: 'text', placeholder: '/assets/models/' }
                    ]
                })}
            </div>
        `;
    },

    renderStep11() {
        const s11 = this.activeGdd.section11;
        return `
            <div class="card-box">
                <h3>11. Audio y Dirección Sonora</h3>

                <div class="form-group full-width">
                    <label>11.1 Dirección Sonora e Identidad</label>
                    <textarea data-path="section11.audio_identity" rows="3">${this.escapeHtml(s11.audio_identity)}</textarea>
                </div>

                <h4>11.2 Pistas de Música</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section11.music',
                    cols: [
                        { label: 'Pista / Tema', key: 'track', type: 'text', placeholder: 'Tema del Menú' },
                        { label: 'Situación', key: 'situation', type: 'text', placeholder: 'Menú principal' },
                        { label: 'Loop', key: 'loop', type: 'text', placeholder: 'Sí / No' },
                        { label: 'Transición', key: 'transition', type: 'text', placeholder: 'Fade out 2s' },
                        { label: 'Estado', key: 'status', type: 'text', placeholder: 'Completada' }
                    ]
                })}

                <h4>11.3 Efectos de Sonido (SFX)</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section11.sfx',
                    cols: [
                        { label: 'ID', key: 'id', type: 'text', placeholder: 'SFX_WALK_01' },
                        { label: 'Sonido', key: 'sound', type: 'text', placeholder: 'Pisada sobre piedra' },
                        { label: 'Trigger', key: 'trigger', type: 'text', placeholder: 'Evento de animación' },
                        { label: 'Variaciones', key: 'variations', type: 'text', placeholder: '4 variaciones de pitch' },
                        { label: 'Prioridad', key: 'priority', type: 'text', placeholder: 'Media' }
                    ]
                })}

                <h4>11.4 Voces y Doblaje</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section11.voices',
                    cols: [
                        { label: 'Personaje', key: 'character', type: 'text', placeholder: 'Protagonista' },
                        { label: 'Tipo', key: 'type', type: 'text', placeholder: 'Gritos de esfuerzo / Diálogo' },
                        { label: 'Idioma', key: 'language', type: 'text', placeholder: 'Español / Inglés' },
                        { label: 'Procesado', key: 'processing', type: 'text', placeholder: 'Efecto de casco futurista' },
                        { label: 'Notas', key: 'notes', type: 'text', placeholder: 'Actor contratado' }
                    ]
                })}

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>11.5 Reglas de Mezcla de Audio</label>
                    <p class="field-hint">Prioridades, ducking, distancias, buses, rangos de volumen.</p>
                    <textarea data-path="section11.mixing_rules" rows="3">${this.escapeHtml(s11.mixing_rules)}</textarea>
                </div>
            </div>
        `;
    },

    renderStep12() {
        const s12 = this.activeGdd.section12;
        const tt = s12.technical_table || {};
        return `
            <div class="card-box">
                <h3>12. Diseño Técnico</h3>

                <h4>Ficha de Especificaciones Técnicas</h4>
                <div class="form-grid">
                    <div class="form-group"><label>Motor y Versión</label><input type="text" data-path="section12.technical_table.engine" value="${this.escapeHtml(tt.engine)}" placeholder="Godot 4.3 / Unity 6"></div>
                    <div class="form-group"><label>Lenguaje de Programación</label><input type="text" data-path="section12.technical_table.language" value="${this.escapeHtml(tt.language)}" placeholder="C# / GDScript / C++"></div>
                    <div class="form-group"><label>Plataformas Objetivo</label><input type="text" data-path="section12.technical_table.platforms" value="${this.escapeHtml(tt.platforms)}" placeholder="Windows / Linux / WebGL"></div>
                    <div class="form-group"><label>Resolución / Aspect Ratios</label><input type="text" data-path="section12.technical_table.resolution" value="${this.escapeHtml(tt.resolution)}" placeholder="1920x1080 (16:9)"></div>
                    <div class="form-group"><label>FPS Objetivo</label><input type="text" data-path="section12.technical_table.fps" value="${this.escapeHtml(tt.fps)}" placeholder="60 FPS"></div>
                    <div class="form-group"><label>Hardware Mínimo</label><input type="text" data-path="section12.technical_table.hardware" value="${this.escapeHtml(tt.hardware)}" placeholder="GTX 1050, 8GB RAM"></div>
                    <div class="form-group"><label>Control de Versiones</label><input type="text" data-path="section12.technical_table.version_control" value="${this.escapeHtml(tt.version_control)}" placeholder="Git / GitHub / LFS"></div>
                    <div class="form-group"><label>Backend / Servicios</label><input type="text" data-path="section12.technical_table.backend" value="${this.escapeHtml(tt.backend)}" placeholder="Firebase / Nakama / N/A"></div>
                    <div class="form-group full-width"><label>Build y Distribución</label><input type="text" data-path="section12.technical_table.build_dist" value="${this.escapeHtml(tt.build_dist)}" placeholder="Steamworks / itch.io"></div>
                </div>

                <h4>12.1 Arquitectura de Software</h4>
                <div class="form-group full-width">
                    <label>Escenas / Estados Principales</label>
                    <textarea data-path="section12.architecture_scenes" rows="2">${this.escapeHtml(s12.architecture_scenes)}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Sistemas Globales / Managers</label>
                    <textarea data-path="section12.architecture_managers" rows="2">${this.escapeHtml(s12.architecture_managers)}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Persistencia de Datos</label>
                    <textarea data-path="section12.architecture_persistence" rows="2">${this.escapeHtml(s12.architecture_persistence)}</textarea>
                </div>

                <h4>12.2 Rendimiento y Objetivos</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section12.performance',
                    cols: [
                        { label: 'Métrica', key: 'metric', type: 'text', placeholder: 'Uso de RAM' },
                        { label: 'Objetivo', key: 'target', type: 'text', placeholder: '< 2 GB' },
                        { label: 'Límite', key: 'limit', type: 'text', placeholder: '3.5 GB' },
                        { label: 'Método de Prueba', key: 'test_method', type: 'text', placeholder: 'Profiler de Unity' }
                    ]
                })}

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>12.3 Multijugador / Red (si aplica)</label>
                    <textarea data-path="section12.network_model" rows="2" placeholder="P2P, Servidor dedicado, etc.">${this.escapeHtml(s12.network_model)}</textarea>
                </div>

                <h4>12.4 Riesgos Técnicos</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section12.technical_risks',
                    cols: [
                        { label: 'Riesgo', key: 'risk', type: 'text', placeholder: 'Complejidad de la IA' },
                        { label: 'Probabilidad', key: 'probability', type: 'text', placeholder: 'Alta' },
                        { label: 'Impacto', key: 'impact', type: 'text', placeholder: 'Alto' },
                        { label: 'Mitigación', key: 'mitigation', type: 'text', placeholder: 'Usar plugin existente' },
                        { label: 'Responsable', key: 'owner', type: 'text', placeholder: 'Lead Tech' }
                    ]
                })}
            </div>
        `;
    },

    renderStep13() {
        const s13 = this.activeGdd.section13;
        return `
            <div class="card-box">
                <h3>13. Monetización y Publicación</h3>
                <p class="field-hint">Puedes omitir esta sección si el proyecto es gratuito o de aprendizaje.</p>

                <div class="form-group full-width">
                    <label>Modelo de Negocio</label>
                    <textarea data-path="section13.business_model" rows="2" placeholder="Premium / Freemium / In-App Purchases">${this.escapeHtml(s13.business_model)}</textarea>
                </div>

                <div class="form-group full-width">
                    <label>Precio y Estrategia</label>
                    <textarea data-path="section13.pricing_strategy" rows="2" placeholder="Precio inicial 14.99€ con 10% de descuento de lanzamiento">${this.escapeHtml(s13.pricing_strategy)}</textarea>
                </div>

                <h4>13.1 Compras Integradas / Anuncios</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section13.purchases_ads',
                    cols: [
                        { label: 'Elemento', key: 'element', type: 'text', placeholder: 'Skin Exclusiva' },
                        { label: 'Tipo', key: 'type', type: 'text', placeholder: 'Cosmético' },
                        { label: 'Precio', key: 'price_freq', type: 'text', placeholder: '2.99€' },
                        { label: 'Impacto Gameplay', key: 'gameplay_impact', type: 'text', placeholder: 'Ninguno' },
                        { label: 'Notas', key: 'notes', type: 'text', placeholder: 'Disponible desde día 1' }
                    ]
                })}

                <h4>13.2 Plataformas y Stores</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section13.platforms_stores',
                    cols: [
                        { label: 'Store', key: 'store', type: 'text', placeholder: 'Steam' },
                        { label: 'Requisitos', key: 'requirements', type: 'text', placeholder: 'Steamworks SDK' },
                        { label: 'Cuenta', key: 'account', type: 'text', placeholder: 'Creada' },
                        { label: 'Build', key: 'build', type: 'text', placeholder: 'En revisión' },
                        { label: 'Estado', key: 'status', type: 'text', placeholder: 'Página lista' }
                    ]
                })}

                <h4>13.3 Analítica y Telemetría</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section13.analytics',
                    cols: [
                        { label: 'Evento', key: 'event', type: 'text', placeholder: 'Completar Nivel 1' },
                        { label: 'Cuándo se registra', key: 'trigger', type: 'text', placeholder: 'Al cruzar la meta' },
                        { label: 'Propósito', key: 'purpose', type: 'text', placeholder: 'Medir retención inicial' },
                        { label: 'Datos', key: 'data', type: 'text', placeholder: 'Tiempo tardado, muertes' }
                    ]
                })}
            </div>
        `;
    },

    renderStep14() {
        return `
            <div class="card-box">
                <h3>14. Producción y Alcance</h3>

                <h4>14.1 Equipo de Trabajo</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section14.team',
                    cols: [
                        { label: 'Persona', key: 'person', type: 'text', placeholder: 'Nombre' },
                        { label: 'Rol', key: 'role', type: 'text', placeholder: 'Game Designer' },
                        { label: 'Responsabilidades', key: 'responsibilities', type: 'text', placeholder: 'Documentación y balance' },
                        { label: 'Disponibilidad', key: 'availability', type: 'text', placeholder: 'Tiempo completo' }
                    ]
                })}

                <h4>14.2 Alcance del Proyecto (Scope)</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section14.scope',
                    cols: [
                        { label: 'Categoría', key: 'category', type: 'text', placeholder: 'Niveles' },
                        { label: 'MVP (Mínimo)', key: 'mvp', type: 'text', placeholder: '3 Niveles' },
                        { label: 'Objetivo Final', key: 'final_goal', type: 'text', placeholder: '10 Niveles' },
                        { label: 'Fuera de Alcance', key: 'out_of_scope', type: 'text', placeholder: 'Editor de mapas' }
                    ]
                })}

                <h4>14.3 Roadmap / Hitos de Producción</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section14.roadmap',
                    cols: [
                        { label: 'Hito', key: 'milestone', type: 'text', placeholder: 'Alpha' },
                        { label: 'Objetivo', key: 'objective', type: 'text', placeholder: 'Core loop jugable' },
                        { label: 'Entregables', key: 'deliverables', type: 'text', placeholder: 'Build jugable con 1 nivel' },
                        { label: 'Fecha Límite', key: 'date', type: 'text', placeholder: '15/11/2026' },
                        { label: 'Criterio de Cierre', key: 'closing_criterion', type: 'text', placeholder: 'Testing interno completado' }
                    ]
                })}

                <h4>14.4 Backlog de Features</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section14.feature_backlog',
                    cols: [
                        { label: 'ID', key: 'id', type: 'text', placeholder: 'FEAT_01' },
                        { label: 'Feature', key: 'feature', type: 'text', placeholder: 'Sistema de Crafting' },
                        { label: 'Prioridad', key: 'priority', type: 'text', placeholder: 'Media' },
                        { label: 'Esfuerzo', key: 'effort', type: 'text', placeholder: '5 Días' },
                        { label: 'Dependencias', key: 'dependencies', type: 'text', placeholder: 'Inventario' },
                        { label: 'Estado', key: 'status', type: 'text', placeholder: 'Pendiente' }
                    ]
                })}

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>14.5 Definition of Done (Criterios de Finalización)</label>
                    <textarea data-path="section14.definition_of_done" rows="3" placeholder="Una feature está terminada cuando: probada en build, sin bugs críticos y aprobada por el lead designer.">${this.escapeHtml(this.activeGdd.section14.definition_of_done)}</textarea>
                </div>
            </div>
        `;
    },

    renderStep15() {
        const s15 = this.activeGdd.section15;
        return `
            <div class="card-box">
                <h3>15. QA, Testing y Balance</h3>

                <div class="form-group full-width">
                    <label>15.1 Plan y Estrategia de Pruebas</label>
                    <textarea data-path="section15.test_plan" rows="3">${this.escapeHtml(s15.test_plan)}</textarea>
                </div>

                <h4>15.2 Casos de Prueba</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section15.test_cases',
                    cols: [
                        { label: 'ID', key: 'id', type: 'text', placeholder: 'TC_01' },
                        { label: 'Sistema', key: 'system', type: 'text', placeholder: 'Inventario' },
                        { label: 'Pasos', key: 'steps', type: 'text', placeholder: 'Arrastrar objeto fuera de pantalla' },
                        { label: 'Resultado Esperado', key: 'expected', type: 'text', placeholder: 'El objeto vuelve a su slot' },
                        { label: 'Resultado Real', key: 'actual', type: 'text', placeholder: 'Correcto' },
                        { label: 'Estado', key: 'status', type: 'text', placeholder: 'Pasado / Fallado' }
                    ]
                })}

                <h4>15.3 Registro de Bugs</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section15.bug_tracker',
                    cols: [
                        { label: 'ID', key: 'id', type: 'text', placeholder: 'BUG_12' },
                        { label: 'Bug', key: 'bug', type: 'text', placeholder: 'Caída al vacío en Nivel 2' },
                        { label: 'Severidad', key: 'severity', type: 'text', placeholder: 'Alta' },
                        { label: 'Pasos Reproducción', key: 'steps_to_reproduce', type: 'text', placeholder: 'Saltar hacia la pared izquierda' },
                        { label: 'Versión', key: 'version', type: 'text', placeholder: 'v0.1' },
                        { label: 'Estado', key: 'status', type: 'text', placeholder: 'Abierto / Corregido' }
                    ]
                })}

                <h4>15.4 Playtesting</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section15.playtesting',
                    cols: [
                        { label: 'Sesión', key: 'session', type: 'text', placeholder: 'Sesión 1' },
                        { label: 'Perfil Tester', key: 'tester_profile', type: 'text', placeholder: 'Jugador habitual' },
                        { label: 'Objetivo', key: 'objective', type: 'text', placeholder: 'Evaluar dificultad Nivel 1' },
                        { label: 'Hallazgos', key: 'findings', type: 'text', placeholder: 'Perdió 5 veces en el primer salto' },
                        { label: 'Acción Tomada', key: 'action', type: 'text', placeholder: 'Aumentar tamaño de plataforma' }
                    ]
                })}

                <h4>15.5 Métricas de Balance</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section15.balance_metrics',
                    cols: [
                        { label: 'Métrica', key: 'metric', type: 'text', placeholder: 'Winrate Boss 1' },
                        { label: 'Objetivo', key: 'target', type: 'text', placeholder: '40% victorias' },
                        { label: 'Resultado', key: 'result', type: 'text', placeholder: '15% victorias' },
                        { label: 'Decisión', key: 'decision', type: 'text', placeholder: 'Reducir daño del Boss en 15%' }
                    ]
                })}
            </div>
        `;
    },

    renderStep16() {
        return `
            <div class="card-box">
                <h3>16. Riesgos y Decisiones de Diseño</h3>

                <h4>16.1 Registro de Riesgos Generales</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section16.risk_register',
                    cols: [
                        { label: 'Riesgo', key: 'risk', type: 'text', placeholder: 'Retraso en assets 3D' },
                        { label: 'Tipo', key: 'type', type: 'text', placeholder: 'Arte' },
                        { label: 'Prob.', key: 'prob', type: 'text', placeholder: 'Media' },
                        { label: 'Impacto', key: 'impact', type: 'text', placeholder: 'Alto' },
                        { label: 'Plan de Contingencia', key: 'plan', type: 'text', placeholder: 'Usar placeholders temporales' },
                        { label: 'Owner', key: 'owner', type: 'text', placeholder: 'Art Director' }
                    ]
                })}

                <h4>16.2 Decision Log (Historial de Decisiones)</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section16.decision_log',
                    cols: [
                        { label: 'Fecha', key: 'date', type: 'text', placeholder: '30/09/2026' },
                        { label: 'Decisión Tomada', key: 'decision', type: 'text', placeholder: 'Eliminar el modo multijugador' },
                        { label: 'Motivo', key: 'reason', type: 'text', placeholder: 'Presupuesto y alcance' },
                        { label: 'Alternativas Descartadas', key: 'discarded_alt', type: 'text', placeholder: 'Coop local' },
                        { label: 'Responsable', key: 'owner', type: 'text', placeholder: 'Game Director' }
                    ]
                })}

                <h4>16.3 Preguntas Abiertas / Pendientes</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section16.open_questions',
                    cols: [
                        { label: 'Pregunta', key: 'question', type: 'text', placeholder: '¿Inundar la cueva en el Acto II?' },
                        { label: 'Impacto', key: 'impact', type: 'text', placeholder: 'Requiere físicas de agua' },
                        { label: 'Responsable', key: 'owner', type: 'text', placeholder: 'Lead Designer' },
                        { label: 'Fecha Límite', key: 'deadline', type: 'text', placeholder: '15/10/2026' },
                        { label: 'Resolución', key: 'resolution', type: 'text', placeholder: 'Pendiente' }
                    ]
                })}
            </div>
        `;
    },

    renderStep17() {
        const s17 = this.activeGdd.section17;
        return `
            <div class="card-box">
                <h3>17. Anexos y Checklist de Revisión</h3>

                <h4>17.1 Glosario de Términos</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section17.glossary',
                    cols: [
                        { label: 'Término', key: 'term', type: 'text', placeholder: 'DPS' },
                        { label: 'Definición', key: 'definition', type: 'text', placeholder: 'Daño por segundo' }
                    ]
                })}

                <h4>17.2 Referencias y Enlaces</h4>
                ${this.renderDynamicTable({
                    arrayPath: 'section17.references',
                    cols: [
                        { label: 'Recurso', key: 'resource', type: 'text', placeholder: 'Tablero Trello' },
                        { label: 'Tipo', key: 'type', type: 'text', placeholder: 'Gestión' },
                        { label: 'Enlace / Ruta', key: 'link', type: 'text', placeholder: 'https://trello.com/...' },
                        { label: 'Uso', key: 'use', type: 'text', placeholder: 'Seguimiento de tareas' }
                    ]
                })}

                <div class="form-group full-width" style="margin-top: 15px;">
                    <label>17.3 Diagramas Pendientes o Enlaces a Esquemas</label>
                    <textarea data-path="section17.pending_diagrams" rows="3" placeholder="Inserta aquí enlaces a diagramas Miro, Figma, o notas...">${this.escapeHtml(s17.pending_diagrams)}</textarea>
                </div>

                <h4>17.4 Checklist de Revisión del GDD</h4>
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
                            <th style="width: 50px;">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        if (arr.length === 0) {
            html += `
                <tr>
                    <td colspan="${cols.length + 1}" class="text-center text-muted" style="padding: 15px;">
                        No hay elementos. Haz clic en "➕ Añadir Fila" para agregar datos.
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
                        <button type="button" class="btn-icon btn-danger-icon" title="Eliminar fila" onclick="QuestionnaireModule.removeTableRow('${arrayPath}', ${index})">🗑️</button>
                    </td>
                </tr>`;
            });
        }

        html += `
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 10px;">
                <button type="button" class="btn btn-sm btn-secondary" onclick="QuestionnaireModule.addTableRow('${arrayPath}', ${JSON.stringify(cols.map(c => c.key)).replace(/"/g, '&quot;')})">➕ Añadir Fila</button>
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

        // Configurar Zona Drag and Drop para el Logo
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
            alert('Por favor selecciona un archivo de imagen válido.');
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

    // Auxiliares de lectura/escritura profunda de objetos
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
