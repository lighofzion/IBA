const fs = require('fs');
const path = require('path');

const buildConfig = () => {
    const config = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
    };

    // Create the config file
    fs.writeFileSync(
        path.join(__dirname, 'config.js'),
        `export default ${JSON.stringify(config, null, 2)};`
    );
};

buildConfig();

function main() {
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    let html = fs.readFileSync('program.html', 'utf8');

    const envVars = {
        '__SUPABASEURL__': process.env.NEXT_PUBLIC_SUPABASE_URL,
        '__SUPABASEKEY__': process.env.NEXT_PUBLIC_SUPABASE_KEY,
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