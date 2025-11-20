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
        // --- GAMING (Expandido) ---
        gaming_general: {
            items: ["GTA VI", "PlayStation 5 Pro", "Nintendo Switch 2", "Xbox Game Pass", "Elden Ring DLC", "Call of Duty Black Ops 6", "The Witcher 4", "Hollow Knight Silksong", "Metroid Prime 4", "FIFA 25", "Minecraft updates", "Roblox"],
            modifiers: ["fecha de lanzamiento", "rumores filtrados", "análisis técnico df", "gameplay 4k", "comparativa gráficos", "mejores accesorios", "guía de trofeos", "requisitos pc", "bugs y errores"],
            templates: [
                "Noticias {item} {modifier}",
                "¿Vale la pena {item}?",
                "Fecha salida {item} {modifier}",
                "Ver trailer {item} {modifier}",
                "Mejores trucos para {item}"
            ]
        },
        // --- FITNESS (Expandido) ---
        fitness_gym: {
            items: ["Creatina monohidratada", "Proteína Whey", "Rutina Full Body", "Calistenia", "Ayuno intermitente", "Zapatillas running", "Reloj Garmin", "Mancuernas ajustables", "Yoga para principiantes", "Dieta Keto", "Magnesio y Zinc", "Crossfit"],
            modifiers: ["beneficios y contraindicaciones", "para principiantes", "en casa sin equipo", "mejores marcas 2025", "cómo tomar correctamente", "para ganar masa muscular", "para perder grasa", "antes y después"],
            templates: [
                "Mejor {item} {modifier}",
                "Guía de {item} {modifier}",
                "Errores al hacer {item}",
                "Rutina de {item} pdf",
                "Qué es {item} y para qué sirve"
            ]
        },
        // --- STEAM & PC (Expandido) ---
        steam_pc: {
            items: ["Steam Deck OLED", "Steam Summer Sale", "Counter Strike 2", "Baldur's Gate 3", "Juegos Indie", "Tarjetas gráficas NVIDIA", "SteamDB", "Teclado Mecánico", "Mouse Gamer Inalámbrico", "RTX 5090"],
            modifiers: ["ofertas históricas", "juegos por menos de 5 dolares", "requisitos mínimos pc", "mejores mods", "skins baratas", "reembolso política", "fps boost guia", "driver update"],
            templates: [
                "Comprar {item} {modifier}",
                "Cuándo empieza {item}",
                "Top valorados {item} {modifier}",
                "{item} precio chile",
                "Solución problema {item}"
            ]
        },
        // --- NUEVA: CINE Y SERIES ---
        entertainment: {
            items: ["Deadpool 3", "Stranger Things 5", "House of the Dragon", "Oppenheimer", "Dune Part 2", "Premios Oscar 2025", "Spiderman Beyond the Spiderverse", "The Boys Season 4", "Shrek 5"],
            modifiers: ["fecha estreno chile", "reparto completo", "final explicado", "escenas post creditos", "crítica rotten tomatoes", "teorías fans", "resumen temporada anterior"],
            templates: [
                "Ver trailer {item} {modifier}",
                "Cuándo sale {item}",
                "Explicación final {item}",
                "Actores de {item} biografía",
                "Noticias rodaje {item}"
            ]
        },
        // --- NUEVA: CIENCIA Y CURIOSIDADES ---
        science_curios: {
            items: ["Agujero negro", "Telescopio James Webb", "Misión a Marte", "Inteligencia Artificial General", "Cambio climático", "Energía de fusión", "Triángulo de las Bermudas", "Pirámides de Egipto", "Civilización Maya"],
            modifiers: ["últimos descubrimientos", "documental nacional geographic", "explicación sencilla", "fotos alta resolución", "teorías conspirativas", "historia resumida", "artículo científico"],
            templates: [
                "Qué es {item} {modifier}",
                "Misterios de {item}",
                "Avances en {item} hoy",
                "Historia real de {item}",
                "Datos curiosos sobre {item}"
            ]
        },
        // --- NUEVA: DEPORTES Y EVENTOS ---
        sports: {
            items: ["Champions League", "Copa América", "Mundial 2026", "Fórmula 1", "NBA Playoffs", "Tenis ATP Ranking", "Colo Colo", "U de Chile", "Selección Chilena"],
            modifiers: ["tabla de posiciones", "calendario partidos", "mejores goles", "fichajes rumores", "entradas precio", "resumen partido ayer", "lesiones jugadores"],
            templates: [
                "Resultados {item} {modifier}",
                "Próximo partido {item}",
                "Ver en vivo {item} {modifier}",
                "Noticias última hora {item}"
            ]
        },
        // --- TECH DEV (Expandido) ---
        tech_dev: {
            items: ["Python", "React Native", "Docker", "Linux", "Git", "SQL", "Rust", "Go Lang", "AWS Services", "Cybersecurity", "Arduino", "Raspberry Pi 5"],
            modifiers: ["tutorial pdf", "curso gratis", "documentación", "entrevista preguntas", "roadmap 2025", "proyectos para principiantes", "vs code extensiones", "certificación precio"],
            templates: [
                "Aprender {item} {modifier}",
                "Solucionar error {item}",
                "Mejores libros {item}",
                "Instalar {item} paso a paso"
            ]
        },
        // --- FINANZAS (Expandido) ---
        finance: {
            items: ["Bitcoin", "Dolar observado", "UF hoy", "Acciones Tesla", "Ethereum", "Bono Marzo", "Devolución de impuestos", "Depósitos a plazo", "Dogecoin"],
            modifiers: ["precio hoy", "predicción expertos", "noticias mercado", "gráfico tiempo real", "calculadora pesos", "invertir o vender"],
            templates: [
                "{item} {modifier}",
                "Valor {item} a pesos",
                "¿Conviene invertir en {item}?",
                "Histórico precio {item}"
            ]
        },
        // --- LIFESTYLE (Expandido) ---
        lifestyle: {
            items: ["Mojito", "Pisco Sour", "Sushi casero", "Pan de masa madre", "Meditación guiada", "Huerto urbano", "Decoración minimalista", "Libros best sellers"],
            modifiers: ["receta fácil", "paso a paso", "ingredientes", "beneficios salud", "tutorial youtube", "ideas Pinterest"],
            templates: [
                "Cómo hacer {item} {modifier}",
                "Mejores ideas {item}",
                "Guía de {item} para principiantes"
            ]
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
