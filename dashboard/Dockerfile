FROM php:8.2-apache

# Activar mod_rewrite para que funcione el .htaccess
RUN a2enmod rewrite

# Instalar extensiones PHP necesarias
RUN apt-get update \
    && apt-get install -y libzip-dev unzip libicu-dev libpng-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql zip intl gd \
    && rm -rf /var/lib/apt/lists/*

# Establecer la carpeta de la aplicación
WORKDIR /var/www/html

# Copiar el Dashboard al contenedor
COPY . /var/www/html/

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Instalar las dependencias PHP del Dashboard
WORKDIR /var/www/html/extensions
RUN composer install --no-dev --optimize-autoloader

# Volver a la raíz del Dashboard
WORKDIR /var/www/html

# Permitir que Apache utilice .htaccess
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Render proporciona el puerto mediante la variable PORT
CMD sh -c 'PORT=${PORT:-10000}; sed -i "s/Listen .*/Listen $PORT/" /etc/apache2/ports.conf; sed -i "s/:80>/:$PORT>/g" /etc/apache2/sites-available/000-default.conf; apache2-foreground'