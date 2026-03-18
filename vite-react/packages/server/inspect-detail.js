const axios = require('axios');
const cheerio = require('cheerio');

async function run() {
    try {
        const url = 'https://haowallpaper.com/homeViewLook/18193748552895872';
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(res.data);
        console.log('Detail Page Title:', $('title').text());

        // Check for images
        const imgs = [];
        $('img').each((i, el) => {
             const src = $(el).attr('src');
             if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('avatar')) {
                 imgs.push(src);
             }
        });
        console.log('Images:', imgs);

        // Check for scripts that might contain image URL
        $('script').each((i, el) => {
            const content = $(el).html();
            if (content && content.includes('http') && (content.includes('.jpg') || content.includes('.png'))) {
                // Extract URL roughly
                const match = content.match(/https?:\/\/[^"'\s]+\.(jpg|jpeg|png|webp)/);
                if (match) console.log('Script URL:', match[0]);
            }
        });

    } catch (e) {
        console.log(e.message);
    }
}

run();
