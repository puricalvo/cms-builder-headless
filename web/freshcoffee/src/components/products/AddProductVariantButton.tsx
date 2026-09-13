import { useOrderStore } from "@/stores/order"
import type { SelectedProduct } from "@/types"
import { toast } from 'react-toastify'

type Props = {
    product: SelectedProduct
}

export default function AddProductVariantButton({product}: Props) {

    const { addItem } = useOrderStore()

     const handleClick = () => {
        addItem(product)
         toast.success('Agregado Correctamente')
    }
    return (
        <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-500 bg-gray-700 p-0 text-lg font-bold leading-2 text-white shadow-sm transition-all duration-300 hover:scale-110 hover:border-amber-300 hover:bg-gray-600 hover:shadow-[0_0_14px_rgba(251,191,36,0.65)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
            onClick={handleClick}
        >
            +
        </button>
    )
}
 