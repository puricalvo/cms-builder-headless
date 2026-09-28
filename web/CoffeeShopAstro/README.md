# CoffeeShopAstro

**CoffeeShopAstro** es la web pública de una cafetería desarrollada con **Astro**, conectada a **CMS Builder Headless** mediante una API REST.

Forma parte de un proyecto mayor en el que CMS Builder actúa como backend y gestor de contenidos, mientras que CoffeeShopAstro se encarga de la presentación pública de la cafetería.

## 🚀 Tecnologías

- Astro.
- TypeScript.
- Tailwind CSS.
- API REST.
- CMS Builder Headless.
- PhotoSwipe.

## 📐 Arquitectura

```text
CMS Builder
     │
     ▼
API REST
     │
     ▼
CoffeeShopAstro
     │
     ├── Web pública
     ├── Productos
     ├── Blog
     ├── Galería
     ├── Contacto
     ├── Reservas
     └── Acceso a FreshCoffee
```

La aplicación no depende directamente de la base de datos. Los contenidos y datos se obtienen desde CMS Builder mediante la API REST.

## 📁 Estructura

```text
CoffeeShopAstro/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── scripts/
│   ├── services/
│   └── styles/
│
├── package.json
└── astro.config.*
```

## 🌐 Web pública

CoffeeShopAstro presenta la información de la cafetería y sus contenidos públicos.

Incluye:

- Página de inicio.
- Información de la cafetería.
- Menú.
- Productos.
- Categorías.
- Blog.
- Galería de imágenes.
- Página de contacto.
- Reservas.
- Información legal.
- Información sobre alérgenos.
- Política de cookies.
- Acceso a FreshCoffee para pedidos a domicilio.

## ☕ Menú

El menú se obtiene dinámicamente desde CMS Builder.

Los productos pueden incluir:

- Nombre.
- Descripción.
- Precio.
- Imagen.
- Ingredientes.
- Alérgenos.

La información de ingredientes y alérgenos se utiliza para mostrar información adicional del producto mediante un modal.

Las imágenes del menú utilizan un sistema de galería basado en **PhotoSwipe**.

## 🖼️ Galería

La web dispone de una galería de imágenes independiente del menú.

Las imágenes se cargan desde los recursos multimedia gestionados por CMS Builder y pueden visualizarse mediante un lightbox.

## 📝 Blog

El contenido del blog se obtiene desde CMS Builder y permite trabajar con páginas y categorías dinámicas.

La estructura de rutas permite mostrar publicaciones y categorías de forma independiente.

## 📅 Reservas

Desde la página de contacto se puede acceder al sistema de reservas para comer en la cafetería.

La web pública funciona como punto de acceso para que el cliente pueda consultar la información de la cafetería y realizar una reserva.

## 🛒 CoffeeShopAstro → FreshCoffee

CoffeeShopAstro también incorpora un botón de acceso a la aplicación **FreshCoffee** para los clientes que quieran realizar un pedido a domicilio.

El flujo es:

```text
CoffeeShopAstro
       ↓
Pedido a domicilio
       ↓
FreshCoffee
       ↓
Productos
       ↓
Carrito
       ↓
Pedido
```

De esta forma, la web pública y la aplicación de pedidos están separadas, pero utilizan el mismo backend y los mismos datos gestionados desde CMS Builder.

## 🔐 Información legal

La web incorpora páginas informativas para:

- Política de cookies.
- Aviso legal.
- Política de privacidad.
- Información sobre alérgenos.

Estas páginas están integradas en la navegación y pueden ser consultadas desde el footer o desde los elementos correspondientes de la web.

## 🍪 Consentimiento de cookies

CoffeeShopAstro dispone de un componente de consentimiento de cookies desarrollado directamente con Astro.

El componente permite:

- Mostrar el aviso de cookies.
- Aceptar el consentimiento.
- Rechazar el consentimiento.
- Acceder a la política de cookies.

No utiliza React para esta funcionalidad.

## 🧩 Componentes Astro

La interfaz está construida principalmente mediante componentes `.astro`.

Entre otros elementos, el proyecto utiliza componentes para:

- Header.
- Footer.
- Navegación.
- Menú.
- Productos.
- Información de productos.
- Galería.
- Consentimiento de cookies.
- Páginas legales.

## 🔗 CMS Builder Headless

CoffeeShopAstro obtiene información de CMS Builder mediante la API REST.

CMS Builder gestiona:

- Páginas.
- Tablas.
- Contenidos.
- Productos.
- Categorías.
- Imágenes.
- Usuarios.
- Configuración.

La aplicación frontend consume esos datos y se encarga de su presentación.

## 🔒 Seguridad

Las claves y credenciales sensibles deben almacenarse mediante variables de entorno.

Los archivos `.env` no deben subirse al repositorio.

La URL de la API y las credenciales necesarias para acceder a ella se configuran mediante variables de entorno.

## 💻 Instalación

Desde la carpeta del proyecto:

```bash
npm install
```

Para iniciar el entorno de desarrollo:

```bash
npm run dev
```

Para generar la versión de producción:

```bash
npm run build
```

Para previsualizar la compilación:

```bash
npm run preview
```

## 🧞 Comandos

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala las dependencias |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Previsualiza la compilación |
| `npm run astro ...` | Ejecuta comandos de Astro |

## 🚀 Despliegue

El proyecto se desarrolla localmente y se comprueba mediante una compilación de producción antes de desplegar los cambios.

Flujo habitual:

```text
Modificar código
      ↓
npm run build
      ↓
Comprobar la aplicación
      ↓
Git
      ↓
Despliegue
```

## 🔗 Proyecto relacionado

CoffeeShopAstro forma parte de **CMS Builder Headless**, junto con:

- CMS Builder.
- API REST.
- FreshCoffee.
- Panel administrativo.

La arquitectura permite separar claramente:

```text
CMS Builder
    ↓
API REST
    ↓
CoffeeShopAstro → Web pública
    ↓
FreshCoffee → Pedidos
```

## 🎯 Objetivo

El objetivo de CoffeeShopAstro es proporcionar una web pública moderna y desacoplada que utilice CMS Builder como backend.

La aplicación demuestra cómo un mismo CMS puede proporcionar los contenidos y datos necesarios para una web pública y, al mismo tiempo, servir de base para una aplicación de pedidos independiente.

## 👩‍💻 Autora

Desarrollado por **Puri Calvo**.

**CMS + API + Web + App**
