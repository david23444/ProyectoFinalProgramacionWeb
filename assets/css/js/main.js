document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = '6ca5a9c3f0e36d059e867cbe3b411d17';
  const BASE_URL = 'https://api.themoviedb.org/3';
  const POSTER_URL = 'https://image.tmdb.org/t/p/w780';

  // ==================== LOGIN Y BOTÓN ====================
  const loginBtn = document.getElementById('loginBtn');
  if (localStorage.getItem('usuarioLogueado') && loginBtn) {
    const user = JSON.parse(localStorage.getItem('usuarioLogueado'));
    loginBtn.innerHTML = `Hola, ${user.nombre.split(' ')[0]} <span id="logout">(salir)</span>`;
    loginBtn.href = "#";
    loginBtn.style.background = "#00ff9d";
    loginBtn.style.color = "#000";
  }

  if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').onsubmit = e => {
      e.preventDefault();
      const nombre = e.target[0].value.trim();
      const email = e.target[1].value.trim();
      const password = e.target[2].value;
      if (nombre && email && password.length >= 6) {
        localStorage.setItem('usuarioRegistrado', JSON.stringify({nombre, email, password}));
        alert('¡Registrado con éxito!');
        location.href = 'login.html';
      } else alert('Completa bien los campos');
    };
  }

  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').onsubmit = e => {
      e.preventDefault();
      const email = e.target[0].value.trim();
      const password = e.target[1].value;
      const user = JSON.parse(localStorage.getItem('usuarioRegistrado') || '{}');
      if (user.email === email && user.password === password) {
        localStorage.setItem('usuarioLogueado', JSON.stringify(user));
        alert(`¡Bienvenido, ${user.nombre}!`);
        location.href = 'index.html';
      } else alert('Datos incorrectos');
    };
  }

  document.addEventListener('click', e => {
    if (e.target && e.target.id === 'logout') {
      localStorage.removeItem('usuarioLogueado');
      location.reload();
    }
  });

  // ==================== CARRUSEL PRINCIPAL ====================
  const carousel = document.getElementById('carousel');
  const dots = document.getElementById('dots');
  if (carousel && dots) {
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`)
      .then(r => r.json())
      .then(d => {
        d.results.slice(0, 3).forEach((peli, i) => {
          const slide = document.createElement('div');
          slide.className = 'carousel-slide';
          slide.innerHTML = `
            <img src="${POSTER_URL}${peli.poster_path}" alt="${peli.title}">
            <div class="carousel-overlay">
              <h2>${peli.title}</h2>
              <p>${peli.release_date?.split('-')[0] || 'Próximamente'}</p>
              <a href="#" class="btn">Ver detalles</a>
            </div>
          `;
          carousel.appendChild(slide);

          const dot = document.createElement('div');
          dot.className = 'dot';
          if (i === 0) dot.classList.add('active');
          dot.onclick = () => {
            carousel.style.transform = `translateX(-${i * 100}%)`;
            document.querySelectorAll('.dot').forEach((d, j) => d.classList.toggle('active', j === i));
          };
          dots.appendChild(dot);
        });

        let current = 0;
        setInterval(() => {
          current = (current + 1) % 3;
          carousel.style.transform = `translateX(-${current * 100}%)`;
          document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
        }, 5000);
      });
  }

  // ==================== FILAS POR GÉNERO CON BOTONES ← → ====================
  const genres = {
    dramaRow: 18,
    terrorRow: 27,
    accionRow: 28,
    comediaRow: 35
  };

  Object.keys(genres).forEach(rowId => {
    const row = document.getElementById(rowId);
    if (row) {
      fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genres[rowId]}&language=es-ES`)
        .then(r => r.json())
        .then(d => {
          d.results.slice(0, 15).forEach(peli => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
              <img src="${POSTER_URL}${peli.poster_path}" alt="${peli.title}">
              <div class="movie-info">
                <h3>${peli.title}</h3>
                <p>${peli.release_date?.split('-')[0] || 'Próximamente'}</p>
              </div>
            `;
            row.appendChild(card);
          });
        });
    }
  });

  // ==================== FUNCIÓN PARA BOTONES ← → ====================
  window.scrollRow = function(rowId, amount) {
    const row = document.getElementById(rowId);
    row.scrollLeft += amount;
  };

  // ==================== ARCHIVE (30+ películas) ====================
  const grid = document.getElementById('archiveGrid');
  if (grid) {
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`)
      .then(r => r.json())
      .then(d => {
        d.results.forEach(peli => {
          const card = document.createElement('div');
          card.className = 'archive-card';
          card.innerHTML = `
            <img src="${POSTER_URL}${peli.poster_path}" alt="${peli.title}">
            <h3>${peli.title}</h3>
            <p>${peli.release_date?.split('-')[0] || 'Sin fecha'}</p>
          `;
          grid.appendChild(card);
        });
      });
  }

  // ==================== MENÚ HAMBURGUESA ====================
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.onclick = () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    };
  }
});