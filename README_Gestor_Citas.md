# Gestor de Citas Medicas

Sistema web para gestionar citas medicas de forma sencilla. Permite registrar usuarios, iniciar sesion, consultar medicos disponibles, agendar citas, evitar horarios duplicados y revisar las citas registradas.

## Tecnologias Usadas

- React
- Node.js
- Express
- MySQL
- Axios
- CSS

## Requisitos Previos

Antes de ejecutar el proyecto se necesita tener instalado:

- Node.js
- MySQL Server
- MySQL Workbench
- npm

## Configuracion de la Base de Datos

1. Abrir MySQL Workbench.
2. Ejecutar el script principal de base de datos para crear `gestion_citas`.
3. Crear la tabla de usuarios:

```sql
USE gestion_citas;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cedula INT UNSIGNED NOT NULL UNIQUE
);
```

4. Agregar la restriccion para evitar citas duplicadas:

```sql
USE gestion_citas;

ALTER TABLE citas
ADD UNIQUE KEY uq_medico_fecha_hora (id_medico, fecha, hora);
```

Si la restriccion ya existe, MySQL mostrara un aviso de llave duplicada. En ese caso no es necesario volver a ejecutarla.

## Instalacion del Backend

Abrir una terminal y ejecutar:

```powershell
cd C:\Users\SKAIRLER\Downloads\Backend-main\Backend-main
npm install
```

Verificar que el archivo `db/connection.js` tenga los datos correctos de MySQL:

```js
host: 'localhost',
user: 'root',
password: 'root',
database: 'gestion_citas'
```

## Instalacion del Frontend

Abrir otra terminal y ejecutar:

```powershell
cd C:\Users\SKAIRLER\Downloads\Frontend-main\Frontend-main
npm install
```

## Ejecucion del Proyecto

Primero iniciar el backend:

```powershell
cd C:\Users\SKAIRLER\Downloads\Backend-main\Backend-main
npm start
```

Luego iniciar el frontend:

```powershell
cd C:\Users\SKAIRLER\Downloads\Frontend-main\Frontend-main
npm start
```

La aplicacion se abre en:

```text
http://localhost:3000
```

El backend funciona en:

```text
http://localhost:5000
```

## Manual de Usuario

### Registro

1. Abrir la pagina del sistema.
2. Seleccionar la pestana `Registrarse`.
3. Ingresar usuario, contrasena y cedula.
4. La cedula solo permite numeros y maximo 10 digitos.
5. Presionar `Crear cuenta`.

### Inicio de Sesion

1. Seleccionar la pestana `Iniciar sesion`.
2. Ingresar usuario y contrasena.
3. Presionar `Entrar`.
4. Si los datos son correctos, el sistema muestra el contenido principal.

### Agendar una Cita

1. Iniciar sesion.
2. Ir a la seccion de medicos disponibles.
3. Presionar `Agendar cita` en el medico deseado.
4. Seleccionar fecha y hora.
5. Presionar `Confirmar cita`.

Si el medico ya tiene una cita en esa misma fecha y hora, el sistema mostrara una alerta indicando que el horario no esta disponible.

### Consultar Citas

En la seccion `Citas registradas` se muestra el listado de citas creadas. La tabla permite filtrar por:

- Medico
- Fecha
- Nombre del paciente
- Estado

El listado muestra 10 citas por pagina.

### Cancelar una Cita

1. Buscar la cita en la tabla.
2. Presionar el boton `Cancelar`.
3. Confirmar la accion.

La cita se elimina del sistema.

## Funcionalidades Principales

- Registro e inicio de sesion.
- Proteccion del contenido hasta iniciar sesion.
- Validacion de cedula numerica de maximo 10 digitos.
- Visualizacion de medicos disponibles.
- Agendamiento de citas medicas.
- Validacion de horarios ocupados.
- Ventanas emergentes para errores y confirmaciones.
- Filtros en el listado de citas.
- Paginacion de 10 registros por pagina.
- Eliminacion de citas.
