/**
 * preview.js
 * Genera la vista de documento profesional y la exportación a PDF (vía ventana de impresión).
 */

const PreviewModule = {
    render(gdd) {
        const container = document.getElementById('gdd-document-render');
        if (!container || !gdd) return;

        const cover = gdd.cover || {};
        const title = cover.title || 'Nombre del Videojuego';
        const studio = cover.studio || 'Estudio / Equipo';
        const version = cover.version || '0.1';
        const date = cover.date || new Date().toLocaleDateString('es-ES');
        const author = cover.author || 'Adrián Bautista Ramos';
        const logo = cover.logo;
        const notes = cover.notes || 'Documento Confidencial';

        let html = `
            <div class="gdd-page-container">
                <!-- Cabecera de Página (Arriba a la Derecha) -->
                <div class="print-page-header">
                    <span class="header-game-title">${this.escape(title)} - GDD</span>
                </div>

                <!-- PORTADA DE PÁGINA 1 -->
                <div class="gdd-cover-page">
                    <div class="cover-top">
                        <span class="cover-subtitle">GAME DESIGN DOCUMENT</span>
                        <h1 class="cover-title">${this.escape(title)}</h1>
                        <div class="cover-studio-badge">ESTUDIO / EQUIPO: <strong>${this.escape(studio)}</strong></div>
                    </div>

                    <div class="cover-metadata-grid">
                        <div class="meta-item">
                            <span class="meta-label">VERSIÓN DEL GDD</span>
                            <span class="meta-value">${this.escape(version)}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">FECHA</span>
                            <span class="meta-value">${this.escape(date)}</span>
                        </div>
                        <div class="meta-item full-width">
                            <span class="meta-label">RESPONSABLE</span>
                            <span class="meta-value">${this.escape(author || 'No asignado')}</span>
                        </div>
                    </div>

                    <!-- CONFIDENCIALIDAD / NOTAS & IMAGEN DEL ESTUDIO EN PORTADA -->
                    <div class="cover-confidentiality-box">
                        <div class="confidentiality-header">CONFIDENCIALIDAD / NOTAS</div>
                        <div class="confidentiality-content">
                            ${logo ? `
                                <div class="cover-logo-display">
                                    <img src="${logo}" alt="Logo ${this.escape(studio)}" class="studio-cover-img">
                                </div>
                            ` : `
                                <div class="no-logo-placeholder">
                                    <span class="placeholder-icon">🏢</span>
                                    <span>[Imagen / Logo del Estudio no definida]</span>
                                </div>
                            `}
                            <p class="notes-text">${this.escape(notes)}</p>
                        </div>
                    </div>

                    <!-- CONTROL DE VERSIONES -->
                    <div class="cover-section-block">
                        <h3>Control de Versiones</h3>
                        ${this.renderTable(
                            ['Versión', 'Fecha', 'Autor', 'Cambios realizados'],
                            (cover.version_control || []).map(vc => [vc.version, vc.date, vc.author, vc.changes])
                        )}
                    </div>

                    <!-- ESTADO DEL DOCUMENTO -->
                    <div class="cover-section-block">
                        <h3>Estado del Documento</h3>
                        ${this.renderTable(
                            ['Área', 'Responsable', 'Estado', 'Última revisión'],
                            (cover.doc_status || []).map(ds => [ds.area, ds.responsible, ds.status, ds.last_review])
                        )}
                    </div>
                </div>

                <!-- SALTO DE PÁGINA TRAS LA PORTADA -->
                <div class="page-break"></div>

                <!-- GUÍA RÁPIDA DE CONVENCIÓN -->
                <div class="gdd-section-block info-callout-box">
                    <h4>💡 Cómo usar este GDD</h4>
                    <p>El GDD es un documento vivo. No hace falta completar todo desde el primer día: rellena primero la visión, el core loop y las mecánicas principales; amplía el resto conforme el prototipo avance.</p>
                </div>

                <!-- SECCIÓN 1: RESUMEN EJECUTIVO -->
                <div class="gdd-section-block">
                    <h2>1. Resumen ejecutivo</h2>
                    <p class="section-subtitle">Debe permitir que alguien entienda el juego en 2–3 minutos.</p>

                    <div class="doc-field">
                        <span class="doc-field-label">HIGH CONCEPT</span>
                        <p class="doc-field-value">${this.formatText(gdd.section1?.high_concept)}</p>
                    </div>

                    <div class="doc-field">
                        <span class="doc-field-label">ELEVATOR PITCH</span>
                        <p class="doc-field-value">${this.formatText(gdd.section1?.elevator_pitch)}</p>
                    </div>

                    <h3>Ficha Técnica</h3>
                    ${this.renderTable(
                        ['Dato', 'Definición'],
                        [
                            ['Género', gdd.section1?.technical_sheet?.genre],
                            ['Subgénero', gdd.section1?.technical_sheet?.subgenre],
                            ['Plataformas', gdd.section1?.technical_sheet?.platforms],
                            ['Público objetivo', gdd.section1?.technical_sheet?.target_audience],
                            ['Modo', gdd.section1?.technical_sheet?.mode],
                            ['Perspectiva', gdd.section1?.technical_sheet?.perspective],
                            ['Duración estimada', gdd.section1?.technical_sheet?.duration],
                            ['Motor', gdd.section1?.technical_sheet?.engine],
                            ['Modelo de negocio', gdd.section1?.technical_sheet?.business_model]
                        ]
                    )}

                    <div class="doc-field">
                        <span class="doc-field-label">PILARES DE DISEÑO</span>
                        <p class="doc-field-value">${this.formatText(gdd.section1?.design_pillars)}</p>
                    </div>

                    <div class="doc-field">
                        <span class="doc-field-label">USP / ELEMENTOS DIFERENCIALES</span>
                        <p class="doc-field-value">${this.formatText(gdd.section1?.usp)}</p>
                    </div>

                    <div class="doc-field">
                        <span class="doc-field-label">REFERENCIAS</span>
                        <p class="doc-field-value">${this.formatText(gdd.section1?.references)}</p>
                    </div>
                </div>

                <!-- SECCIÓN 2: EXPERIENCIA DEL JUGADOR -->
                <div class="gdd-section-block">
                    <h2>2. Experiencia del jugador</h2>

                    <h3>2.1 Fantasía del jugador</h3>
                    <div class="doc-field">
                        <span class="doc-field-label">FANTASÍA PRINCIPAL</span>
                        <p class="doc-field-value">${this.formatText(gdd.section2?.fantasy_main)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">EMOCIONES OBJETIVO</span>
                        <p class="doc-field-value">${this.formatText(gdd.section2?.emotions_target)}</p>
                    </div>

                    <h3>2.2 Objetivos</h3>
                    ${this.renderTable(
                        ['Tipo', 'Objetivo', 'Cómo se comunica al jugador'],
                        (gdd.section2?.objectives || []).map(o => [o.type, o.objective, o.communication])
                    )}

                    <h3>2.3 Core loop</h3>
                    <div class="doc-field">
                        <span class="doc-field-label">BUCLE PRINCIPAL</span>
                        <p class="doc-field-value">${this.formatText(gdd.section2?.core_loop_main)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">BUCLE DE SESIÓN</span>
                        <p class="doc-field-value">${this.formatText(gdd.section2?.core_loop_session)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">BUCLE DE PROGRESIÓN</span>
                        <p class="doc-field-value">${this.formatText(gdd.section2?.core_loop_progression)}</p>
                    </div>

                    <h3>2.4 Condiciones de éxito y fracaso</h3>
                    ${this.renderTable(
                        ['Situación', 'Condición', 'Consecuencia', 'Feedback'],
                        (gdd.section2?.success_fail_conditions || []).map(s => [s.situation, s.condition, s.consequence, s.feedback])
                    )}
                </div>

                <!-- SECCIÓN 3: GAMEPLAY Y MECÁNICAS -->
                <div class="gdd-section-block">
                    <h2>3. Gameplay y mecánicas</h2>

                    <h3>3.1 Controles</h3>
                    ${this.renderTable(
                        ['Acción', 'Teclado/ratón', 'Mando', 'Móvil', 'Notas'],
                        (gdd.section3?.controls || []).map(c => [c.action, c.keyboard, c.gamepad, c.mobile, c.notes])
                    )}

                    <h3>3.2 Movimiento</h3>
                    <div class="doc-field">
                        <span class="doc-field-label">SISTEMA DE MOVIMIENTO</span>
                        <p class="doc-field-value">${this.formatText(gdd.section3?.movement_system)}</p>
                    </div>

                    <h3>3.3 Mecánicas principales</h3>
                    ${this.renderTable(
                        ['Mecánica', 'Descripción', 'Input', 'Reglas', 'Feedback', 'Prioridad'],
                        (gdd.section3?.main_mechanics || []).map(m => [m.mechanic, m.description, m.input, m.rules, m.feedback, m.priority])
                    )}

                    <h3>3.4 Mecánicas secundarias</h3>
                    ${this.renderTable(
                        ['Mecánica', 'Descripción', 'Cuándo se usa', 'Dependencias'],
                        (gdd.section3?.secondary_mechanics || []).map(m => [m.mechanic, m.description, m.when_used, m.dependencies])
                    )}

                    <h3>3.5 Interacción con el mundo</h3>
                    <div class="doc-field">
                        <span class="doc-field-label">SISTEMA DE INTERACCIÓN</span>
                        <p class="doc-field-value">${this.formatText(gdd.section3?.interaction_system)}</p>
                    </div>

                    <h3>3.6 Combate</h3>
                    ${this.renderTable(
                        ['Elemento', 'Diseño / reglas'],
                        [
                            ['Ataque', gdd.section3?.combat?.attack],
                            ['Defensa', gdd.section3?.combat?.defense],
                            ['Daño', gdd.section3?.combat?.damage],
                            ['Vida', gdd.section3?.combat?.health],
                            ['Estados', gdd.section3?.combat?.status_effects],
                            ['Armas', gdd.section3?.combat?.weapons],
                            ['Munición/recursos', gdd.section3?.combat?.ammo_resources],
                            ['IA en combate', gdd.section3?.combat?.combat_ai],
                            ['Muerte/respawn', gdd.section3?.combat?.death_respawn]
                        ]
                    )}
                </div>

                <!-- SECCIÓN 4: SISTEMAS DEL JUEGO -->
                <div class="gdd-section-block">
                    <h2>4. Sistemas del juego</h2>

                    <div class="doc-field">
                        <span class="doc-field-label">4.1 PROGRESIÓN</span>
                        <p class="doc-field-value">${this.formatText(gdd.section4?.progression)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">4.2 ECONOMÍA Y RECURSOS</span>
                        <p class="doc-field-value">${this.formatText(gdd.section4?.economy)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">4.3 INVENTARIO Y EQUIPAMIENTO</span>
                        <p class="doc-field-value">${this.formatText(gdd.section4?.inventory)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">4.4 RECOMPENSAS</span>
                        <p class="doc-field-value">${this.formatText(gdd.section4?.rewards)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">4.5 GUARDADO</span>
                        <p class="doc-field-value">${this.formatText(gdd.section4?.saves)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">4.6 DIFICULTAD</span>
                        <p class="doc-field-value">${this.formatText(gdd.section4?.difficulty_desc)}</p>
                    </div>

                    <h3>Variables de Balance</h3>
                    ${this.renderTable(
                        ['Variable de balance', 'Valor inicial', 'Mín.', 'Máx.', 'Notas'],
                        (gdd.section4?.balance_variables || []).map(b => [b.variable, b.initial, b.min, b.max, b.notes])
                    )}
                </div>

                <!-- SECCIÓN 5: MUNDO, NIVELES Y ESTRUCTURA -->
                <div class="gdd-section-block">
                    <h2>5. Mundo, niveles y estructura</h2>

                    <div class="doc-field">
                        <span class="doc-field-label">5.1 ESTRUCTURA GLOBAL</span>
                        <p class="doc-field-value">${this.formatText(gdd.section5?.world_structure)}</p>
                    </div>

                    <h3>5.2 Diseño de niveles</h3>
                    ${this.renderTable(
                        ['Nivel / zona', 'Objetivo', 'Mecánica protagonista', 'Amenazas', 'Recompensa', 'Duración'],
                        (gdd.section5?.level_design || []).map(l => [l.level, l.objective, l.main_mechanic, l.threats, l.reward, l.duration])
                    )}

                    <h3>5.3 Plantilla para cada nivel</h3>
                    ${this.renderTable(
                        ['Campo', 'Contenido'],
                        [
                            ['Nombre / ID', gdd.section5?.level_template?.id],
                            ['Objetivo', gdd.section5?.level_template?.objective],
                            ['Inicio', gdd.section5?.level_template?.start],
                            ['Final', gdd.section5?.level_template?.end],
                            ['Layout', gdd.section5?.level_template?.layout],
                            ['Mecánicas', gdd.section5?.level_template?.mechanics],
                            ['Enemigos / obstáculos', gdd.section5?.level_template?.enemies],
                            ['Coleccionables', gdd.section5?.level_template?.collectibles],
                            ['Eventos', gdd.section5?.level_template?.events],
                            ['Checkpoint', gdd.section5?.level_template?.checkpoint]
                        ]
                    )}

                    <div class="doc-field">
                        <span class="doc-field-label">RITMO Y PACING</span>
                        <p class="doc-field-value">${this.formatText(gdd.section5?.pacing)}</p>
                    </div>
                </div>

                <!-- SECCIÓN 6: NARRATIVA Y PERSONAJES -->
                <div class="gdd-section-block">
                    <h2>6. Narrativa y personajes</h2>

                    <div class="doc-field">
                        <span class="doc-field-label">6.1 SINOPSIS</span>
                        <p class="doc-field-value">${this.formatText(gdd.section6?.synopsis)}</p>
                    </div>

                    <h3>6.2 Estructura narrativa</h3>
                    ${this.renderTable(
                        ['Acto / capítulo', 'Situación', 'Objetivo dramático', 'Giro / revelación', 'Gameplay asociado'],
                        (gdd.section6?.narrative_structure || []).map(n => [n.act, n.situation, n.dramatic_obj, n.twist, n.gameplay])
                    )}

                    <h3>6.3 Personajes</h3>
                    ${this.renderTable(
                        ['Personaje', 'Rol', 'Objetivo', 'Personalidad', 'Arco', 'Gameplay'],
                        (gdd.section6?.characters || []).map(ch => [ch.character, ch.role, ch.objective, ch.personality, ch.arc, ch.gameplay])
                    )}

                    <h3>6.4 Lore y worldbuilding</h3>
                    <div class="doc-field">
                        <span class="doc-field-label">REGLAS DEL MUNDO</span>
                        <p class="doc-field-value">${this.formatText(gdd.section6?.lore_rules)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">CRONOLOGÍA</span>
                        <p class="doc-field-value">${this.formatText(gdd.section6?.lore_chronology)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">INFORMACIÓN QUE CONOCE EL JUGADOR</span>
                        <p class="doc-field-value">${this.formatText(gdd.section6?.lore_known_info)}</p>
                    </div>

                    <h3>6.5 Diálogos y cinemáticas</h3>
                    ${this.renderTable(
                        ['ID', 'Escena', 'Personajes', 'Trigger', 'Duración', 'Notas'],
                        (gdd.section6?.dialogues_cutscenes || []).map(d => [d.id, d.scene, d.characters, d.trigger, d.duration, d.notes])
                    )}
                </div>

                <!-- SECCIÓN 7: ENTIDADES, ENEMIGOS Y NPC -->
                <div class="gdd-section-block">
                    <h2>7. Entidades, enemigos y NPC</h2>

                    <h3>7.1 Enemigos</h3>
                    ${this.renderTable(
                        ['Nombre', 'Rol', 'Comportamiento', 'Ataques', 'Debilidad', 'Stats clave', 'Drop'],
                        (gdd.section7?.enemies || []).map(e => [e.name, e.role, e.behavior, e.attacks, e.weakness, e.key_stats, e.drop])
                    )}

                    <h3>7.2 IA</h3>
                    <div class="doc-field">
                        <span class="doc-field-label">ARQUITECTURA DE IA</span>
                        <p class="doc-field-value">${this.formatText(gdd.section7?.ai_architecture)}</p>
                    </div>
                    ${this.renderTable(
                        ['Estado IA', 'Entrada', 'Comportamiento', 'Salida'],
                        (gdd.section7?.ai_states || []).map(a => [a.state, a.entry, a.behavior, a.exit])
                    )}

                    <h3>7.3 NPC</h3>
                    ${this.renderTable(
                        ['NPC', 'Función', 'Localización', 'Interacciones', 'Recompensa / información'],
                        (gdd.section7?.npcs || []).map(npc => [npc.npc, npc.function, npc.location, npc.interactions, npc.reward_info])
                    )}

                    <h3>7.4 Jefes (si aplica)</h3>
                    ${this.renderTable(
                        ['Boss', 'Fases', 'Mecánicas', 'Telegraphs', 'Condición de victoria'],
                        (gdd.section7?.bosses || []).map(b => [b.boss, b.phases, b.mechanics, b.telegraphs, b.victory_cond])
                    )}
                </div>

                <!-- SECCIÓN 8: OBJETOS, HABILIDADES Y CONTENIDO -->
                <div class="gdd-section-block">
                    <h2>8. Objetos, habilidades y contenido</h2>

                    <h3>8.1 Objetos</h3>
                    ${this.renderTable(
                        ['ID', 'Nombre', 'Tipo', 'Efecto', 'Rareza', 'Obtención', 'Valor'],
                        (gdd.section8?.items || []).map(i => [i.id, i.name, i.type, i.effect, i.rarity, i.how_to_get, i.value])
                    )}

                    <h3>8.2 Armas / herramientas</h3>
                    ${this.renderTable(
                        ['Nombre', 'Función', 'Stats', 'Coste', 'Mejoras', 'Feedback'],
                        (gdd.section8?.weapons_tools || []).map(w => [w.name, w.function, w.stats, w.cost, w.upgrades, w.feedback])
                    )}

                    <h3>8.3 Habilidades / perks</h3>
                    ${this.renderTable(
                        ['Habilidad', 'Descripción', 'Requisito', 'Coste', 'Sinergias', 'Balance'],
                        (gdd.section8?.skills_perks || []).map(sk => [sk.skill, sk.description, sk.requirement, sk.cost, sk.synergies, sk.balance])
                    )}

                    <h3>8.4 Coleccionables</h3>
                    ${this.renderTable(
                        ['Coleccionable', 'Cantidad', 'Ubicación', 'Recompensa', 'Seguimiento UI'],
                        (gdd.section8?.collectibles || []).map(col => [col.collectible, col.count, col.location, col.reward, col.ui_tracking])
                    )}
                </div>

                <!-- SECCIÓN 9: INTERFAZ, UX Y ACCESIBILIDAD -->
                <div class="gdd-section-block">
                    <h2>9. Interfaz, UX y accesibilidad</h2>

                    <div class="doc-field">
                        <span class="doc-field-label">9.1 FLUJO DE PANTALLAS</span>
                        <p class="doc-field-value">${this.formatText(gdd.section9?.screen_flow)}</p>
                    </div>

                    <h3>9.2 HUD</h3>
                    ${this.renderTable(
                        ['Elemento', 'Información', 'Posición', 'Cuándo aparece', 'Prioridad'],
                        (gdd.section9?.hud_elements || []).map(h => [h.element, h.info, h.position, h.trigger, h.priority])
                    )}

                    <h3>9.3 Menús</h3>
                    ${this.renderTable(
                        ['Pantalla', 'Opciones', 'Navegación', 'Notas'],
                        (gdd.section9?.menus || []).map(m => [m.screen, m.options, m.navigation, m.notes])
                    )}

                    <h3>9.4 Feedback</h3>
                    ${this.renderTable(
                        ['Evento', 'Visual', 'Audio', 'Háptico', 'Texto'],
                        (gdd.section9?.feedback_events || []).map(f => [f.event, f.visual, f.audio, f.haptic, f.text])
                    )}

                    <h3>9.5 Accesibilidad</h3>
                    ${this.renderTable(
                        ['Necesidad', 'Solución prevista', 'Estado'],
                        (gdd.section9?.accessibility || []).map(acc => [acc.need, acc.solution, acc.status])
                    )}
                </div>

                <!-- SECCIÓN 10: DIRECCIÓN ARTÍSTICA -->
                <div class="gdd-section-block">
                    <h2>10. Dirección artística</h2>

                    <div class="doc-field">
                        <span class="doc-field-label">VISIÓN VISUAL</span>
                        <p class="doc-field-value">${this.formatText(gdd.section10?.visual_vision)}</p>
                    </div>

                    <div class="doc-field">
                        <span class="doc-field-label">MOOD / TONO</span>
                        <p class="doc-field-value">${this.formatText(gdd.section10?.mood_tone)}</p>
                    </div>

                    <h3>10.1 Paleta y color</h3>
                    ${this.renderTable(
                        ['Uso', 'Color / referencia', 'Regla'],
                        (gdd.section10?.color_palette || []).map(p => [p.use, p.color_ref, p.rule])
                    )}

                    <div class="doc-field">
                        <span class="doc-field-label">10.2 GUÍA DE PERSONAJES</span>
                        <p class="doc-field-value">${this.formatText(gdd.section10?.character_art_guide)}</p>
                    </div>

                    <div class="doc-field">
                        <span class="doc-field-label">10.3 GUÍA DE ESCENARIOS</span>
                        <p class="doc-field-value">${this.formatText(gdd.section10?.environment_art_guide)}</p>
                    </div>

                    <div class="doc-field">
                        <span class="doc-field-label">10.4 CÁMARA</span>
                        <p class="doc-field-value">${this.formatText(gdd.section10?.camera)}</p>
                    </div>

                    <h3>10.5 VFX</h3>
                    ${this.renderTable(
                        ['Efecto', 'Trigger', 'Objetivo visual', 'Prioridad'],
                        (gdd.section10?.vfx || []).map(v => [v.effect, v.trigger, v.visual_goal, v.priority])
                    )}

                    <h3>10.6 Lista de assets</h3>
                    ${this.renderTable(
                        ['Asset', 'Tipo', 'Tamaño / resolución', 'Estado', 'Responsable', 'Ruta'],
                        (gdd.section10?.asset_list || []).map(ast => [ast.asset, ast.type, ast.resolution, ast.status, ast.owner, ast.path])
                    )}
                </div>

                <!-- SECCIÓN 11: AUDIO -->
                <div class="gdd-section-block">
                    <h2>11. Audio</h2>

                    <div class="doc-field">
                        <span class="doc-field-label">11.1 IDENTIDAD SONORA</span>
                        <p class="doc-field-value">${this.formatText(gdd.section11?.audio_identity)}</p>
                    </div>

                    <h3>11.2 Música</h3>
                    ${this.renderTable(
                        ['Pista', 'Situación', 'Loop', 'Transición', 'Estado'],
                        (gdd.section11?.music || []).map(m => [m.track, m.situation, m.loop, m.transition, m.status])
                    )}

                    <h3>11.3 SFX</h3>
                    ${this.renderTable(
                        ['ID', 'Sonido', 'Trigger', 'Variaciones', 'Prioridad'],
                        (gdd.section11?.sfx || []).map(s => [s.id, s.sound, s.trigger, s.variations, s.priority])
                    )}

                    <h3>11.4 Voz</h3>
                    ${this.renderTable(
                        ['Personaje', 'Tipo', 'Idioma', 'Procesado', 'Notas'],
                        (gdd.section11?.voices || []).map(v => [v.character, v.type, v.language, v.processing, v.notes])
                    )}

                    <div class="doc-field">
                        <span class="doc-field-label">11.5 MEZCLA</span>
                        <p class="doc-field-value">${this.formatText(gdd.section11?.mixing_rules)}</p>
                    </div>
                </div>

                <!-- SECCIÓN 12: DISEÑO TÉCNICO -->
                <div class="gdd-section-block">
                    <h2>12. Diseño técnico</h2>

                    <h3>Especificaciones Principales</h3>
                    ${this.renderTable(
                        ['Dato', 'Decisión'],
                        [
                            ['Motor y versión', gdd.section12?.technical_table?.engine],
                            ['Lenguaje', gdd.section12?.technical_table?.language],
                            ['Plataformas objetivo', gdd.section12?.technical_table?.platforms],
                            ['Resolución / aspect ratios', gdd.section12?.technical_table?.resolution],
                            ['FPS objetivo', gdd.section12?.technical_table?.fps],
                            ['Hardware mínimo', gdd.section12?.technical_table?.hardware],
                            ['Control de versiones', gdd.section12?.technical_table?.version_control],
                            ['Backend / servicios', gdd.section12?.technical_table?.backend],
                            ['Build / distribución', gdd.section12?.technical_table?.build_dist]
                        ]
                    )}

                    <h3>12.1 Arquitectura</h3>
                    <div class="doc-field">
                        <span class="doc-field-label">ESCENAS / ESTADOS PRINCIPALES</span>
                        <p class="doc-field-value">${this.formatText(gdd.section12?.architecture_scenes)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">SISTEMAS GLOBALES / MANAGERS</span>
                        <p class="doc-field-value">${this.formatText(gdd.section12?.architecture_managers)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">PERSISTENCIA DE DATOS</span>
                        <p class="doc-field-value">${this.formatText(gdd.section12?.architecture_persistence)}</p>
                    </div>

                    <h3>12.2 Rendimiento</h3>
                    ${this.renderTable(
                        ['Métrica', 'Objetivo', 'Límite', 'Método de prueba'],
                        (gdd.section12?.performance || []).map(perf => [perf.metric, perf.target, perf.limit, perf.test_method])
                    )}

                    <div class="doc-field">
                        <span class="doc-field-label">12.3 MULTIJUGADOR / RED</span>
                        <p class="doc-field-value">${this.formatText(gdd.section12?.network_model)}</p>
                    </div>

                    <h3>12.4 Riesgos técnicos</h3>
                    ${this.renderTable(
                        ['Riesgo', 'Probabilidad', 'Impacto', 'Mitigación', 'Responsable'],
                        (gdd.section12?.technical_risks || []).map(tr => [tr.risk, tr.probability, tr.impact, tr.mitigation, tr.owner])
                    )}
                </div>

                <!-- SECCIÓN 13: MONETIZACIÓN Y PUBLICACIÓN -->
                <div class="gdd-section-block">
                    <h2>13. Monetización y publicación</h2>

                    <div class="doc-field">
                        <span class="doc-field-label">MODELO DE NEGOCIO</span>
                        <p class="doc-field-value">${this.formatText(gdd.section13?.business_model)}</p>
                    </div>
                    <div class="doc-field">
                        <span class="doc-field-label">PRECIO / ESTRATEGIA</span>
                        <p class="doc-field-value">${this.formatText(gdd.section13?.pricing_strategy)}</p>
                    </div>

                    <h3>13.1 Compras / anuncios</h3>
                    ${this.renderTable(
                        ['Elemento', 'Tipo', 'Precio / frecuencia', 'Impacto gameplay', 'Notas'],
                        (gdd.section13?.purchases_ads || []).map(pa => [pa.element, pa.type, pa.price_freq, pa.gameplay_impact, pa.notes])
                    )}

                    <h3>13.2 Plataformas y stores</h3>
                    ${this.renderTable(
                        ['Store', 'Requisitos', 'Cuenta', 'Build', 'Estado'],
                        (gdd.section13?.platforms_stores || []).map(ps => [ps.store, ps.requirements, ps.account, ps.build, ps.status])
                    )}

                    <h3>13.3 Analítica</h3>
                    ${this.renderTable(
                        ['Evento', 'Cuándo se registra', 'Propósito', 'Datos'],
                        (gdd.section13?.analytics || []).map(an => [an.event, an.trigger, an.purpose, an.data])
                    )}
                </div>

                <!-- SECCIÓN 14: PRODUCCIÓN Y ALCANCE -->
                <div class="gdd-section-block">
                    <h2>14. Producción y alcance</h2>

                    <h3>14.1 Equipo</h3>
                    ${this.renderTable(
                        ['Persona', 'Rol', 'Responsabilidades', 'Disponibilidad'],
                        (gdd.section14?.team || []).map(t => [t.person, t.role, t.responsibilities, t.availability])
                    )}

                    <h3>14.2 Alcance</h3>
                    ${this.renderTable(
                        ['Categoría', 'MVP', 'Objetivo final', 'Fuera de alcance'],
                        (gdd.section14?.scope || []).map(sc => [sc.category, sc.mvp, sc.final_goal, sc.out_of_scope])
                    )}

                    <h3>14.3 Roadmap</h3>
                    ${this.renderTable(
                        ['Hito', 'Objetivo', 'Entregables', 'Fecha', 'Criterio de cierre'],
                        (gdd.section14?.roadmap || []).map(rm => [rm.milestone, rm.objective, rm.deliverables, rm.date, rm.closing_criterion])
                    )}

                    <h3>14.4 Backlog de features</h3>
                    ${this.renderTable(
                        ['ID', 'Feature', 'Prioridad', 'Esfuerzo', 'Dependencias', 'Estado'],
                        (gdd.section14?.feature_backlog || []).map(fb => [fb.id, fb.feature, fb.priority, fb.effort, fb.dependencies, fb.status])
                    )}

                    <div class="doc-field">
                        <span class="doc-field-label">14.5 DEFINITION OF DONE</span>
                        <p class="doc-field-value">${this.formatText(gdd.section14?.definition_of_done)}</p>
                    </div>
                </div>

                <!-- SECCIÓN 15: QA, TESTING Y BALANCE -->
                <div class="gdd-section-block">
                    <h2>15. QA, testing y balance</h2>

                    <div class="doc-field">
                        <span class="doc-field-label">15.1 ESTRATEGIA DE PRUEBAS</span>
                        <p class="doc-field-value">${this.formatText(gdd.section15?.test_plan)}</p>
                    </div>

                    <h3>15.2 Casos de prueba</h3>
                    ${this.renderTable(
                        ['ID', 'Sistema', 'Pasos', 'Resultado esperado', 'Resultado', 'Estado'],
                        (gdd.section15?.test_cases || []).map(tc => [tc.id, tc.system, tc.steps, tc.expected, tc.actual, tc.status])
                    )}

                    <h3>15.3 Registro de bugs</h3>
                    ${this.renderTable(
                        ['ID', 'Bug', 'Severidad', 'Pasos para reproducir', 'Versión', 'Estado'],
                        (gdd.section15?.bug_tracker || []).map(b => [b.id, b.bug, b.severity, b.steps_to_reproduce, b.version, b.status])
                    )}

                    <h3>15.4 Playtesting</h3>
                    ${this.renderTable(
                        ['Sesión', 'Perfil tester', 'Objetivo', 'Hallazgos', 'Acción'],
                        (gdd.section15?.playtesting || []).map(pt => [pt.session, pt.tester_profile, pt.objective, pt.findings, pt.action])
                    )}

                    <h3>15.5 Métricas de balance</h3>
                    ${this.renderTable(
                        ['Métrica', 'Objetivo', 'Resultado', 'Decisión'],
                        (gdd.section15?.balance_metrics || []).map(bm => [bm.metric, bm.target, bm.result, bm.decision])
                    )}
                </div>

                <!-- SECCIÓN 16: RIESGOS Y DECISIONES DE DISEÑO -->
                <div class="gdd-section-block">
                    <h2>16. Riesgos y decisiones de diseño</h2>

                    <h3>16.1 Registro de riesgos</h3>
                    ${this.renderTable(
                        ['Riesgo', 'Tipo', 'Prob.', 'Impacto', 'Plan', 'Owner'],
                        (gdd.section16?.risk_register || []).map(rr => [rr.risk, rr.type, rr.prob, rr.impact, rr.plan, rr.owner])
                    )}

                    <h3>16.2 Decision log</h3>
                    ${this.renderTable(
                        ['Fecha', 'Decisión', 'Motivo', 'Alternativas descartadas', 'Responsable'],
                        (gdd.section16?.decision_log || []).map(dl => [dl.date, dl.decision, dl.reason, dl.discarded_alt, dl.owner])
                    )}

                    <h3>16.3 Preguntas abiertas</h3>
                    ${this.renderTable(
                        ['Pregunta', 'Impacto', 'Responsable', 'Fecha límite', 'Resolución'],
                        (gdd.section16?.open_questions || []).map(oq => [oq.question, oq.impact, oq.owner, oq.deadline, oq.resolution])
                    )}
                </div>

                <!-- SECCIÓN 17: ANEXOS -->
                <div class="gdd-section-block">
                    <h2>17. Anexos</h2>

                    <h3>17.1 Glosario</h3>
                    ${this.renderTable(
                        ['Término', 'Definición'],
                        (gdd.section17?.glossary || []).map(g => [g.term, g.definition])
                    )}

                    <h3>17.2 Referencias y enlaces</h3>
                    ${this.renderTable(
                        ['Recurso', 'Tipo', 'Enlace / ruta', 'Uso'],
                        (gdd.section17?.references || []).map(r => [r.resource, r.type, r.link, r.use])
                    )}

                    <div class="doc-field">
                        <span class="doc-field-label">17.3 DIAGRAMAS</span>
                        <p class="doc-field-value">${this.formatText(gdd.section17?.pending_diagrams)}</p>
                    </div>

                    <h3>17.4 Checklist de revisión del GDD</h3>
                    <div class="doc-checklist-render">
                        ${(gdd.section17?.checklist || []).map(item => `
                            <div class="doc-check-line ${item.checked ? 'is-checked' : ''}">
                                <span class="check-box-icon">${item.checked ? '☑️' : '☐'}</span>
                                <span>${this.escape(item.text)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    renderTable(headers, rows) {
        // Filtrar filas completamente vacías
        const validRows = rows.filter(row => row && row.some(cell => cell && cell.toString().trim() !== ''));

        if (validRows.length === 0) {
            return `<div class="empty-table-note">— Información no definida —</div>`;
        }

        return `
            <div class="print-table-wrapper">
                <table class="doc-table">
                    <thead>
                        <tr>
                            ${headers.map(h => `<th>${this.escape(h)}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${validRows.map(row => `
                            <tr>
                                ${row.map(cell => `<td>${this.formatText(cell)}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    formatText(val) {
        if (!val || val.toString().trim() === '') {
            return `<span class="empty-field-text">—</span>`;
        }
        return this.escape(val).replace(/\n/g, '<br>');
    },

    escape(str) {
        if (typeof str !== 'string') return str || '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    exportPdf() {
        window.print();
    }
};
