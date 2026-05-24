# Gestor de Citas Medicas - Backend

Este repositorio contiene el backend del sistema de citas medicas. En palabras sencillas: esta es la parte que recibe las peticiones del frontend, habla con MySQL y responde con los datos que la aplicacion necesita.

El backend esta hecho con Node.js, Express y MySQL. Tambien quedo preparado para funcionar de dos maneras:

- Modo local, usando XAMPP/MySQL Workbench.
- Modo Docker, usando las variables que llegan desde `docker-compose.yml`.

## Que Hace Este Backend

El backend funciona como el intermediario entre la pantalla del usuario y la base de datos.

Por ejemplo:

1. El usuario escribe su usuario y contrasena en el frontend.
2. El frontend manda esos datos al backend.
3. El backend revisa en MySQL si ese usuario existe.
4. Si todo esta bien, responde que el inicio de sesion fue correcto.

Lo mismo pasa con las citas:

1. El usuario elige un medico, fecha y hora.
2. El frontend manda esa cita al backend.
3. El backend verifica que ese medico no tenga otra cita en la misma fecha y hora.
4. Si el horario esta libre, guarda la cita en MySQL.

## Tecnologias Usadas

- Node.js: permite ejecutar JavaScript en el servidor.
- Express: permite crear rutas como `/api/auth/login` o `/api/citas/agendar`.
- MySQL: guarda usuarios, medicos y citas.
- mysql2: conecta Node.js con MySQL.
- dotenv: permite leer configuraciones desde `.env`.
- Docker: permite ejecutar el backend dentro de un contenedor.

## Requisitos Previos

Para trabajar sin Docker se necesita:

- Node.js.
- npm.
- XAMPP con MySQL activo.
- MySQL Workbench.
- La base de datos `gestion_citas` creada.

Para trabajar con Docker se necesita:

- Docker Desktop.
- WSL 2 activado en Windows.
- Docker Compose.

## Estructura Del Backend

```text
Backend-main/
  controllers/
    authController.js
    citasController.js
    medicosController.js
  db/
    connection.js
  routes/
    authRoutes.js
    citasRoutes.js
    medicosRoutes.js
  server.js
  package.json
  Dockerfile
  .dockerignore
  .env.example
```

### `server.js`

Es el archivo que prende el servidor. Aqui se cargan Express, CORS, JSON y las rutas principales.

Rutas montadas:

```js
app.use('/api/medicos', medicosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/auth', authRoutes);
```

Eso significa:

- Todo lo de medicos empieza por `/api/medicos`.
- Todo lo de citas empieza por `/api/citas`.
- Todo lo de login y registro empieza por `/api/auth`.

Tambien se usa:

```js
const PORT = process.env.PORT || 5000;
```

Esto permite que el puerto venga desde `.env` o desde Docker. Si no se configura nada, usa `5000`.

### `db/connection.js`

Este archivo conecta el backend con MySQL.

Antes la conexion estaba fija con datos como `root/root`. Ahora usa variables de entorno:

```js
host: process.env.DB_HOST || 'localhost',
user: process.env.DB_USER || 'test',
password: process.env.DB_PASSWORD ?? 'test',
database: process.env.DB_NAME || 'gestion_citas',
port: Number(process.env.DB_PORT || 3306)
```

Esto sirve para que el mismo codigo funcione en dos ambientes:

- En XAMPP puedes usar `root/root`.
- En Docker puedes usar `test/test` y `DB_HOST=db`.

La parte importante es esta:

```js
password: process.env.DB_PASSWORD ?? 'test'
```

Se usa `??` para permitir contrasenas vacias si algun MySQL local no tiene password. Si se usara `||`, una contrasena vacia se reemplazaria por `test`.

### `routes/`

Los archivos de `routes` son como el mapa de entradas del backend.

Ejemplo en citas:

```js
router.post('/agendar', agendarCita);
router.get('/historial/:id_usuario', getTodasCitas);
router.delete('/:id', eliminarCita);
```

Eso significa:

- `POST /api/citas/agendar`: guarda una cita.
- `GET /api/citas/historial/1`: trae las citas del usuario con id 1.
- `DELETE /api/citas/5`: elimina la cita con id 5, si pertenece al usuario activo.

### `controllers/`

Los controladores tienen la logica real.

`authController.js` maneja:

- Registro de usuario.
- Inicio de sesion.
- Validacion de cedula.
- Hash de contrasena.

`citasController.js` maneja:

- Crear citas.
- Validar horarios ocupados.
- Consultar solo las citas del usuario activo.
- Eliminar solo citas que pertenecen al usuario activo.

`medicosController.js` maneja:

- Consulta de medicos disponibles.

## Configuracion De La Base De Datos

La base de datos se llama:

```text
gestion_citas
```

Tablas principales:

- `usuarios`: guarda las cuentas registradas.
- `medicos`: guarda los medicos disponibles.
- `citas`: guarda las citas creadas.

La tabla `citas` ahora tiene una columna importante:

```text
id_usuario
```

Esa columna indica que una cita pertenece a un usuario especifico. Gracias a eso, un usuario solo ve sus propias citas.

La relacion queda asi:

```text
usuarios.id -> citas.id_usuario
medicos.id  -> citas.id_medico
```

Tambien existe esta restriccion:

```sql
UNIQUE KEY uq_medico_fecha_hora (id_medico, fecha, hora)
```

Eso evita que el mismo medico tenga dos citas en la misma fecha y hora.


## Codigo Completo De Base De Datos

Este es el script recomendado para crear la base desde cero sin borrar datos existentes por accidente:

```sql
CREATE DATABASE IF NOT EXISTS gestion_citas;
USE gestion_citas;

CREATE TABLE IF NOT EXISTS medicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL
);

INSERT INTO medicos (id, nombre, especialidad) VALUES
(1, 'Dr. rancho', 'Diagnóstico General'),
(2, 'Dra. manotas', 'Urologia'),
(3, 'Dr. pulgarcito', 'Cirugia')
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    especialidad = VALUES(especialidad);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cedula INT UNSIGNED NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_paciente VARCHAR(100) NOT NULL,
    id_medico INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'Programada',
    UNIQUE KEY uq_medico_fecha_hora (id_medico, fecha, hora),
    CONSTRAINT fk_medico FOREIGN KEY (id_medico) REFERENCES medicos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_usuario_cita FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
```

Explicacion rapida:

- `CREATE DATABASE IF NOT EXISTS`: crea la base solo si no existe. No borra usuarios ni citas.
- `medicos`: guarda los doctores disponibles.
- `usuarios`: guarda las cuentas registradas.
- `citas`: guarda las citas medicas.
- `id_usuario`: permite saber que usuario creo cada cita.
- `id_medico`: permite saber con que medico es la cita.
- `UNIQUE KEY uq_medico_fecha_hora`: evita que un medico tenga dos citas en la misma fecha y hora.
- `FOREIGN KEY`: conecta tablas entre si para mantener datos coherentes.
- `ON DELETE CASCADE`: si se borra un usuario, tambien se borran sus citas asociadas.

Si la base ya existia y solo falta agregar `id_usuario` a `citas`, se puede usar esta migracion:

```sql
USE gestion_citas;

ALTER TABLE citas
ADD COLUMN id_usuario INT NULL AFTER id_medico;

ALTER TABLE citas
ADD CONSTRAINT fk_usuario_cita
FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
ON DELETE CASCADE ON UPDATE CASCADE;
```

Importante: no uses `DROP DATABASE` si quieres conservar usuarios y citas.

## Instalacion Del Backend

Abrir una terminal en la carpeta del backend:

```powershell
cd C:\Users\SKAIRLER\Documents\Codex\2026-05-05\gestor-citas-medicas\backend_zip\Backend-main
npm install
```

Crear un archivo `.env` usando como guia `.env.example`.

Para tu caso local con XAMPP/MySQL Workbench:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=gestion_citas
```

Si tu MySQL no usa contrasena, entonces seria:

```env
DB_PASSWORD=
```

## Ejecucion Del Backend

Con MySQL activo en XAMPP, ejecutar:

```powershell
npm start
```

Si todo esta bien, la terminal muestra:

```text
Servidor corriendo en http://localhost:5000
```

Puedes probar en el navegador:

```text
http://localhost:5000
```

## Uso Con Docker

Este backend tiene un `Dockerfile` para construir una imagen de Node.js.

El Dockerfile hace esto:

1. Usa Node.js 20 en una imagen liviana.
2. Copia `package.json`.
3. Instala dependencias.
4. Copia el codigo.
5. Expone el puerto `5000`.
6. Ejecuta `npm start`.

Cuando se usa Docker Compose, no se usa el `.env` local. Docker le pasa sus propias variables al backend:

```yaml
DB_HOST: db
DB_USER: test
DB_PASSWORD: test
DB_NAME: gestion_citas
```

`DB_HOST=db` significa que el backend busca MySQL dentro de la red de Docker, no en XAMPP.

## Manual De Usuario

Aunque este repositorio es el backend, estas son las acciones que permite desde el sistema completo.

### Registro

1. El usuario entra al frontend.
2. Selecciona `Registrarse`.
3. Ingresa usuario, cedula y contrasena.
4. El frontend envia los datos a `POST /api/auth/registro`.
5. El backend guarda el usuario en MySQL.

### Inicio De Sesion

1. El usuario escribe usuario y contrasena.
2. El frontend envia los datos a `POST /api/auth/login`.
3. El backend convierte la contrasena a hash y la compara con la guardada.
4. Si coincide, responde con los datos basicos del usuario.

### Agendar Una Cita

1. El usuario ya debe haber iniciado sesion.
2. Elige un medico.
3. Elige fecha y hora.
4. El frontend envia la cita a `POST /api/citas/agendar`.
5. El backend valida que el horario no este ocupado para ese medico.
6. Si esta disponible, guarda la cita con `id_usuario`.

### Consultar Citas

El backend usa:

```text
GET /api/citas/historial/:id_usuario
```

Asi cada usuario consulta solamente sus propias citas.

### Cancelar Una Cita

El frontend manda el id de la cita y el id del usuario. El backend elimina la cita solo si pertenece a ese usuario.

## Funcionalidades Principales

- Registro de usuarios.
- Inicio de sesion.
- Validacion de cedula numerica de maximo 10 digitos.
- Conexion configurable a MySQL con `.env`.
- Consulta de medicos disponibles.
- Agendamiento de citas medicas.
- Validacion de horarios ocupados por medico.
- Historial de citas separado por usuario.
- Eliminacion de citas protegida por usuario.
- Compatibilidad con ejecucion local usando XAMPP.
- Compatibilidad con Docker.

## Explicacion De Seguridad Del Proyecto

La seguridad del proyecto tiene varias capas simples.

### 1. Contrasenas Con Hash

Cuando un usuario se registra, el backend no guarda la contrasena tal como la escribio. Primero la convierte usando SHA-256:

```js
crypto.createHash('sha256').update(password).digest('hex')
```

Eso significa que si alguien mira la tabla `usuarios`, no vera la contrasena original, sino una version transformada.

Importante: para un proyecto academico esta bien, pero en proyectos reales se recomienda usar `bcrypt`, porque agrega sal y es mas fuerte contra ataques.

### 2. Consultas Parametrizadas

El backend usa consultas con `?`:

```js
'INSERT INTO usuarios (usuario, password, cedula) VALUES (?, ?, ?)'
```

Eso ayuda a evitar inyeccion SQL, porque los datos del usuario no se pegan directamente al texto SQL.

### 3. Citas Separadas Por Usuario

Antes cualquier usuario podia ver todas las citas. Ahora cada cita guarda `id_usuario`, y el historial filtra por ese usuario.

Esto protege la privacidad basica del sistema.

### 4. Eliminacion Protegida

Para eliminar una cita, el backend no borra solo por `id`. Borra por `id` y `id_usuario`:

```sql
DELETE FROM citas WHERE id = ? AND id_usuario = ?
```

Asi un usuario no deberia poder eliminar citas de otro usuario.

### 5. Variables De Entorno

Los datos de conexion no deben estar quemados directamente en el codigo. Por eso se usa `.env`.

El archivo `.env` no debe subirse a GitHub. Solo se sube `.env.example`, que sirve como plantilla.

## Cosas Que Todavia Se Podrian Mejorar

Para una version mas profesional se podria agregar:

- bcrypt para contrasenas.
- Tokens JWT para sesiones reales.
- Middleware de autenticacion en backend.
- Validacion mas fuerte de fechas y horas.
- Roles de usuario, por ejemplo paciente y administrador.
- Mensajes de error mas especificos.
- Tests automatizados.

## Guia Rapida Para Hacer Cambios

Si quieres cambiar algo del login, revisa:

```text
controllers/authController.js
routes/authRoutes.js
```

Si quieres cambiar algo de citas, revisa:

```text
controllers/citasController.js
routes/citasRoutes.js
```

Si quieres cambiar la conexion a MySQL, revisa:

```text
db/connection.js
.env
```

Si quieres cambiar el puerto o rutas generales, revisa:

```text
server.js
```

## Ramas De Git

Estas trabajando en la rama:

```text
develop
```

Una rama es como una linea de trabajo. Puedes imaginarlo asi:

- `main`: version principal o estable.
- `develop`: version donde se agregan cambios antes de pasarlos a main.
- una rama nueva: un espacio para probar un cambio sin ensuciar develop.

Ejemplo:

```powershell
git checkout -b mejora-backend
```

Eso crea una rama llamada `mejora-backend` y te mueve a ella.

## Comandos Git Utiles Para Este Proyecto

Ver en que rama estas:

```powershell
git branch
```

Ver cambios pendientes:

```powershell
git status
```

Ver que cambiaste dentro de los archivos:

```powershell
git diff
```

Traer cambios desde GitHub:

```powershell
git pull origin develop
```

Preparar todos los archivos modificados:

```powershell
git add .
```

Preparar solo un archivo:

```powershell
git add controllers/citasController.js
```

Crear commit:

```powershell
git commit -m "Describe el cambio"
```

Subir cambios a GitHub:

```powershell
git push origin develop
```

Crear una rama nueva:

```powershell
git checkout -b nombre-de-la-rama
```

Cambiar a develop:

```powershell
git checkout develop
```

Ver historial de commits:

```powershell
git log --oneline
```

Descartar cambios de un archivo especifico:

```powershell
git restore controllers/citasController.js
```

Ver remotos configurados:

```powershell
git remote -v
```

## Flujo Recomendado Para Hacer Cambios

1. Entrar al repo.
2. Asegurarte de estar en `develop`.
3. Traer lo ultimo de GitHub.
4. Hacer cambios.
5. Probar el backend.
6. Revisar `git status`.
7. Hacer commit.
8. Subir a GitHub.

Comandos:

```powershell
git checkout develop
git pull origin develop
# hacer cambios
git status
git add .
git commit -m "Explica que cambiaste"
git push origin develop
```
