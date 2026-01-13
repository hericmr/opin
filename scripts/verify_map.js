const fs = require('fs');
const path = require('path');

const mapPath = path.join(__dirname, '../src/data/image_map.json');
const imageMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

const testUrl = 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-das-escolas/20/abilio_fernandes.png';

console.log('Testing URL:', testUrl);
console.log('Map entry:', imageMap[testUrl]);

if (imageMap[testUrl]) {
    console.log('SUCCESS: Mapped to', imageMap[testUrl]);
} else {
    console.log('FAILURE: Not found in map');

    // Check partial matches or encoding issues
    const keys = Object.keys(imageMap);
    const similar = keys.filter(k => k.includes('abilio_fernandes'));
    console.log('Similar keys found:', similar);
}
