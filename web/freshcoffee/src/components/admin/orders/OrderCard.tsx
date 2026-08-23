import type { OrderContent } from "@/types";
import { orderStatusOptions } from "@/utils/constants";
import { formatCurrency } from "@/utils";
import { actions } from "astro:actions";
import type { KeyedMutator } from "swr";
import { toast } from "react-toastify";

type Props = {
    order: OrderContent;
    mutate: KeyedMutator<OrderContent[]>;
};

export default function OrderCard({ order, mutate }: Props) {

    const items = JSON.parse(order.items_order);

    const handleChang = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const status = e.target.value;

        const result = await actions.orders.updateStatus({
            status,
            id: order.id_order
        });

        if (result.data && !result.error) {
            toast.success(result.data.message);
            mutate();
        }
    };

    return (
        <div className="p-5 shadow-lg space-y-5 border border-gray-200">

            <div className="text-sm grid grid-cols-2 justify-between text-gray-600">

                <h2>
                    ID Orden:
                    <span className="font-black">
                        {" "}{order.id_order}
                    </span>
                </h2>

                <p className="text-right">
                    Cliente: {order.name_order}
                </p>

            </div>


            {/* INFORMACIÓN DEL CLIENTE */}

            <div className="border-t border-gray-200 pt-4 space-y-2">

                <p>
                    <span className="font-semibold">
                        Teléfono:
                    </span>{" "}
                    {order.phone_order}
                </p>

            </div>


            {/* ENTREGA */}

            <div className="border-t border-gray-200 pt-4 space-y-2">

                <p className="font-semibold">
                    Entrega:
                </p>

                {order.delivery_method_order === "pickup" ? (

                    <p>
                        ☕ Recoger en cafetería
                    </p>

                ) : (

                    <div className="space-y-1">

                        <p>
                            🚚 Reparto a domicilio
                        </p>

                        {order.delivery_address_order && (
                            <p className="text-gray-600">
                                📍 {order.delivery_address_order}
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

                {order.payment_method_order === "card" ? (

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

                    {order.payment_status_order === "paid" ? (

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

                    {items.map((item: any, index: number) => (

                        <li key={index}>

                            <strong>
                                {item.quantity} x
                            </strong>{" "}

                            {item.name}

                            {item.size && (
                                <> ({item.size})</>
                            )}

                            {" - "}

                            {formatCurrency(
                                Number(item.price)
                            )}

                        </li>

                    ))}

                </ul>

            </div>


            {/* ESTADO DEL PEDIDO */}

            <select
                onChange={handleChang}
                value={order.status_order}
                className="border border-gray-300 w-full p-2 text-center"
            >

                {orderStatusOptions.map((s) => (

                    <option
                        key={s.value}
                        value={s.value}
                    >
                        {s.label}
                    </option>

                ))}

            </select>


            {/* TOTAL */}

            <p className="text-right text-lg">

                Total orden:

                <span className="text-amber-400 font-black">

                    {" "}

                    {formatCurrency(
                        order.total_order
                    )}

                </span>

            </p>

        </div>
    );
}