const fs = require('fs');
const files = [
  'src/App.jsx', 
  'src/components/ShopScreen.jsx', 
  'src/components/OutfitScreen.jsx', 
  'src/components/MirrorScreen.jsx', 
  'src/components/Avatar3D.jsx', 
  'src/index.css'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/--emerald/g, '--accent');
  content = content.replace(/emerald-/g, 'accent-');
  content = content.replace(/emerald/g, 'accent'); // catch any loose 'emerald' like badge-emerald
  content = content.replace(/#10b981/g, '#ff4d00'); // point light / meta theme
  fs.writeFileSync(f, content);
});
console.log('Renamed emerald to accent');
