/**
 * template-data.js
 * Esquema limpio y utilidades para el GDD basado en Plantilla_GDD_Profesional.docx
 */

function createEmptyGdd(title = "", studio = "") {
    return {
        id: "gdd_" + Date.now(),
        updatedAt: new Date().toISOString(),
        
        // Portada y Datos Generales
        cover: {
            title: title || "Nuevo Videojuego",
            studio: studio || "Mi Estudio",
            logo: "", // Base64 o URL del logo del estudio
            version: "0.1",
            date: new Date().toLocaleDateString('es-ES'),
            author: "",
            notes: "Este documento contiene información confidencial sobre el diseño del videojuego.",
            version_control: [],
            doc_status: []
        },

        // 1. Resumen ejecutivo
        section1: {
            high_concept: "",
            elevator_pitch: "",
            technical_sheet: {
                genre: "",
                subgenre: "",
                platforms: "",
                target_audience: "",
                mode: "",
                perspective: "",
                duration: "",
                engine: "",
                business_model: ""
            },
            design_pillars: "",
            usp: "",
            references: ""
        },

        // 2. Experiencia del jugador
        section2: {
            fantasy_main: "",
            emotions_target: "",
            objectives: [],
            core_loop_main: "",
            core_loop_session: "",
            core_loop_progression: "",
            success_fail_conditions: []
        },

        // 3. Gameplay y mecánicas
        section3: {
            controls: [],
            movement_system: "",
            main_mechanics: [],
            secondary_mechanics: [],
            interaction_system: "",
            combat: {
                attack: "",
                defense: "",
                damage: "",
                health: "",
                status_effects: "",
                weapons: "",
                ammo_resources: "",
                combat_ai: "",
                death_respawn: ""
            }
        },

        // 4. Sistemas del juego
        section4: {
            progression: "",
            economy: "",
            inventory: "",
            rewards: "",
            saves: "",
            difficulty_desc: "",
            balance_variables: []
        },

        // 5. Mundo, niveles y estructura
        section5: {
            world_structure: "",
            level_design: [],
            level_template: {
                id: "",
                objective: "",
                start: "",
                end: "",
                layout: "",
                mechanics: "",
                enemies: "",
                collectibles: "",
                events: "",
                checkpoint: ""
            },
            pacing: ""
        },

        // 6. Narrativa y personajes
        section6: {
            synopsis: "",
            narrative_structure: [],
            characters: [],
            lore_rules: "",
            lore_chronology: "",
            lore_known_info: "",
            dialogues_cutscenes: []
        },

        // 7. Entidades, enemigos y NPC
        section7: {
            enemies: [],
            ai_architecture: "",
            ai_states: [],
            npcs: [],
            bosses: []
        },

        // 8. Objetos, habilidades y contenido
        section8: {
            items: [],
            weapons_tools: [],
            skills_perks: [],
            collectibles: []
        },

        // 9. Interfaz, UX y accesibilidad
        section9: {
            screen_flow: "",
            hud_elements: [],
            menus: [],
            feedback_events: [],
            accessibility: []
        },

        // 10. Dirección artística
        section10: {
            visual_vision: "",
            mood_tone: "",
            color_palette: [],
            character_art_guide: "",
            environment_art_guide: "",
            camera: "",
            vfx: [],
            asset_list: []
        },

        // 11. Audio
        section11: {
            audio_identity: "",
            music: [],
            sfx: [],
            voices: [],
            mixing_rules: ""
        },

        // 12. Diseño técnico
        section12: {
            technical_table: {
                engine: "",
                language: "",
                platforms: "",
                resolution: "",
                fps: "",
                hardware: "",
                version_control: "",
                backend: "",
                build_dist: ""
            },
            architecture_scenes: "",
            architecture_managers: "",
            architecture_persistence: "",
            performance: [],
            network_model: "",
            technical_risks: []
        },

        // 13. Monetización y publicación
        section13: {
            business_model: "",
            pricing_strategy: "",
            purchases_ads: [],
            platforms_stores: [],
            analytics: []
        },

        // 14. Producción y alcance
        section14: {
            team: [],
            scope: [],
            roadmap: [],
            feature_backlog: [],
            definition_of_done: ""
        },

        // 15. QA, testing y balance
        section15: {
            test_plan: "",
            test_cases: [],
            bug_tracker: [],
            playtesting: [],
            balance_metrics: []
        },

        // 16. Riesgos y decisiones de diseño
        section16: {
            risk_register: [],
            decision_log: [],
            open_questions: []
        },

        // 17. Anexos
        section17: {
            glossary: [],
            references: [],
            pending_diagrams: "",
            checklist: [
                { id: "c1", text: "La fantasía del jugador y el high concept se entienden rápidamente.", checked: false },
                { id: "c2", text: "El core loop está definido y coincide con las mecánicas principales.", checked: false },
                { id: "c3", text: "Las condiciones de éxito y fracaso están documentadas.", checked: false },
                { id: "c4", text: "Los niveles y la progresión tienen una estructura clara.", checked: false },
                { id: "c5", text: "Narrativa y gameplay no se contradicen.", checked: false },
                { id: "c6", text: "UI/UX, arte y audio tienen reglas suficientemente concretas.", checked: false },
                { id: "c7", text: "Las decisiones técnicas clave están registradas.", checked: false },
                { id: "c8", text: "El alcance del MVP está separado del contenido deseable.", checked: false },
                { id: "c9", text: "Los riesgos principales tienen mitigación.", checked: false },
                { id: "c10", text: "El GDD refleja el estado actual del juego.", checked: false }
            ]
        }
    };
}

/**
 * Calcula el porcentaje de completitud del GDD
 */
function calculateGddCompletion(gdd) {
    if (!gdd) return 0;
    
    let totalFields = 0;
    let filledFields = 0;

    function check(val) {
        totalFields++;
        if (val !== null && val !== undefined && val !== "" && (Array.isArray(val) ? val.length > 0 : true)) {
            filledFields++;
        }
    }

    // Datos principales
    check(gdd.cover.title);
    check(gdd.cover.studio);
    check(gdd.cover.author);
    check(gdd.cover.logo);

    // Sección 1
    check(gdd.section1.high_concept);
    check(gdd.section1.elevator_pitch);
    check(gdd.section1.technical_sheet.genre);
    check(gdd.section1.technical_sheet.platforms);
    check(gdd.section1.technical_sheet.engine);
    check(gdd.section1.design_pillars);
    check(gdd.section1.usp);

    // Sección 2
    check(gdd.section2.fantasy_main);
    check(gdd.section2.core_loop_main);

    // Sección 3
    check(gdd.section3.movement_system);

    // Sección 6
    check(gdd.section6.synopsis);

    // Sección 10
    check(gdd.section10.visual_vision);

    if (totalFields === 0) return 0;
    return Math.round((filledFields / totalFields) * 100);
}
