const axios = require('axios');

const testId = '18347080643104128'; // From the default fallback
const cropUrl = `https://haowallpaper.com/link/common/file/getCroppingImg/${testId}`;
const imgUrl = `https://haowallpaper.com/link/common/file/getImg/${testId}`; // Guessing
const originalUrl = `https://haowallpaper.com/link/common/file/getOriginalImg/${testId}`; // Guessing
const downloadUrl = `https://haowallpaper.com/link/common/file/download/${testId}`; // Guessing

async function check(url) {
  try {
    const start = Date.now();
    const res = await axios.head(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
    await check(imgUrl);
    await check(originalUrl);
    await check(downloadUrl);
}

run();
