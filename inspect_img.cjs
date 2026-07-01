const fs = require('fs');
const path = require('path');

function getPngDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    if (buffer.readUInt32BE(0) !== 0x89504E47) {
      return null;
    }
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  } catch (err) {
    return null;
  }
}

const dir = path.join(__dirname, 'public', '3');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

files.forEach((file) => {
  const p = path.join(dir, file);
  const stats = fs.statSync(p);
  const dim = getPngDimensions(p);
  console.log(`${file}: size=${stats.size} bytes, dims=${dim ? `${dim.width}x${dim.height}` : 'unknown'}`);
});
