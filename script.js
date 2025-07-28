/********************************************
 * Asistente de Investigación con Gemini API
 ********************************************/
const API_KEY = "AIzaSyD__HMqr9hdRhqo0v6-XMv3SHMmPguG5BA"; // <-- Reemplaza con tu API Key real

// ======= FUNCIONES PRINCIPALES =======
async function analizarEnfoque() {
    const texto = construirPrompt(
        "determina el enfoque de investigación (Cualitativo, Cuantitativo o Mixto) y explica brevemente por qué."
    );
    mostrarCargando("resultado");
    await consultarGemini(texto, "resultado");
}

async function generarTipos() {
    const texto = construirPrompt(
        "determina los tipos de investigación más adecuados (por ejemplo: exploratoria, descriptiva, correlacional, explicativa, aplicada) y justifica brevemente."
    );
    mostrarCargando("resultadoTipos");
    await consultarGemini(texto, "resultadoTipos");
}

async function generarDisenos() {
    const texto = construirPrompt(
        "determina el diseño de investigación más apropiado (por ejemplo: experimental, cuasi-experimental, no experimental, transversal, longitudinal, de campo) y explica brevemente."
    );
    mostrarCargando("resultadoDisenos");
    await consultarGemini(texto, "resultadoDisenos");
}

async function generarPoblacion() {
    const texto = construirPrompt(
        "sugiere la población objetivo más adecuada para este estudio y explica brevemente por qué es la correcta."
    );
    mostrarCargando("resultadoPoblacion");
    await consultarGemini(texto, "resultadoPoblacion");
}

async function generarAnalisis() {
    const texto = construirPrompt(
        "propón un plan de análisis de la información, indicando técnicas y métodos apropiados para el análisis de los datos."
    );
    mostrarCargando("resultadoAnalisis");
    await consultarGemini(texto, "resultadoAnalisis");
}

async function generarInstrumentos() {
    const texto = construirPrompt(
        "propón los instrumentos de recolección de información más adecuados (por ejemplo: encuestas, entrevistas, cuestionarios, pruebas) y justifica brevemente."
    );
    mostrarCargando("resultadoInstrumentos");
    await consultarGemini(texto, "resultadoInstrumentos");
}

/**
 * Nueva funcionalidad: listar las tareas para cada objetivo específico
 */
async function listarTareas() {
    const texto = construirPrompt(
        "para cada objetivo específico, lista al menos 3-5 tareas o actividades concretas necesarias para alcanzarlo. Presenta la respuesta en formato de lista estructurada."
    );
    mostrarCargando("resultadoTareas");
    await consultarGemini(texto, "resultadoTareas");
}

// ======= FUNCIONES AUXILIARES =======
function construirPrompt(instruccion) {
    const objetivoGeneral = document.getElementById("objetivoGeneral").value;
    const objetivosEspecificos = document.getElementById("objetivosEspecificos").value;

    if (!objetivoGeneral.trim()) {
        alert("Por favor, digite el objetivo general.");
        throw new Error("Objetivo general faltante");
    }

    return `Con base en el siguiente objetivo general y estos objetivos específicos, ${instruccion}\n\nObjetivo General: ${objetivoGeneral}\n\nObjetivos Específicos:\n${objetivosEspecificos}`;
}

function mostrarCargando(id) {
    document.getElementById(id).innerHTML = "Generando... <div class='spinner-border spinner-border-sm ms-2'></div>";
}

async function consultarGemini(texto, idDiv) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: texto }] }] })
            }
        );

        const data = await response.json();
        console.log(`Respuesta de Gemini (${idDiv}):`, data);

        if (data.error) {
            document.getElementById(idDiv).innerText = "Error: " + data.error.message;
            return;
        }

        const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se recibió respuesta.";
        document.getElementById(idDiv).innerHTML = formatearLista(respuesta);
    } catch (error) {
        console.error("Error en la consulta:", error);
        document.getElementById(idDiv).innerText = "Error al conectar con la API.";
    }
}

/**
 * Convierte texto plano en listas HTML si detecta guiones o numeración
 */
function formatearLista(texto) {
    const lineas = texto.split("\n").filter(l => l.trim() !== "");
    if (lineas.length <= 1) return `<p>${texto}</p>`;
    let html = "<ul>";
    lineas.forEach(linea => {
        html += `<li>${linea.replace(/^[-*0-9.]+\s*/, "")}</li>`;
    });
    html += "</ul>";
    return html;
}