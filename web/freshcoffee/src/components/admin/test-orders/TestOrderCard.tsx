import { formatCurrency } from "@/utils";
import type { TestOrder } from "./TestOrderList";

type Props = {
    order: TestOrder;
};

export default function TestOrderCard({
    order
}: Props) {

    let items: any[] = [];

    try {
        items =
            JSON.parse(
                order.items_test_order
            );
    } catch {
        items = [];
    }

    return (
        <div className="p-5 shadow-lg space-y-5 border border-gray-200">

            {/* CABECERA */}

            <div className="text-sm grid grid-cols-2 justify-between text-gray-600">

                <h2>
                    ID Prueba:
                    <span className="font-black">
                        {" "}
                        {order.id_test_order}
                    </span>
                </h2>

                <p className="text-right">
                    Pedido de prueba
                </p>

            </div>


            {/* ADMINISTRADOR */}

            <div className="border-t border-gray-200 pt-4 space-y-2">

                <p>
                    <span className="font-semibold">
                        Administrador:
                    </span>{" "}
                    {order.admin_test_order}
                </p>

                <p>
                    <span className="font-semibold">
                        Teléfono:
                    </span>{" "}
                    {order.phone_test_order}
                </p>

            </div>


            {/* ENTREGA */}

            <div className="border-t border-gray-200 pt-4 space-y-2">

                <p className="font-semibold">
                    Entrega:
                </p>

                {order.delivery_method_test_order === "pickup" ? (

                    <p>
                        ☕ Recoger en cafetería
                    </p>

                ) : (

                    <div className="space-y-1">

                        <p>
                            🚚 Reparto a domicilio
                        </p>

                        {order.delivery_address_test_order && (

                            <p className="text-gray-600">
                                📍{" "}
                                {order.delivery_address_test_order}
                            </p>

                        )}

                    </div>

                )}

            </div>


            {/* FORMA DE PAGO */}

            <div className="border-t border-gray-200 pt-4 space-y-2">

                <p className="font-semibold">
                    Forma de pago:
                </p>

                {order.payment_method_test_order === "card" ? (

                    <p>
                        💳 Pago con tarjeta
                    </p>

                ) : (

                    <p>
                        💵 Pago en efectivo
                    </p>

                )}

                <p>

                    <span className="font-semibold">
                        Estado del pago:
                    </span>{" "}

                    {order.payment_status_test_order === "paid" ? (

                        <span className="font-semibold">
                            🟢 Pagado
                        </span>

                    ) : (

                        <span className="font-semibold">
                            🟠 Pendiente de pago
                        </span>

                    )}

                </p>

            </div>


            {/* CONTENIDO DEL PEDIDO */}

            <div className="border-t border-gray-200 pt-4">

                <p className="font-semibold mb-2">
                    Contenido:
                </p>

                <ul className="space-y-1">

                    {items.map(
                        (item: any, index: number) => (

                            <li key={index}>

                                <strong>
                                    {item.quantity} x
                                </strong>{" "}

                                {item.name}

                                {item.size && (
                                    <>
                                        {" "}
                                        ({item.size})
                                    </>
                                )}

                                {" - "}

                                {formatCurrency(
                                    Number(item.price)
                                )}

                            </li>

                        )
                    )}

                </ul>

            </div>


            {/* TOTAL */}

            <p className="text-right text-lg">

                Total prueba:

                <span className="text-amber-400 font-black">

                    {" "}

                    {formatCurrency(
                        Number(
                            order.total_test_order
                        )
                    )}

                </span>

            </p>

        </div>
    );
}