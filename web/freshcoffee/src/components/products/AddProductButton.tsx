import { useOrderStore } from "@/stores/order"
import type { SelectedProduct } from "@/types"
import { toast } from 'react-toastify'

type Props = {
    product: SelectedProduct
}

export default function AddProductButton({product} : Props) {

    const { addItem } = useOrderStore()

    const handleClick = () => {
       addItem(product)
       toast.success('Agregado Correctamente')
    }
    
  return (
    <button
        type="button"
        className="mt-5 w-full rounded-full border border-gray-500 bg-gray-700 px-5 py-3 text-lg font-bold uppercase text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-amber-300 hover:bg-gray-600 hover:shadow-[0_0_14px_rgba(251,191,36,0.65)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
        onClick={handleClick}
    >
        Agregar
    </button>
  )
}
