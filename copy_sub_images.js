const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\aa\\.gemini\\antigravity-ide\\brain\\e2981bf4-eb75-4de5-8fba-222b4119c1e3';
const destDir = path.join(__dirname, 'public', 'images', 'subcategories');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const imagesToCopy = [
  { name: 'sub_pvc_cards_1785750538733.png', slug: 'pvc-cards', targetName: 'pvc_cards.png' },
  { name: 'sub_nfc_cards_1785750548101.png', slug: 'nfc-cards', targetName: 'nfc_cards.png' },
  { name: 'sub_flyers_1785750558624.png', slug: 'flyers', targetName: 'flyers.png' },
  { name: 'sub_brochures_1785750568829.png', slug: 'brochures', targetName: 'brochures.png' },
  { name: 'sub_posters_1785750579336.png', slug: 'posters', targetName: 'posters.png' },
  { name: 'sub_catalogues_1785750590060.png', slug: 'catalogues', targetName: 'catalogues.png' },
  { name: 'sub_letterheads_1785750600112.png', slug: 'letterheads', targetName: 'letterheads.png' },
  { name: 'sub_envelopes_1785750610877.png', slug: 'envelopes', targetName: 'envelopes.png' },
  { name: 'sub_notepads_1785750621243.png', slug: 'notepads', targetName: 'notepads.png' },
  { name: 'sub_stickers_1785750631594.png', slug: 'stickers', targetName: 'stickers.png' },
  { name: 'sub_labels_1785750642435.png', slug: 'labels', targetName: 'labels.png' },
];

imagesToCopy.forEach(img => {
  const src = path.join(brainDir, img.name);
  const dest = path.join(destDir, img.targetName);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${img.name} to ${img.targetName}`);
  } else {
    console.log(`Source not found: ${src}`);
  }
});

const configPath = path.join(__dirname, 'src', 'config', 'categoryData.js');
if (fs.existsSync(configPath)) {
  let content = fs.readFileSync(configPath, 'utf8');
  
  imagesToCopy.forEach(img => {
    // We want to replace the image for the specific slug.
    // E.g. { name: 'PVC Cards', group: 'Cards', slug: 'pvc-cards', image: 'https://images.unsplash.com/...', count: 5 }
    // We can use a regex to find the object with that slug and replace the image URL.
    
    const regex = new RegExp(`(slug:\\s*'${img.slug}'\\s*,\\s*image:\\s*)'[^']+'`, 'g');
    content = content.replace(regex, `$1'/images/subcategories/${img.targetName}'`);
  });
  
  fs.writeFileSync(configPath, content);
  console.log('Updated categoryData.js');
} else {
  console.log(`Config not found: ${configPath}`);
}
