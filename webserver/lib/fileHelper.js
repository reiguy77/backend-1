
const fs = require('fs');
const sharp = require('sharp');
const heicConvert = require('heic-convert');
const path = require('path');

fileHelper = {}
compressionOptions = {
  targetSizeMB: .75,
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
        usedMemory();
        compressedFile = await compressHEIC(file);
        usedMemory();
      }
      else{
        usedMemory();
        compressedFile = await compressImage(file);
        usedMemory();
      }
      compressedFiles.push(compressedFile);
    }
    catch(e){
      console.log("Failed to compress the file!", file, e);
    }
  }  
  return compressedFiles;
}
async function compressImage(imageFile, filename) {
  try
  {
    const { targetSizeMB, maxWidthOrHeight, qualityRange } = compressionOptions;
    let minQuality = qualityRange.min;
    let maxQuality = qualityRange.max;
    const imageBuffer = fs.readFileSync(imageFile.path);
    while (minQuality < maxQuality) {
      const midQuality = Math.floor((minQuality + maxQuality) / 2);
      const compressedBuffer = await sharp(imageBuffer)
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

    let jpegPath = fileHelper.withoutExtension(imageFile.path)+ '.jpeg';
    // After the loop, 'minQuality' contains the optimal quality setting
    const optimalCompressedBuffer = await sharp(imageBuffer)
      .resize({ width: maxWidthOrHeight, height: maxWidthOrHeight, fit: 'inside' })
      .withMetadata()
      .jpeg({ quality: minQuality })
      .toBuffer();

      // Delete the old file
      fs.unlinkSync(imageFile.path);
      
      fs.writeFileSync(jpegPath, optimalCompressedBuffer);

      return;
  }
  catch(e){
    console.log(e);
  }
}

async function compressHEIC(heicFile){
  
  try{ 
    const imageBuffer = fs.readFileSync(heicFile.path);
    let jpegBuffer = await heicConvert({buffer:imageBuffer, format:"JPEG"});
    const { targetSizeMB, maxWidthOrHeight, qualityRange } = compressionOptions;
    let minQuality = qualityRange.min;
    let maxQuality = qualityRange.max;
    while (minQuality < maxQuality) {
      const midQuality = Math.floor((minQuality + maxQuality) / 2);
      const compressedBuffer = await sharp(jpegBuffer)
        .resize({ width: maxWidthOrHeight, height: maxWidthOrHeight, fit: 'inside' })
        .withMetadata()
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
    let jpegPath = fileHelper.withoutExtension(heicFile.path)+ '.jpeg';
  // After the loop, 'minQuality' contains the optimal quality setting
    const optimalCompressedBuffer = await sharp(jpegBuffer)
      .resize({ width: maxWidthOrHeight, height: maxWidthOrHeight, fit: 'inside' })
      .jpeg({ quality: minQuality })
      .toBuffer();

      fs.unlinkSync(heicFile.path);
      
      fs.writeFileSync(jpegPath, optimalCompressedBuffer);

      // Delete the old file
      return;
  }
  catch(e){
    console.log('ERROR',e);
    // let compressedFile = await bic.imageCompression(jpegFile, this.compressionOptions);
    return null;
  }
}

const usedMemory = () => {
  const memoryUsage = process.memoryUsage();
  console.log('Memory Usage:');
  console.log(`  - RSS: ${formatBytes(memoryUsage.rss)}`);
  console.log(`  - Heap Total: ${formatBytes(memoryUsage.heapTotal)}`);
  console.log(`  - Heap Used: ${formatBytes(memoryUsage.heapUsed)}`);
}; 
const formatBytes = (bytes) => {
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

fileHelper.withoutExtension = (filePath) => {
  const extension = path.extname(filePath);
  const baseName = path.basename(filePath, extension);
  const directory = path.dirname(filePath);
  return path.join(directory, baseName);
}

module.exports = fileHelper;