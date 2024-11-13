// scripts/combineFlags.js
const fs = require('fs');
const path = require('path');

// Config
const inputDir = './flags';
const outputFile = './force-app/main/default/lwc/phoneInput/flags.svg';

// Create the combined SVG header
const combinedSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
`;

// Read all SVG files
fs.readdir(inputDir, (err, files) => {
    if (err) throw err;

    let symbols = '';
    
    files.filter(file => file.endsWith('.svg')).forEach(file => {
        const content = fs.readFileSync(path.join(inputDir, file), 'utf8');
        
        // Extract the viewBox
        const viewBox = content.match(/viewBox="([^"]+)"/)?.[1] || '0 0 640 480';
        
        // Extract everything between <svg> and </svg>
        const innerContent = content
            .replace(/<\?xml.*?\?>/, '') // Remove XML declaration
            .replace(/<svg[^>]*>/, '')   // Remove opening svg tag
            .replace(/<\/svg>/, '')      // Remove closing svg tag
            .trim();                     // Clean up whitespace
        
        // Create symbol ID from filename (e.g., "us.svg" becomes "flag-us")
        const symbolId = `flag-${path.basename(file, '.svg').toLowerCase()}`;
        
        // Create symbol element
        symbols += `  <symbol id="${symbolId}" viewBox="${viewBox}">
    ${innerContent}
  </symbol>\n`;
    });

    // Complete the SVG
    const finalSvg = combinedSvg + symbols + '</svg>';

    // Write the combined file
    fs.writeFileSync(outputFile, finalSvg);
    console.log(`Combined ${files.length} flags into ${outputFile}`);
});