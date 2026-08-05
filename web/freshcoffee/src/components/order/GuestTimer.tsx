import { useEffect, useState } from "react";
import { actions } from "astro:actions";
import { useOrderStore } from "@/stores/order";
import { navigate } from "astro:transitions/client";
import { ClockIcon } from "@heroicons/react/24/outline";

const GUEST_TIME = 2 * 60 * 1000;

export default function GuestTimer() {

    const [remaining, setRemaining] =
        useState<number | null>(null);

    useEffect(() => {

        const started =
            localStorage.getItem(
                "freshcoffee-guest-started"
            );

        if (!started) {
            return;
        }

        const startedAt =
            Number(started);

        const updateTimer = async () => {

            const elapsed =
                Date.now() - startedAt;

            const timeLeft =
                GUEST_TIME - elapsed;

            if (timeLeft <= 0) {

                setRemaining(0);

                /*
                 * ==============================
                 * TIEMPO AGOTADO
                 * ==============================
                 *
                 * Vaciamos el carrito y lo cerramos.
                 */

                useOrderStore.setState({
                    order: [],
                    isOrderDrawerOpen: false
                });

                localStorage.removeItem(
                    "freshcoffee-guest-started"
                );

                /*
                 * Cerramos la sesión de invitado
                 * y eliminamos FRESHCOFFEE_TOKEN.
                 */

                await actions.auth.signOutGuest();

                /*
                 * Avisamos a la página de inicio
                 * de que el tiempo ha terminado.
                 */

                localStorage.setItem(
                    "freshcoffee-guest-expired",
                    "true"
                );

                navigate("/");

                return;
            }

            setRemaining(timeLeft);
        };

        updateTimer();

        const interval =
            setInterval(updateTimer, 1000);

        return () => {
            clearInterval(interval);
        };

    }, []);

    if (remaining === null) {
        return null;
    }

    const totalSeconds =
        Math.ceil(remaining / 1000);

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    return (
        <div
            className="flex items-center gap-2 font-bold text-lg"
            title="Tiempo disponible como invitado"
        >
            <ClockIcon
                className="h-8 w-8 "
                aria-hidden="true"
            />

            <span>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
            </span>
        </div>
    );
}