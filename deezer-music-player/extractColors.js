import ColorThief from 'colorthief';
import Jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function extractColors() {
  try {
    const imagePath = path.resolve(__dirname, 'public/ui-background.png');
    const jimpImage = await Jimp.read(imagePath);
    // Resize image for faster processing with ColorThief (optional, but good for large images)
    jimpImage.resize(200, Jimp.AUTO);
    const buffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);

    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(buffer, 8); // Get 8 dominant colors

    console.log(JSON.stringify(palette));
  } catch (error) {
    console.error('Error extracting colors:', error);
    process.exit(1);
  }
}

extractColors();
