const Cloud = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, '/google_cloud_api_key_2.json');

const { Storage } = Cloud;

// Create a client from a google service account key

const storage = new Storage({
    keyFilename: serviceKey,
    projectId: 'soen-341-instagram'
})

module.exports = storage
