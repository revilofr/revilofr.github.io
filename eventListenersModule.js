// eventListenersModule.js

// Importez les fonctions nécessaires des autres modules

import { ajusterAccelerationPersonnalisee, togglePause } from './solarSystemModule.js';

import { tempsReel } from './solarSystemModule.js';

let enPause = false; // Déclarer la variable enPause ici

const ajusterAccelerationTemporelle = (ajustement) => {
    accelerationTemporelle = accelerationTemporelle + ajustement;
};

function gestionContinue(htmlElements, solarSystemContext, tempsDebutPression, accelerationSigne, gestionFn) {
    if (solarSystemContext.GUI.boutonAccelereEnfonce || solarSystemContext.GUI.boutonRalentitEnfonce) {
        if (solarSystemContext.solarSystemSettings.accelerationTemporelle * accelerationSigne > solarSystemContext.solarSystemSettings.accelerationMax) {
            solarSystemContext.solarSystemSettings.accelerationTemporelle = solarSystemContext.solarSystemSettings.accelerationMax * accelerationSigne;
        } else {
            const tempsMaintien = performance.now() - tempsDebutPression;

            // Ajustez la constante exponentielle selon vos préférences
            const accelerationProgressive = 1 - Math.exp(-tempsMaintien * 0.000001); // Ajustez le facteur multiplicatif selon vos préférences

            const accelerationEnCours = solarSystemContext.solarSystemSettings.accelerationMax * accelerationProgressive * accelerationSigne;

            //Modification de l'acceleration temporelle
            solarSystemContext.solarSystemSettings.accelerationTemporelle += accelerationEnCours;

            requestAnimationFrame(function () { gestionFn(htmlElements, solarSystemContext) });
        }
    }
}

function gestionAccelerationContinue(htmlElements, solarSystemContext) {
    gestionContinue(htmlElements, solarSystemContext, solarSystemContext.GUI.tempsDebutPressionAccelere, 1, function () { gestionAccelerationContinue(htmlElements, solarSystemContext) });
}

function gestionDecelerationContinue(htmlElements, solarSystemContext) {
    gestionContinue(htmlElements, solarSystemContext, solarSystemContext.GUI.tempsDebutPressionRalentit, -1, function () { gestionDecelerationContinue(htmlElements, solarSystemContext) });
}

// Fonction pour initialiser les écouteurs d'événements
function initializeEventListeners(htmlElements, solarSystemContext) {
    // Ajoutez les écouteurs d'événements nécessaires
    document.getElementById("accelererTempsButton").addEventListener("mousedown", (event) => {
        solarSystemContext.GUI.boutonAccelereEnfonce = true;
        solarSystemContext.GUI.tempsDebutPressionAccelere = performance.now();
        gestionAccelerationContinue(htmlElements, solarSystemContext);
    });

    document.getElementById("accelererTempsButton").addEventListener("mouseup", () => {
        solarSystemContext.GUI.boutonAccelereEnfonce = false;
        solarSystemContext.GUI.accelerationEnCours = 0;
    });

    document.getElementById("tempsReelButton").addEventListener("click", () => {
        tempsReel(htmlElements, solarSystemContext);
    });

    document.getElementById("ralentirTempsButton").addEventListener("mousedown", (event) => {
        solarSystemContext.GUI.boutonRalentitEnfonce = true;
        solarSystemContext.GUI.tempsDebutPressionRalentit = performance.now();
        gestionDecelerationContinue(htmlElements, solarSystemContext);
    });

    document.getElementById("ralentirTempsButton").addEventListener("mouseup", () => {
        solarSystemContext.GUI.boutonRalentitEnfonce = false;
        solarSystemContext.GUI.accelerationEnCours = 0;
    });

    document.getElementById("pauseButton").addEventListener("click", () => {
        togglePause(htmlElements, solarSystemContext)
    });

    solarSystemContext.GUI.enSaisiedAcceleration = false;

    //si on est en focus sur l'input accelerationInput solarSystemContext.GUI.enSaisiedAcceleration = true
    document.getElementById("accelerationInput").addEventListener("focus", () => {
        solarSystemContext.GUI.enSaisiedAcceleration = true;
    });

    //si l'on est plus en focus sur l'input accelerationInput solarSystemContext.GUI.enSaisiedAcceleration = false
    document.getElementById("accelerationInput").addEventListener("blur", () => {
        solarSystemContext.GUI.enSaisiedAcceleration = false;
    });

    document.getElementById("accelerationInput").addEventListener("input", function () { ajusterAccelerationPersonnalisee(htmlElements, solarSystemContext) });

    const menuContainer = htmlElements.menuContainer
    let isDragging = false;
    solarSystemContext.GUI.offsetX = 0;
    solarSystemContext.GUI.offsetY = 0;

    menuContainer.addEventListener("mousedown", (event) => {startDrag(event, htmlElements, solarSystemContext)});
    menuContainer.addEventListener("mousemove", (event) => {drag(event, htmlElements, solarSystemContext)});
    menuContainer.addEventListener("mouseup", (event) => {stopDrag(event, htmlElements, solarSystemContext)});
    menuContainer.addEventListener("mouseleave", (event) => {stopDrag(event, htmlElements, solarSystemContext)});
}


// Fonctions pour le drag and drop du menu déplaçable
function startDrag(event, htmlElements, solarSystemContext) {
    solarSystemContext.GUI.isDragging = true;

    // Calcul du décalage entre le coin supérieur gauche du menu et le pointeur de la souris
    solarSystemContext.GUI.offsetX = event.clientX - htmlElements.menuContainer.offsetLeft;
    solarSystemContext.GUI.offsetY = event.clientY - htmlElements.menuContainer.offsetTop;
}

// Fonction pour déplacer le menu déplaçable en drag and drop
function drag(event, htmlElements, solarSystemContext) {
    if (solarSystemContext.GUI.isDragging) {
        // Déplacement du menu déplaçable
        htmlElements.menuContainer.style.left = event.clientX - solarSystemContext.GUI.offsetX + "px";
        htmlElements.menuContainer.style.top = event.clientY - solarSystemContext.GUI.offsetY + "px";
    }
}

// Fonction pour arrêter le drag and drop du menu déplaçable
function stopDrag(event, htmlElements, solarSystemContext) {
    solarSystemContext.GUI.isDragging = false;
}  

export { togglePause, initializeEventListeners, startDrag, drag, stopDrag };
