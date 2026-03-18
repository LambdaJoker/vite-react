const axios = require('axios');

const testId = '18193731367128448'; // From inspect-detail output
const cropUrl = `https://haowallpaper.com/link/common/file/getCroppingImg/${testId}`;
const previewUrl = `https://haowallpaper.com/link/common/file/previewFileImg/${testId}`;
const downloadUrl = `https://haowallpaper.com/link/common/file/download/${testId}`;

async function check(url) {
  try {
    const start = Date.now();
    const res = await axios.head(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
             // Add Referer for download check
            'Referer': 'https://haowallpaper.com/'
        },
        validateStatus: () => true
    });
    console.log(`[${res.status}] ${url} - Size: ${res.headers['content-length']} - Time: ${Date.now() - start}ms`);
  } catch (e) {
    console.log(`[ERR] ${url} - ${e.message}`);
  }
}

async function run() {
    console.log('Checking URLs...');
    await check(cropUrl);
    await check(previewUrl);
    await check(downloadUrl);
}

run();
