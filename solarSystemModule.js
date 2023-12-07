/**
 * Gère la logique du système solaire, y compris la création d'astres, les calculs de position, etc
 */




// Enumération des teintes de couleurs
const Teinte = {
    SOMBRE: 20,
    NORMAL: 50,
    CLAIR: 60,
    HYPPERCLAIR: 75,
    BLANCHATRE: 90
    // add more colors as needed
};


function togglePause(htmlElements, solarSystemContext) {
    solarSystemContext.GUI.enPause = !solarSystemContext.GUI.enPause;
    solarSystemContext.solarSystemSettings.accelerationTemporelle = 0;
    if (solarSystemContext.GUI.enPause) {
        // Mettre en pause
        cancelAnimationFrame(solarSystemContext.GUI.animationId);
    } else {
        // Reprendre
        solarSystemContext.GUI.animationId = requestAnimationFrame(function () { dessinerSystemeSolaire(htmlElements, solarSystemContext) });
    }
}

function intializeEtoiles(htmlElements, solarSystemContext) {
    const nombreEtoiles = solarSystemContext.solarSystemSettings.baseDensiteEtoiles * solarSystemContext.densiteEtoiles;
    for (let i = 0; i < nombreEtoiles; i++) {
        const taille = Math.random();
        const scintiller = Math.random() < 0.1;
        const etoile = {
            id: "" + i,
            x: Math.random() * htmlElements.canvas.width,
            y: Math.random() * htmlElements.canvas.height,
            taille,
            couleur: (scintiller)?genererCouleur(Teinte.CLAIR):"#FFFFFF",
            couleurScintillement: (scintiller)?genererCouleur(Teinte.BLANCHATRE):undefined,
            tailleScintillement: taille * 2.5,
            scintiller,
        };
        solarSystemContext.etoiles.push(etoile);
    }
    return solarSystemContext.etoiles;
}

// Generer un nuage de gaz de degradés de couleur de forme aléatoire
function genererRayonnementLumineux(htmlElements, solarSystemContext) {
    const gradient = htmlElements.context.createRadialGradient(htmlElements.canvas.width / 2, htmlElements.canvas.height / 2, 0, htmlElements.canvas.width / 2, htmlElements.canvas.height / 2, htmlElements.canvas.width / 2);

    // On base la couleur du nuage de gaz sur la couleur du soleil
    const couleurSoleil = hexToRgb(solarSystemContext.soleil.couleur);
    const couleurSoleilR = couleurSoleil[0];
    const couleurSoleilG = couleurSoleil[1];
    const couleurSoleilB = couleurSoleil[2];
    const couleurSoleilAlpha = 0.5;
    const couleurSoleilRgba = `rgba(${couleurSoleilR}, ${couleurSoleilG}, ${couleurSoleilB}, ${couleurSoleilAlpha})`;

    gradient.addColorStop(0, couleurSoleilRgba);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
    htmlElements.context.fillStyle = gradient;
    htmlElements.context.fillRect(0, 0, htmlElements.canvas.width, htmlElements.canvas.height);
}


// Fonction pour ajuster l'accélération personnalisée
function ajusterAccelerationPersonnalisee(htmlElements, solarSystemContext) {
    const accelerationSouhaitee = htmlElements.accelerationInput.value;
    if (accelerationSouhaitee > solarSystemContext.solarSystemSettings.accelerationMax) {
        solarSystemContext.solarSystemSettings.accelerationTemporelle = solarSystemContext.solarSystemSettings.accelerationMax;
        htmlElements.accelerationInput.value = solarSystemContext.solarSystemSettings.accelerationTemporelle;
        console.log('Acceleration du temps au MAXIMUM')
    } else if (accelerationSouhaitee < (-1 * solarSystemContext.solarSystemSettings.accelerationMax)) {
        solarSystemContext.solarSystemSettings.accelerationTemporelle = -1 * solarSystemContext.solarSystemSettings.accelerationMax;
        htmlElements.accelerationInput.value = solarSystemContext.solarSystemSettings.accelerationTemporelle;
        console.log('Acceleration du temps au MINIMUM')
    } else {
        solarSystemContext.solarSystemSettings.accelerationTemporelle = parseFloat(accelerationInput.value) || 1.0;
    }
}

// Fonction pour initialiser le système solaire
function initializeSolarSystem(htmlElements, solarSystemContext) {
    // si des astres sont déjà présents, ne pas en générer d'autres
    if (solarSystemContext.astres.length > 0) {
        console.log('systeme solaire deja initialise');
        return;
    }

    // Initialiser le soleil
    const soleil = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        rayon: 30,
        couleur: genererCouleur(Teinte.CLAIR)
    };

    // Générer des astres aléatoires
    const facteurVitesseSolaire = Math.floor(Math.random() * 20);
    for (let i = 0; i < solarSystemContext.solarSystemSettings.nombreAstres; i++) {
        const taille = Math.random() * 20 + 5;
        const distanceMin = 50; // Distance minimale entre les astres

        const astre = {
            nom: genererNomAstre(),
            revolutions: 0,
            taille: taille,
            couleur: genererCouleur(),
            distance: i === 0 ? distanceMin + taille / 2 : solarSystemContext.astres[i - 1].distance + solarSystemContext.astres[i - 1].taille / 2 + distanceMin + taille / 2,
            angle: Math.random() * 2 * Math.PI,
            vitesseInitiale: calculerVitesseOrbitale(i + 1, facteurVitesseSolaire)  // i + 1 car les rangs commencent à 1
        };

        astre.x = soleil.x + astre.distance * Math.cos(astre.angle);
        astre.y = soleil.y + astre.distance * Math.sin(astre.angle);

        solarSystemContext.astres.push(astre);
    }
    solarSystemContext.soleil = soleil;
    intializeEtoiles(htmlElements, solarSystemContext);
}

// Fonction pour générer un nom d'astre
function genererNomAstre() {
    const prefixes = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"];
    const suffixes = ["Prime", "Secundus", "Tertius", "Quartus", "Quintus"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix} ${suffix}`;
}

// Fonction pour calculer la vitesse orbitale en fonction de la distance
function calculerVitesseOrbitale(rangOrbite, facteurVitesseSolaire) {
    return 0.0001 / (Math.pow(rangOrbite, 1.5) * 24 * 365 * facteurVitesseSolaire);
}

function dessinerAstre(htmlElements, x, y, rayon, couleur) {
    htmlElements.context.beginPath();
    htmlElements.context.arc(x, y, rayon, 0, 2 * Math.PI);
    htmlElements.context.fillStyle = couleur;
    htmlElements.context.fill();
    htmlElements.context.closePath();
}

function dessinerOrbite(htmlElements, soleil, astre) {
    htmlElements.context.beginPath();
    htmlElements.context.arc(soleil.x, soleil.y, astre.distance, 0, 2 * Math.PI);
    htmlElements.context.strokeStyle = "rgba(255, 255, 255, 0.1)";
    htmlElements.context.stroke();
    htmlElements.context.closePath();
}
// Fonction pour convertir une couleur hexadécimale en valeurs RGB
function hexToRgb(hex) {
    // Si la couleur est undefined, retourner une couleur bleue
    if (hex === undefined) {
        console.log('hexToRgb undefined');
        return [0, 0, 255];
    }
    // Vérifie si la chaine commence par #
    if (hex[0] !== '#') {
        console.log('hexToRgb should start with #');
        return [0, 0, 255];
    }
    //vérifie la taille de la chaine
    if (hex.length !== 7) {
        console.log('hexToRgb should be 7 characters long');
        return [0, 0, 255];
    }

    // formate en lowercase
    hex = hex.toLowerCase();

    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}


// Fonction pour convertir des valeurs RGB en une couleur hexadécimale
function rgbToHex(r, g, b) {
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

// Faire varier la taille de l'étoile progressivement
function faireVarierLaTaille(solarSystemContext, etoile) {

    // l'étoile id 42 doit toujours scintiller même si 42 est un nombre ou une chaîne de caractères
    if (etoile.id === '42') {
        etoile.scintiller = true;
    }

    // Vérifier si l'étoile doit scintiller
    if (!etoile.scintiller) {
        return etoile.taille;
    }

    // Vérifier si la vitesse de scintillement est un nombre et est définie
    if (isNaN(etoile.vitesseScintillement) || etoile.vitesseScintillement === undefined) {
        etoile.vitesseScintillement = solarSystemContext.solarSystemSettings.vitesseScintillement;
    }

    // Vérifier si la taille de scintillement est définie
    if (etoile.tailleScintillement === undefined) {
        etoile.tailleScintillement = etoile.taille * 2;
    }

    // Vérifier si la taille actuelle est définie
    if (etoile.tailleActuelle === undefined) {
        etoile.tailleActuelle = etoile.taille;
    }
    // Formater la taille actuelle et la taille de scintillement à 2 décimales près
    etoile.tailleActuelle = Math.round(etoile.tailleActuelle * 100) / 100;

    // Arrondir la taille actuelle à 2 décimales près
    etoile.tailleActuelle = Math.round(etoile.tailleActuelle * 100) / 100;

    // Arrondir la taille de scintillement à 2 décimales près
    etoile.tailleScintillement = Math.round(etoile.tailleScintillement * 100) / 100;

    if (etoile.sensTransition === undefined) {
        etoile.sensTransition = 1;
    }


    // Progressivement faire grossir l'étoile jusqu'à sa taille de scintillement ou la faire diminuer jusqu'à sa taille d'origine
    if (etoile.tailleActuelle === etoile.tailleScintillement) {
        etoile.sensTransition = -1;
    } else if (etoile.tailleActuelle === etoile.taille) {
        etoile.sensTransition = 1;
    }

    const increment = etoile.vitesseScintillement * etoile.sensTransition;
    etoile.tailleActuelle = etoile.tailleActuelle + increment;

    // Si la taille actuelle est plus petite que 0, la taille actuelle devient 0
    if (etoile.tailleActuelle < 0) {
        etoile.tailleActuelle = 0;
    }
}

//faire varier la couleur de l'étoile des étoiles scintillantes
function faireVarierLaCouleur(solarSystemContext, etoile) {
    // Vérifier si l'étoile doit scintiller
    if (!etoile.scintiller) {
        return etoile.couleur;
    }

    // Vérifier si la vitesse de scintillement est un nombre et est définie
    if (isNaN(etoile.vitesseScintillement) || etoile.vitesseScintillement === undefined) {
        etoile.vitesseScintillement = solarSystemContext.solarSystemSettings.vitesseScintillement;
    }

    // Vérifier si la couleur de scintillement est définie
    if (etoile.couleurScintillement === undefined) {
        etoile.couleurScintillement = "#ffffff";
    }

    // Vérifier si la couleur actuelle est définie
    if (etoile.couleurActuelle === undefined) {
        etoile.couleurActuelle = etoile.couleur;
    }

}

// Fonction pour convertir une couleur HSL en RGB
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c/2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Fonction pour générer une couleur aléatoire
// majoritairement des couleurs claires
function genererCouleur(lightness) {
    if (lightness === undefined) {
        lightness = Teinte.NORMAL;
    };



    // Hue est un nombre entre 0 et 360, représentant une couleur sur le cercle chromatique.
    let hue = Math.floor(Math.random() * 360);
    // Saturation est un pourcentage représentant la pureté de la couleur.
    let saturation = 100;
    // Lightness est un pourcentage représentant la luminosité de la couleur.
    // Si le paramètre "lightness" est défini, on utilise cette valeur.
    // Sinon, on génère une valeur aléatoire entre 0% et 100%.
    if (lightness === undefined) {
        lightness = Math.floor(Math.random() * 100);
    }

    // Convert the HSL color to RGB.
    return hslToRgb(hue, saturation, lightness);
}


// Fonction pour dessiner une étoile
function dessinerEtoile(htmlElements, solarSystemContext, etoile) {

    // Initialiser les propriétés de l'étoile si elles ne sont pas définies
    if (etoile.sensTransition === undefined) {
        etoile.sensTransition = 1;
    }
    if (etoile.ScintillementComplet === undefined) {
        etoile.ScintillementComplet = false;
    }
    if (etoile.couleur === undefined) {
        etoile.couleur = "#bbbbbb";
    }
    if (etoile.couleurScintillement === undefined) {
        etoile.couleurScintillement = "#ffffff";
    }
    if (etoile.couleurActuelle === undefined) {
        etoile.couleurActuelle = etoile.couleur;
    }

    //arrondir la taille de scintillement et d'origine à 2 décimales près
    etoile.tailleScintillement = Math.round(etoile.tailleScintillement, 2);
    etoile.taille = Math.round(etoile.taille, 2);

    // Faire briller l'étoile en changeant sa taille et sa couleur progressivement
    faireVarierLaTaille(solarSystemContext, etoile);
    faireVarierLaCouleur(solarSystemContext, etoile);

    if (!etoile.scintiller) {
        etoile.couleurActuelle = etoile.couleur;
        etoile.tailleActuelle = etoile.taille;
    }

    htmlElements.context.fillStyle = etoile.couleurActuelle;

    htmlElements.context.beginPath();
    htmlElements.context.arc(etoile.x, etoile.y, etoile.tailleActuelle, 0, 2 * Math.PI);

    htmlElements.context.fill();
    htmlElements.context.closePath();
}

// Fonction pour mettre à jour la position d'un astre
function mettreAJourPosition(solarSystemContext, astre) {
    astre.angle += astre.vitesseInitiale * solarSystemContext.solarSystemSettings.accelerationTemporelle; // Ajuster la vitesse orbitale en fonction de l'accélération temporelle
    astre.x = solarSystemContext.soleil.x + astre.distance * Math.cos(astre.angle);
    astre.y = solarSystemContext.soleil.y + astre.distance * Math.sin(astre.angle);

    // Mettre à jour le nombre de révolutions
    astre.revolutions = Math.round(astre.angle / (2 * Math.PI));
}

// Fonction pour convertir un temps en millisecondes en années, mois, jours, heures et minutes
function convertirTemps(tempsEnMillisecondes) {
    const secondes = tempsEnMillisecondes / 1000;
    const minutes = Math.floor(secondes / 60);
    const heures = Math.floor(minutes / 60);
    const jours = Math.floor(heures / 24);
    const mois = Math.floor(jours / 30.44); // Moyenne de jours par mois
    const annees = Math.floor(mois / 12);

    return {
        annees: annees,
        mois: mois % 12,
        jours: jours % 30,
        heures: heures % 24,
        minutes: minutes % 60
    };
}

function dessinerSystemeSolaire(htmlElements, solarSystemContext) {
    htmlElements.context.clearRect(0, 0, htmlElements.canvas.width, htmlElements.canvas.height);

    // Dessiner les étoiles
    for (const etoile of solarSystemContext.etoiles) {
        dessinerEtoile(htmlElements, solarSystemContext, etoile);
    }

    // Dessiner le nuage de gaz
    genererRayonnementLumineux(htmlElements, solarSystemContext);

    // Dessiner le soleil
    dessinerAstre(htmlElements, solarSystemContext.soleil.x, solarSystemContext.soleil.y, solarSystemContext.soleil.rayon, solarSystemContext.soleil.couleur);

    for (const astre of solarSystemContext.astres) {
        dessinerOrbite(htmlElements, solarSystemContext.soleil, astre);
        mettreAJourPosition(solarSystemContext, astre);
        dessinerAstre(htmlElements, astre.x, astre.y, astre.taille, astre.couleur);

        // Afficher le nom de l'astre en dessous de la planète
        htmlElements.context.fillStyle = "white";
        htmlElements.context.font = "14px Arial";
        htmlElements.context.fillText(`${astre.nom} - Révolutions: ${astre.revolutions}`, astre.x - astre.taille, astre.y + astre.taille + 10);
    }

    // Mise à jour du temps écoulé en fonction de l'accélération
    const tempsActuel = performance.now();
    const deltaTemps = (tempsActuel - solarSystemContext.GUI.tempsPrecedent) * solarSystemContext.solarSystemSettings.accelerationTemporelle;

    if (!solarSystemContext.enPause) {
        solarSystemContext.tempsEcoule += deltaTemps;
    }

    solarSystemContext.GUI.tempsPrecedent = tempsActuel;

    // Calcul de l'âge du système solaire en millisecondes
    const ageSolaireEnMillisecondes = solarSystemContext.tempsEcoule;
    //console.log(ageSolaireEnMillisecondes);

    // Conversion de l'âge en années, mois, jours, heures et minutes
    const ageSolaireConverti = convertirTemps(ageSolaireEnMillisecondes);

    // Afficher l'âge du système solaire et l'accélération du temps
    let ageSolaireTexte = '';
    const acceltemp = solarSystemContext.solarSystemSettings.accelerationTemporelle;
    if (acceltemp > 50000000) {
        ageSolaireTexte = `Âge du système solaire : ${ageSolaireConverti.annees} ans`;
    }
    else if (acceltemp > 5000000) {
        ageSolaireTexte = `Âge du système solaire : ${ageSolaireConverti.annees} ans, ${ageSolaireConverti.mois} mois`;
    }
    else if (acceltemp > 10000) {
        ageSolaireTexte = `Âge du système solaire : ${ageSolaireConverti.annees} ans, ${ageSolaireConverti.mois} mois, ${ageSolaireConverti.jours} jours`;
    }
    else if (acceltemp > 5000) {
        ageSolaireTexte = `Âge du système solaire : ${ageSolaireConverti.annees} ans, ${ageSolaireConverti.mois} mois, ${ageSolaireConverti.jours} jours, ${ageSolaireConverti.heures} heures`;
    } else {
        ageSolaireTexte = `Âge du système solaire : ${ageSolaireConverti.annees} ans, ${ageSolaireConverti.mois} mois, ${ageSolaireConverti.jours} jours, ${ageSolaireConverti.heures} heures, ${ageSolaireConverti.minutes} minutes`;
    }
    htmlElements.infoContainer.innerHTML = ageSolaireTexte;
    htmlElements.infoContainer.innerHTML += `<br>Accélération du temps : ${acceltemp.toFixed(2)}x`;

    solarSystemContext.animationId = requestAnimationFrame(function () { dessinerSystemeSolaire(htmlElements, solarSystemContext) });
}

// Fonction pour mettre le temps en temps réel
function tempsReel(htmlElements, solarSystemContext) {
    solarSystemContext.solarSystemSettings.accelerationTemporelle = 1;
}

// Exportez d'autres fonctions ou variables si nécessaire
export { tempsReel, intializeEtoiles, ajusterAccelerationPersonnalisee, initializeSolarSystem, genererNomAstre, genererCouleur as genererCouleur, calculerVitesseOrbitale, dessinerSystemeSolaire, togglePause, hexToRgb, rgbToHex }