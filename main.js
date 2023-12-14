// main.js
import { initializeCanvas, startSolarSystemSimulation } from './canvasModule.js';
import { initializeEventListeners } from './eventListenersModule.js';
import { initializeSolarSystem } from './solarSystemModule.js';

const urlParams = new URLSearchParams(window.location.search);

let nogui=false;
// Si le paramètre nogui est présent dans l'url
if (urlParams.has('nogui')) {
    // vérifier la valeur du paramètre si impossible rendre faux
    nogui = urlParams.get('nogui') == 'true' ? true : false;
}




// Variables relatives au système solaire
// Paramètres du système solaire
const GUI = {
    boutonAccelereEnfonce: false,
    accelerationEnCours: 0,
    tempsDebutPressionAccelere: 0,
    tempsDebutPressionRalentit: 0,
    tempsPrecedent: performance.now(),
    // boutonRalentitEnfonce:false,
    enPause: false,
    animationId: null
}

const solarSystemSettings = {
    nombreAstres: Math.floor(Math.random() * 10) + 3,// nombre d'astres à générer entre 3 et 12
    baseDensiteEtoiles: 2000,
    accelerationTemporelle: 1000000, // acceleration par défaut par rapport au temps réel
    accelerationMax: 10000000,
    vitesseScintillement: 0.05
};

const solarSystemContext = {
    GUI,
    solarSystemSettings,
    astres: [],
    etoiles: [],
    tempsEcoule: 0,
    rayonnementSolaire: Math.random() * 1.8 + 0.2, // rayonnement solaire entre 0.2 et 2
    densiteEtoiles: Math.random(),// Densité d'étoiles entre 0 et 1
};

// Déclaration des variables liées au canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const infoContainer = document.getElementById("info-container");
const menuContainer = document.getElementById("menu-container");
const accelerationInput = document.getElementById("accelerationInput")
const htmlElements = { context, canvas, infoContainer, menuContainer, accelerationInput, window };

if (nogui) {
    // on affiche cache la gui
    menuContainer.style.display = "none";
    infoContainer.style.display = "none";

}else {
    // on affiche la gui
    menuContainer.style.display = "flex";
    infoContainer.style.display = "flex";
}

// si le paramètre nogui est présent dans l'url ou de l'iframe, on masque la GUI

initializeCanvas(htmlElements, solarSystemContext);
initializeSolarSystem(htmlElements, solarSystemContext);
initializeEventListeners(htmlElements, solarSystemContext);
startSolarSystemSimulation(htmlElements, solarSystemContext);
