(function() {
    // --- CONFIGURACIÓN ---
    const CONFIG = {
        totalSearches: 33, // Número de búsquedas
        duration: 6000,    // Base de 6 segundos de espera
        daysToRemember: 5, // No repetir palabras en 5 días
        storageKey: 'bing_rewards_v4_ultimate' // Nueva llave para nueva versión
    };

    console.log("--- Iniciando Sistema: Gaming, Fitness & Steam Edition ---");

    // --- GESTOR DE MEMORIA (Persistencia Local) ---
    const Memory = {
        get: () => {
            const data = localStorage.getItem(CONFIG.storageKey);
            return data ? JSON.parse(data) : { history: {} };
        },
        save: (data) => localStorage.setItem(CONFIG.storageKey, JSON.stringify(data)),
        cleanOldEntries: () => {
            const data = Memory.get();
            const now = Date.now();
            const retentionMs = CONFIG.daysToRemember * 24 * 60 * 60 * 1000;
            let cleaned = 0;
            for (const term in data.history) {
                if (now - data.history[term] > retentionMs) {
                    delete data.history[term];
                    cleaned++;
                }
            }
            Memory.save(data);
            if(cleaned > 0) console.log(`Limpieza: ${cleaned} registros antiguos borrados.`);
        },
        isRemembered: (term) => Memory.get().history.hasOwnProperty(term),
        add: (term) => {
            const data = Memory.get();
            data.history[term] = Date.now();
            Memory.save(data);
        }
    };

    // --- CEREBRO DE PLANTILLAS (BLUEPRINTS) ---
    const Blueprints = {
        // --- NUEVA SECCIÓN: GAMING GENERAL ---
        gaming_general: {
            items: ["GTA VI", "PlayStation 5 Pro", "Nintendo Switch 2", "Xbox Game Pass", "Elden Ring DLC", "Call of Duty Black Ops 6", "The Witcher 4"],
            modifiers: ["fecha de lanzamiento", "rumores filtrados", "análisis técnico df", "gameplay 4k", "comparativa gráficos", "mejores accesorios", "guía de trofeos"],
            templates: [
                "Noticias {item} {modifier}",
                "¿Vale la pena {item}?",
                "Fecha salida {item} {modifier}",
                "Ver trailer {item} {modifier}"
            ]
        },
        // --- NUEVA SECCIÓN: FITNESS ---
        fitness_gym: {
            items: ["Creatina monohidratada", "Proteína Whey", "Rutina Full Body", "Calistenia", "Ayuno intermitente", "Zapatillas running", "Reloj Garmin", "Mancuernas ajustables"],
            modifiers: ["beneficios y contraindicaciones", "para principiantes", "en casa sin equipo", "mejores marcas 2025", "cómo tomar correctamente", "para ganar masa muscular", "para perder grasa"],
            templates: [
                "Mejor {item} {modifier}",
                "Guía de {item} {modifier}",
                "Errores al hacer {item}",
                "Rutina de {item} pdf"
            ]
        },
        // --- NUEVA SECCIÓN: STEAM & OFERTAS ---
        steam_pc: {
            items: ["Steam Deck OLED", "Steam Summer Sale", "Counter Strike 2", "Baldur's Gate 3", "Juegos Indie", "Tarjetas gráficas NVIDIA", "SteamDB"],
            modifiers: ["ofertas históricas", "juegos por menos de 5 dolares", "requisitos mínimos pc", "mejores mods", "skins baratas", "reembolso política", "fps boost guia"],
            templates: [
                "Comprar {item} {modifier}",
                "Cuándo empieza {item}",
                "Top valorados {item} {modifier}",
                "{item} precio chile"
            ]
        },
        // --- SECCIONES ANTERIORES (Mantenidas para variedad) ---
        cocktails: {
            items: ["Mojito", "Pisco Sour", "Ramazzotti", "Gin Tonic", "Vino Navegado", "Michelada"],
            modifiers: ["receta casera", "ingredientes", "preparación fácil", "con maracuyá", "medidas exactas"],
            templates: ["Cómo preparar {item} {modifier}", "Receta de {item} {modifier}"]
        },
        tech_dev: {
            items: ["Python", "React Native", "Docker", "Linux", "Git", "SQL"],
            modifiers: ["tutorial pdf", "curso gratis", "documentación", "entrevista preguntas", "roadmap 2025"],
            templates: ["Aprender {item} {modifier}", "Solucionar error {item}"]
        },
        finance: {
            items: ["Bitcoin", "Dolar observado", "UF hoy", "Acciones Tesla", "Ethereum"],
            modifiers: ["precio hoy", "predicción", "noticias", "gráfico tiempo real"],
            templates: ["{item} {modifier}", "Valor {item} a pesos"]
        }
    };

    // --- MOTOR GENERADOR ---
    const Generator = {
        buildQuery: () => {
            // 1. Seleccionar categoría
            const categories = Object.keys(Blueprints);
            const catKey = categories[Math.floor(Math.random() * categories.length)];
            const schema = Blueprints[catKey];

            // 2. Seleccionar datos
            const template = schema.templates[Math.floor(Math.random() * schema.templates.length)];
            const item = schema.items[Math.floor(Math.random() * schema.items.length)];
            const modifier = schema.modifiers[Math.floor(Math.random() * schema.modifiers.length)];

            // 3. Construir frase
            let query = template.replace("{item}", item).replace("{modifier}", modifier);
            return query.replace("{modifier}", "").trim(); 
        },

        getUniqueQuery: () => {
            let attempt = 0;
            let query = "";
            do {
                query = Generator.buildQuery();
                attempt++;
            } while (Memory.isRemembered(query) && attempt < 50);

            if (attempt >= 50) return query + " " + Math.floor(Math.random() * 9999);
            return query;
        }
    };

    // --- EJECUCIÓN ---
    let currentCount = 0;

    function performSearch() {
        if (currentCount === 0) Memory.cleanOldEntries();

        if (currentCount >= CONFIG.totalSearches) {
            console.log("✅ Misión cumplida: 33 búsquedas realizadas.");
            alert("Script finalizado. Puntos obtenidos.");
            return;
        }

        currentCount++;
        const searchTerm = Generator.getUniqueQuery();
        Memory.add(searchTerm);

        console.log(`[${currentCount}/${CONFIG.totalSearches}] Buscando: "${searchTerm}"`);

        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}&form=QBLH`;
        const win = window.open(searchUrl, "_blank");

        // Tiempo aleatorio entre 6 y 10 segundos para máxima seguridad
        const randomDuration = CONFIG.duration + Math.floor(Math.random() * 4000);

        setTimeout(() => {
            if (win) {
                win.close();
                setTimeout(performSearch, 1000);
            } else {
                console.error("❌ Error: Habilita las ventanas emergentes (Pop-ups).");
            }
        }, randomDuration);
    }

    performSearch();
})();
