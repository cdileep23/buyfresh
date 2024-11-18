import { Router } from "express";
import { 
  getAllProducts, 
  getSellerProducts, 
  getSellerSingleProduct, 
  addProduct, 
  addRatingForProducts,
  cartProduct, 
  buyProduct 
} from "../controllers/product-controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs"
import multer from "multer";
import cloudinary from 'cloudinary'

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
  cloud_name: "dzb0rtckl", 
  api_key: 213546156719363, 
  api_secret:  "87nWrjNrG9fkIA-Wnd1hr3YlUfQ"
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
  .post(isAuthenticated, addRatingForProducts); // Authenticate the user before adding the rating

// Get all products from all sellers
router.route('/').get(isAuthenticated,getAllProducts);

// Get products added by a specific seller
router.route("/getallproductsbyseller").get(isAuthenticated,getSellerProducts); // Uses req.user.id from middleware


router.route("/seller/:productId").get(isAuthenticated,getSellerSingleProduct); 


router.route("/seller/createProduct")
  .post(isAuthenticated, upload.single("imageFile"),handleImageUpload, addProduct); 


router.route("/user/:productId/cart")
  .put(isAuthenticated,cartProduct); 


router.route("/user/buyProduct")
  .get(isAuthenticated,buyProduct) 
  .put(isAuthenticated,buyProduct); 

export default router;
