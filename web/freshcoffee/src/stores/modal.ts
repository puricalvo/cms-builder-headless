import { create } from 'zustand'

type Store = {
    productId: number | null
    productTable: string | null
    open: boolean

    setProductId: (productId: number) => void
    setProductTable: (productTable: string) => void
    setOpen: (open: boolean) => void
}

export const useModalStore = create<Store>((set) => ({
    productId: null,
    productTable: null,
    open: false,

    setProductId: (productId) => {
        set({ productId })
    },

    setProductTable: (productTable) => {
        set({ productTable })
    },

    setOpen: (open) => {
        set({ open })
    }
}))