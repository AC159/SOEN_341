const gc = require('../config/index');

const bucketName = 'soen-341-instagram-pictures';
const bucket = gc.bucket(bucketName);

const uploadImage = (image, test = false) => new Promise((resolve, reject) => {

    // Multer stores the image in req.file with upload.single('image')
    // console.log(image);

    // Multer stored the file (image) in a buffer
    let gcsFileName = null;

    if (!test) {
        gcsFileName = `${Date.now()}_${image.originalname}`;
    } else {
        gcsFileName = 'test_image';
    }

    const file = bucket.file(gcsFileName);

    const stream = file.createWriteStream({
        resumable: false
    });

    stream.on('error', (error) => {
        reject({error: error})
    });

    stream.on('finish', () => {

        resolve(`https://storage.googleapis.com/${bucketName}/${gcsFileName}`);

    });

    if (!test) {
        stream.end(image.buffer);
    } else {
        stream.end(image);
    }

});


const deleteImage = (imageUrl, test = false) => new Promise((resolve, reject) => {

    const filename = imageUrl.replace(`https://storage.googleapis.com/${bucketName}/`, '');
    const file = bucket.file(filename);

    console.log(filename);
    file.delete().then((data) => {
        if (!test) {
            resolve(data);
        } else {
          resolve("Image deleted successfully");
        }
    }).catch((error) => {
        reject(error);
    });

});


module.exports.uploadImage = uploadImage;
module.exports.deleteImage = deleteImage;


