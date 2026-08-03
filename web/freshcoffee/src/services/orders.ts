import { api } from "./api"; 
import type { OrderItem } from "@/types"; 
import { calculateTotal } from "@/utils"; 

type CreateOrderData = { 
  name: string; 
  order: OrderItem[];
}; 

export async function createOrder(data: CreateOrderData, token: string) {
  
  return await api(
    `externas?table=orders&token=${token}&tableToken=customers&suffix=customer&suffix_module=order`,
    "POST",
    {
      name_order: data.name,
      total_order: calculateTotal(data.order).toString(),
      status_order: "pending",
      items_order: JSON.stringify(data.order)
    }
  );
  
}


export async function updateOrderStatus( 
  id: number, 
  status: string, 
  token: string 

) { 

  return await api( 
    `orders?id=${id}&nameId=id_order&token=${token}&table=admins&suffix=admin`, 
    "PUT", 
    { 
      status_order: status 
    } 
  ); 
} 
    
    export async function deleteOrder(id: number) { 
      return await api( 
        `orders?id=${id}&nameId=id_order`, 
        "DELETE" 
      ); } 

export async function getPickupOrders(perPage: number = 5) {
  return await api(
    `orders?linkTo=status_order&equalTo=completed&orderBy=id_order&orderMode=DESC&per_page=${perPage}`,
    "GET"
  );
}




