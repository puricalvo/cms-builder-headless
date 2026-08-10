import { useEffect, useState } from "react";

const ADMIN_TEST_ORDER_KEY =
    "freshcoffee-admin-test-order";

export default function BackToAdminButton() {

    const [isTestOrder, setIsTestOrder] =
        useState(false);

    useEffect(() => {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const isTestOrderFromUrl =
            params.get("testOrder") === "1";

        if (isTestOrderFromUrl) {

            sessionStorage.setItem(
                ADMIN_TEST_ORDER_KEY,
                "true"
            );

            setIsTestOrder(true);

            return;
        }

        const isAdminTestOrder =
            sessionStorage.getItem(
                ADMIN_TEST_ORDER_KEY
            ) === "true";

        setIsTestOrder(isAdminTestOrder);

    }, []);

    const handleBackToAdmin = () => {

        /*
         * Cerramos SOLO el modo de pedido de prueba.
         *
         * NO tocamos FRESHCOFFEE_TOKEN.
         * La sesión del administrador permanece activa.
         */

        sessionStorage.removeItem(
            ADMIN_TEST_ORDER_KEY
        );

        window.location.href =
            "/admin/test-orders";
    };

    if (!isTestOrder) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={handleBackToAdmin}
            className="block bg-amber-500 hover:bg-amber-600 text-lg text-white p-3 uppercase font-bold rounded-xl text-center"
        >
            ← Volver al panel
        </button>
    );
}