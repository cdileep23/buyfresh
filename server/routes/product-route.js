import { Router } from "express";
import { 
  getAllProducts, 
  getSellerProducts, 
  getSellerSingleProduct, 
  addProduct, 
  addRatingForProducts,
  cartProduct, 
  buyProduct, 
  getSellerProductsById
} from "../controllers/product-controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs"
import multer from "multer";
import cloudinary from 'cloudinary'
import dotenv from "dotenv"
dotenv.config()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("filename fxn", file)
    cb(null, './uploads');
    console.log("error")
  },
  filename: function (req, file, cb) {
    const random = uuidv4();

    cb(null, random + " " + file.originalname);

  }
});

const upload = multer({ storage: storage });

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret:process.env.CLOUD_SECRET_KEY
});

const handleImageUpload = async (req, res, next) => {
  try {
    console.log("handle upload")

    const imageFile = req.file;
console.log(`file pat          ${imageFile.path}`)
    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path);
      req.body.imageUrl = uploadResult.secure_url; 

      
      fs.unlink(imageFile.path, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Deleted file after uploading to Cloudinary');
        }
      });
    }

    next();
  } catch (error) {
    console.error('Error in handleImageUpload middleware:', error);
    res.status(500).json({ message: "Error uploading image", success: false });
  }
};


const router = Router();
router.route("/:productId/rating")
  .post(isAuthenticated, addRatingForProducts);

router.route('/').get(isAuthenticated,getAllProducts);
router.route('/seller-by-id/:sellerId').get(isAuthenticated,getSellerProductsById);


router.route("/getallproductsbyseller").get(isAuthenticated,getSellerProducts); 


router.route("/seller/:productId").get(isAuthenticated,getSellerSingleProduct); 


router.route("/seller/createProduct")
  .post(isAuthenticated, upload.single("imageFile"),handleImageUpload, addProduct); 


router.route("/user/:productId/cart")
  .get(isAuthenticated,cartProduct); 


router.route("/user/buyProduct")
  .get(isAuthenticated,buyProduct) 
  .put(isAuthenticated,buyProduct); 

export default router;
