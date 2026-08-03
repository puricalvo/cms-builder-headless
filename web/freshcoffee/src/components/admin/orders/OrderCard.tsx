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

    const handleChang = async (e: React.ChangeEvent<HTMLSelectElement>) => {

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
                    <span className="font-black"> {order.id_order}</span>
                </h2>

                <p className="text-right">
                    Cliente: {order.name_order}
                </p>
            </div>

            <div>
                <p className="font-semibold mb-2">Contenido:</p>

                <ul className="space-y-1">
                    {items.map((item: any, index: number) => (
                        <li key={index}>
                            <strong>{item.quantity} x</strong>{" "}
                            {item.name}

                            {item.size && (
                                <> ({item.size})</>
                            )}

                            {" - "}
                            {formatCurrency(Number(item.price))}
                        </li>
                    ))}
                </ul>
            </div>

            <select
                onChange={handleChang}
                value={order.status_order}
                className="border border-gray-300 w-full p-2 text-center"
            >
                {orderStatusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.label}
                    </option>
                ))}
            </select>

            <p className="text-right text-lg">
                Total orden:
                <span className="text-amber-400 font-black">
                    {" "}
                    {formatCurrency(order.total_order)}
                </span>
            </p>

        </div>
    );
}