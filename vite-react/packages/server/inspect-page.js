const axios = require('axios');
const cheerio = require('cheerio');

async function run() {
    try {
        const res = await axios.get('https://haowallpaper.com/?page=1', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(res.data);
        console.log('Page Title:', $('title').text());
        
        // Check for links
        const links = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && (href.includes('detail') || href.includes('view') || href.match(/\/\d+$/))) {
                links.push(href);
            }
        });
        console.log('Potential Detail Links:', links.slice(0, 5));

        // Check for images
        const imgs = [];
        $('img').each((i, el) => {
             const src = $(el).attr('src');
             if (src) imgs.push(src);
        });
        console.log('Images:', imgs.slice(0, 5));

    } catch (e) {
        console.log(e.message);
    }
}

run();
