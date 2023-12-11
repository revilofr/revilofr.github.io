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

    const menuContainer = htmlElements.menuContainer;

    //Definition d'un objet dragable
    const dragableElement = {
        htmlElement: menuContainer,
        isDragging: false,
        offsetX: 0,
        offsetY: 0
    };

    // Ajout des écouteurs d'événements pour le drag and drop du menu déplaçable
    menuContainer.addEventListener("mousedown", (event) => {startDrag(event, dragableElement)});
    menuContainer.addEventListener("mousemove", (event) => {drag(event, dragableElement)});
    menuContainer.addEventListener("mouseup", (event) => {stopDrag(event, dragableElement)});
    menuContainer.addEventListener("mouseleave", (event) => {stopDrag(event, dragableElement)});
}


// Fonctions pour le drag and drop du menu déplaçable
function startDrag(event, dragableElement) {
    dragableElement.isDragging = true;

    // Calcul du décalage entre le coin supérieur gauche du menu et le pointeur de la souris
    dragableElement.htmlElement.offsetX = event.clientX - dragableElement.htmlElement.offsetLeft;
    dragableElement.htmlElement.offsetY = event.clientY - dragableElement.htmlElement.offsetTop;
}

// Fonction pour déplacer le menu déplaçable en drag and drop
function drag(event, dragableElement) {
    if (dragableElement.isDragging) {
        // Déplacement du menu déplaçable
        dragableElement.htmlElement.style.left = event.clientX - dragableElement.htmlElement.offsetX + "px";
        dragableElement.htmlElement.style.top = event.clientY - dragableElement.htmlElement.offsetY + "px";
    }
}

// Fonction pour arrêter le drag and drop du menu déplaçable
function stopDrag(event, dragableElement) {
    dragableElement.isDragging = false;
}  

export { togglePause, initializeEventListeners, startDrag, drag, stopDrag };
