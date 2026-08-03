<script setup lang="ts">
import { usePriceStore, appStore } from "@/stores/price";
import { onMounted } from "vue";

const store = usePriceStore(appStore);

onMounted(() => {

        if (store.variants.length === 0) {

                store.setVariants([
                        {
                                size: "Ch",
                                price: 0
                        },
                        {
                                size: "M",
                                price: 0
                        },
                        {
                                size: "G",
                                price: 0
                        }
                ]);

        }

});
</script>

<template>

        <div class="col-span-full" v-for="(size, index) in store.variants" :key="index">

                <label :for="`variant-${index}`">

                        <span class="font-bold">
                                Precio Tamaño:
                        </span>

                        {{ size.size }}

                </label>

                <input :id="`variant-${index}`" :name="`variants[${index}][price]`" v-model.number="size.price"
                        type="number"
                        class="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        :placeholder="`Precio del tamaño: ${size.size}`" />

                <input type="hidden" :name="`variants[${index}][size]`" :value="size.size" />

        </div>

</template>