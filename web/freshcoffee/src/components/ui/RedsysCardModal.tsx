import { useState } from "react";
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

    const [loading, setLoading] = useState(false);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >

            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">

                <h3 className="mb-5 text-xl font-semibold">
                    Introduce los datos de tu tarjeta
                </h3>

                <div className="mb-4 flex items-center rounded border p-3">

                    <span className="mr-2">
                        💳
                    </span>

                    <input
                        type="text"
                        placeholder="Número de tarjeta"
                        value={cardNumber}
                        onChange={(event) =>
                            setCardNumber(event.target.value)
                        }
                        className="w-full outline-none"
                    />

                </div>

                <div className="mb-4 flex gap-3">

                    <div className="flex flex-1 items-center rounded border p-3">

                        <span className="mr-2">
                            📅
                        </span>

                        <input
                            type="text"
                            placeholder="MM/AA"
                            value={expiryDate}
                            onChange={(event) =>
                                setExpiryDate(event.target.value)
                            }
                            className="w-full outline-none"
                        />

                    </div>

                    <div className="flex flex-1 items-center rounded border p-3">

                        <span className="mr-2">
                            🔒
                        </span>

                        <input
                            type="text"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(event) =>
                                setCvv(event.target.value)
                            }
                            className="w-full outline-none"
                        />

                    </div>

                </div>

                <button
                    type="button"
                    disabled={loading}
                    className="mb-3 w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
                    onClick={async () => {

                        setLoading(true);

                        /*
                         * ==========================================
                         * COMPROBAR PEDIDO PENDIENTE
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

                       

                        

                        try {

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
                                    amount: 100,
                                    cardNumber,
                                    expiryDate,
                                    cvv,
                                    emv3ds
                                });


                            if (error) {

                                console.error(
                                    "ERROR REDSYS:",
                                    error
                                );

                                setLoading(false);

                                return;
                            }

                            if (!data) {

                                console.error(
                                    "REDSYS NO DEVOLVIÓ DATOS"
                                );

                                setLoading(false);

                                return;
                            }

                            /*
                             * ==========================================
                             * CHALLENGE REDSYS
                             * ==========================================
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

                                if (form) {

                                   

                                    form.submit();

                                } else {

                                    console.error(
                                        "NO SE ENCONTRÓ redirectForm"
                                    );

                                }

                                return;
                            }

                            /*
                             * ==========================================
                             * RESPUESTA NORMAL
                             * ==========================================
                             */

                            if (
                                data.Ds_MerchantParameters
                            ) {

                               

                                try {

                                    const decoded =
                                        JSON.parse(
                                            atob(
                                                data.Ds_MerchantParameters
                                                    .replace(
                                                        /-/g,
                                                        "+"
                                                    )
                                                    .replace(
                                                        /_/g,
                                                        "/"
                                                    )
                                            )
                                        );

                                   

                                } catch (error) {

                                    console.error(
                                        "ERROR DECODIFICANDO REDSYS:",
                                        error
                                    );

                                }

                            }

                        } catch (error) {

                            console.error(
                                "ERROR AL LLAMAR A REDSYS:",
                                error
                            );

                        } finally {

                            setLoading(false);

                        }

                    }}
                >

                    {loading
                        ? "Procesando..."
                        : "Pagar"
                    }

                </button>

                <button
                    type="button"
                    disabled={loading}
                    className="w-full rounded border px-4 py-3 disabled:opacity-50"
                    onClick={onClose}
                >
                    Cerrar
                </button>

            </div>

        </div>
    );
}