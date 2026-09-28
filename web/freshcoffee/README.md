# FreshCoffee

**FreshCoffee** es una aplicación web de pedidos para una cafetería desarrollada con **Astro**, conectada a **CMS Builder Headless** mediante una API REST.

Forma parte del proyecto **CMS Builder Headless** y está separada de la web pública CoffeeShopAstro. Mientras CoffeeShopAstro presenta la cafetería y sus contenidos, FreshCoffee gestiona el proceso de pedido, carrito, clientes y administración.

## 🚀 Tecnologías

- Astro.
- TypeScript.
- React.
- Vue / Pinia.
- Tailwind CSS.
- API REST.
- CMS Builder Headless.
- Vercel.
- Redsys.

## 📐 Arquitectura

```text
CMS Builder
     │
     ▼
API REST
     │
     ▼
FreshCoffee
     │
     ├── Autenticación
     ├── Clientes
     ├── Productos
     ├── Carrito
     ├── Pedidos
     ├── Pago
     └── Panel administrativo
```

La aplicación no accede directamente a la base de datos. Los datos se obtienen y gestionan mediante la API REST.

## 📁 Estructura

```text
FreshCoffee/
│
├── public/
├── src/
│   ├── actions/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── stores/
│   └── styles/
│
├── package.json
└── astro.config.*
```

## 🛒 Aplicación de pedidos

FreshCoffee permite a los clientes realizar pedidos desde la aplicación.

El flujo principal es:

```text
Cliente
   ↓
Productos
   ↓
Carrito
   ↓
Datos del pedido
   ↓
Pago
   ↓
Pedido
```

La aplicación obtiene los productos y su información desde CMS Builder a través de la API.

## 👤 Usuarios y autenticación

FreshCoffee dispone de autenticación para clientes y usuarios administrativos.

Los usuarios pueden iniciar sesión y acceder a las funcionalidades correspondientes según su tipo de cuenta.

La sesión se gestiona mediante una cookie:

```text
FRESHCOFFEE_TOKEN
```

También existe soporte para pedidos como invitado.

El usuario invitado utiliza el valor:

```text
INVITADO
```

## 👥 Clientes

La aplicación permite gestionar clientes y sus pedidos.

Los clientes autenticados pueden realizar pedidos utilizando su cuenta.

Los usuarios deshabilitados no pueden acceder normalmente a la aplicación y son redirigidos al registro correspondiente.

## 👨‍💼 Administración

FreshCoffee incorpora un panel administrativo protegido.

Los roles disponibles son:

```text
superadmin
admin
editor
```

El acceso a las rutas administrativas está protegido mediante middleware y comprobación de sesión.

El panel permite trabajar con la información necesaria para la gestión de la aplicación y los pedidos.

## ☕ Productos

Los productos se obtienen desde CMS Builder mediante la API REST.

La aplicación muestra:

- Productos.
- Categorías.
- Precios.
- Imágenes.
- Información del producto.
- Opciones necesarias para realizar el pedido.

La gestión de los contenidos y datos se mantiene separada de la interfaz.

## 🛍️ Carrito

FreshCoffee dispone de un carrito de pedidos.

El carrito permite:

- Añadir productos.
- Modificar cantidades.
- Consultar el pedido.
- Eliminar productos.
- Preparar el pedido antes del pago.

La interfaz del carrito utiliza componentes interactivos para actualizar la información sin tener que reconstruir toda la página.

## ⏱️ Pedidos como invitado

FreshCoffee permite realizar pedidos como invitado mediante una sesión temporal.

El sistema utiliza un temporizador para controlar la duración de la sesión de invitado.

La duración configurada es:

```text
2 minutos
```

El estado relacionado con el pedido de invitado se mantiene mediante la sesión y el almacenamiento local necesario para el funcionamiento de la interfaz.

Al cerrar la sesión de invitado también se limpian los datos relacionados con el temporizador y el carrito.

## 💳 Pagos

FreshCoffee integra **Redsys** para gestionar el proceso de pago.

El flujo de pago se realiza mediante las acciones correspondientes de la aplicación y la API.

El sistema contempla también el retorno desde Redsys para completar el flujo del pedido.

## 📦 Pedidos

Los pedidos se gestionan mediante la API REST.

El flujo general es:

```text
Productos
    ↓
Carrito
    ↓
Pedido
    ↓
Redsys
    ↓
Confirmación
```

La aplicación también permite consultar pedidos completados en las funcionalidades correspondientes.

## 🚚 Pedido a domicilio

FreshCoffee es la aplicación utilizada cuando el cliente quiere realizar un pedido para recibirlo en casa.

El acceso puede realizarse desde la web pública **CoffeeShopAstro** mediante el botón correspondiente de pedido a domicilio.

```text
CoffeeShopAstro
       ↓
Pedido a domicilio
       ↓
FreshCoffee
       ↓
Carrito
       ↓
Pedido
```

## 🏪 Recogida

La aplicación contempla también el flujo de recogida de pedidos.

En las funcionalidades de recogida se muestran los últimos pedidos completados según la lógica de la aplicación.

## 🔐 Seguridad

Las rutas administrativas están protegidas mediante comprobación de sesión.

Las claves y credenciales sensibles deben almacenarse mediante variables de entorno.

Los archivos `.env` no deben subirse al repositorio.

Las variables principales utilizadas por la aplicación incluyen:

```text
API_URL
API_KEY
```

La comunicación con la API utiliza la clave configurada para autenticar las peticiones.

## 🔗 CMS Builder Headless

FreshCoffee utiliza CMS Builder como backend y gestor de datos.

CMS Builder proporciona la información necesaria para:

- Productos.
- Categorías.
- Clientes.
- Pedidos.
- Usuarios.
- Contenidos.
- Imágenes.
- Configuración.

La aplicación frontend consume estos datos mediante la API REST.

## 🌐 Relación con CoffeeShopAstro

FreshCoffee y CoffeeShopAstro son proyectos independientes.

```text
CMS Builder
      ↓
API REST
      ↓
 ┌───────────────┐
 │               │
 ▼               ▼
CoffeeShopAstro  FreshCoffee
Web pública      Pedidos
```

CoffeeShopAstro se utiliza para presentar la cafetería y sus contenidos.

FreshCoffee se utiliza para realizar y gestionar los pedidos.

Ambas aplicaciones utilizan el mismo backend y los mismos datos gestionados desde CMS Builder.

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

La aplicación está preparada para desplegarse como aplicación Astro mediante Vercel.

## 🔧 Variables de entorno

La aplicación utiliza variables de entorno para configurar la conexión con la API.

Ejemplo:

```text
API_URL=...
API_KEY=...
```

Los valores reales no deben almacenarse en el repositorio.

## 🎯 Objetivo

El objetivo de FreshCoffee es proporcionar una aplicación independiente para gestionar el proceso completo de pedidos de una cafetería.

El proyecto demuestra cómo una aplicación Astro puede utilizar un CMS desacoplado como backend para gestionar usuarios, productos, carrito, pedidos, pagos y administración.

## 🔗 Proyecto relacionado

FreshCoffee forma parte de **CMS Builder Headless**, junto con:

- CMS Builder.
- API REST.
- CoffeeShopAstro.
- Panel administrativo.

La arquitectura completa permite separar:

```text
CMS Builder
    ↓
API REST
    ↓
CoffeeShopAstro → Web pública
    ↓
FreshCoffee → Pedidos
```

## 👩‍💻 Autora

Desarrollado por **Puri Calvo**.

**CMS + API + Web + App**
