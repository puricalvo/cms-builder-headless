import { useOrderStore } from "@/stores/order";
import {
    actions,
    isActionError,
    isInputError
} from "astro:actions";
import { navigate } from "astro:transitions/client";
import { toast } from "react-toastify";
import { useState } from "react";
import RedsysCardModal from "@/components/ui/RedsysCardModal";
import DeliveryMethod from "@/components/ui/DeliveryMethod";

type SubmitOrderFormProps = {
    total: number;
};

const ADMIN_TEST_ORDER_KEY =
    "freshcoffee-admin-test-order";

export default function SubmitOrderForm({
    total
}: SubmitOrderFormProps) {

    const { order } = useOrderStore();

    /*
     * =============================================
     * COMPROBAR MODO PRUEBA
     * =============================================
     *
     * El modo prueba puede venir de:
     *
     * 1. ?testOrder=1
     * 2. sessionStorage
     *
     * De esta forma el modo prueba se mantiene aunque
     * el administrador navegue entre categorías.
     */

    const isTestOrder =
        new URLSearchParams(window.location.search)
            .get("testOrder") === "1" ||
        sessionStorage.getItem(
            ADMIN_TEST_ORDER_KEY
        ) === "true";

    /*
     * Si hemos entrado directamente mediante
     * ?testOrder=1, guardamos el modo prueba para
     * mantenerlo durante toda la navegación.
     */

    if (
        new URLSearchParams(window.location.search)
            .get("testOrder") === "1"
    ) {
        sessionStorage.setItem(
            ADMIN_TEST_ORDER_KEY,
            "true"
        );
    }

    const [deliveryMethod, setDeliveryMethod] =
        useState<"pickup" | "delivery">("pickup");

    const [deliveryLocality, setDeliveryLocality] =
        useState("");

    const [paymentMethod, setPaymentMethod] =
        useState<"cash" | "card">("cash");

    const [isProcessing, setIsProcessing] =
        useState(false);

    const [isCardModalOpen, setIsCardModalOpen] =
        useState(false);


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (isProcessing) {
            return;
        }

        const form =
            e.target as HTMLFormElement;

        const formData =
            new FormData(form);

        /*
         * =============================================
         * DATOS DEL FORMULARIO
         * =============================================
         */

        const name =
            formData.get("name")
                ?.toString()
                .trim() ?? "";

        const phone =
            formData.get("phone")
                ?.toString()
                .trim() ?? "";

        const deliveryAddress =
            formData.get("delivery_address")
                ?.toString()
                .trim() ?? "";

        /*
         * En modo prueba el mismo campo "name"
         * contiene el nombre del administrador.
         */

        const adminName =
            isTestOrder
                ? name
                : "";


        /*
         * =============================================
         * VALIDACIÓN
         * =============================================
         */

        if (!name) {

            toast.error(
                isTestOrder
                    ? "El nombre del administrador es obligatorio"
                    : "El nombre es obligatorio"
            );

            return;
        }

        if (!phone) {

            toast.error(
                "El teléfono es obligatorio"
            );

            return;
        }

        if (
            deliveryMethod === "delivery" &&
            !deliveryLocality
        ) {

            toast.error(
                "La localidad de entrega es obligatoria"
            );

            return;
        }

        if (
            deliveryMethod === "delivery" &&
            !deliveryAddress
        ) {

            toast.error(
                "La dirección de entrega es obligatoria"
            );

            return;
        }

        if (!order.length) {

            toast.error(
                "No hay productos en el pedido"
            );

            return;
        }

        /*
         * BLOQUEAMOS EL FORMULARIO
         */

        setIsProcessing(true);


        /*
         * =============================================
         * PAGO CON TARJETA
         * =============================================
         *
         * Guardamos también el modo prueba para que
         * RedsysReturnHandler pueda crear el pedido
         * correcto al volver del pago.
         */

        if (paymentMethod === "card") {

            sessionStorage.setItem(
                "pending_order",
                JSON.stringify({

                    name,

                    phone,

                    deliveryMethod,

                    deliveryLocality,

                    deliveryAddress,

                    order,

                    total,

                    isTestOrder,

                    adminName:
                        isTestOrder
                            ? adminName
                            : ""
                })
            );

            setIsProcessing(false);

            setIsCardModalOpen(true);

            return;
        }


        /*
         * =============================================
         * PAGO EN EFECTIVO
         * =============================================
         */

        const { data, error } =
            await actions.orders.createOrder({

                name,

                phone,

                deliveryMethod,

                deliveryLocality,

                paymentMethod,

                deliveryAddress,

                order,

                isTestOrder,

                adminName:
                    isTestOrder
                        ? adminName
                        : undefined
            });


        /*
         * =============================================
         * ERRORES DE VALIDACIÓN
         * =============================================
         */

        const inputErrors =
            isInputError(error)
                ? error.issues
                : [];

        if (inputErrors.length) {

            setIsProcessing(false);

            inputErrors.forEach(error => {

                toast.error(
                    error.message
                );

            });

            return;
        }


        /*
         * =============================================
         * ERRORES DE LA ACTION
         * =============================================
         */

        const actionError =
            isActionError(error)
                ? error.message
                : null;

        if (actionError) {

            setIsProcessing(false);

            if (actionError === "No hay token") {

                toast.info(
                    "Como invitado puedes preparar tu pedido, pero para finalizar la compra debes iniciar sesión o registrarte."
                );

                setTimeout(() => {

                    navigate("/");

                }, 4000);

                return;
            }

            if (actionError === "INVITADO") {

                toast.info(
                    "Como invitado puedes preparar tu pedido, pero para finalizar la compra debes iniciar sesión o registrarte."
                );

                setTimeout(() => {

                    navigate("/");

                }, 4000);

                return;
            }

            toast.error(
                actionError
            );

            return;
        }


        /*
         * =============================================
         * PEDIDO CREADO CORRECTAMENTE
         * =============================================
         */

        if (data && !error) {

            toast.success(
                data.message
            );

            /*
             * Vaciar carrito.
             */

            useOrderStore.setState({

                order: [],

                isOrderDrawerOpen: false

            });


            /*
             * =============================================
             * PEDIDO DE PRUEBA
             * =============================================
             *
             * El administrador mantiene su sesión.
             */

            if (isTestOrder) {

                setIsProcessing(false);

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

            }, 5000);

            return;
        }

        setIsProcessing(false);

    };


    return (
        <>

            <form
                className="mt-5"
                onSubmit={handleSubmit}
            >

                <div className="space-y-5">

                    <div className="space-y-3">

                        <label
                            htmlFor="name"
                            className="font-bold text-lg"
                        >
                            {isTestOrder
                                ? "Administrador que realiza la prueba:"
                                : "Tu Nombre:"
                            }
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder={
                                isTestOrder
                                    ? "Nombre del administrador"
                                    : "Coloca tu Nombre"
                            }
                            className="border border-gray-300 p-2 w-full rounded-xl"
                            required
                            disabled={isProcessing}
                        />

                    </div>


                    <div className="space-y-3">

                        <label
                            htmlFor="phone"
                            className="font-bold text-lg"
                        >
                            Teléfono:
                        </label>

                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Tu número de teléfono"
                            className="border border-gray-300 p-2 w-full rounded-xl"
                            required
                            disabled={isProcessing}
                        />

                    </div>


                    <DeliveryMethod
                        deliveryMethod={deliveryMethod}
                        setDeliveryMethod={setDeliveryMethod}
                        isProcessing={isProcessing}
                        onLocalityChange={setDeliveryLocality}
                    />


                    <div className="space-y-3">

                        <p className="font-bold text-lg">
                            Forma de pago:
                        </p>

                        <label className="flex items-center gap-3 cursor-pointer">

                            <input
                                type="radio"
                                name="payment_method"
                                value="cash"
                                checked={
                                    paymentMethod === "cash"
                                }
                                onChange={() =>
                                    setPaymentMethod("cash")
                                }
                                required
                                disabled={isProcessing}
                            />

                            <span>
                                Pago en efectivo
                            </span>

                        </label>


                        <label className="flex items-center gap-3 cursor-pointer">

                            <input
                                type="radio"
                                name="payment_method"
                                value="card"
                                checked={
                                    paymentMethod === "card"
                                }
                                onChange={() =>
                                    setPaymentMethod("card")
                                }
                                disabled={isProcessing}
                            />

                            <span>
                                Pago con tarjeta
                            </span>

                        </label>

                    </div>


                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white w-full rounded-xl py-3 mt-5 text-lg font-bold uppercase cursor-pointer disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isProcessing}
                    >
                        {isProcessing
                            ? "Procesando..."
                            : paymentMethod === "card"
                                ? "Pagar con tarjeta"
                                : isTestOrder
                                    ? "Crear pedido de prueba"
                                    : "Realizar Pedido"
                        }
                    </button>

                </div>

            </form>


            <RedsysCardModal
                isOpen={isCardModalOpen}
                onClose={() =>
                    setIsCardModalOpen(false)
                }
            />

        </>
    );
}