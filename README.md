
# CMS Builder Community Edition

CMS Builder Community Edition es un generador de aplicaciones CRUD desarrollado en PHP y MySQL que permite crear paneles de administración completos de forma visual, sin necesidad de programar cada módulo manualmente.

El sistema genera automáticamente tablas, formularios, relaciones entre módulos y una API REST lista para consumir desde cualquier aplicación.

Este repositorio contiene la base del CMS Builder y su evolución hacia una arquitectura **headless**, donde el CMS funciona como backend y diferentes aplicaciones frontend consumen su API.

## Proyecto principal

La versión principal del CMS se encuentra en:

[CMS Builder en GitHub](https://github.com/puricalvo/cms-builder)

## Arquitectura actual

El proyecto headless está dividido en dos partes principales:

```text
cms-builder-headless/
│
├── api/
│   └── API REST desarrollada en PHP
│
└── web/
    │
    ├── coffeeastro/
    │   └── Web pública de la cafetería
    │
    └── freshcoffee/
        └── Aplicación de pedidos y gestión
```

### API

La API proporciona acceso dinámico a las tablas creadas desde CMS Builder.

Permite trabajar con:

* GET
* POST
* PUT
* DELETE

Las operaciones se realizan de forma dinámica sobre las tablas generadas por el CMS, evitando tener que crear un endpoint específico para cada nueva tabla o módulo.

## Tecnologías utilizadas

### CMS Builder / API

* PHP.
* MySQL / MariaDB.
* Composer.
* Apache.
* Arquitectura MVC.
* API REST.

### CoffeeShopAstro

CoffeeShopAstro es la aplicación web pública de la cafetería.

Está desarrollada utilizando:

* Astro.
* TypeScript.
* API REST de CMS Builder.

### FreshCoffee

FreshCoffee es la aplicación utilizada para realizar pedidos y gestionar los productos de la cafetería.

Está desarrollada utilizando:

* Astro.
* React.
* Vue.
* Pinia.
* TypeScript.
* API REST de CMS Builder.

Las dos aplicaciones frontend están desarrolladas utilizando **TypeScript**.

## CMS Builder

CMS Builder permite crear visualmente:

* Tablas.
* Módulos CRUD.
* Formularios.
* Páginas.
* Relaciones entre módulos.
* Usuarios y administradores.
* Configuración del dashboard.
* Gestión de archivos multimedia.

Las tablas creadas por el CMS utilizan una estructura dinámica basada en `suffix`, permitiendo que campos como:

```text
id_<suffix>
date_created_<suffix>
date_updated_<suffix>
```

se generen automáticamente para cada módulo.

## CoffeeShopAstro

CoffeeShopAstro es la web pública de la cafetería.

Está desarrollada con **Astro y TypeScript** y consume los datos directamente desde la API de **CMS Builder**.

Entre las funcionalidades actuales se encuentran:

* Página de inicio.
* Información de la cafetería.
* Blog.
* Galería.
* Menú.
* Contacto.
* Formulario de contacto y reservas.
* Mapa de ubicación.
* Acceso al sistema de pedidos.
* Visualización dinámica de productos y categorías.
* Enlace desde la cafetería al sistema de pedidos FreshCoffee.

## FreshCoffee

FreshCoffee es la aplicación utilizada para realizar pedidos y gestionar los productos de la cafetería.

Está desarrollada con **Astro, React, Vue, Pinia y TypeScript** y consume los datos directamente desde la API de CMS Builder.

Además del sistema de pedidos para clientes, FreshCoffee incorpora un **panel de administración integrado** y un **panel de órdenes para mostrar los pedidos en un monitor dentro de la tienda**.

### Sistema de pedidos para clientes

Actualmente permite:

* Registro de clientes.
* Inicio de sesión.
* Autenticación mediante token.
* Carrito de compra.
* Productos con precio único.
* Productos con precios variables.
* Selección de tamaños o variantes.
* Cálculo de subtotales.
* Cálculo del total.
* Creación de pedidos.
* Paginación de productos.
* Gestión dinámica de categorías.
* Gestión de imágenes mediante la API.

### Panel de administración

FreshCoffee dispone de un panel de administración integrado en la propia aplicación.

Desde este panel se pueden gestionar diferentes aspectos de la aplicación sin necesidad de acceder directamente al CMS Builder.

Actualmente permite:

* Gestionar productos.
* Crear productos.
* Editar productos.
* Eliminar productos.
* Gestionar productos por categorías.
* Gestionar pedidos.
* Consultar el estado de los pedidos.
* Actualizar el estado de los pedidos.

El panel utiliza la misma API de CMS Builder para mantener sincronizada la información con la base de datos y el CMS.

### Panel de órdenes

FreshCoffee también dispone de una página específica para utilizarse como **monitor de pedidos dentro de la tienda**.

Esta pantalla está pensada para permanecer visible en un monitor y mostrar los últimos pedidos completados, permitiendo que el personal de la cafetería y los clientes puedan consultar visualmente los pedidos que ya están preparados o completados.

El panel de órdenes funciona de forma independiente del panel de administración y está pensado específicamente para su utilización como pantalla de información en el establecimiento.

## Sistema de pedidos

El sistema de pedidos utiliza autenticación mediante:

```text
FRESHCOFFEE_TOKEN
```

Un cliente puede añadir productos al carrito sin estar autenticado.

Sin embargo, para realizar el pedido es obligatorio estar registrado e iniciar sesión.

El flujo actual es:

```text
Cliente
   ↓
Carrito
   ↓
Intentar realizar pedido
   ↓
¿Existe FRESHCOFFEE_TOKEN?
   ↓
   ├── NO → Solicitar registro/login
   │
   └── SÍ → Crear pedido
              ↓
           API REST
              ↓
          Base de datos
              ↓
        CMS / Panel
```

El carrito permanece disponible mientras el cliente continúe utilizando el mismo navegador y almacenamiento local.

El carrito no se comparte entre diferentes navegadores o dispositivos.

## Endpoint para peticiones externas

El proyecto incorpora el endpoint:

```text
externas.php
```

Este endpoint permite que las aplicaciones externas, como CoffeeShopAstro y FreshCoffee, puedan insertar, actualizar y eliminar información utilizando la API de forma controlada.

Las operaciones externas:

* Validan la API Key.
* Validan el token del usuario cuando es necesario.
* Comprueban que las columnas pertenecen a la tabla indicada.
* Trabajan dinámicamente con cualquier tabla.
* Generan automáticamente la fecha de creación utilizando el `suffix` de la tabla.

Por ejemplo, una tabla cuyo suffix sea:

```text
cafe
```

puede utilizar automáticamente:

```text
date_created_cafe
```

sin necesidad de crear una lógica específica para esa tabla.

## Productos

Los productos se almacenan en tablas dinámicas creadas desde CMS Builder.

Cada categoría puede tener su propia tabla y suffix.

La aplicación obtiene dinámicamente:

* Tabla.
* Suffix.
* Categoría.
* Productos.
* Precios.
* Variantes.

Esto permite añadir nuevas categorías desde el CMS sin tener que modificar la API.

## Imágenes y archivos

Las imágenes se gestionan mediante el sistema de archivos del CMS.

La API dispone de un endpoint de medios para recibir imágenes desde las aplicaciones externas.

Las imágenes se almacenan en la tabla `files` y en el sistema de archivos del CMS.

La eliminación de un producto no elimina automáticamente su imagen asociada, manteniendo el comportamiento actual del CMS.

## Seguridad

Las variables sensibles se almacenan en archivos `.env` y no deben subirse al repositorio.

La API utiliza API Key y autenticación mediante tokens para proteger las operaciones que requieren autorización.

El cliente puede navegar y utilizar el carrito sin autenticarse, pero no puede crear un pedido sin disponer de un token válido.

## Requisitos

* PHP 8.1 o superior.
* MySQL o MariaDB.
* Composer.
* Node.js.
* npm.
* Servidor Apache o Nginx.

## Instalación

### CMS / API

1. Clona o descarga el proyecto.
2. Instala las dependencias de Composer:

```bash
composer install
```

3. Copia:

```text
.env.template
```

como:

```text
.env
```

4. Configura las variables de entorno.
5. Crea la base de datos.
6. Configura Apache o Nginx.
7. Accede al instalador desde el navegador.

Durante la instalación se crearán automáticamente las estructuras iniciales del CMS.

### Aplicaciones frontend

Las aplicaciones frontend se encuentran dentro de la carpeta `web`:

```text
web/
├── coffeeastro/
└── freshcoffee/
```

Para cada aplicación, instala las dependencias de Node:

```bash
npm install
```

Después configura las variables de entorno necesarias para conectar con la API.

## Variables de entorno

Los archivos `.env` contienen información sensible y están excluidos del repositorio mediante `.gitignore`.

El proyecto utiliza archivos de ejemplo como:

```text
.env.template
.env.example
```

para documentar las variables necesarias sin almacenar credenciales reales.

## Estructura general

```text
cms-builder-headless/
│
├── api/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── views/
│   └── index.php
│
└── web/
    │
    ├── coffeeastro/
    │   ├── src/
    │   ├── public/
    │   └── package.json
    │
    └── freshcoffee/
        ├── src/
        ├── public/
        └── package.json
```

## API REST

Todos los módulos creados desde el dashboard generan automáticamente sus correspondientes endpoints REST.

La API permite realizar operaciones:

* GET
* POST
* PUT
* DELETE

sin necesidad de escribir código adicional para cada tabla.

Las aplicaciones frontend consumen estos endpoints mediante servicios centralizados.

## ChatGPT

CMS Builder permite integrar ChatGPT dentro de cualquier módulo mediante campos dinámicos.

Para utilizar esta funcionalidad es necesario configurar las credenciales de OpenAI desde el panel de administración.

## Personalización

El dashboard permite configurar:

* Nombre del proyecto.
* Símbolo.
* Color principal.
* Tipografía.
* Imagen de fondo del login.

## Estado actual del proyecto

### Punto estable antes de la integración de pagos

El proyecto se encuentra actualmente en un punto estable previo a la integración del sistema de pagos.

Funcionando actualmente:

* CMS Builder.
* API REST.
* API externa dinámica.
* Registro de clientes.
* Login.
* Autenticación mediante token.
* Carrito de compra.
* Productos variables.
* Categorías dinámicas.
* Creación de productos.
* Edición de productos.
* Eliminación de productos.
* Creación de pedidos.
* Fechas de creación automáticas.
* Subida de imágenes.
* Panel de administración integrado en FreshCoffee.
* Gestión de productos desde FreshCoffee.
* Gestión de pedidos desde FreshCoffee.
* Panel de órdenes para monitor de la tienda.
* Paginación.
* Integración CoffeeShopAstro → FreshCoffee.
* Validación de autenticación antes de crear pedidos.

## Próximas funcionalidades

El siguiente objetivo del proyecto es integrar un sistema completo de pedidos con:

* Pago mediante Redsys.
* Confirmación del pago antes de crear el pedido.
* Reparto a domicilio.
* Restricción de zonas de reparto.
* Costes de reparto.
* Gestión del estado del pedido.
* Confirmación automática de los pagos.

El pedido definitivo deberá crearse únicamente después de recibir la confirmación válida del pago.

El flujo previsto será:

```text
Carrito
   ↓
Datos del cliente
   ↓
Tipo de entrega
   ↓
Dirección / zona de reparto
   ↓
Redsys
   ↓
Pago confirmado
   ↓
Crear pedido
   ↓
Base de datos
   ↓
CMS / Panel de administración
```

Si el pago es rechazado o cancelado, el pedido no deberá crearse.

## Licencia

CMS Builder Community Edition se distribuye para fines educativos y de desarrollo.

Puedes modificarlo y adaptarlo a tus propios proyectos respetando las condiciones de la licencia correspondiente.

## Autor

Desarrollado por **Puri Calvo**.

Proyecto creado para facilitar el desarrollo rápido de aplicaciones administrativas mediante una arquitectura visual basada en PHP, MySQL y API REST.

