import { useModalStore } from '@/stores/modal'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { toast } from 'react-toastify'

export default function DeleteProductModal() {

    const {
    open,
    productId,
    productTable,
    setOpen
} = useModalStore()

   const handleClick = async () => {

    const { data, error } =
        await actions.products.deleteProduct({
            id: productId!,
            table: productTable!
        })

    if (error) {

        toast.error("No se ha podido eliminar el producto")

        return
    }

    if (data?.message) {

        toast.success(data.message)

        setOpen(false)

        setTimeout(() => {
            navigate('/admin/products')
        }, 1000)
    }
}

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false) } className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-800/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
                  <XMarkIcon aria-hidden="true" className="size-8 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    ¿Eliminar Producto?  
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Confirmas que deseas eliminar este producto? Un Producto eliminado no se puede recuperar.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleClick}
                  className="inline-flex w-full justify-center rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold  shadow-xs hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:col-start-2 text-black"
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  Cancelar
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}