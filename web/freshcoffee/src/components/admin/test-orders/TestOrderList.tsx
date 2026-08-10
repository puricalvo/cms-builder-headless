import useSWR from "swr";
import TestOrderCard from "./TestOrderCard";

export type TestOrder = {
    id_test_order: number;
    name_test_order: string;
    admin_test_order: string;
    phone_test_order: string;
    delivery_method_test_order: string;
    delivery_address_test_order: string;
    payment_method_test_order: string;
    payment_status_test_order: string;
    total_test_order: number | string;
    status_test_order: string;
    items_test_order: string;
    visible_test_order: boolean;
    date_updated_test_order: string;
};

type Props = {
    status: string;
};

export default function TestOrderList({
    status
}: Props) {

    /*
     * =============================================
     * OBTENER PEDIDOS DE PRUEBA DESDE EL CMS
     * =============================================
     *
     * CMS
     *   ↓
     * /api/test-orders/[status]
     *   ↓
     * aquí
     *   ↓
     * TestOrderCard
     *
     * El "status" NO se utiliza para decidir
     * cuándo se muestra u oculta la tarjeta.
     *
     * Los pedidos de prueba solamente se ocultan
     * automáticamente después de 24 horas.
     */

    const url =
        `/api/test-orders/${status}`;

    const fetcher = async () => {

        const res =
            await fetch(url);

        if (!res.ok) {

            throw new Error(
                "Error obteniendo los pedidos de prueba"
            );

        }

        const json =
            await res.json();

        if (Array.isArray(json)) {
            return json;
        }

        return json.results ?? [];
    };

    const {
        data,
        isLoading,
        error
    } = useSWR<TestOrder[]>(
        url,
        fetcher,
        {
            refreshInterval: 60 * 1000
        }
    );

    if (isLoading) {

        return (
            <p className="text-center">
                Cargando pedidos de prueba...
            </p>
        );

    }

    if (error) {

        return (
            <p className="text-center text-red-600">
                Error al cargar los pedidos de prueba
            </p>
        );

    }

    if (!data || data.length === 0) {

        return (
            <p className="text-center">
                No hay pedidos de prueba
            </p>
        );

    }

    /*
     * =============================================
     * OCULTAR PEDIDOS DESPUÉS DE 24 HORAS
     * =============================================
     *
     * No modificamos el pedido.
     *
     * No lo borramos del CMS.
     *
     * No modificamos su estado.
     *
     * Simplemente dejamos de mostrar la tarjeta
     * en FreshCoffee cuando han pasado 24 horas.
     */

    const now =
        new Date();

    const filteredOrders =
        data.filter((order) => {

            const updatedDate =
                new Date(
                    order.date_updated_test_order
                );

            const hoursPassed =
                (
                    now.getTime() -
                    updatedDate.getTime()
                ) /
                (1000 * 60 * 60);

            return hoursPassed < 24;

        });

    if (filteredOrders.length === 0) {

        return (
            <p className="text-center">
                No hay pedidos de prueba
            </p>
        );

    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">

            {filteredOrders.map((order) => (

                <TestOrderCard
                    key={order.id_test_order}
                    order={order}
                />

            ))}

        </div>
    );
}