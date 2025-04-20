const tinycolor = require('tinycolor2');

function generatePalette(colorInput, scheme = 'analogous') {
  const color = tinycolor(colorInput);
  if (!color.isValid()) throw new Error('Invalid color input');

  switch (scheme) {
    case 'analogous':
      return color.analogous().map(c => c.toHexString());
    case 'complement':
      return [color.toHexString(), color.complement().toHexString()];
    case 'monochromatic':
      return color.monochromatic().map(c => c.toHexString());
    default:
      throw new Error('Unsupported palette scheme');
  }
}

module.exports = { generatePalette };
