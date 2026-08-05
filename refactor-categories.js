const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const webDir = path.join(__dirname, 'c:', 'maaza-printwala', 'maaza-printwala-web');
if (!fs.existsSync(webDir)) {
    // try relative if absolute fails
}
const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');

// 1. Rename Folders
const localeDir = path.join(srcDir, 'app', '[locale]');
const categoryDir = path.join(localeDir, 'category');
const allCatDir = path.join(categoryDir, 'all');
const slugCatDir = path.join(categoryDir, '[slug]');

if (fs.existsSync(allCatDir)) {
    fs.renameSync(allCatDir, path.join(localeDir, 'all-categories'));
    console.log('Moved /category/all -> /all-categories');
}

if (fs.existsSync(slugCatDir)) {
    fs.renameSync(slugCatDir, path.join(localeDir, '[slug]'));
    console.log('Moved /category/[slug] -> /[slug]');
}

// 2. Safely remove category dir if empty
if (fs.existsSync(categoryDir)) {
    try {
        fs.rmdirSync(categoryDir);
        console.log('Removed empty category folder');
    } catch(e) {
        console.log('Could not remove category dir, it might not be empty', e);
    }
}

// 3. Find and replace in files
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace /category/all with /all-categories
    content = content.replace(/\/category\/all/g, '/all-categories');
    
    // Replace /category/${...} with /${...}
    content = content.replace(/\/category\/\$\{/g, '/${');
    
    // Replace /category/something with /something
    // Careful not to match something that is not a string path
    // Matches /category/ followed by a word character
    content = content.replace(/\/category\/([a-zA-Z0-9-]+)/g, '/$1');

    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
    }
});

console.log('Done!');
