import ImageKit from 'imagekit';
import multer from 'multer';
const storage = multer.memoryStorage();


export const uploadImage = async function (file) {
   
    const imagekit = new ImageKit({
        publicKey: process.env.publicKey,
        privateKey: process.env.privateKey,
        urlEndpoint: process.env.URL_END_POINT
    })

    let image = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: 'users/trial'
    })

    const imageUrl = image.url;
    
    return imageUrl
}

// var ImageKit = require("imagekit");

// var imagekit = new ImageKit({
//     publicKey: "your_public_api_key",
//     privateKey: "your_private_api_key",
//     urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/"
// });

// var fileId = "file_id";
// var versionId = "version_id"

// imagekit.deleteFileVersion({
//     fileId,
//     versionId
// }, function (error, result) {
//     if (error) console.log(error);
//     else console.log(result);
// });


