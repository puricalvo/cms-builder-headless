import type { OrderItem } from "@/types"

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount)
}

export function toLowerFirstChar(str: string) {
    return str.charAt(0).toLowerCase()
}

export const calculateTotal = (order: OrderItem[]) =>
    order.reduce((total, item) => total + item.subtotal, 0)

export function formatOrder(order: OrderItem[]) {
    let contents = ''
    order.map(item => {
        contents +=  `<li><span class="font-bold">${item.quantity} x</span> - ${item.name} ${item.size 
        ? `(${item.size})` : ''}  - ${formatCurrency(item.price)}</li>`
    })

    return contents
}

export function nullToEmptyString(arg: unknown) {
    return arg ?? ''
}

export const currentPage = (href: string, category: string) => href === category