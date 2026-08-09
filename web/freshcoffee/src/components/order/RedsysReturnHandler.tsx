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
             *
             * Este dato solamente existe cuando el cliente
             * inició un pago con tarjeta.
             *
             * Redsys ya ha hecho el challenge y nuestro PHP
             * solamente vuelve a /order/pricecafe cuando el
             * pago ha sido autorizado.
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
                 * CREAR PEDIDO
                 * =============================================
                 *
                 * IMPORTANTE:
                 * El pedido se crea AHORA.
                 *
                 * Nunca antes del pago.
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
                            orderData.order
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
                 * Vaciar carrito y cerrar drawer.
                 */

                useOrderStore.setState({
                    order: [],
                    isOrderDrawerOpen: false
                });

                /*
                 * Mensaje de éxito.
                 */

                toast.success(
                    "¡Pago autorizado! Tu pedido se ha realizado correctamente."
                );

                /*
                 * Cerrar sesión.
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