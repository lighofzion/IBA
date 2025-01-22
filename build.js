const fs = require('fs');
const path = require('path');

function main() {
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    let html = fs.readFileSync('program.html', 'utf8');

    const envVars = {
        '__SUPABASEURL__': process.env.SUPABASE_URL,
        '__SUPABASEKEY__': process.env.SUPABASE_KEY,
    };

    for (const [placeholder, value] of Object.entries(envVars)) {
        if (!value) {
            console.warn(`Warning: Environment variable for ${placeholder} is not set`);
        }
        html = html.replace(placeholder, value || '');
    }

    fs.writeFileSync('dist/program.html', html);
    console.log('Build completed successfully!');
}

main();