import { useOrderStore } from "@/stores/order";
import {
    actions,
    isActionError,
    isInputError
} from "astro:actions";
import { navigate } from "astro:transitions/client";
import { toast } from "react-toastify";
import { useState } from "react";

export default function SubmitOrderForm() {

    const { order } = useOrderStore();

    const [deliveryMethod, setDeliveryMethod] =
        useState<"pickup" | "delivery">("pickup");

    const [paymentMethod, setPaymentMethod] =
        useState<"cash" | "card">("cash");

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const name =
            formData.get("name")?.toString().trim() ?? "";

        const phone =
            formData.get("phone")?.toString().trim() ?? "";

        const deliveryAddress =
            formData.get("delivery_address")?.toString().trim() ?? "";

        /*
         * VALIDACIÓN DEL FORMULARIO
         */

        if (!name) {
            toast.error("El nombre es obligatorio");
            return;
        }

        if (!phone) {
            toast.error("El teléfono es obligatorio");
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

        /*
         * CREAR PEDIDO
         */

        const { data, error } =
            await actions.orders.createOrder({
                name,
                phone,
                deliveryMethod,
                paymentMethod,
                deliveryAddress,
                order
            });

        /*
         * ERRORES DE VALIDACIÓN DE ASTRO ACTIONS
         */

        const inputErrors =
            isInputError(error)
                ? error.issues
                : [];

        if (inputErrors.length) {

            inputErrors.forEach(error => {
                toast.error(error.message);
            });

            return;
        }

        /*
         * ERRORES DE LA ACTION
         */

        const actionError =
            isActionError(error)
                ? error.message
                : null;

        if (actionError) {

            /*
             * EL CLIENTE NO ESTÁ AUTENTICADO
             */

            if (actionError === "No hay token") {

                toast.info(
                    "Para realizar el pedido debes iniciar sesión o registrarte"
                );

                setTimeout(() => {
                    navigate("/");
                }, 4000);

                return;
            }

            toast.error(actionError);

            return;
        }

        /*
         * PEDIDO CREADO CORRECTAMENTE
         */

        if (data && !error) {

            toast.success(data.message);

            useOrderStore.setState({
                order: [],
                isOrderDrawerOpen: false
            });

            await actions.auth.signOut();

            setTimeout(() => {
                navigate("/");
            }, 5000);
        }
    };

    return (
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
                        Tu Nombre:
                    </label>

                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Coloca tu Nombre"
                        className="border border-gray-300 p-2 w-full rounded-xl"
                        required
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
                    />

                </div>

                <div className="space-y-3">

                    <p className="font-bold text-lg">
                        ¿Cómo quieres recibir tu pedido?
                    </p>

                    <label className="flex items-center gap-3 cursor-pointer">

                        <input
                            type="radio"
                            name="delivery_method"
                            value="pickup"
                            checked={
                                deliveryMethod === "pickup"
                            }
                            onChange={() =>
                                setDeliveryMethod("pickup")
                            }
                            required
                        />

                        <span>
                            Recoger en cafetería
                        </span>

                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">

                        <input
                            type="radio"
                            name="delivery_method"
                            value="delivery"
                            checked={
                                deliveryMethod === "delivery"
                            }
                            onChange={() =>
                                setDeliveryMethod("delivery")
                            }
                        />

                        <span>
                            Reparto a domicilio
                        </span>

                    </label>

                </div>

                {deliveryMethod === "delivery" && (

                    <div className="space-y-3">

                        <label
                            htmlFor="delivery_address"
                            className="font-bold text-lg"
                        >
                            Dirección de entrega:
                        </label>

                        <textarea
                            id="delivery_address"
                            name="delivery_address"
                            placeholder="Escribe tu dirección completa"
                            className="border border-gray-300 p-2 w-full rounded-xl min-h-24"
                            required
                        />

                    </div>

                )}

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
                        />

                        <span>
                            Pago con tarjeta
                        </span>

                    </label>

                </div>

                <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white w-full rounded-xl py-3 mt-5 text-lg font-bold uppercase cursor-pointer"
                    type="submit"
                >
                    Realizar Pedido
                </button>

            </div>

        </form>
    );
}