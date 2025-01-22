const fs = require('fs');
const path = require('path');

function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

function copyDirectory(source, destination) {
    ensureDirectoryExists(destination);

    const files = fs.readdirSync(source);

    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const destPath = path.join(destination, file);

        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDirectory(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    });
}

function main() {
    // Create public directory
    ensureDirectoryExists('public');

    // Build config.js
    const config = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
    };

    fs.writeFileSync(
        path.join(__dirname, 'public', 'config.js'),
        `export default ${JSON.stringify(config, null, 2)};`
    );

    // Copy assets directory if it exists
    if (fs.existsSync('assets')) {
        copyDirectory('assets', path.join('public', 'assets'));
    }

    // Copy and process HTML files
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

    fs.writeFileSync('public/program.html', html);

    // Copy other HTML files if they exist
    ['index.html', 'aboutus.html'].forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, `public/${file}`);
        }
    });

    console.log('Build completed successfully! Output directory: public');
}

main();