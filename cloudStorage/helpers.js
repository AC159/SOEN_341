const gc = require('../config/index');


const uploadImage = (image) => new Promise((resolve, reject) => {

    // Multer stores the image in req.file with upload.single('image')
    console.log(image);

    const bucket = gc.bucket('soen-341-instagram-pictures');

    // Multer stored the file (image) in a buffer

    const gcsFileName = `${Date.now()}_${image.originalname}`;
    const file = bucket.file(gcsFileName);

    const stream = file.createWriteStream({
        resumable: false
    });

    stream.on('error', (error) => {
        reject({error: error})
    });

    stream.on('finish', () => {

        // The promise returns the public url of the image, this url needs to be stored for each user in mongodb
        file.makePublic(function (error, apiResponse) {
            resolve({ apiResponse, fileName: gcsFileName });
        })

    });

    stream.end(image.buffer);

})


module.exports = uploadImage;
