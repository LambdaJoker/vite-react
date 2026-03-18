const axios = require('axios');

const ids = [
    '15789130517090624',
    '18347080643104128',
    '17136054112800128'
];

async function check(id) {
    const cropUrl = `https://haowallpaper.com/link/common/file/getCroppingImg/${id}`;
    const previewUrl = `https://haowallpaper.com/link/common/file/previewFileImg/${id}`;
    
    console.log(`Checking ID: ${id}`);
    try {
        const res1 = await axios.head(cropUrl);
        console.log(`  Crop: ${res1.headers['content-length']}`);
    } catch(e) { console.log(`  Crop: ERR`); }

    try {
        const res2 = await axios.head(previewUrl);
        console.log(`  Preview: ${res2.headers['content-length']}`);
    } catch(e) { console.log(`  Preview: ERR`); }
}

async function run() {
    for (const id of ids) {
        await check(id);
    }
}

run();
