# API Automation - Home Banking

Framework de automatización de pruebas de API para el sistema demo de Home Banking, desarrollado como parte de un curso de API Automation.

## Tech Stack

| Herramienta | Versión |
|---|---|
| [Playwright Test](https://playwright.dev/) | v1.58.2 |
| TypeScript | v6.0.2 |
| ts-node | v10.9.2 |
| dotenv | v17.3.1 |
| Node.js | >= 18 |

## Estructura del Proyecto

```
API-AUTOMATION/
├── src/
│   ├── services/              # Capa de servicios (wrappers de API)
│   │   ├── authService.ts     # Autenticación y obtención de token
│   │   ├── clientesService.ts # Endpoints de clientes / dashboard
│   │   └── prestamosService.ts# Endpoints de préstamos
│   ├── tests/                 # Especificaciones de prueba
│   │   ├── cliente.spec.ts    # Tests de datos del cliente
│   │   └── prestamos.spec.ts  # Tests de alta de préstamos
│   └── data/                  # Datos de prueba (fixtures)
├── playwright.config.ts       # Configuración de Playwright
├── tsconfig.json              # Configuración de TypeScript
├── .env                       # Variables de entorno (NO commitear)
└── package.json
```

## Requisitos Previos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/mati2088/API-AUTOMATION-.git
cd API-AUTOMATION-

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales correspondientes
```

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
BASE_URL=https://homebanking-demo.onrender.com
USER_EMAIL=usuario@test.com
USER_PASSWORD=password123
```

> El archivo `.env` está incluido en `.gitignore` y nunca debe ser commiteado.

## Ejecutar Tests

```bash
# Ejecutar todos los tests
npx playwright test

# Ejecutar un archivo específico
npx playwright test src/tests/cliente.spec.ts
npx playwright test src/tests/prestamos.spec.ts

# Ejecutar con reporte detallado
npx playwright test --reporter=list

# Ver reporte HTML luego de la ejecución
npx playwright show-report
```

## Servicios Disponibles

### AuthService
Gestiona la autenticación contra la API.

```typescript
const token = await authService.getToken(email, password);
```

- `POST /auth/login` — Devuelve el token de autenticación

### ClientesService
Obtiene datos del cliente autenticado.

```typescript
const response = await clientesService.obtenerDatosCliente(token);
```

- `GET /cliente/dashboard` — Dashboard con `personalInfo`, `accounts` y `cards`

### PrestamosService
Gestiona operaciones de préstamos.

```typescript
const response = await prestamosService.altaPrestamo(cuentaDestino, cuotas, monto);
```

- `POST /prestamos/` — Crea un nuevo préstamo

## Tests Implementados

### cliente.spec.ts
| Test | Descripción |
|---|---|
| Obtener datos cliente exitosamente | Verifica que el endpoint responde correctamente |
| Validar personalInfo | Valida nombre, cuenta, tarjeta y dirección del cliente |

### prestamos.spec.ts
| Test | Descripción |
|---|---|
| Dar de alta PRESTAMO | Flujo completo: login → obtener cuenta → crear préstamo |

## API Under Test

**Base URL:** `https://homebanking-demo.onrender.com`

Sistema demo de Home Banking que expone endpoints REST para autenticación, gestión de clientes y préstamos.

## Contribuir

1. Crear una branch descriptiva: `git checkout -b feature/nombre-feature`
2. Realizar los cambios y commitear: `git commit -m "feat: descripción"`
3. Push y abrir un Pull Request

## Autor

Proyecto desarrollado como parte del curso de **API Automation Testing**.
