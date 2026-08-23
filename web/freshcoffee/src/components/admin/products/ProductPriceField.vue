<script setup lang="ts">
import { usePriceStore, appStore } from '@/stores/price'

const store = usePriceStore(appStore)
</script>

<template>
  <div class="col-span-full">
    <label for="price" class="block text-sm/6 font-medium text-gray-900">
      Precio del Producto:
    </label>

    <div class="mt-2">
      <input id="price" name="price" type="number" class="w-full rounded-md bg-white px-3 
        py-1.5 text-base text-gray-900 outline-1 
        -outline-offset-1 outline-gray-300 
        placeholder:text-gray-400 focus:outline-2 
        focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="Precio Producto" :value="store.selectedProduct?.variable_price === false
            ? store.selectedProduct.price
            : ''
          " />
    </div>
  </div>
</template>