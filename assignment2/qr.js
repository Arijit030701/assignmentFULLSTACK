const {Jimp} = require('jimp');
const jsqr = require('jsqr');

async function decodeQR(imagePath) {
    const image = await Jimp.read(imagePath);
    const { data, width, height } = image.bitmap;

    const result = jsqr(data, width, height);

    if (!result) {
        throw new Error('No QR code found');
    }

    return result.data;
}

module.exports = { decodeQR };

if (require.main === module) {
    const testImagePath = './test.png'; 
    
    console.log(`Testing QR decoder on ${testImagePath}...`);
    
    decodeQR(testImagePath)
        .then(extractedText => {
            console.log('Extracted Text:');
            console.log(extractedText);
        })
        .catch(error => {
            console.error('Failed:', error.message);
        });
}