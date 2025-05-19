# Findtect API

API REST para la gestión de empresas y transferencias, construida con Node.js, Express, TypeScript y PostgreSQL.

## Arquitectura

El proyecto sigue la arquitectura hexagonal (también conocida como puertos y adaptadores), separando claramente:

- **Dominio**: Las entidades y reglas de negocio core
- **Aplicación**: Los casos de uso de la aplicación
- **Infraestructura**: Implementaciones concretas de los repositorios, controladores, rutas, etc.

## Requerimientos

- Node.js >= 14
- PostgreSQL

## Instalación

1. Clonar el repositorio
2. Instalar dependencias

```bash
npm install
```

3. Crear archivo `.env` en la raíz del proyecto con la siguiente configuración:

```
NODE_ENV=development
PORT=3000

# Database
DB_HOST=172.25.51.225
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=282828
DB_NAME=findtect_db

# JWT
JWT_SECRET=findtect_secret_key_very_secure
JWT_EXPIRES_IN=24h
```

4. Crear la base de datos y las tablas

Para crear las tablas en la base de datos, ejecutar:

```bash
npm run build
node dist/infrastructure/scripts/migrations.js
```

5. Popular la base de datos con datos de prueba

```bash
npm run seed
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

## Tests

```bash
npm test
```

## Endpoints

La API expone los siguientes endpoints:

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Empresas

Todos los endpoints de empresas requieren autenticación mediante JWT.

- `POST /api/companies/adhere` - Adhesión de una empresa
- `GET /api/companies/adhered-last-month` - Obtener empresas adheridas el último mes
- `GET /api/companies/with-transfers-last-month` - Obtener empresas que hicieron transferencias el último mes

## Estructura del Proyecto

```
src/
├── application/        # Capa de aplicación (servicios)
├── domain/             # Capa de dominio
│   ├── entities/       # Entidades del dominio
│   └── repositories/   # Interfaces de repositorios
├── infrastructure/     # Capa de infraestructura
│   ├── config/         # Configuraciones
│   ├── controllers/    # Controladores
│   ├── middlewares/    # Middlewares
│   ├── repositories/   # Implementaciones de repositorios
│   ├── routes/         # Rutas
│   └── scripts/        # Scripts (migraciones, seed)
├── tests/              # Tests
└── server.ts           # Punto de entrada
``` 