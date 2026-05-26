# Gestor de Citas Medicas

Sistema web para gestionar citas medicas. Permite registrar usuarios, iniciar sesion, consultar medicos disponibles, agendar citas, evitar horarios duplicados y revisar las citas registradas por cada usuario.

El proyecto esta dividido en dos partes:

- Backend: API desarrollada con Node.js, Express y MySQL.
- Frontend: interfaz web desarrollada con React.

Tambien puede ejecutarse de dos formas:

- Localmente con XAMPP y MySQL Workbench.
- Con Docker y Docker Compose.

## Tecnologias Usadas

- Node.js
- Express
- MySQL
- React
- Axios
- CSS
- Docker
- Nginx

## Requisitos Previos

Para ejecutar el proyecto localmente se necesita:

- Node.js
- npm
- XAMPP con MySQL activo
- MySQL Workbench
- Git

Para ejecutarlo con Docker se necesita:

- Docker Desktop
- WSL 2 en Windows
- Docker Compose

## Estructura General Del Proyecto

```text
gestor-citas-medicas/
  backend_zip/
    Backend-main/
      controllers/
      db/
      routes/
      server.js
      package.json
      .env.example
      Dockerfile
  frontend_zip/
    Frontend-main/
      public/
      src/
      package.json
      Dockerfile
      nginx.conf
  BD_Citas.sql
  BD_Citas_migracion_usuarios_citas.sql
  docker-compose.yml
  DOCKER.md
```

No es necesario modificar carpetas generadas como `node_modules`, `build` o `.git`.

## Configuracion De La Base De Datos

La base de datos se llama:

```text
gestion_citas
```

Tablas principales:

- `usuarios`: guarda las cuentas registradas.
- `medicos`: guarda los medicos disponibles.
- `citas`: guarda las citas creadas.

La tabla `citas` incluye `id_usuario`, lo que permite que cada usuario vea solamente sus propias citas.

Para crear la base de datos desde cero, ejecutar en MySQL Workbench el archivo:

```text
BD_Citas.sql
```

Si la base ya existia y solo hace falta agregar la relacion entre citas y usuarios, ejecutar:

```text
BD_Citas_migracion_usuarios_citas.sql
```

Importante: no usar `DROP DATABASE` si se quieren conservar usuarios y citas.

## Configuracion Del Backend

Entrar a la carpeta del backend:

```powershell
cd C:\Users\SKAIRLER\Documents\Codex\2026-05-05\gestor-citas-medicas\backend_zip\Backend-main
```

Instalar dependencias:

```powershell
npm install
```

Crear un archivo `.env` tomando como referencia `.env.example`.

Ejemplo para XAMPP/MySQL Workbench con usuario `root` y contrasena `root`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=gestion_citas
```

Si MySQL no tiene contrasena, dejar:

```env
DB_PASSWORD=
```

Iniciar el backend:

```powershell
npm start
```

El backend queda disponible en:

```text
http://localhost:5000
```

## Configuracion Del Frontend

Entrar a la carpeta del frontend:

```powershell
cd C:\Users\SKAIRLER\Documents\Codex\2026-05-05\gestor-citas-medicas\frontend_zip\Frontend-main
```

Instalar dependencias:

```powershell
npm install
```

Iniciar el frontend:

```powershell
npm start
```

La aplicacion normalmente se abre en:

```text
http://localhost:3000
```

Si el puerto `3000` esta ocupado, React puede preguntar si se desea usar otro puerto.

## Ejecucion Local Con XAMPP

1. Abrir XAMPP.
2. Activar MySQL.
3. Abrir MySQL Workbench.
4. Ejecutar `BD_Citas.sql` si la base no existe.
5. Revisar que el archivo `.env` del backend tenga las credenciales correctas.
6. Iniciar el backend con `npm start`.
7. Iniciar el frontend con `npm start`.
8. Abrir `http://localhost:3000`.

## Ejecucion Con Docker

Desde la raiz del proyecto:

```bash
docker compose up --build -d
```

La aplicacion queda disponible en:

```text
http://localhost:3000
```

Para apagar los contenedores:

```bash
docker compose down
```

Para borrar tambien los datos guardados por el volumen de MySQL:

```bash
docker compose down -v
```

Usar `down -v` solo si se desea reiniciar la base de datos desde cero.

## Manual De Usuario

### Registro

1. Abrir la aplicacion.
2. Seleccionar la pestana `Registrarse`.
3. Ingresar usuario, cedula y contrasena.
4. Presionar `Crear cuenta`.
5. Si los datos son validos, el sistema permite iniciar sesion.

### Inicio De Sesion

1. Seleccionar la pestana `Iniciar sesion`.
2. Ingresar usuario y contrasena.
3. Presionar `Entrar`.
4. Si los datos son correctos, se muestra el panel principal.

### Consultar Medicos

Despues de iniciar sesion, el sistema muestra los medicos disponibles y sus especialidades.

### Agendar Cita

1. Seleccionar un medico.
2. Escribir el nombre del paciente.
3. Elegir fecha y hora.
4. Presionar `Confirmar cita`.

Si el medico ya tiene una cita en la misma fecha y hora, el sistema muestra un aviso de horario no disponible.

### Consultar Citas

En la seccion `Citas registradas`, el usuario puede ver sus citas. El sistema permite filtrar por:

- Medico
- Fecha
- Paciente

Cada usuario ve solo las citas asociadas a su cuenta.

### Cancelar Cita

1. Buscar la cita en la tabla.
2. Presionar `Cancelar`.
3. Confirmar la accion.

La cita se elimina del sistema.

## Funcionalidades Principales

- Registro de usuarios.
- Inicio de sesion.
- Validacion de cedula numerica.
- Consulta de medicos disponibles.
- Agendamiento de citas.
- Validacion de horarios ocupados.
- Historial de citas por usuario.
- Filtros de busqueda en citas.
- Cancelacion de citas.
- Ejecucion local con XAMPP.
- Ejecucion con Docker.

## Seguridad Del Proyecto

El proyecto incluye medidas basicas de seguridad:

- Las contrasenas se almacenan como hash, no como texto plano.
- Las consultas SQL usan parametros para reducir el riesgo de inyeccion SQL.
- Los usuarios y cedulas no pueden repetirse en la base de datos.
- Cada cita se relaciona con un usuario mediante `id_usuario`.
- Un usuario solo consulta sus propias citas.
- Una cita solo se elimina si pertenece al usuario activo.
- Las credenciales de conexion se manejan con variables de entorno en `.env`.
- El archivo `.env` no debe subirse a GitHub.

Este nivel de seguridad es adecuado para un proyecto academico. Para una version de produccion se recomienda agregar autenticacion con tokens, uso de bcrypt para contrasenas, roles de usuario y validaciones adicionales.

## Comandos Git Para Personas Nuevas

### Ver En Que Rama Estas

```powershell
git branch
```

La rama marcada con `*` es la rama actual.

### Ver Cambios Pendientes

```powershell
git status
```

Sirve para saber que archivos fueron modificados.

### Traer La Version Mas Reciente De GitHub

```powershell
git pull origin develop
```

Usar este comando antes de empezar a trabajar.

### Preparar Cambios Para Guardarlos

```powershell
git add .
```

Prepara todos los archivos modificados.

Para preparar un archivo especifico:

```powershell
git add src/App.js
```

### Guardar Cambios En Un Commit

```powershell
git commit -m "Descripcion corta del cambio"
```

Ejemplo:

```powershell
git commit -m "Ajustar formulario de citas"
```

### Subir Cambios A GitHub

```powershell
git push origin develop
```

### Ver Historial De Cambios

```powershell
git log --oneline
```

### Crear Una Rama Nueva

```powershell
git checkout -b nombre-de-la-rama
```

Ejemplo:

```powershell
git checkout -b mejora-formulario-citas
```

### Volver A La Rama Develop

```powershell
git checkout develop
```

### Deshacer Cambios De Un Archivo

```powershell
git restore nombre-del-archivo
```

Ejemplo:

```powershell
git restore src/App.js
```

## Flujo Recomendado De Trabajo

```powershell
git checkout develop
git pull origin develop
# hacer cambios en el proyecto
git status
git add .
git commit -m "Explicar el cambio realizado"
git push origin develop
```

Este flujo ayuda a trabajar de forma ordenada y evita perder cambios.
