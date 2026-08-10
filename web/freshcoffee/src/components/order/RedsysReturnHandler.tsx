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
                 *
                 * Estos datos solamente existen cuando el
                 * administrador ha entrado mediante:
                 *
                 * /order/pricecafe?testOrder=1
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
                 *
                 * El pedido se crea solamente después de
                 * que Redsys haya autorizado el pago.
                 */

                const { data, error } =
                    await actions.orders.createOrder({

                        name:
                            orderData.name,

                        phone:
                            orderData.phone,

                        deliveryMethod:
                            orderData.deliveryMethod,

                        paymentMethod:
                            "card",

                        deliveryAddress:
                            orderData.deliveryAddress,

                        order:
                            orderData.order,

                        /*
                         * Si es prueba enviamos los datos.
                         * Para un pedido normal será false.
                         */

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
                 * Vaciar el mismo carrito que utiliza
                 * el cliente.
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
                 *
                 * El administrador mantiene su sesión
                 * y permanece en la página.
                 */

                if (isTestOrder) {

                    return;
                }

                /*
                 * =============================================
                 * PEDIDO NORMAL
                 * =============================================
                 *
                 * Mantenemos el comportamiento anterior.
                 */

                await actions.auth.signOut();

                /*
                 * Volver a inicio.
                 */

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