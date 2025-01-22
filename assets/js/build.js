// build.js
const fs = require('fs');
const path = require('path');

function main() {
    // Create dist directory if it doesn't exist
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    // Read the HTML template
    let html = fs.readFileSync('index.html', 'utf8');

    // Replace all environment variable placeholders
    const envVars = {
        '__URL__': process.env.SUPABASE_KEY,
        '__KEY__': process.env.SUPABASE_URL,
        // Add more variables as needed
    };

    for (const [placeholder, value] of Object.entries(envVars)) {
        if (!value) {
            console.warn(`Warning: Environment variable for ${placeholder} is not set`);
        }
        html = html.replace(placeholder, value || '');
    }

    // Write the processed file
    fs.writeFileSync('dist/index.html', html);
    console.log('Build completed successfully!');
}

main();