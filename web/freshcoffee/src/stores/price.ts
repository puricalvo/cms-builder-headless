
import { defineStore, createPinia } from "pinia";
import { ref } from "vue";

type SelectedProduct = {
    variable_price: boolean;
    price?: number;
    variants?: {
        size: string;
        price: number;
    }[];
};

export const usePriceStore = defineStore("prices", () => {
    const isVariablePrice = ref(false);

    const selectedProduct = ref<SelectedProduct | null>(null);

    const variants = ref<any[]>([]);

    const setSelectedProduct = (product: SelectedProduct) => {
        isVariablePrice.value = product.variable_price;

        selectedProduct.value = product;

        syncVariantsFromProps();
    };

    const syncVariantsFromProps = () => {
        const product = selectedProduct.value;

        if (!product) return;

        if (product.variable_price) {
            variants.value = product.variants ?? [];
        } else {
            variants.value = [];
        }
    };

    const setVariants = (items: any[]) => {
        variants.value = items;
    };

    return {
        isVariablePrice,
        selectedProduct,
        variants,
        setSelectedProduct,
        setVariants,
    };
});

export const appStore = createPinia();