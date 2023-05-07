# Configuración básica de graphql con express, mysql, typescript y typeorm

Este proyecto es una demostración de cómo crear una API de graphql usando node.js y typescript, junto con las librerías de express, mysql, typeorm y jsonwebtoken


## Requisitos

- Node.js
- TypeScript
- MySQL

## Instalación

Para instalar las dependencias del proyecto, ejecute el siguiente comando:

```bash
npm install
```

## Ejecución

Para iniciar el servidor de desarrollo, ejecute el siguiente comando:

```bash
npm start
```

El servidor se iniciará en el puerto 4000 y podrá acceder al playground de graphql en la ruta `http://localhost:4000/graphql`.

## Uso

El proyecto expone una API de graphql que permite realizar operaciones CRUD sobre las entidades llamadas `Users` y `Profiles`.

Puede consultar la documentación de graphql en el playground para ver los detalles de cada operación disponible. A continuación se muestra un ejemplo de cómo crear un usuario usando una mutación:

```graphql
mutation CreateUser($email: String!, $password: String!) {
  CreateUser(email: $email, password: $password) {
    token
    created_at
    expires_at
  }
}
```
