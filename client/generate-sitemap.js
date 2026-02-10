import { SitemapStream, streamToPromise } from "sitemap";
import { writeFileSync } from "fs";

const sitemap = new SitemapStream({ hostname: "https://tutoraive.vercel.app" });

sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.7 });
sitemap.write({ url: '/contact', changefreq: 'monthly', priority: 0.7 });

sitemap.end();

streamToPromise(sitemap).then((data) => {
    writeFileSync('./public/sitemap.xml', data);
    console.log('Sitemap generated!');
});
