import type { OrderItem, SelectedProduct } from '@/types'
import { toLowerFirstChar } from '@/utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Store = {
    isOrderDrawerOpen: boolean
    toggleOrderDrawer: () => void
    order: OrderItem[]
    addItem: (product: SelectedProduct) => void
    deleteItem: (product: OrderItem) => void
    increaseQuantity: (product: OrderItem) => void
    decreaseQuantity: (product: OrderItem) => void
    updateItemSize: (product: OrderItem, newSize: OrderItem['size']) => void
}

export const useOrderStore = create<Store>()(
    persist(
        (set, get) => ({
            isOrderDrawerOpen: false,

            toggleOrderDrawer: () => {
                set((state) => ({
                    isOrderDrawerOpen: !state.isOrderDrawerOpen
                }))
            },

            order: [],

            addItem: (product) => {
                const currentOrder = get().order

                const hasSize = Boolean(product.size)

                const key = hasSize
                    ? `${product.table}-${product.id}-${toLowerFirstChar(product.size!)}`
                    : `${product.table}-${product.id}`

                const isMatch = (item: OrderItem) =>
                    item.key === key

                const existingItem = currentOrder.find(isMatch)

                let order: OrderItem[]

                if (existingItem) {
                    order = currentOrder.map(item =>
                        isMatch(item)
                            ? {
                                ...item,
                                quantity: item.quantity + 1,
                                subtotal: item.price * (item.quantity + 1)
                            }
                            : item
                    )
                } else {
                    const newItem = {
                        ...product,
                        quantity: 1,
                        subtotal: product.price,
                        key
                    }

                    order = [...currentOrder, newItem]
                }

                set({ order })
            },

            deleteItem: (product) => {
                const order = get().order.filter(item =>
                    product.key
                        ? item.key !== product.key
                        : item.id !== product.id
                )

                set({ order })
            },

            increaseQuantity: (product) => {
                const isMatch = (item: OrderItem) =>
                    product.key
                        ? item.key === product.key
                        : item.id === product.id

                const order = get().order.map(item =>
                    isMatch(item)
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            subtotal: item.price * (item.quantity + 1)
                        }
                        : item
                )

                set({ order })
            },

            decreaseQuantity: (product) => {
                const isMatch = (item: OrderItem) =>
                    product.key
                        ? item.key === product.key
                        : item.id === product.id

                const order = get().order.map(item =>
                    isMatch(item)
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                            subtotal: item.price * (item.quantity - 1)
                        }
                        : item
                )

                set({ order })
            },

            updateItemSize: async (product, newSize) => {
                if (!product.key || !newSize || !product.variants) return

                const updatedData = product.variants.find(
                    (value: any) => value.size === newSize
                )

                if (!updatedData) return

                const order = get().order

                const newKey =
                    `${product.table}-${product.id}-${toLowerFirstChar(newSize)}`

                const isMatch = (item: OrderItem, key: string) =>
                    item.key === key

                const selectedIndex = order.findIndex(item =>
                    isMatch(item, product.key!)
                )

                const existingIndex = order.findIndex(item =>
                    isMatch(item, newKey)
                )

                let updatedOrder = [...order]

                if (existingIndex !== -1) {
                    const existingItem = updatedOrder[existingIndex]
                    const mergedQuantity =
                        existingItem.quantity + product.quantity

                    updatedOrder[existingIndex] = {
                        ...existingItem,
                        quantity: mergedQuantity,
                        subtotal: mergedQuantity * existingItem.price
                    }

                    if (existingIndex !== selectedIndex) {
                        updatedOrder.splice(selectedIndex, 1)
                    }
                } else {
                    updatedOrder[selectedIndex] = {
                        ...product,
                        key: newKey,
                        size: newSize,
                        price: Number(updatedData.price),
                        subtotal: product.quantity * Number(updatedData.price)
                    }
                }

                set({ order: updatedOrder })
            }
        }),
        {
            name: 'freshcoffee-order'
        }
    )
)