(function() {
    // --- CONFIGURACIÓN ---
    const CONFIG = {
        totalSearches: 33,
        duration: 5000, // 5 segundos
        daysToRemember: 5,
        storageKey: 'bing_rewards_ai_memory'
    };

    // --- DICCIONARIO BASE (SEMILLA) ---
    // El script usará esto para "aprender" combinaciones
    const seedDictionary = {
        topics: ["clima", "noticias", "receta", "definicion", "precio", "historia", "mapa", "tutorial", "comprar", "mejor", "juegos"],
        subjects: ["python", "react", "dolar", "euro", "criptomonedas", "tesla", "marte", "inteligencia artificial", "messi", "chile", "viaje", "cafe", "shooter", "extraction"],
        modifiers: ["2024", "hoy", "wikipedia", "pdf", "resumen", "video", "online", "barato", "urgente", "gratis", "oferta", "descuento"]
    };

    console.log("--- 🧠 Iniciando Sistema de Búsqueda Inteligente ---");

    // --- GESTOR DE MEMORIA (LOCALSTORAGE) ---
    const Memory = {
        get: () => {
            const data = localStorage.getItem(CONFIG.storageKey);
            return data ? JSON.parse(data) : { history: {} };
        },
        save: (data) => {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
        },
        cleanOldEntries: () => {
            const data = Memory.get();
            const now = Date.now();
            const retentionMs = CONFIG.daysToRemember * 24 * 60 * 60 * 1000;
            
            let cleanedCount = 0;
            for (const term in data.history) {
                if (now - data.history[term] > retentionMs) {
                    delete data.history[term];
                    cleanedCount++;
                }
            }
            Memory.save(data);
            if(cleanedCount > 0) console.log(`🧹 Memoria limpia: Se olvidaron ${cleanedCount} términos antiguos.`);
        },
        isRemembered: (term) => {
            const data = Memory.get();
            // Retorna true si existe y es reciente (la limpieza ya se encarga de lo viejo, pero doble check)
            return data.history.hasOwnProperty(term);
        },
        add: (term) => {
            const data = Memory.get();
            data.history[term] = Date.now();
            Memory.save(data);
        }
    };

    // --- MOTOR GENERATIVO (SIMULACIÓN ML) ---
    const Generator = {
        // Genera una búsqueda nueva combinando vectores de palabras
        createNovelQuery: () => {
            const t = seedDictionary.topics;
            const s = seedDictionary.subjects;
            const m = seedDictionary.modifiers;
            
            // Selecciona aleatoriamente partes del discurso
            const p1 = t[Math.floor(Math.random() * t.length)];
            const p2 = s[Math.floor(Math.random() * s.length)];
            const p3 = Math.random() > 0.5 ? m[Math.floor(Math.random() * m.length)] : "";
            
            return `${p1} ${p2} ${p3}`.trim();
        },

        // Intenta generar una palabra única que no esté en memoria
        getUniqueQuery: () => {
            let attempt = 0;
            let query = "";
            const maxAttempts = 50;

            do {
                query = Generator.createNovelQuery();
                attempt++;
            } while (Memory.isRemembered(query) && attempt < maxAttempts);

            if (attempt >= maxAttempts) {
                // Fallback: Si se agotan las combinaciones lógicas, usa entropía pura
                return query + " " + Math.floor(Math.random() * 1000);
            }
            return query;
        }
    };

    // --- LÓGICA DE CONTROL ---
    let currentCount = 0;

    function performSearch() {
        // 1. Mantenimiento de memoria
        if (currentCount === 0) Memory.cleanOldEntries();

        // 2. Condición de parada
        if (currentCount >= CONFIG.totalSearches) {
            console.log("✅ Meta alcanzada: 33 búsquedas inteligentes completadas.");
            alert("Proceso finalizado. Puntos generados.");
            return;
        }

        currentCount++;

        // 3. Generar término único (ML Logic)
        const searchTerm = Generator.getUniqueQuery();
        
        // 4. Guardar en memoria para no repetir en 5 días
        Memory.add(searchTerm);

        console.log(`[${currentCount}/${CONFIG.totalSearches}] 🔍 Buscando: "${searchTerm}" (No se repetirá hasta dentro de 5 días)`);

        // 5. Ejecutar búsqueda
        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}&form=QBLH`;
        
        // Abrir pestaña
        const win = window.open(searchUrl, "_blank");

        // 6. Cerrar y continuar
        setTimeout(() => {
            if (win) {
                win.close();
                // Pequeña variación aleatoria en el tiempo (humanización)
                const randomDelay = Math.floor(Math.random() * 1000) + 500;
                setTimeout(performSearch, randomDelay);
            } else {
                console.error("❌ Error: Pop-up bloqueado. Habilita las ventanas emergentes.");
            }
        }, CONFIG.duration);
    }

    // Iniciar
    performSearch();
})();
