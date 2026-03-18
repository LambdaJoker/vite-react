const axios = require('axios');

async function test() {
  const res = await axios.get('https://haowallpaper.com/');
  const html = res.data;
  // match all links
  const links = html.match(/href="([^"]+)"[^>]*>([^<]+)<\/a>/g);
  if (links) {
    links.forEach(l => console.log(l));
  }
}
test();