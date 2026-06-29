import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const scriptTag = '  <script src="/js/mediabundle-integration.js"></script>\n</body>';

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getHtmlFiles(filePath));
        } else if (file.endsWith('.html')) {
            results.push(filePath);
        }
    });
    return results;
}

const htmlFiles = getHtmlFiles(publicDir);

htmlFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if script is already injected
        if (content.includes('mediabundle-integration.js')) {
            console.log(`Script already present in ${path.relative(publicDir, filePath)}, skipping.`);
            return;
        }

        if (content.includes('</body>')) {
            content = content.replace('</body>', scriptTag);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Successfully injected mediabundle-integration.js into ${path.relative(publicDir, filePath)}`);
        } else {
            console.warn(`Could not find </body> in ${path.relative(publicDir, filePath)}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
});
console.log("Injection completed!");
