import Router from "express"

const router=Router()

import { updateOrderStatus } from "../controllers/order-controller.js";

//Update Order Status Api
router.put("/:orderId/updateStatus", updateOrderStatus);

export default router;
