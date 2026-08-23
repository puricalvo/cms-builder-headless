import { useEffect, useState } from "react";
import { useOrderStore } from "@/stores/order";

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
         * ==========================================
         * VACIAR CARRITO DEL PEDIDO DE PRUEBA
         * ==========================================
         *
         * El carrito está guardado en Zustand/persist,
         * por lo que debemos vaciarlo explícitamente.
         */

        useOrderStore.setState({

            order: [],

            isOrderDrawerOpen: false

        });

        /*
         * ==========================================
         * CERRAR MODO PEDIDO DE PRUEBA
         * ==========================================
         *
         * NO tocamos FRESHCOFFEE_TOKEN.
         *
         * La sesión del administrador permanece activa.
         */

        sessionStorage.removeItem(
            ADMIN_TEST_ORDER_KEY
        );

        /*
         * Volvemos al panel de pedidos de prueba.
         */

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