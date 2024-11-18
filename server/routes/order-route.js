import Router from "express"

const router=Router()

import { updateOrderStatus } from "../controllers/order-controller.js";

//Update Order Status Api
router.put("/:orderId/:productId/updateStatus", updateOrderStatus);

export default router;
