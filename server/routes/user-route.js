import express from "express"
import { getAllOrders, getCartItems, getAllOrderEachProduct, login, logout, register,updateUserProfile, getAllOrderFarmers,checkToken, removeCartProduct } from "../controllers/user-controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";



const router=express.Router();
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(isAuthenticated,logout)
router.route('/update').put(isAuthenticated,updateUserProfile)
router.route('/get-all-order').get(isAuthenticated,getAllOrders)
router.route('/get-all-cart-items').get(isAuthenticated,getCartItems)
router.route('/cart/:productId').get(isAuthenticated,removeCartProduct)
router.route('/farmer/get-Allorders-each-product').get(isAuthenticated,getAllOrderEachProduct)
router.route('/farmer/get-Allorders').get(isAuthenticated,getAllOrderFarmers)
router.route('/check-user').get(checkToken);
export default router