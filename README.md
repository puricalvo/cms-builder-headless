
# CMS Builder Headless

Solución completa para cafeterías basada en una arquitectura desacoplada:

**CMS Builder + API REST + Web + App de pedidos**

El proyecto reúne un CMS para gestionar los contenidos y datos, una web pública desarrollada con Astro y una aplicación de pedidos desarrollada con Astro, React y Vue.

## 📐 Arquitectura

---
```text
                         CMS Builder
                              │
                              │ API REST
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
          CoffeeShopAstro             FreshCoffee
            Web pública             App de pedidos
                 │                         │
                 └────────────┬────────────┘
                              │
                              ▼
                         Base de datos
```
---

La información configurable se gestiona desde **CMS Builder** y las aplicaciones frontend consumen esos datos mediante la API.

# 📁 Estructura del proyecto

---
```text
cms-builder-headless/
│
├── api/
│   └── API REST del CMS
│
└── web/
    │
    ├── coffeeastro/
    │   └── Web pública de la cafetería
    │
    └── freshcoffee/
        └── Aplicación de pedidos
```
---

# 🧩 CMS Builder

CMS Builder es el sistema encargado de gestionar la información utilizada por las aplicaciones.

Permite crear y administrar:

- Páginas.
- Tablas.
- Módulos CRUD.
- Formularios.
- Relaciones.
- Usuarios.
- Administradores.
- Editores.
- Permisos.
- Archivos multimedia.
- Contenidos.
- Productos.
- Categorías.
- Zonas de reparto.
- Localidades.
- Pedidos.

El objetivo es que la gestión de los datos configurables se realice desde el CMS sin tener que modificar el código de las aplicaciones cada vez que se añade o cambia información.

# 🌐 API REST

CMS Builder proporciona una API REST para que las aplicaciones externas puedan consultar y modificar los datos del CMS.

La API permite trabajar con:

- `GET`
- `POST`
- `PUT`
- `DELETE`

Las tablas son dinámicas y pueden utilizarse desde los servicios de las aplicaciones sin tener que crear manualmente un endpoint específico para cada tabla.

# 📄 Páginas y tablas

Las páginas se obtienen mediante la URL configurada en CMS Builder.

Por ejemplo:

---
```ts
const page = await getPage("nosotros");
```
---

o:

---
```ts
const page = await getPage("repartos");
```
---

Las tablas no necesitan tener una URL propia.

Cuando una página necesita información de una tabla independiente, se puede obtener directamente:

---
```ts
const content = await getTable("nosotros");
```
---

o:

---
```ts
const content = await getTable("repartos");
```
---

Esto permite separar:

---
```text
URL de la página
      ↓
Página del CMS
      ↓
Tabla de datos
```
---

# 🏷️ Suffix de las tablas

CMS Builder utiliza un `suffix` para identificar los campos pertenecientes a cada tabla.

Por ejemplo, una tabla llamada:

---
```text
repartos
```
---

puede utilizar el suffix:

---
```text
reparto
```
---

y generar campos como:

---
```text
id_reparto
localidad_reparto
cafeteria_reparto
activa_reparto
date_created_reparto
date_updated_reparto
```
---

Esto permite trabajar dinámicamente con diferentes tablas y módulos.

# 👥 Usuarios, administradores y editores

CMS Builder permite separar las responsabilidades de los usuarios.

Los administradores pueden gestionar las funcionalidades para las que estén autorizados.

Los editores pueden recibir permisos específicos sobre determinadas páginas o contenidos.

Por ejemplo:

---
```text
Editor 1 → Página de cobros
Editor 2 → Página de zonas de reparto
Editor 3 → Otra página o contenido
```
---

La gestión de usuarios, editores y permisos pertenece al CMS.

FreshCoffee no duplica estas responsabilidades.

# ☕ CoffeeShopAstro

**CoffeeShopAstro** es la web pública de la cafetería.

Está desarrollada con:

- Astro.
- TypeScript.
- API REST.

La web obtiene sus contenidos desde CMS Builder.

Entre sus funcionalidades se encuentran:

- Página de inicio.
- Páginas dinámicas.
- Información de la cafetería.
- Productos.
- Categorías.
- Blog.
- Galería.
- Contacto.
- Reservas.
- Información dinámica procedente del CMS.

# 🔗 Integración CoffeeShopAstro → FreshCoffee

CoffeeShopAstro incorpora un botón de acceso directo a **FreshCoffee** para que el cliente pueda pasar de la web pública al sistema de pedidos.

El flujo es:

---
```text
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
---

La web pública se encarga de presentar la cafetería y FreshCoffee de gestionar el proceso de compra.

# 🛒 FreshCoffee

**FreshCoffee** es la aplicación utilizada para realizar pedidos y gestionar la operativa de la cafetería.

Está desarrollada utilizando:

- Astro.
- React.
- Vue.
- TypeScript.
- Zustand.
- Pinia.
- Tailwind CSS.
- Headless UI.
- Heroicons.
- React Toastify.
- Zod.

La aplicación consume los datos de CMS Builder mediante la API REST.

# 🥐 Productos

Los productos se obtienen dinámicamente desde CMS Builder.

FreshCoffee permite trabajar con:

- Categorías dinámicas.
- Productos dinámicos.
- Productos con precio único.
- Productos con precios variables.
- Tamaños.
- Variantes.
- Imágenes.
- Paginación.

Las categorías y tablas pueden modificarse desde CMS Builder sin tener que crear una nueva API específica.

# 🛍️ Carrito

FreshCoffee dispone de un carrito completamente funcional.

Permite:

- Añadir productos.
- Eliminar productos.
- Aumentar cantidades.
- Disminuir cantidades.
- Cambiar tamaños.
- Trabajar con precios variables.
- Recalcular subtotales.
- Calcular el total.

El carrito utiliza almacenamiento local y Zustand.

# 🔐 Autenticación

FreshCoffee utiliza el token:

---
```text
FRESHCOFFEE_TOKEN
```
---

El token permite identificar la sesión del usuario.

Las acciones que requieren autenticación comprueban la existencia de una sesión válida.

# 👤 Sesión de invitado

FreshCoffee permite acceder como invitado.

El invitado puede utilizar el carrito durante un periodo limitado.

El control del tiempo utiliza almacenamiento local mediante:

---
```text
freshcoffee-guest-started
```
---

Cuando finaliza el tiempo establecido, el carrito puede vaciarse automáticamente.

El invitado no puede completar un pedido normal sin disponer de una sesión válida.

# 📦 Pedidos

FreshCoffee permite crear pedidos y enviarlos al CMS mediante la API.

Los pedidos almacenan información como:

- Nombre.
- Teléfono.
- Forma de entrega.
- Localidad.
- Dirección.
- Forma de pago.
- Estado del pago.
- Productos.
- Total.
- Estado del pedido.

La dirección de entrega se almacena en:

---
```text
delivery_address_order
```
---

# 🚚 Formas de entrega

Actualmente existen dos formas de entrega:

---
```text
pickup
delivery
```
---

## Recoger en cafetería

El cliente puede seleccionar:

> Recoger en cafetería

En este caso no se solicita una dirección de entrega.

## Reparto a domicilio

El cliente puede seleccionar:

> Reparto a domicilio

En este caso se solicita:

- Localidad.
- Dirección de entrega.

# 📍 Zonas de reparto

Las zonas de reparto se gestionan desde **CMS Builder**.

FreshCoffee no contiene una gestión independiente de las zonas.

La aplicación consulta las zonas mediante la API.

La tabla utilizada actualmente es:

---
```text
repartos
```
---

con campos como:

---
```text
id_reparto
localidad_reparto
cafeteria_reparto
activa_reparto
date_created_reparto
date_updated_reparto
```
---

El campo:

---
```text
activa_reparto
```
---

determina si una zona está disponible.

En la base de datos un valor activo puede aparecer como:

---
```text
1
```
---

mientras que en CMS Builder se representa como:

---
```text
true
```
---

La aplicación muestra únicamente las zonas activas.

# 🏘️ Localidades de reparto

Cuando el cliente selecciona **Reparto a domicilio**, FreshCoffee muestra las localidades disponibles obtenidas desde CMS Builder.

El cliente selecciona su localidad y posteriormente introduce la dirección completa.

Ejemplo:

---
```text
Localidad:
Sevilla

Dirección:
Calle Ejemplo, 25, 2ºB
```
---

La información se guarda junto al pedido.

# 📋 Estados de los pedidos

Los pedidos utilizan actualmente los siguientes estados:

---
```text
pending
preparing
completed
cancelled
```
---

La forma de entrega no es un estado.

Por ejemplo:

---
```text
Reparto + Pendiente
Reparto + Preparando
Reparto + Completado
```
---

o:

---
```text
Recogida + Pendiente
Recogida + Preparando
Recogida + Completado
```
---

# 💳 Estados del pago

El estado del pago se gestiona independientemente del estado del pedido.

Por ejemplo:

---
```text
payment_status_order = paid
status_order = pending
```
---

significa que:

- El pago ya se ha realizado.
- El pedido todavía está pendiente de preparación.

# 💵 Pago en efectivo

FreshCoffee permite realizar pedidos mediante:

---
```text
cash
```
---

En este caso el pedido se crea con el estado de pago correspondiente a un pago pendiente.

# 💳 Redsys

FreshCoffee incorpora integración con **Redsys** para realizar pagos mediante tarjeta.

El flujo es:

---
```text
Carrito
   ↓
Datos del cliente
   ↓
Forma de entrega
   ↓
Resumen del pedido
   ↓
Redsys
   ↓
Pago
   ↓
Retorno a FreshCoffee
   ↓
Creación del pedido
   ↓
CMS Builder
```
---

El pedido definitivo se crea después de que Redsys haya autorizado el pago.

# 🔄 Retorno de Redsys

Después del pago, Redsys devuelve al usuario a:

---
```text
/order/pricecafe
```
---

FreshCoffee conserva temporalmente los datos necesarios del pedido mediante:

---
```text
sessionStorage
```
---

utilizando:

---
```text
pending_order
```
---

El proceso es:

---
```text
Pago autorizado
       ↓
FreshCoffee
       ↓
Crear pedido
       ↓
Vaciar carrito
       ↓
Mostrar confirmación
```
---

Si el pago se ha realizado pero la creación del pedido falla, la aplicación informa al usuario de que el pago ha sido realizado pero el pedido no ha podido completarse.

# 🧪 Pedidos de prueba

FreshCoffee dispone de un sistema de pedidos de prueba para administradores.

El acceso se realiza desde:

---
```text
/admin/test-orders
```
---

El administrador puede acceder al carrito mediante:

---
```text
/order/pricecafe?testOrder=1
```
---

Los pedidos de prueba permiten comprobar:

- Productos.
- Carrito.
- Formas de entrega.
- Localidades.
- Dirección.
- Pago.
- Creación del pedido.
- Integración con CMS Builder.
- Funcionamiento del panel administrativo.
- Integración con Redsys.

# 🔧 Modo de prueba del administrador

El estado del modo de prueba se conserva mediante `sessionStorage` utilizando:

---
```text
freshcoffee-admin-test-order
```
---

Esto permite navegar entre diferentes categorías durante el pedido de prueba.

Por ejemplo:

---
```text
/order/pricecafe?testOrder=1
        ↓
/order/pizzas
        ↓
/order/postres
```
---

El modo de prueba continúa activo durante la navegación.

Al volver al panel se elimina únicamente la marca del modo de prueba.

La sesión del administrador permanece activa.

# ↩️ Volver al panel de administración

Durante un pedido de prueba aparece el botón:

> ← Volver al panel

El botón vuelve a:

---
```text
/admin/test-orders
```
---

El botón elimina únicamente:

---
```text
freshcoffee-admin-test-order
```
---

No elimina:

---
```text
FRESHCOFFEE_TOKEN
```
---

Por tanto, el administrador conserva su sesión.

# 🖥️ Panel de administración

FreshCoffee dispone de un panel de administración para las funcionalidades propias de la aplicación.

Permite trabajar con:

- Productos.
- Categorías.
- Creación de productos.
- Edición de productos.
- Eliminación de productos.
- Pedidos.
- Estados de pedidos.
- Información de clientes.
- Información de entrega.
- Información de pago.
- Pedidos de prueba.

La gestión general de contenidos y configuración pertenece a CMS Builder.

# 🧾 Panel de pedidos

FreshCoffee dispone de una pantalla específica para consultar los pedidos de la cafetería.

Permite trabajar con los pedidos y sus estados:

---
```text
Pendiente
Preparando
Completado
Cancelado
```
---

La información procede del CMS mediante la API REST.

# 🖼️ Gestión de imágenes

FreshCoffee utiliza la API de CMS Builder para gestionar las imágenes.

El sistema dispone de un endpoint específico para recibir imágenes.

Las aplicaciones frontend no necesitan acceder directamente a la base de datos.

# 🧱 Servicios frontend

FreshCoffee centraliza la comunicación con la API mediante servicios.

Entre ellos se encuentran:

---
```text
services/
├── api.ts
├── pages.ts
├── orders.ts
├── test-orders.ts
└── upload.ts
```
---

Esto permite mantener separada la comunicación con la API de los componentes de interfaz.

# 🔒 Seguridad

Las credenciales y claves sensibles se almacenan mediante variables de entorno.

No deben incluirse credenciales reales dentro del repositorio.

El sistema utiliza:

- API Keys.
- Tokens.
- Sesiones.
- Validación de permisos.
- Validación de acciones.

# ⚙️ Variables de entorno

Las aplicaciones utilizan variables de entorno para configurar la conexión con la API.

Los archivos `.env` no deben subirse al repositorio.

Se deben utilizar archivos de ejemplo para documentar las variables necesarias.

# 🛠️ Tecnologías

## CMS / API

- PHP.
- MySQL.
- MariaDB.
- Apache.
- Composer.
- API REST.

## CoffeeShopAstro

- Astro.
- TypeScript.

## FreshCoffee

- Astro.
- React.
- Vue.
- TypeScript.
- Zustand.
- Pinia.
- Tailwind CSS.
- Headless UI.
- Heroicons.
- React Toastify.
- Zod.

## Pagos

- Redsys.

# 💻 Instalación

## API

Instalar las dependencias PHP:

---
```bash
composer install
```
---

Configurar las variables de entorno y la conexión con la base de datos.

Configurar Apache o el servidor web correspondiente.

## CoffeeShopAstro

Entrar en:

---
```text
web/coffeeastro
```
---

Instalar las dependencias:

---
```bash
npm install
```
---

Configurar las variables de entorno necesarias.

Iniciar el entorno de desarrollo:

---
```bash
npm run dev
```
---

## FreshCoffee

Entrar en:

---
```text
web/freshcoffee
```
---

Instalar las dependencias:

---
```bash
npm install
```
---

Configurar las variables de entorno necesarias.

Iniciar el entorno de desarrollo:

---
```bash
npm run dev
```
---

# 🖥️ Desarrollo local

El proyecto se ha desarrollado utilizando un entorno local basado en XAMPP.

La estructura local principal es:

---
```text
C:\xampp\htdocs\cms-builder-headless
```
---

La API y las aplicaciones frontend se ejecutan de forma independiente y se comunican mediante HTTP.

# 🔄 Flujo completo del sistema

---
```text
                         CMS Builder
                              │
                              │
                          API REST
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
       CoffeeShopAstro                    FreshCoffee
              │                               │
              │                               ▼
              │                           Productos
              │                               │
              │                               ▼
              │                             Carrito
              │                               │
              │                               ▼
              │                         Datos cliente
              │                               │
              │                               ▼
              │                        Entrega / Pago
              │                               │
              │                    ┌──────────┴──────────┐
              │                    │                     │
              │                    ▼                     ▼
              │                 Efectivo              Redsys
              │                    │                     │
              │                    └──────────┬──────────┘
              │                               ▼
              │                         Crear pedido
              │                               │
              └───────────────────────────────┤
                                              ▼
                                        CMS Builder
                                              │
                                              ▼
                                    Panel administrativo
```
---

# 🧠 Separación de responsabilidades

El proyecto mantiene una separación clara entre CMS, web y aplicación.

### CMS Builder

Gestiona:

- Datos.
- Contenidos.
- Páginas.
- Tablas.
- Módulos.
- Usuarios.
- Administradores.
- Editores.
- Permisos.
- Configuración.
- Zonas de reparto.
- Localidades.
- Información gestionable.

### CoffeeShopAstro

Gestiona:

- Presentación pública.
- Contenido.
- Navegación.
- Información de la cafetería.
- Acceso a FreshCoffee.

### FreshCoffee

Gestiona:

- Productos.
- Carrito.
- Clientes.
- Pedidos.
- Entrega.
- Pago.
- Operativa de la cafetería.
- Panel de administración de la aplicación.

La aplicación no duplica responsabilidades que ya pertenecen al CMS.

# 📦 Arquitectura comercial

El proyecto está pensado como una solución completa:

---
```text
┌───────────────────────────┐
│        CMS Builder        │
│ Gestión y administración  │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│       CoffeeShopAstro     │
│        Web pública        │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│        FreshCoffee        │
│     App de pedidos        │
└───────────────────────────┘
```
---

Esto permite ofrecer el conjunto como un paquete:

**CMS + Web + App**

manteniendo las responsabilidades separadas y reutilizando la misma arquitectura para diferentes cafeterías y negocios.

# 🚀 Escalabilidad

El sistema está diseñado para poder ampliarse desde CMS Builder.

Por ejemplo:

- Nuevas categorías.
- Nuevos productos.
- Nuevas localidades.
- Nuevas zonas de reparto.
- Nuevas cafeterías.
- Nuevos contenidos.
- Nuevos módulos.
- Nuevos editores.
- Nuevas aplicaciones frontend.

La incorporación de información configurable no requiere necesariamente modificar el código de FreshCoffee o CoffeeShopAstro.

# 🎯 Objetivo del proyecto

El objetivo es disponer de una plataforma completa y reutilizable para cafeterías y otros negocios que necesiten:

---
```text
CMS
+
API REST
+
Web pública
+
Aplicación de pedidos
+
Panel administrativo
+
Pagos
```
---

con una arquitectura desacoplada, dinámica y preparada para crecer.

# 🔗 Repositorios

https://github.com/puricalvo/cms-install-builder

## CMS Builder Headless

https://github.com/puricalvo/cms-builder-headless

# 👩‍💻 Autor

Desarrollado por **Puri Calvo**.

Arquitectura basada en:

**CMS + API + Web + App**
