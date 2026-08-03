import { useOrderStore } from "@/stores/order"
import { actions, isActionError, isInputError } from "astro:actions"
import { navigate } from "astro:transitions/client"
import { toast } from "react-toastify"

export default function SubmitOrderForm() {
    const { order } = useOrderStore()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const name = formData.get("name")?.toString() ?? ""

        const { data, error } =
            await actions.orders.createOrder({ name, order })

        const inputErrors = isInputError(error)
            ? error.issues
            : []

        if (error && inputErrors.length) {
            inputErrors.forEach(error =>
                toast.error(error.message)
            )
            return
        }

        const actionError =
            isActionError(error)
                ? error.message
                : null

        if (actionError) {

            if (actionError === "No hay token") {
                toast.info(
                    "Para realizar el pedido debes iniciar sesión o registrarte"
                )

                setTimeout(() => {
                    navigate("/")
                }, 4000)

                return
            }

            toast.error(actionError)
            return
        }

        if (data && !error) {
            toast.success(data.message)

            useOrderStore.setState({
                order: [],
                isOrderDrawerOpen: false
            })

            await actions.auth.signOut()

            setTimeout(() => {
                navigate("/")
            }, 5000)
        }
    }

    return (
        <form className="mt-5" onSubmit={handleSubmit}>
            <div className="space-y-3">

                <label
                    htmlFor="name"
                    className="font-bold text-lg"
                >
                    Tu Nombre:
                </label>

                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Coloca tu Nombre"
                    className="border border-gray-300 p-2 w-full rounded-xl"
                />

            </div>

            <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full rounded-xl py-3 mt-5 text-lg font-bold uppercase cursor-pointer"
                type="submit"
            >
                Realizar Pedido
            </button>
        </form>
    )
}