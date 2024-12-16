# API Serverless - Star Wars & Pokémon Data Integration

## **Desarrollado por:** Brigitte Mendez

---

## **Descripción del Proyecto**

Esta API Serverless combina datos de la API de **Star Wars (SWAPI)** y la API de **Pokémon** para generar un modelo fusionado de información, almacenado y gestionado en **AWS Lambda** con **DynamoDB**. Incluye un sistema de **cacheo**, autenticación basada en **JWT**, y documentación generada con **Redocli**.

El objetivo principal es ofrecer un conjunto de funcionalidades que permiten:

1. **Fusionar datos externos** (Star Wars + Pokémon).
2. **Almacenar datos personalizados** definidos por el usuario.
3. **Consultar el historial de datos fusionados**.

---

## **Características Principales**

- **Desarrollado en**: Node.js v20 + Serverless Framework + TypeScript.
- **Base de datos**: DynamoDB.
- **Seguridad**: Autenticación con JWT.
- **Documentación**: OpenAPI 3.0 + Redocli.
- **Despliegue**: AWS Lambda + API Gateway.

---

## **Instalación**

1. **Instalar dependencias**:

   ```bash
   npm install
   ```

2. **Implementar la API en AWS**:

   ```bash
   serverless deploy
   ```

3. **Ver documentación de Redocli**:

   ```bash
   npx openapi preview-docs
   ```

   Visualizar la documentación en [http://127.0.0.1:8080](http://127.0.0.1:8080).

---

## **Endpoints**

### **GET /fusionados**

- **Descripción**: Fusiona datos de las APIs de Star Wars y Pokémon, y almacena el resultado en DynamoDB para futuras consultas.
- **Autenticación**: Requiere un token **JWT** en el encabezado `Authorization`.
- **Respuesta Ejemplo**:
   ```json
   [
       {
           "name": "Luke Skywalker",
           "homeworld": "Tatooine",
           "climate": "arid",
           "pokemon_friend": ["spearow", "pikachu"]
       }
   ]
   ```

### **POST /almacenar**

- **Descripción**: Permite almacenar información personalizada.
- **Autenticación**: Requiere un token **JWT**.
- **Cuerpo de Solicitud**:
   ```json
   {
       "type": "note",
       "content": {
           "title": "Test Note",
           "description": "This is a test note"
       }
   }
   ```
- **Respuesta Ejemplo**:
   ```json
   {
       "message": "¡Datos almacenados exitosamente!"
   }
   ```

### **GET /historial**

- **Descripción**: Consulta el historial de datos fusionados almacenados con soporte de paginación.
- **Autenticación**: Requiere un token **JWT**.
- **Parámetros**:
   - `pageSize`: Número de elementos por página (máximo 10).
   - `npage`: Número de página.
- **Respuesta Ejemplo**:
   ```json
   {
       "items": [
           {
               "partitionKey": "2024-12",
               "climate": "arid",
               "sortKey": "2024-12-15T16:25:31.061Z#932",
               "homeworld": "Tatooine",
               "createdAt": "2024-12-15T16:25:31.061Z",
               "id": "37d3b52a-7b49-4864-8749-67d417fbdd19",
               "pokemon_friend": ["spearow"],
               "name": "R5-D4"
           }
       ],
       "currentPage": 2,
       "totalPages": 6,
       "totalItems": 30
   }
   ```

---

## **Funciones Avanzadas**

1. **Cacheo**:
   - Respuestas de APIs externas almacenadas en DynamoDB por 30 minutos.

2. **Autenticación**:
   - Implementada con **JWT**.

---

## **Pruebas**

- Pruebas unitarias y de integración desarrolladas con **Jest**.

---

## **Contribuir**

1. **Clonar el repositorio**:
   ```bash
   git clone git@github.com:BrigitteMendez1302/test-serverless.git
   ```

2. **Crear un branch para cambios**:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

3. **Enviar un pull request** para revisión.

---

## **Postman Collection**

Entrar a este link: [Postman endpoints](https://www.postman.com/security-pilot-62443805/softek-test)

---

## **Licencia**

Este proyecto está licenciado bajo la [MIT License](https://opensource.org/licenses/MIT). 

¡Gracias por usar este proyecto!
