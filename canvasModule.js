// canvasModule.js

// Importez les fonctions nécessaires des autres modules
import { dessinerSystemeSolaire } from './solarSystemModule.js'; // Assurez-vous d'ajuster le chemin selon votre structure

// Fonction pour initialiser le canvas
export function initializeCanvas(htmlElements, solarSystemContext) {
    htmlElements.canvas.width = window.innerWidth;
    htmlElements.canvas.height = window.innerHeight;
    return htmlElements.canvas;
}

// Fonction pour effacer le canvas
export function clearCanvas(htmlElements, solarSystemContext) {
    solarSystemContext.context.clearRect(0, 0, htmlElements.canvas.width, htmlElements.canvas.height);
    return htmlElements.canvas;
}

// Fonction pour démarrer la simulation du système solaire
export function startSolarSystemSimulation(htmlElements, solarSystemContext) {
    dessinerSystemeSolaire(htmlElements, solarSystemContext);
}

// Exportez d'autres fonctions ou variables liées au canvas si nécessaire
