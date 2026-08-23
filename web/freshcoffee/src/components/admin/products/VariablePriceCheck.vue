<script setup lang="ts">
import { onMounted } from "vue";
import { usePriceStore, appStore } from "@/stores/price";
import ProductPriceField from "./ProductPriceField.vue";
import VariablePriceFields from "./VariablePriceFields.vue";
import type { CMSProduct } from "@/types/products";


const store = usePriceStore(appStore);

interface Props {
  currentProduct?: CMSProduct;
}

const props = defineProps<Props>();

onMounted(() => {


  // EDITAR
  if (props.currentProduct) {

    if (props.currentProduct.variable_price) {

      store.setSelectedProduct({
        variable_price: true,
        variants: props.currentProduct.variants ?? []
      });

    } else {

      store.setSelectedProduct({
        variable_price: false,
        price: Number(props.currentProduct.price ?? 0)
      });

    }

    return;
  }

  // CREAR NUEVO
  store.isVariablePrice = false;

  store.setSelectedProduct({
    variable_price: false,
    price: 0
  });
});


</script>

<template>

  <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">

    <div class="col-span-full">

      <div class="mt-6 space-y-6">

        <div class="flex gap-3">

          <div class="flex h-6 shrink-0 items-center">

            <div class="group grid size-4 grid-cols-1">

              <input id="variable_price" type="checkbox" v-model="store.isVariablePrice"
                class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" />

              <svg fill="none" viewBox="0 0 14 14"
                class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white">
                <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="opacity-0 group-has-checked:opacity-100" />
              </svg>

            </div>

          </div>

          <div class="text-sm/6">

            <label for="variable_price" class="font-medium text-gray-900">
              Habilitar Precio Variable
            </label>

            <p class="text-gray-500">
              Activa esta opción si el producto tiene varios tamaños.
            </p>

          </div>

        </div>

        <VariablePriceFields v-if="store.isVariablePrice" />

        <ProductPriceField v-else />

      </div>

    </div>

  </div>

</template>