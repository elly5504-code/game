const fs = require('fs');
const path = require('path');

function extractPngTextMetadata(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    let offset = 8; // skip signature
    const textMetadata = [];

    while (offset < buffer.length - 12) {
      const length = buffer.readUInt32BE(offset);
      const type = buffer.toString('ascii', offset + 4, offset + 8);
      
      if (type === 'tEXt' || type === 'iTXt' || type === 'zTXt') {
        const textData = buffer.toString('utf8', offset + 8, offset + 8 + length);
        textMetadata.push({ type, data: textData });
      }
      
      offset += 12 + length; // 4 length + 4 type + data + 4 CRC
    }
    return textMetadata;
  } catch (err) {
    return [];
  }
}

const dir = path.join(__dirname, 'public', '3');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

files.forEach((file) => {
  const p = path.join(dir, file);
  const meta = extractPngTextMetadata(p);
  console.log(`File: ${file}`);
  if (meta.length === 0) {
    console.log('  No text metadata found.');
  } else {
    meta.forEach(m => {
      // clean up raw non-printable chars
      const clean = m.data.replace(/[^\x20-\x7E\sㄱ-ㅎ가-힣]/g, '');
      console.log(`  [${m.type}] ${clean.substring(0, 150)}`);
    });
  }
});
