# NERV - Reseñas de cine con alma  
**Proyecto Final - Programación Web**  
**Alumno:** Jhoel David Barrionuevo Mamani  
**Fecha:** 8 Diciembre 2025  

---

### DESCRIPCIÓN DEL PROYECTO
NERV es una plataforma web estilo Netflix desarrollada 100% con **HTML, CSS y JavaScript** (sin frameworks ni librerías externas).  
Permite explorar películas reales usando la API oficial de **The Movie Database (TMDb)**, ver trailers, leer sinopsis y calificar con estrellas.

---

### MANUAL DE USUARIO 
1. **Inicio** → Carrusel con películas destacadas + 4 filas por género (Drama, Terror, Acción, Comedia)  
2. Haz click en cualquier película → se abre un modal con:
   - Trailer oficial de YouTube (reproduce automáticamente)
   - Título, año y sinopsis
   - 5 estrellas para calificar (se guarda tu voto visualmente)
3. **Archive** → Todas las películas populares 
4. **Login / Registro** → Crea cuenta o inicia sesión → el botón cambia a "Hola, [Tunombre]"
5. **Responsive** → Funciona perfecto en móvil, tablet y escritorio
6. **Menú hamburguesa** en móvil

---

### MANUAL TÉCNICO 

#### Tecnologías usadas
- HTML semántico
- CSS con Flexbox, Grid y media queries
- JavaScript 
- API externa: [The Movie Database (TMDb)](https://www.themoviedb.org/)
- Almacenamiento local: `localStorage`

#### Características técnicas implementadas
- Consumo de API REST con `fetch`
- Manipulación intensiva del DOM
- Eventos delegados y reutilización de código
- Sistema de login persistente sin backend
- Modal interactivo con trailer embebido
- Calificación con estrellas (estado local por sesión)
- Scroll horizontal con botones ← →
- Diseño responsive completo
- Optimización de imágenes (carga dinámica desde API)

#### Estructura de carpetas
nerv-cine/
├── index.html
├── archive.html
├── about.html
├── login.html
├── signup.html
├── assets/
│   ├── css/main.css
│   └── js/main.js
└── images/
└── (logo + favicon)


#### API utilizada
- Base URL: `https://api.themoviedb.org/3`
- Endpoints principales:
  - `/movie/popular` → carrusel y archive
  - `/discover/movie?with_genres=` → filas por género
  - `/movie/{id}` → detalles
  - `/movie/{id}/videos` → trailer oficial

---

### DEMO EN VIVO
[https://david23444.github.io/ProyectoFinalProgramacionWeb/archive.html?genre=28]

---

Hecho con pasión por el cine y el código  