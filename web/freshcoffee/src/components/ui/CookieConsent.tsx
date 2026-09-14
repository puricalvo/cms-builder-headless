import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "freshcoffee-cookie-consent";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);

        if (!consent) {
            setVisible(true);
        }
    }, []);

    const handleConsent = (value: "accepted" | "rejected") => {
        localStorage.setItem(COOKIE_CONSENT_KEY, value);
        setVisible(false);
    };

    if (!visible) {
        return null;
    }

    return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-3">
                    <div className="text-2xl" aria-hidden="true">
                        🍪
                    </div>

                    <div>
                        <h2 className="text-sm font-black text-slate-800 sm:text-base">
                            Utilizamos cookies
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                            FreshCoffee utiliza cookies necesarias para el
                            funcionamiento de la aplicación.
                        </p>

                        <a
                            href="/legal/cookies?from=home"
                            className="mt-1 inline-block text-xs font-semibold text-amber-600 underline hover:text-amber-700"
                        >
                            Política de cookies
                        </a>
                    </div>
                </div>

                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        onClick={() => handleConsent("rejected")}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                    >
                        Rechazar
                    </button>

                    <button
                        type="button"
                        onClick={() => handleConsent("accepted")}
                        className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-black text-slate-900 transition hover:bg-amber-500 cursor-pointer"
                    >
                        Aceptar
                    </button>
                </div>

            </div>
        </div>
    </div>
);
}