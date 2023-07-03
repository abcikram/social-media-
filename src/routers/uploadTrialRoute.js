import express from 'express'
import ImageKit from 'imagekit';
const router = express.Router();
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage:storage})

router.post('/',upload.single("file"),async(req,res) =>{
    let file = req.file
    console.log(file);
    const imagekit = new ImageKit({
        publicKey:"public_D7mlT470io9+XU3X7NxIqppBRS4=",
        privateKey:"private_RAnLtGjFC2SsAz6aOZ9g4/N2308=",
        urlEndpoint:"https://ik.imagekit.io/oxtdhgpbm/users"
    }) 

   let image =await imagekit.upload({
    file:req.file.buffer,
    fileName:'file.png',
    folder:'users/trial'
   })
   console.log(image);

    return res.send("jhfsdjhf")
})

export default router