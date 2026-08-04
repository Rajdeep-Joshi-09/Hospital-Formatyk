const fs = require('fs');
const html = fs.readFileSync('login_screen.html', 'utf8');
const match = html.match(/theme: \{([\s\S]*?)\}/);
if (match) {
  const themeText = match[0];
  const colorsMatch = themeText.match(/"colors": \{([\s\S]*?)\}/);
  let css = '@import "tailwindcss";\n\n@theme {\n';
  if (colorsMatch) {
    const colorsStr = colorsMatch[1];
    const regex = /"([^"]+)":\s*"([^"]+)"/g;
    let m;
    while ((m = regex.exec(colorsStr)) !== null) {
      css += '  --color-' + m[1] + ': ' + m[2] + ';\n';
    }
  }
  
  // Font families
  css += '  --font-body-md: "Inter", sans-serif;\n';
  css += '  --font-label-md: "Inter", sans-serif;\n';
  css += '  --font-headline-md: "Playfair Display", serif;\n';
  css += '  --font-headline-sm: "Playfair Display", serif;\n';
  css += '  --font-display-lg-mobile: "Playfair Display", serif;\n';
  css += '  --font-caption: "Inter", sans-serif;\n';
  css += '  --font-display-lg: "Playfair Display", serif;\n';
  css += '  --font-body-lg: "Inter", sans-serif;\n';
  
  // Custom styles for glass-card and floating-input
  css += `}

.glass-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid #E7E7E7;
    box-shadow: 0px 4px 20px rgba(0,0,0,0.04);
}

.floating-input {
    transition: all 0.2s ease-in-out;
}

.floating-input:focus + label,
.floating-input:not(:placeholder-shown) + label {
    transform: translateY(-20px) scale(0.85);
    color: var(--color-primary);
}
`;
  
  fs.writeFileSync('src/index.css', css);
  console.log('index.css generated successfully');
}
