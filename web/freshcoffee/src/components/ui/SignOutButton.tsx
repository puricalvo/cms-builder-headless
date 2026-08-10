import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { useEffect, useState } from "react";

export default function SignOutButton() {

    const [visible, setVisible] =
        useState(false);

    const [isProcessing, setIsProcessing] =
        useState(false);

    useEffect(() => {

        const checkSession = async () => {

            /*
             * Si estamos en modo prueba de administrador,
             * este botón no debe aparecer.
             */

            const isAdminTestOrder =
                sessionStorage.getItem(
                    "freshcoffee-admin-test-order"
                ) === "true";

            if (isAdminTestOrder) {
                setVisible(false);
                return;
            }

            /*
             * Si no estamos en modo prueba,
             * mostramos el botón.
             *
             * Tanto cliente como invitado utilizan
             * FRESHCOFFEE_TOKEN.
             */

            setVisible(true);
        };

        checkSession();

    }, []);

    const handleSignOut = async () => {

        if (isProcessing) {
            return;
        }

        setIsProcessing(true);

        /*
         * Cerramos la sesión actual.
         *
         * Esto elimina FRESHCOFFEE_TOKEN.
         */

        await actions.auth.signOut();

        /*
         * Si era invitado, también eliminamos
         * el inicio del contador.
         */

        localStorage.removeItem(
            "freshcoffee-guest-started"
        );

        /*
         * Eliminamos también la marca de invitado
         * expirado, si existiera.
         */

        localStorage.removeItem(
            "freshcoffee-guest-expired"
        );

        /*
         * Volvemos al inicio.
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