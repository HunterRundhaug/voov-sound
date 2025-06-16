
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'public_html','data.json');

// Write (update or create)
function saveVariable(key, value) {
  let data = {};

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  data[key] = value;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {saveVariable};