import { useEffect } from "react";
import { actions } from "astro:actions";
import { useOrderStore } from "@/stores/order";
import { toast } from "react-toastify";
import { navigate } from "astro:transitions/client";

export default function RedsysReturnHandler() {

    useEffect(() => {

        async function processPayment() {

            /*
             * =============================================
             * COMPROBAR PEDIDO PENDIENTE
             * =============================================
             */

            const pendingOrder =
                sessionStorage.getItem(
                    "pending_order"
                );

            if (!pendingOrder) {
                return;
            }

            try {

                const orderData =
                    JSON.parse(
                        pendingOrder
                    );

                /*
                 * =============================================
                 * DATOS DEL PEDIDO DE PRUEBA
                 * =============================================
                 */

                const isTestOrder =
                    orderData.isTestOrder === true;

                const adminName =
                    orderData.adminName
                        ?.toString()
                        .trim() ?? "";

                /*
                 * =============================================
                 * CREAR PEDIDO
                 * =============================================
                 */

                const { data, error } =
                    await actions.orders.createOrder({

                        name:
                            orderData.name,

                        phone:
                            orderData.phone,

                        deliveryMethod:
                            orderData.deliveryMethod,

                        deliveryLocality:
                            orderData.deliveryLocality ?? "",

                        paymentMethod:
                            "card",

                        deliveryAddress:
                            orderData.deliveryAddress,

                        order:
                            orderData.order,

                        isTestOrder,

                        adminName:
                            isTestOrder
                                ? adminName
                                : undefined
                    });

                /*
                 * =============================================
                 * ERROR CREANDO EL PEDIDO
                 * =============================================
                 */

                if (error) {

                    console.error(
                        "ERROR CREANDO EL PEDIDO:",
                        error
                    );

                    toast.error(
                        "El pago ha sido realizado, pero no se ha podido crear el pedido."
                    );

                    return;
                }

                /*
                 * =============================================
                 * PEDIDO CREADO CORRECTAMENTE
                 * =============================================
                 */

                sessionStorage.removeItem(
                    "pending_order"
                );

                /*
                 * Vaciar carrito
                 */

                useOrderStore.setState({

                    order: [],

                    isOrderDrawerOpen: false

                });

                /*
                 * =============================================
                 * MENSAJE DE ÉXITO
                 * =============================================
                 */

                toast.success(
                    isTestOrder
                        ? "¡Pago autorizado! El pedido de prueba se ha creado correctamente."
                        : "¡Pago autorizado! Tu pedido se ha realizado correctamente."
                );

                /*
                 * =============================================
                 * PEDIDO DE PRUEBA
                 * =============================================
                 */

                if (isTestOrder) {

                    return;
                }

                /*
                 * =============================================
                 * PEDIDO NORMAL
                 * =============================================
                 */

                await actions.auth.signOut();

                setTimeout(() => {

                    navigate("/");

                }, 6000);

            } catch (error) {

                console.error(
                    "ERROR PROCESANDO PEDIDO DESPUÉS DEL PAGO:",
                    error
                );

                toast.error(
                    "El pago ha sido realizado, pero no se ha podido completar el pedido."
                );

            }

        }

        processPayment();

    }, []);

    return null;
}