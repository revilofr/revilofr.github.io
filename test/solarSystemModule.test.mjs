import assert from 'assert';
import {hexToRgb, rgbToHex} from '../solarSystemModule.js';


describe('hexToRgb', function() {
  it('converts valid hex code', function() {
    assert.deepStrictEqual(hexToRgb('#ff0000'), [255, 0, 0]);
  });

  it('converts valid hex code with lowercase letters', function() {
    assert.deepStrictEqual(hexToRgb('#00ff00'), [0, 255, 0]);
  });

  it('converts valid hex code with mixed case letters', function() {
    assert.deepStrictEqual(hexToRgb('#0000FF'), [0, 0, 255]);
  });

  it('handles undefined hex code', function() {
    assert.deepStrictEqual(hexToRgb(), [0, 0, 255]);
  });

  it('converts valid hex code for white color', function() {
    assert.deepStrictEqual(hexToRgb('#ffffff'), [255, 255, 255]);
  });

  it('handles invalid hex code', function() {
    assert.deepStrictEqual(hexToRgb('#123'), [0, 0, 255]);
  });
  it('handles invalid hex code that should start with #', function() {
    assert.deepStrictEqual(hexToRgb('1234567'), [0, 0, 255]);
  });
  it('handles uppercase hex code that should start with #', function() {
    assert.deepStrictEqual(hexToRgb('#00FFFF'), [0, 255, 255]);
  });
  it('handles aaaaaa', function() {
    assert.deepStrictEqual(hexToRgb('#aaaaaa'), [170, 170, 170]);
  });
});

describe('rgbToHex', function() {
  it('converts red color', function() {
    assert.strictEqual(rgbToHex(255, 0, 0), '#ff0000');
  });

  it('converts green color', function() {
    assert.strictEqual(rgbToHex(0, 255, 0), '#00ff00');
  });

  it('converts blue color', function() {
    assert.strictEqual(rgbToHex(0, 0, 255), '#0000ff');
  });

  it('converts gray color', function() {
    assert.strictEqual(rgbToHex(128, 128, 128), '#808080');
  });

  it('converts black color', function() {
    assert.strictEqual(rgbToHex(0, 0, 0), '#000000');
  });

  it('converts white color', function() {
    assert.strictEqual(rgbToHex(255, 255, 255), '#ffffff');
  });
});