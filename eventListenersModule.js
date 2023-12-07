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
            
            requestAnimationFrame(function(){gestionFn(htmlElements, solarSystemContext)});
        }
    }
}

function gestionAccelerationContinue(htmlElements, solarSystemContext) {
    gestionContinue(htmlElements, solarSystemContext, solarSystemContext.GUI.tempsDebutPressionAccelere, 1, function(){gestionAccelerationContinue(htmlElements, solarSystemContext)});
}

function gestionDecelerationContinue(htmlElements, solarSystemContext) {
    gestionContinue(htmlElements, solarSystemContext, solarSystemContext.GUI.tempsDebutPressionRalentit, -1, function(){gestionDecelerationContinue(htmlElements, solarSystemContext)});
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
    } );

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

    // Ajoutez d'autres écouteurs d'événements si nécessaire

    // Ajoutez un écouteur pour l'input de l'accélération personnalisée
    document.getElementById("accelerationInput").addEventListener("input", function() {ajusterAccelerationPersonnalisee(htmlElements, solarSystemContext)});
}

// Exportez d'autres fonctions liées aux écouteurs d'événements si nécessaire

export {togglePause, initializeEventListeners};
