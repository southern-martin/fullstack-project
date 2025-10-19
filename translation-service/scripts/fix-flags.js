const fs = require('fs');
const path = require('path');

// Read the seed file
const seedFile = path.join(__dirname, 'seed-data.ts');
let content = fs.readFileSync(seedFile, 'utf8');

// Define the flags mapping
const flags = {
  'en': '🇺🇸',
  'es': '🇪🇸',
  'fr': '🇫🇷',
  'de': '🇩🇪',
  'it': '🇮🇹',
  'pt': '🇵🇹',
  'ru': '🇷🇺',
  'zh': '🇨🇳',
  'ja': '🇯🇵',
  'ko': '🇰🇷',
  'ar': '🇸🇦',
  'hi': '🇮🇳',
  'tr': '🇹🇷',
  'pl': '🇵🇱',
  'nl': '🇳🇱',
  'sv': '🇸🇪',
  'no': '🇳🇴',
  'da': '🇩🇰',
  'fi': '🇫🇮',
  'cs': '🇨🇿',
  'hu': '🇭🇺',
  'ro': '🇷🇴',
  'uk': '🇺🇦',
  'el': '🇬🇷',
  'he': '🇮🇱',
  'th': '🇹🇭',
  'vi': '🇻🇳',
  'id': '🇮🇩',
  'ms': '🇲🇾',
  'fil': '🇵🇭'
};

// Add flag field after localName for each language
Object.entries(flags).forEach(([code, flag]) => {
  // Match: code: "XX", ... localName: "YYY",
  // Replace with: code: "XX", ... localName: "YYY",\n        flag: "🏴",
  const regex = new RegExp(
    `(code:\\s*"${code}"[^}]*localName:\\s*"[^"]+",)`,
    'g'
  );
  
  content = content.replace(regex, `$1\n        flag: "${flag}",`);
});

// Write the file back
fs.writeFileSync(seedFile, content);
console.log('✅ Added flags to all languages');
