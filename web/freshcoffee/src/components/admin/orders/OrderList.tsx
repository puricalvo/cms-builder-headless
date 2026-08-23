import useSWR from "swr";
import type { OrderContent } from "@/types";
import OrderCard from "./OrderCard";

type Props = {
  status: string;
};

export default function OrderList({ status }: Props) {

  const url = `/api/orders/${status}`;

  const fetcher = async () => {
    const res = await fetch(url);
    const json = await res.json();

    if (Array.isArray(json)) {
      return json;
    }

    return json.results ?? [];
  };

  const config = {
    refreshInterval: 60 * 1000
  };

  const { data, isLoading, mutate } =
    useSWR<OrderContent[]>(url, fetcher, config);

   

  if (isLoading) return "Cargando...";

  if (!data || data.length === 0) {
    return <p className="text-center">No hay órdenes</p>;
  }

  const filteredOrders = status === "completed" || status === "cancelled"
  ? data.filter((order) => {

      const updatedDate = new Date(order.date_updated_order);
      const now = new Date();

      const hoursPassed =
        (now.getTime() - updatedDate.getTime()) /
        (1000 * 60 * 60);

      return hoursPassed < 24;
    })
  : data;

  if (filteredOrders.length === 0) {
    return <p className="text-center">No hay órdenes</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {filteredOrders.map((order) => (
        <OrderCard
          key={order.id_order}
          order={order}
          mutate={mutate}
        />
      ))}
    </div>
  );
}

