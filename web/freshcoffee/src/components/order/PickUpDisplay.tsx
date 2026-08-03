import useSWR from "swr";
import type { OrderContent } from "@/types";

export default function PickUpDisplay() {

    const url = `/api/orders/pickup?per_page=5`;

    const fetcher = () =>
        fetch(url).then(res => res.json());

    const config = {
        refreshInterval: 1000 * 5
    };

    const { data, isLoading } =
        useSWR<OrderContent[]>(url, fetcher, config);

    if (isLoading) {
        return "Cargando...";
    }

    if (!data) {
        return null;
    }

    if (data.length === 0) {
        return (
            <p className="text-center">
                No hay ordenes listas
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 w-full">
            {data.slice(0, 5).map(order => (
                <div
                    key={order.id_order}
                    className="shadow p-5 border-gray-200 border"
                >
                    <p className="text-2xl font-bold">
                        ID: {order.id_order}
                    </p>

                    <p className="text-3xl">
                        Nombre: {order.name_order}
                    </p>
                </div>
            ))}
        </div>
    );
}