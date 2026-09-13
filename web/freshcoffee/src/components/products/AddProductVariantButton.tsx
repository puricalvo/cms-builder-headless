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
            className="bg-black hover:bg-amber-400 text-lg text-white flex h-10 w-10 shrink-0 items-center justify-center p-0 uppercase font-bold
            cursor-pointer rounded-xl leading-2" 
            onClick={handleClick}
        >
            +
        </button>
    )
}
 