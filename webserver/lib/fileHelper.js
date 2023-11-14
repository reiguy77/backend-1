
const fs = require('fs');
const sharp = require('sharp');
const { fromHEIC } = require('heic-convert');

fileHelper = {}
compressionOptions = {
  targetSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  qualityRange: { min: 1, max: 100 }
}
fileHelper.checkDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive:true});
      }
}

fileHelper.compressImages = async (files) => {
  const compressedFiles = [];  
  for(const file of files){
    try{
      let compressedFile;
      if(file.filename.toLowerCase().includes('heic')){
        compressedFile = compressHEIC(file);
      }
      else{
        compressedFile = compressImage(file);
      }
      compressedFiles.push(compressedFile);
      // console.log(`new size! ${compressedFile.size / 1024 / 1024} MB` );
    }
    catch(e){
      console.log("Failed to compress the file!", file, e);
    }
  }  
  return await Promise.all(compressedFiles);
}
async function compressImage(imageFile, filename) {
  const { targetSizeMB, maxWidthOrHeight, qualityRange } = compressionOptions;
  let minQuality = qualityRange.min;
  let maxQuality = qualityRange.max;
  const imageBuffer = fs.readFileSync(imageFile.path);
  while (minQuality < maxQuality) {
    const midQuality = Math.floor((minQuality + maxQuality) / 2);
    const compressedBuffer = sharp(imageBuffer)
      .resize({ width: maxWidthOrHeight, height: maxWidthOrHeight, fit: 'inside' })
      .jpeg({ quality: midQuality })
      .toBuffer();

    const compressedSizeMB = compressedBuffer.length / (1024 * 1024);

    if (compressedSizeMB > targetSizeMB) {
      // If compressed size is too large, reduce quality
      maxQuality = midQuality;
    } else {
      // If compressed size is within the target, try higher quality
      minQuality = midQuality + 1;
    }
  }

  // After the loop, 'minQuality' contains the optimal quality setting
  const optimalCompressedFile = await sharp(imageBuffer)
    .resize({ width: maxWidthOrHeight, height: maxWidthOrHeight, fit: 'inside' })
    .jpeg({ quality: minQuality })
    .toFile(imageFile.path + '.jpeg');

  return optimalCompressedFile;
}

async function compressHEIC(heicFile){
  try{
    let jpegFile = await fromHEIC(heicFile);
    let compressedFile = await compressImage(jpegFile);
    return compressedFile;
  }
  catch(e){
    console.log('ERROR',e);
    // let compressedFile = await bic.imageCompression(jpegFile, this.compressionOptions);
    return null;
  }
}

module.exports = fileHelper;