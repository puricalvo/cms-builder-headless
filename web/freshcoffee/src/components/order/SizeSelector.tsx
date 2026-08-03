import { Radio, RadioGroup } from '@headlessui/react'
import { useOrderStore } from '@/stores/order'
import type { OrderItem } from '@/types'

type Props = {
    item: OrderItem
}

export default function SizeSelector({ item }: Props) {

    const { updateItemSize } = useOrderStore()

    const sizes = item.variants ?? []

    const selectedSize = sizes.find(
        size => size.size === item.size
    )

    const handleChange = (value: { size: string }) => {
        updateItemSize(item, value.size)
    }

    return (
        <div>
            <RadioGroup
                value={selectedSize}
                onChange={handleChange}
                className="grid gap-4 lg:grid-cols-3"
            >
                {sizes.map((size) => (
                    <Radio
                        key={size.size}
                        value={size}
                        className="cursor-pointer focus:outline-hidden flex items-center justify-center rounded-md border border-gray-600 bg-white px-3 py-3 text-sm font-medium text-gray-900 uppercase hover:bg-amber-500 hover:text-white hover:border-0 data-checked:border-transparent data-checked:bg-amber-500 data-checked:text-white data-checked:hover:bg-amber-600 data-focus:ring-2 data-focus:ring-amber-500 data-focus:ring-offset-2 sm:flex-1"
                    >
                        {size.size}
                    </Radio>
                ))}
            </RadioGroup>
        </div>
    )
}