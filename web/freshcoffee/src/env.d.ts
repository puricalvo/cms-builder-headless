/// <reference types="astro/client" />
/// <reference types="vue/macros-global" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<{}, {}, any>;

  export default component;
}

declare namespace App {
  interface Locals {
    user?: {
      id: number;
      role: string;
      email: string;
    };
  }
}