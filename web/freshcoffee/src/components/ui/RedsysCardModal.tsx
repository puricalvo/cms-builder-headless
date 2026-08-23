import { useEffect, useState } from "react";
import { getEmv3dsParams } from "@/utils/emv3ds";
import { actions } from "astro:actions";

interface RedsysCardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RedsysCardModal({
    isOpen,
    onClose
}: RedsysCardModalProps) {

    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);

    /*
     * ==========================================
     * CARGAR DATOS DEL PEDIDO
     * ==========================================
     *
     * El pedido todavía no existe en la base de datos.
     * Por eso no mostramos un ID de pedido.
     *
     * El total sí existe porque está guardado en
     * pending_order antes de iniciar el pago.
     */

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        const pendingOrder =
            sessionStorage.getItem(
                "pending_order"
            );

        if (!pendingOrder) {

            console.error(
                "NO EXISTE pending_order"
            );

            return;
        }

        try {

            const orderData =
                JSON.parse(
                    pendingOrder
                );

            const orderTotal =
                Number(orderData.total);

            if (
                Number.isFinite(orderTotal) &&
                orderTotal > 0
            ) {

                setTotal(orderTotal);

            } else {

                console.error(
                    "TOTAL DEL PEDIDO NO VÁLIDO:",
                    orderData.total
                );

                setTotal(0);
            }

        } catch (error) {

            console.error(
                "ERROR LEYENDO pending_order:",
                error
            );

            setTotal(0);
        }

    }, [isOpen]);


    /*
     * ==========================================
     * FORMATEAR IMPORTE
     * ==========================================
     */

    const formattedTotal =
        total.toLocaleString(
            "es-ES",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    /*
     * ==========================================
     * PROCESAR PAGO
     * ==========================================
     */

    const handlePayment = async () => {

        if (loading) {
            return;
        }

        setLoading(true);

        /*
         * ==========================================
         * RECUPERAR PEDIDO PENDIENTE
         * ==========================================
         */

        const pendingOrder =
            sessionStorage.getItem(
                "pending_order"
            );

        if (!pendingOrder) {

            console.error(
                "NO EXISTE pending_order"
            );

            setLoading(false);

            return;
        }

        try {

            const orderData =
                JSON.parse(
                    pendingOrder
                );

            /*
             * ==========================================
             * COMPROBAR IMPORTE
             * ==========================================
             */

            const orderTotal =
                Number(orderData.total);

            if (
                !Number.isFinite(orderTotal) ||
                orderTotal <= 0
            ) {

                console.error(
                    "IMPORTE DEL PEDIDO NO VÁLIDO:",
                    orderData.total
                );

                setLoading(false);

                return;
            }

            /*
             * Redsys trabaja en céntimos.
             *
             * Ejemplo:
             *
             * 7,50 € -> 750
             * 12,30 € -> 1230
             */

            const amount =
                Math.round(
                    orderTotal * 100
                );

            /*
             * ==========================================
             * DATOS EMV 3DS
             * ==========================================
             */

            const emv3ds =
                getEmv3dsParams() as {
                    browserUserAgent: string;
                    browserJavaEnabled: boolean;
                    browserJavascriptEnabled: boolean;
                    browserLanguage: string;
                    browserColorDepth: number;
                    browserScreenHeight: number;
                    browserScreenWidth: number;
                    browserTZ: number;
                };


            /*
             * ==========================================
             * LLAMAR A REDSYS
             * ==========================================
             */

            const {
                data,
                error
            } =
                await actions.redsys.createCardPayment({

                    amount,

                    cardNumber,

                    expiryDate,

                    cvv,

                    emv3ds

                });


            /*
             * ==========================================
             * ERROR REDSYS
             * ==========================================
             */

            if (error) {

                console.error(
                    "ERROR REDSYS:",
                    error
                );

                setLoading(false);

                return;
            }


            /*
             * ==========================================
             * COMPROBAR RESPUESTA
             * ==========================================
             */

            if (!data) {

                console.error(
                    "REDSYS NO DEVOLVIÓ DATOS"
                );

                setLoading(false);

                return;
            }

            /*
             * ==========================================
             * CHALLENGE 3DS
             * ==========================================
             *
             * Si Redsys necesita autenticación adicional,
             * enviamos el formulario que devuelve Redsys.
             */

            if (data.challenge) {

                const challengeContainer =
                    document.createElement(
                        "div"
                    );

                challengeContainer.innerHTML =
                    data.challenge;

                document.body.appendChild(
                    challengeContainer
                );

                const form =
                    challengeContainer.querySelector(
                        "#redirectForm"
                    ) as HTMLFormElement | null;

                if (!form) {

                    console.error(
                        "NO SE ENCONTRÓ redirectForm"
                    );

                    challengeContainer.remove();

                    setLoading(false);

                    return;
                }

                /*
                 * Dejamos que Redsys continúe
                 * el proceso de autenticación.
                 */

                form.submit();

                return;
            }


            /*
             * ==========================================
             * RESPUESTA REDSYS SIN CHALLENGE
             * ==========================================
             *
             * Redsys devuelve directamente los parámetros.
             *
             * No eliminamos pending_order porque
             * RedsysReturnHandler lo necesita para
             * crear el pedido.
             */

            if (
                data.Ds_MerchantParameters
            ) {


                window.location.href =
                    "/order/pricecafe";

                return;
            }


            /*
             * ==========================================
             * RESPUESTA NO RECONOCIDA
             * ==========================================
             */

            console.error(
                "RESPUESTA REDSYS NO RECONOCIDA:",
                data
            );

            setLoading(false);

        } catch (error) {

            console.error(
                "ERROR AL PROCESAR EL PAGO:",
                error
            );

            setLoading(false);
        }
    };


    /*
     * ==========================================
     * MODAL CERRADO
     * ==========================================
     */

    if (!isOpen) {
        return null;
    }


    /*
     * ==========================================
     * INTERFAZ
     * ==========================================
     */

    return (
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4"
            onClick={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    if (!loading) {
                        onClose();
                    }
                }

            }}
        >

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                {/* ======================================
                    CABECERA
                ====================================== */}

                <div className="mb-5 text-center">

                    <div className="mb-2 text-3xl">
                        ☕
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900">
                        Cafetería Desde 1939
                    </h3>

                    <p className="mt-1 text-gray-600">
                        Pago seguro con tarjeta
                    </p>

                </div>


                {/* ======================================
                    TOTAL
                ====================================== */}

                <div className="mb-6 rounded-2xl bg-gray-100 p-5 text-center">

                    <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Total a pagar
                    </p>

                    <p className="mt-1 text-4xl font-bold text-gray-900">
                        {formattedTotal} €
                    </p>

                </div>


                {/* ======================================
                    DATOS TARJETA
                ====================================== */}

                <div className="mb-4 flex items-center rounded-xl border border-gray-300 p-3">

                    <span className="mr-2">
                        💳
                    </span>

                    <input
                        type="text"
                        placeholder="Número de tarjeta"
                        value={cardNumber}
                        onChange={(event) =>
                            setCardNumber(
                                event.target.value
                            )
                        }
                        className="w-full outline-none"
                        disabled={loading}
                        inputMode="numeric"
                        autoComplete="cc-number"
                    />

                </div>


                <div className="mb-5 flex gap-3">

                    <div className="flex flex-1 items-center rounded-xl border border-gray-300 p-3">

                        <span className="mr-2">
                            📅
                        </span>

                        <input
                            type="text"
                            placeholder="MM/AA"
                            value={expiryDate}
                            onChange={(event) =>
                                setExpiryDate(
                                    event.target.value
                                )
                            }
                            className="w-full outline-none"
                            disabled={loading}
                            inputMode="numeric"
                            autoComplete="cc-exp"
                        />

                    </div>


                    <div className="flex flex-1 items-center rounded-xl border border-gray-300 p-3">

                        <span className="mr-2">
                            🔒
                        </span>

                        <input
                            type="text"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(event) =>
                                setCvv(
                                    event.target.value
                                )
                            }
                            className="w-full outline-none"
                            disabled={loading}
                            inputMode="numeric"
                            autoComplete="cc-csc"
                        />

                    </div>

                </div>


                {/* ======================================
                    BOTÓN PAGAR
                ====================================== */}

                <button
                    type="button"
                    disabled={
                        loading ||
                        total <= 0
                    }
                    className="mb-3 w-full rounded-xl bg-black px-4 py-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handlePayment}
                >

                    {loading
                        ? "Procesando..."
                        : `Pagar ${formattedTotal} €`
                    }

                </button>


                {/* ======================================
                    BOTÓN CERRAR
                ====================================== */}

                <button
                    type="button"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={onClose}
                >
                    Cerrar
                </button>


                {/* ======================================
                    INFORMACIÓN
                ====================================== */}

                <p className="mt-4 text-center text-xs text-gray-500">
                    El pago se procesa de forma segura.
                </p>

            </div>

        </div>
    );
}