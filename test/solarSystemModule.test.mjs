import { assert } from 'chai';
// importer toutes les fonctions du module solarSystemModule.js
import {
  hexToRgb, rgbToHex, intializeEtoiles, ajusterAccelerationPersonnalisee, initializeSolarSystem, genererNomAstre, calculerVitesseOrbitale, faireVarierLaTaille
} from '../solarSystemModule.js';


describe('hexToRgb', function () {
  it('converts valid hex code', function () {
    assert.deepStrictEqual(hexToRgb('#ff0000'), [255, 0, 0]);
  });

  it('converts valid hex code with lowercase letters', function () {
    assert.deepStrictEqual(hexToRgb('#00ff00'), [0, 255, 0]);
  });

  it('converts valid hex code with mixed case letters', function () {
    assert.deepStrictEqual(hexToRgb('#0000FF'), [0, 0, 255]);
  });

  it('handles undefined hex code', function () {
    assert.deepStrictEqual(hexToRgb(), [0, 0, 255]);
  });

  it('converts valid hex code for white color', function () {
    assert.deepStrictEqual(hexToRgb('#ffffff'), [255, 255, 255]);
  });

  it('handles invalid hex code', function () {
    assert.deepStrictEqual(hexToRgb('#123'), [0, 0, 255]);
  });
  it('handles invalid hex code that should start with #', function () {
    assert.deepStrictEqual(hexToRgb('1234567'), [0, 0, 255]);
  });
  it('handles uppercase hex code that should start with #', function () {
    assert.deepStrictEqual(hexToRgb('#00FFFF'), [0, 255, 255]);
  });
  it('handles aaaaaa', function () {
    assert.deepStrictEqual(hexToRgb('#aaaaaa'), [170, 170, 170]);
  });
});

describe('rgbToHex', function () {
  it('converts red color', function () {
    assert.strictEqual(rgbToHex(255, 0, 0), '#ff0000');
  });

  it('converts green color', function () {
    assert.strictEqual(rgbToHex(0, 255, 0), '#00ff00');
  });

  it('converts blue color', function () {
    assert.strictEqual(rgbToHex(0, 0, 255), '#0000ff');
  });

  it('converts gray color', function () {
    assert.strictEqual(rgbToHex(128, 128, 128), '#808080');
  });

  it('converts black color', function () {
    assert.strictEqual(rgbToHex(0, 0, 0), '#000000');
  });

  it('converts white color', function () {
    assert.strictEqual(rgbToHex(255, 255, 255), '#ffffff');
  });
});

describe('Solar System Module', function () {
  let htmlElements;
  let etoile;
  let solarSystemContext;

  beforeEach(function () {
    htmlElements = {
      canvas: {
        width: 800,
        height: 600
      },
      accelerationInput: {
        value: 2
      },
      window: {
        innerWidth: 800,
        innerHeight: 600
      }
    };

    solarSystemContext = {
      GUI: {
        enPause: false,
        animationId: null
      },
      solarSystemSettings: {
        accelerationTemporelle: 0
      },
      astres: [],
      etoiles: [],
      tempsEcoule: 0,
      rayonnementSolaire: Math.random() * 1.8 + 0.2,
      densiteEtoiles: Math.random()
    };


    // création d'une étoile
    solarSystemContext.etoiles.push(etoile = {
      id: "42",
      scintiller: false,
      taille: 10,
      vitesseScintillement: 0.5,
      tailleScintillement: 20,
      tailleActuelle: 10,
      sensTransition: 1
    });

    //création d'un astre
    solarSystemContext.astres.push({
      'id': 42,
      "nom": "Gamma Quintus",
      "revolutions": 1,
      "taille": 12.149242494738397,
      "couleur": "#0800ff",
      "distance": 122.71349141951846,
      "angle": 7.660308830891724,
      "vitesseInitiale": 4.035997609512258e-9,
      "x": 983.6179688338839,
      "y": 581.9192365219524
    });
  });
  it('should initialize etoiles', function () {
    const etoiles = intializeEtoiles(htmlElements, solarSystemContext);
    assert.isAbove(etoiles.length, 0);
  });

  it('should adjust acceleration', function () {
    ajusterAccelerationPersonnalisee(htmlElements, solarSystemContext);
    assert.equal(solarSystemContext.solarSystemSettings.accelerationTemporelle, 2);
  });

  it('should initialize solar system', function () {
    initializeSolarSystem(htmlElements, solarSystemContext);
    assert.isAbove(solarSystemContext.astres.length, 0);
  });

  it('should generate astre name', function () {
    const nomAstre = genererNomAstre();
    assert.isString(nomAstre);
  });

  it('should calculate orbital speed', function () {
    const vitesseOrbitale = calculerVitesseOrbitale(2, 5);
    console.log({vitesseOrbitale});
    assert.isNumber(vitesseOrbitale);
  });

  /* calculerVitesseOrbitaleEnKmParSeconde */
  if('should calculate orbital speed in km per second', function () {
    const vitesseOrbitale = calculerVitesseOrbitaleEnKmParSeconde(2, 5);
    console.log({vitesseOrbitale});
    assert.isNumber(vitesseOrbitale);
  });

  it('should convert hex to rgb', function () {
    const rgbColor = hexToRgb("#FF0000");
    assert.deepEqual(rgbColor, [255, 0, 0]);
  });

  it('should convert rgb to hex', function () {
    const hexColor = rgbToHex(255, 0, 0);
    assert.equal(hexColor, "#ff0000");
  });

  it('should vary size', function () {
    faireVarierLaTaille(solarSystemContext, etoile);
    assert.equal(etoile.tailleActuelle, 10.5);
  });
});