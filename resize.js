const Jimp = require('jimp');

async function main() {
  try {
    const image = await Jimp.read('apps/desktop/resources/icon.png');
    await image.resize(256, 256).writeAsync('apps/desktop/resources/square.png');
    console.log('Successfully created square.png');
  } catch (err) {
    console.error('Failed:', err);
  }
}

main();
