import ImageKit from 'imagekit';
import multer from 'multer';
const storage = multer.memoryStorage();

// +++++++++++++++++++++++++ Image upload :- ++++++++++++++++++++++++++++++//

export const uploadImage = async function (userId,type,file,postId) {
   
    const imagekit = new ImageKit({
        publicKey: process.env.publicKey,
        privateKey: process.env.privateKey,
        urlEndpoint: process.env.URL_END_POINT
    })
  
    if(type == 'profilePicture'){
        var image = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: `facebook_clone/users/${userId}/profile_Pics`
        })
    }

    else if(type == 'coverPicture'){
        var image = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: `facebook_clone/users/${userId}/cover_Pics`
        })
    
    }
    else if(type == 'post'){
        var image = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: `facebook_clone/users/${userId}/post_Pics/${postId}`
        })
    }

    
    return image
}



//+++++++++++++++++++++++++++++ Image deleted:- +++++++++++++++++++++++++++++++++//

// var ImageKit = require("imagekit");

// var imagekit = new ImageKit({
//     publicKey : "your_public_api_key",
//     privateKey : "your_private_api_key",
//     urlEndpoint : "https://ik.imagekit.io/your_imagekit_id/"
// });

// imagekit.deleteFile("file_id", function(error, result) {
//     if(error) console.log(error);
//     else console.log(result);
// });

export const deleteImage = async function(fileId){
    const imagekit = new ImageKit({
        publicKey: process.env.PUBLICKEY,
        privateKey: process.env.PRIVATEKEY,
        urlEndpoint: process.env.URL_END_POINT
    })

    try {
        await imagekit.deleteFile(`${fileId}`);
        console.log('Image deleted successfully');
      } catch (error) {
        console.error('Error deleting image:', error);
      }
}


