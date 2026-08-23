import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { useEffect, useState } from "react";
import { useOrderStore } from "@/stores/order";

export default function SignOutButton() {

    const [visible, setVisible] =
        useState(false);

    const [isProcessing, setIsProcessing] =
        useState(false);

    useEffect(() => {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const isTestOrderFromUrl =
            params.get("testOrder") === "1";

        const isAdminTestOrder =
            sessionStorage.getItem(
                "freshcoffee-admin-test-order"
            ) === "true";

        if (
            isTestOrderFromUrl ||
            isAdminTestOrder
        ) {
            setVisible(false);
            return;
        }

        setVisible(true);

    }, []);

    const handleSignOut = async () => {

        if (isProcessing) {
            return;
        }

        setIsProcessing(true);

        /*
         * =============================================
         * VACIAR CARRITO
         * =============================================
         *
         * El carrito se elimina tanto si la sesión
         * pertenece a un cliente como si es invitado.
         *
         * NO tocamos ninguna clave del contador.
         */

        useOrderStore.setState({
            order: [],
            isOrderDrawerOpen: false
        });

        /*
         * =============================================
         * CERRAR SESIÓN
         * =============================================
         *
         * Esto elimina FRESHCOFFEE_TOKEN.
         */

        await actions.auth.signOut();

        /*
         * =============================================
         * VOLVER AL INICIO
         * =============================================
         */

        navigate("/");

    };

    if (!visible) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={handleSignOut}
            disabled={isProcessing}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white p-2 rounded-xl font-bold"
        >
            {isProcessing
                ? "Saliendo..."
                : "Salir"
            }
        </button>
    );
}