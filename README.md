# CMS Builder Headless

**CMS Builder Headless** es una arquitectura desacoplada que demuestra
cómo **CMS Builder** puede funcionar no solo como CMS para crear páginas
web, sino también como **backend y gestor de aplicaciones**.

El proyecto integra:

**CMS Builder + API REST + Web pública + Aplicación de pedidos + Panel
administrativo**

La idea es que CMS Builder proporcione la estructura, los datos,
usuarios, permisos, tablas y configuración, mientras que distintas
aplicaciones frontend consumen y modifican esa información mediante la
API.

------------------------------------------------------------------------

## 🧩 CMS Builder como gestor de aplicaciones

CMS Builder permite crear visualmente:

-   Páginas.
-   Tablas.
-   Módulos CRUD.
-   Formularios.
-   Relaciones.
-   Usuarios.
-   Administradores.
-   Editores.
-   Roles y permisos.
-   Archivos multimedia.
-   Contenidos.
-   Configuración.

La API REST permite que aplicaciones externas consulten, creen,
modifiquen y eliminen información de las tablas creadas desde el CMS.

Esto permite utilizar CMS Builder como **backend reutilizable para
diferentes aplicaciones**.

------------------------------------------------------------------------

## 📐 Arquitectura

``` text
                         CMS Builder
                   Gestión y configuración
                              │
                         API REST
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
       CoffeeShopAstro                    FreshCoffee
        Web pública                    App de pedidos
              │                               │
              └───────────────┬───────────────┘
                              ▼
                         Base de datos
```

------------------------------------------------------------------------

## 📁 Estructura

``` text
cms-builder-headless/
│
├── api/
│   └── API REST del CMS
│
└── web/
    ├── coffeeastro/
    │   └── Web pública de la cafetería
    │
    └── freshcoffee/
        └── Aplicación de pedidos y gestión
```

------------------------------------------------------------------------

# 🧩 CMS Builder

CMS Builder permite gestionar:

-   Páginas.
-   Tablas.
-   Módulos CRUD.
-   Formularios.
-   Relaciones.
-   Usuarios.
-   Administradores.
-   Editores.
-   Roles y permisos.
-   Archivos multimedia.
-   Contenidos.
-   Configuración.

Las tablas utilizan `suffix` para generar estructuras dinámicas como:

``` text
id_reparto
localidad_reparto
activa_reparto
date_created_reparto
date_updated_reparto
```

Los campos de identificación y fechas se generan automáticamente.

------------------------------------------------------------------------

# 🌐 API REST

La API permite:

-   `GET`
-   `POST`
-   `PUT`
-   `DELETE`

Las operaciones trabajan dinámicamente sobre las tablas del CMS.

Esto permite que una aplicación externa pueda crear y modificar
información sin tener que desarrollar un endpoint específico para cada
tabla.

``` text
Aplicación
    ↓
API REST
    ↓
CMS Builder
    ↓
Base de datos
```

------------------------------------------------------------------------

# 👥 Usuarios, administradores y editores

CMS Builder permite separar responsabilidades mediante roles y permisos.

Los administradores pueden acceder a las funcionalidades autorizadas y
los editores pueden recibir permisos específicos sobre determinadas
páginas o funcionalidades.

Una misma cuenta puede utilizar CMS Builder y, si tiene los permisos
correspondientes, acceder también a una aplicación conectada al CMS.

------------------------------------------------------------------------

# ☕ CoffeeShopAstro

**CoffeeShopAstro** es la web pública de la cafetería.

Tecnologías:

-   Astro.
-   TypeScript.
-   API REST.

La web obtiene sus contenidos y datos desde CMS Builder.

Incluye:

-   Página de inicio.
-   Páginas dinámicas.
-   Información de la cafetería.
-   Productos.
-   Categorías.
-   Blog.
-   Galería.
-   Contacto.
-   Reservas.
-   Acceso al sistema de pedidos.

------------------------------------------------------------------------

# 🔗 CoffeeShopAstro → FreshCoffee

La web pública incorpora un botón para acceder al sistema de pedidos.

``` text
CoffeeShopAstro
       ↓
Realizar pedido
       ↓
FreshCoffee
       ↓
Productos
       ↓
Carrito
       ↓
Pedido
```

------------------------------------------------------------------------

# 🛒 FreshCoffee

**FreshCoffee** es la aplicación de pedidos y gestión de la cafetería.

Tecnologías:

-   Astro.
-   React.
-   Vue.
-   TypeScript.
-   Zustand.
-   Pinia.
-   Tailwind CSS.
-   Headless UI.
-   Heroicons.
-   React Toastify.
-   Zod.

La aplicación consume los datos de CMS Builder mediante la API REST.

------------------------------------------------------------------------

# 🥐 Productos

FreshCoffee trabaja con:

-   Categorías dinámicas.
-   Productos dinámicos.
-   Precio único.
-   Precios variables.
-   Tamaños.
-   Variantes.
-   Imágenes.
-   Paginación.

Los productos pueden gestionarse desde FreshCoffee y almacenarse en las
tablas gestionadas por CMS Builder.

------------------------------------------------------------------------

# 🛍️ Carrito

Permite:

-   Añadir productos.
-   Eliminar productos.
-   Aumentar cantidades.
-   Disminuir cantidades.
-   Cambiar tamaños.
-   Trabajar con precios variables.
-   Recalcular subtotales.
-   Calcular el total.

Utiliza Zustand y almacenamiento local.

------------------------------------------------------------------------

# 🔐 Autenticación

FreshCoffee utiliza el token:

``` text
FRESHCOFFEE_TOKEN
```

El token identifica la sesión y se valida mediante la API.

Cada administrador tiene su propio registro, identificador y token.

------------------------------------------------------------------------

# 👤 Sesión de invitado

FreshCoffee permite acceder como invitado.

El control temporal utiliza:

``` text
freshcoffee-guest-started
```

Cuando finaliza el tiempo establecido, el carrito puede vaciarse
automáticamente.

El invitado no puede completar un pedido normal sin una sesión válida.

------------------------------------------------------------------------

# 📦 Pedidos

FreshCoffee permite crear pedidos y enviarlos al CMS mediante la API.

Los pedidos almacenan:

-   Nombre.
-   Teléfono.
-   Forma de entrega.
-   Localidad.
-   Dirección.
-   Forma de pago.
-   Estado del pago.
-   Productos.
-   Total.
-   Estado del pedido.

La aplicación no accede directamente a la base de datos.

------------------------------------------------------------------------

# 🧪 Pedidos de prueba

FreshCoffee dispone de un sistema de pedidos de prueba para
administradores y usuarios autorizados.

Permite comprobar:

-   Productos.
-   Carrito.
-   Entrega.
-   Localidades.
-   Dirección.
-   Pago.
-   Creación del pedido.
-   API.
-   CMS Builder.
-   Panel administrativo.
-   Redsys.

Los pedidos de prueba identifican técnicamente al administrador
mediante:

``` text
id_admin_test_order
email_admin_test_order
```

También pueden conservar un nombre descriptivo introducido por el
administrador.

------------------------------------------------------------------------

# 🖥️ Panel administrativo

FreshCoffee dispone de un panel para la operativa de la cafetería.

Permite gestionar:

-   Productos.
-   Categorías.
-   Creación de productos.
-   Edición de productos.
-   Eliminación de productos.
-   Pedidos.
-   Estados de pedidos.
-   Clientes.
-   Entrega.
-   Pago.
-   Pedidos de prueba.

La gestión general de contenidos, páginas, tablas, usuarios y permisos
pertenece a CMS Builder.

------------------------------------------------------------------------

# 💳 Redsys

FreshCoffee incorpora integración con **Redsys** para pagos mediante
tarjeta.

``` text
Carrito
   ↓
Datos del cliente
   ↓
Entrega
   ↓
Resumen
   ↓
Redsys
   ↓
Pago
   ↓
FreshCoffee
   ↓
Crear pedido
   ↓
CMS Builder
```

------------------------------------------------------------------------

# 📍 Zonas de reparto

Las zonas de reparto se gestionan desde CMS Builder y FreshCoffee las
consulta mediante la API.

Ejemplo:

``` text
id_reparto
localidad_reparto
cafeteria_reparto
activa_reparto
date_created_reparto
date_updated_reparto
```

------------------------------------------------------------------------

# 🧾 Separación de responsabilidades

### CMS Builder

Gestiona:

-   Datos.
-   Contenidos.
-   Páginas.
-   Tablas.
-   Módulos.
-   Usuarios.
-   Administradores.
-   Editores.
-   Permisos.
-   Configuración.

### CoffeeShopAstro

Gestiona:

-   Presentación pública.
-   Navegación.
-   Información de la cafetería.
-   Acceso a FreshCoffee.

### FreshCoffee

Gestiona:

-   Productos.
-   Carrito.
-   Clientes.
-   Pedidos.
-   Entrega.
-   Pago.
-   Operativa de la cafetería.
-   Panel administrativo.

------------------------------------------------------------------------

# 📦 Arquitectura comercial

El proyecto demuestra que CMS Builder puede utilizarse como base para
construir diferentes soluciones.

``` text
┌───────────────────────────┐
│        CMS Builder        │
│ Backend + Gestión         │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│     Aplicación            │
│     personalizada         │
└───────────────────────────┘
```

En este proyecto:

``` text
CMS Builder
     │
     ├── API REST
     │
     ├── CoffeeShopAstro
     │      └── Web pública
     │
     └── FreshCoffee
            └── App de pedidos
```

La arquitectura puede reutilizarse para otros negocios y aplicaciones.

------------------------------------------------------------------------

# 🚀 Escalabilidad

El sistema puede ampliarse mediante:

-   Nuevas categorías.
-   Nuevos productos.
-   Nuevas localidades.
-   Nuevas zonas.
-   Nuevas páginas.
-   Nuevos contenidos.
-   Nuevos módulos.
-   Nuevos editores.
-   Nuevos permisos.
-   Nuevas aplicaciones frontend.

------------------------------------------------------------------------

# 🔒 Seguridad

Las credenciales y claves sensibles se almacenan mediante variables de
entorno.

Los archivos `.env` no deben subirse al repositorio.

El sistema utiliza:

-   API Keys.
-   JWT.
-   Sesiones.
-   Validación de tokens.
-   Roles.
-   Permisos.
-   Validación de acciones.

No se deben incluir credenciales reales en el repositorio público.

------------------------------------------------------------------------

# 💻 Instalación

## API

``` bash
composer install
```

Configurar las variables de entorno, la base de datos y Apache.

## CoffeeShopAstro

``` bash
cd web/coffeeastro
npm install
npm run dev
```

## FreshCoffee

``` bash
cd web/freshcoffee
npm install
npm run dev
```

------------------------------------------------------------------------

# 🧰 CMS Builder Installer

CMS Builder está pensado para distribuirse como una instalación base.

El instalador permite crear una nueva instalación del CMS y, a partir de
ella, construir una aplicación adaptada a las necesidades de cada
proyecto.

## Repositorios

### CMS Builder

https://github.com/puricalvo/cms-builder

### CMS Builder Headless

https://github.com/puricalvo/cms-builder-headless

------------------------------------------------------------------------

# 🎯 Objetivo

El objetivo es disponer de una plataforma reutilizable formada por:

``` text
CMS Builder
     +
API REST
     +
Web pública
     +
Aplicación
     +
Panel administrativo
     +
Pagos
```

CMS Builder deja de ser únicamente un sistema para crear páginas web y
se convierte también en una **plataforma para crear y gestionar
aplicaciones conectadas a su API**.

La aplicación de cafetería es un ejemplo práctico de esta arquitectura.

------------------------------------------------------------------------

# 👩‍💻 Autora

Desarrollado por **Puri Calvo**.

**CMS + API + Web + App**
