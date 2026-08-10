import { auth } from "./auth";
import { orders } from "./orders";
import { products } from "./products";
import { upload } from "./upload";
import { redsys } from "./redsys";
import { testOrders } from "./test-orders";

export const server = {
    auth,
    orders,
    upload,
    products,
    redsys,
    testOrders,
};