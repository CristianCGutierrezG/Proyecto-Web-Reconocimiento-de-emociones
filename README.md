# Proyecto-Web-Reconocimiento-de-emociones

Repositorio para el almacenamiento del API con las emociones de los estudiantes

API CRUD desarrollada en express para la gestión de base de datos relacional (PostgreSQL).

# Especificaciones Técnicas

## Tecnologías Implementadas y Versiones

- Express
- PostgreSQL

**Entorno Local:** Node.JS Version: v18.16.0 | NPM Version: 10.7.1 | express version: 4.18.3 | sequelize version: v6.37.1

## Variables de Entorno

```shell
#Informacion basica de acceso a la base de datos
PORT=30000
DB_USER=''
DB_PASSWORD=''
DB_HOST=''
DB_NAME=''
DB_PORT=''

#Correo de acceso para pgAdmin
DB_MAIL=''   

#Llaves de seguridad para acceso a los datos
API_KEY=''
JWT_SECRET=''
JWT_RECOVERY_SECRET=''

#Correo y cotraseña para el envio de mensajes de recuperacion de contraseñas
EMAIL_SENDER=''
EMAIL_PASSWORD=''
```

## Ejecución del Proyecto

```shell
#1. Clonar el repositorio
git clone https://github.com/CristianCGutierrezG/Proyecto-Web-Reconocimiento-de-emociones # Via HTTPS

#2. Moverse a la carpeta del repositorio
cd Proyecto-Web-Reconocimiento-de-emociones

#3. Moverse a la rama **develop**
git pull origin develop && git checkout develop

#4. Instalar dependencias
npm install

#5. Alimentar todas las variables de entorno que utiliza el proyecto en un archivo .env.

```



# Modelo de Datos
![Diagrama fisico](https://github.com/user-attachments/assets/7268febf-5f50-45c2-b6f8-1a89f63fe697)

