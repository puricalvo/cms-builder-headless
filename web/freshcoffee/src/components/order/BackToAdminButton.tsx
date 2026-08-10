import { useEffect, useState } from "react";

export default function BackToAdminButton() {

    const [isTestOrder, setIsTestOrder] =
        useState(false);

    useEffect(() => {

        const params =
            new URLSearchParams(
                window.location.search
            );

        setIsTestOrder(
            params.get("testOrder") === "1"
        );

    }, []);

    if (!isTestOrder) {
        return null;
    }

    return (
        <a
            href="/admin/test-orders"
            className="block bg-amber-500 hover:bg-amber-600 text-lg text-white p-3 uppercase font-bold rounded-xl text-center"
        >
            ← Volver al panel
        </a>
    );
}