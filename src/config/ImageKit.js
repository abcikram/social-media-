import ImageKit from "imagekit";

export const imagekit = new ImageKit({
    publicKey : process.env.PUBLICKEY,
    privateKey : process.env.PRIVATEKEY,
    urlEndpoint : process.env.URL_END_POINT
});

