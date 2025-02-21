const fs = require('fs');
const csv = require('csv-parser');

// Helper function to read CSV data
async function getAccountData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('account_data.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

module.exports = { getAccountData };