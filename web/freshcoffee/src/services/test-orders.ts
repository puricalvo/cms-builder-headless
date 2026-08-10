import { api } from "./api";
import type { OrderItem } from "@/types";
import { calculateTotal } from "@/utils";

type CreateTestOrderData = {
    adminName: string;
    phone: string;
    deliveryMethod: "pickup" | "delivery";
    paymentMethod: "cash" | "card";
    deliveryAddress: string;
    order: OrderItem[];
};

export async function createTestOrder(
    data: CreateTestOrderData,
    token: string
) {

    return await api(
        `externas?table=test_orders&token=${token}&tableToken=admins&suffix=admin&suffix_module=test_order`,
        "POST",
        {
            name_test_order: "PRUEBA",

            admin_test_order:
                data.adminName,

            phone_test_order:
                data.phone,

            delivery_method_test_order:
                data.deliveryMethod,

            delivery_address_test_order:
                data.deliveryMethod === "delivery"
                    ? data.deliveryAddress
                    : "",

            payment_method_test_order:
                data.paymentMethod,

            payment_status_test_order:
                data.paymentMethod === "card"
                    ? "paid"
                    : "pending_payment",

            total_test_order:
                calculateTotal(data.order).toString(),

            status_test_order:
                "pending",

            items_test_order:
                JSON.stringify(data.order),

            visible_test_order:
                true
        }
    );
}

export async function getTestOrders(
    token: string
) {

    return await api(
        `externas?table=test_orders&token=${token}&tableToken=admins&suffix=admin&suffix_module=test_order`,
        "GET"
    );
}