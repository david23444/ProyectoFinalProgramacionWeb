/* ==================================================
   main.js - NERV PROYECTO FINAL 100% FUNCIONAL
   ================================================== */

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

  // Registro
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
      } else {
        alert('Completa todos los campos correctamente');
      }
    };
  }

  // Login
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
      } else {
        alert('Email o contraseña incorrectos');
      }
    };
  }

  // Cerrar sesión
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

  // ==================== FILAS POR GÉNERO ====================
  const genres = {
    dramaRow: 18,
    terrorRow: 27,
    accionRow: 28,
    comediaRow: 35
  };

  Object.keys(genres).forEach(rowId => {
    const row = document.getElementById(rowId);
    if (row) {
      fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genres[rowId]}&language=es-ES&page=1`)
        .then(r => r.json())
        .then(d1 => {
          fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genres[rowId]}&language=es-ES&page=2`)
            .then(r => r.json())
            .then(d2 => {
              const allResults = d1.results.concat(d2.results);
              allResults.forEach(peli => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.dataset.movieId = peli.id;
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
        });
    }
  });

  // Botones ← →
  window.scrollRow = function(rowId, amount) {
    const row = document.getElementById(rowId);
    row.scrollLeft += amount;
  };

  // ==================== BUSCADOR POR GÉNERO → REDIRIGE A ARCHIVE ====================
  const genreSelect = document.getElementById('genreSelect');
  if (genreSelect) {
    genreSelect.addEventListener('change', () => {
      const genre = genreSelect.value;
      location.href = genre ? `archive.html?genre=${genre}` : 'archive.html';
    });
  }

  // ==================== ARCHIVE: TODAS O POR GÉNERO ====================
  const urlParams = new URLSearchParams(window.location.search);
  const selectedGenre = urlParams.get('genre');
  const archiveTitle = document.getElementById('archiveTitle');
  const grid = document.getElementById('archiveGrid');

  if (grid) {
    if (archiveTitle) {
      archiveTitle.textContent = selectedGenre ? 'Películas del género seleccionado' : 'Todas las películas';
    }

    const pages = [1, 2, 3];
    pages.forEach(page => {
      const url = selectedGenre
        ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&language=es-ES&page=${page}`
        : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`;

      fetch(url)
        .then(r => r.json())
        .then(data => {
          data.results.forEach(peli => {
            const card = document.createElement('div');
            card.className = 'archive-card';
            card.dataset.movieId = peli.id;
            card.innerHTML = `
              <img src="${POSTER_URL}${peli.poster_path}" alt="${peli.title}">
              <h3>${peli.title}</h3>
              <p>${peli.release_date?.split('-')[0] || 'Sin fecha'}</p>
            `;
            grid.appendChild(card);
          });
        });
    });
  }

  // ==================== MODAL ====================
  function openMovieModal(movieId) {
    fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`)
      .then(r => r.json())
      .then(movie => {
        document.getElementById('modalTitle').textContent = movie.title;
        document.getElementById('modalYear').textContent = movie.release_date?.split('-')[0] || 'Sin fecha';
        document.getElementById('modalSynopsis').textContent = movie.overview || 'Sin sinopsis disponible';

        fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`)
          .then(r => r.json())
          .then(v => {
            const trailer = v.results.find(t => t.type === "Trailer" && t.site === "YouTube");
            const frame = document.getElementById('trailerFrame');
            frame.src = trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0` : "";
          });

        // Reiniciar estrellas
        document.querySelectorAll('#ratingStars span').forEach(star => star.classList.remove('active'));

        document.getElementById('movieModal').classList.add('active');
      });
  }

  // CERRAR MODAL
  document.getElementById('closeModalBtn')?.addEventListener('click', () => {
    document.getElementById('movieModal').classList.remove('active');
    document.getElementById('trailerFrame').src = "";
  });

  // CERRAR AL HACER CLICK FUERA
  document.getElementById('movieModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('movieModal')) {
      document.getElementById('movieModal').classList.remove('active');
      document.getElementById('trailerFrame').src = "";
    }
  });

  // ESTRELLAS
  document.getElementById('ratingStars')?.addEventListener('click', e => {
    if (e.target.tagName === 'SPAN') {
      const val = e.target.dataset.value;
      document.querySelectorAll('#ratingStars span').forEach((s, i) => {
        s.classList.toggle('active', i < val);
      });
      alert(`¡Gracias! Le diste ${val} estrellas a "${document.getElementById('modalTitle').textContent}"`);
    }
  });

  // ABRIR MODAL AL HACER CLICK EN PELÍCULA
  document.addEventListener('click', e => {
    const card = e.target.closest('.movie-card, .archive-card');
    if (card && card.dataset.movieId) {
      openMovieModal(card.dataset.movieId);
    }
  });

  // ==================== MENÚ HAMBURGUESA - FUNCIONA EN MÓVIL AL 100% ====================
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (toggle && nav) {
      e.preventDefault();
      toggle.classList.toggle('active');
      nav.classList.toggle('active');

      if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  });
});