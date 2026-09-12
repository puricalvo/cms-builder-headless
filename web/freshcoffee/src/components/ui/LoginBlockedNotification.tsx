import { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";

interface Props {
    show: boolean;
}

export default function LoginBlockedNotification({ show }: Props) {

    const alreadyShown = useRef(false);

    useEffect(() => {

        if (!show || alreadyShown.current) {
            return;
        }

        alreadyShown.current = true;

        // Quitar ?_action=auth.signInUser de la URL
        window.history.replaceState(
            {},
            "",
            "/auth/login"
        );

        // Mostrar la notificación
        const toastTimer = window.setTimeout(() => {

            toast.info(
                "Esta cuenta está bloqueada. Debes registrarte nuevamente para poder acceder.",
                {
                    containerId: "login-blocked-toast"
                }
            );

        }, 100);

        // Después de 4 segundos ir al registro
        const redirectTimer = window.setTimeout(() => {

            window.location.href = "/auth/register";

        }, 5000);

        return () => {
            window.clearTimeout(toastTimer);
            window.clearTimeout(redirectTimer);
        };

    }, [show]);


    return (
        <ToastContainer
            containerId="login-blocked-toast"
            position="top-center"
        />
    );
}