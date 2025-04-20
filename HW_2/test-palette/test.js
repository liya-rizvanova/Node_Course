const { generatePalette } = require('random-color-palette');

const baseColor = '#3498db'; // Важно: hex с #

try {
  const analogous = generatePalette(baseColor, 'analogous');
  const complement = generatePalette(baseColor, 'complement');
  const mono = generatePalette(baseColor, 'monochromatic');

  console.log('🎨 Аналогичная палитра:', analogous);
  console.log('🔁 Комплементарная палитра:', complement);
  console.log('⚪ Монохромная палитра:', mono);
} catch (e) {
  console.error('Ошибка при генерации палитры:', e.message);
}
