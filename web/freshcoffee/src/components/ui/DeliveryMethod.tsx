import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type DeliveryMethod = "pickup" | "delivery";

type DeliveryZone = {
    id_reparto: number;
    localidad_reparto: string;
    cafeteria_reparto: string;
    activa_reparto: number;
};

type Props = {
    deliveryMethod: DeliveryMethod;
    setDeliveryMethod: Dispatch<SetStateAction<DeliveryMethod>>;
    isProcessing: boolean;
    onLocalityChange: (locality: string) => void;
};

export default function DeliveryMethod({
    deliveryMethod,
    setDeliveryMethod,
    isProcessing,
    onLocalityChange
}: Props) {

    const [zones, setZones] =
        useState<DeliveryZone[]>([]);

    const [selectedLocality, setSelectedLocality] =
        useState("");

    useEffect(() => {

        const loadZones = async () => {

            try {

                const response =
                    await fetch("/api/delivery");

                if (!response.ok) {
                    return;
                }

                const data =
                    await response.json();

                const activeZones =
                    data.filter(
                        (zone: DeliveryZone) =>
                            zone.activa_reparto === 1
                    );

                setZones(activeZones);

            } catch {

                setZones([]);

            }

        };

        loadZones();

    }, []);

    return (
        <>
            <div className="space-y-3">

                <p className="font-bold text-lg">
                    ¿Cómo quieres recibir tu pedido?
                </p>

                <label className="flex items-center gap-3 cursor-pointer">

                    <input
                        type="radio"
                        name="delivery_method"
                        value="pickup"
                        checked={
                            deliveryMethod === "pickup"
                        }
                        onChange={() =>
                            setDeliveryMethod("pickup")
                        }
                        required
                        disabled={isProcessing}
                    />

                    <span>
                        Recoger en cafetería
                    </span>

                </label>

                {zones.length > 0 && (

                    <label className="flex items-center gap-3 cursor-pointer">

                        <input
                            type="radio"
                            name="delivery_method"
                            value="delivery"
                            checked={
                                deliveryMethod === "delivery"
                            }
                            onChange={() => {
                                setDeliveryMethod("delivery");
                            }}
                            disabled={isProcessing}
                        />

                        <span>
                            Reparto a domicilio
                        </span>

                    </label>

                )}

            </div>

            {deliveryMethod === "delivery" &&
                zones.length > 0 && (

                <div className="space-y-5">

                    <div className="space-y-3">

                        <label
                            htmlFor="delivery_locality"
                            className="font-bold text-lg"
                        >
                            Localidad:
                        </label>

                        <select
                            id="delivery_locality"
                            name="delivery_locality"
                            value={selectedLocality}
                            onChange={(e) => {

                                const locality =
                                    e.target.value;

                                setSelectedLocality(
                                    locality
                                );

                                onLocalityChange(
                                    locality
                                );
                            }}
                            className="border border-gray-300 p-2 w-full rounded-xl"
                            required
                            disabled={isProcessing}
                        >

                            <option value="">
                                Selecciona tu localidad
                            </option>

                            {zones.map((zone) => (

                                <option
                                    key={zone.id_reparto}
                                    value={
                                        zone.localidad_reparto
                                    }
                                >
                                    {zone.localidad_reparto}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="space-y-3">

                        <label
                            htmlFor="delivery_address"
                            className="font-bold text-lg"
                        >
                            Dirección de entrega:
                        </label>

                        <textarea
                            id="delivery_address"
                            name="delivery_address"
                            placeholder="Escribe tu dirección completa"
                            className="border border-gray-300 p-2 w-full rounded-xl min-h-24"
                            required
                            disabled={
                                isProcessing ||
                                !selectedLocality
                            }
                        />

                    </div>

                </div>

            )}
        </>
    );
}