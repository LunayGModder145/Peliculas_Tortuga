/**
 * =================================================================use
 * 1. ESTADO GLOBAL Y PERSISTENCIA (LOCALSTORAGE)
 * =================================================================
 */

// Intenta cargar las películas desde el almacenamiento local; si está vacío, utiliza el catálogo inicial por defecto
let movies = JSON.parse(localStorage.getItem("movies")) || [
  {
    titulo: "Buddy",
    descripcion: "Un grupo de niños se ve atrapado en un programa de televisión infantil presentado por Buddy.",
    año: 2026,
    urlFoto: "https://m.media-amazon.com/images/M/MV5BMWRkNWJhNjYtY2FkZC00YjFlLWFjMjUtZGFhMjc5MGYyODE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    genero: "terror"
  },
  {
    titulo: "Street Fighter",
    descripcion: "Basada en la saga de videojuegos 'Street Fighter' y ambientada en 1993.",
    año: 2026,
    urlFoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQxjTOVRmdclq28r3620PfU2lXc6XCOdvT9D-G-VCh2g&s",
    genero: "accion"
  },
  {
    titulo: "IT",
    descripcion: "Cuando empiezan a desaparecer niños en el pueblo de Derry, una pandilla de amigos lidia con un malvado payaso.",
    año: 2017,
    urlFoto: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhgCOC00zCghuR0rLCWSJ7tQhryRf_dWdC44qypu1NE1ZEDaSoWrlSk2ooOiruO-z9A9LpVKhxt_Yxb3eFBbKIgVdXWiH3i44uPycw5e_2cfqqe1Dh4xL03JfBWtrLaWh3DIP9XmtrMdxti/s1600/IT-POSTER-CARTEL-2017.jpg",
    genero: "terror"
  },
  {
    titulo: "La La Land",
    descripcion: "Un pianista de jazz y una aspirante a actriz se enamoran en Los Ángeles mientras persiguen sus sueños.",
    año: 2016,
    urlFoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqsawS_-iFGA1VEOyR5qPpqabqxac_LGnV27GgJFFkAesJtugfe4iuAHZX&s=10",
    genero: "romantica"
  },
  {
    titulo: "Superbad",
    descripcion: "Dos estudiantes de instituto co-dependientes se enfrentan a la ansiedad por la separación mientras intentan organizar una fiesta.",
    año: 2007,
    urlFoto: "https://m.media-amazon.com/images/M/MV5BMTc0NjIyMjA2OF5BMl5BanBnXkFtZTcwMzIxNDE1MQ@@._V1_FMjpg_UX1000_.jpg",
    genero: "comedia"
  },
  {
    titulo: "La Máscara",
    descripcion: "Un tímido empleado de banco encuentra una máscara antigua que lo transforma en un extravagante maníaco con superpoderes.",
    año: 1994,
    urlFoto: "https://es.web.img3.acsta.net/pictures/14/02/07/13/46/596218.jpg",
    genero: "comedia"
  }
];

/**
 * Serializa y guarda el array actual de películas en el localStorage del navegador.
 */
function saveMovies() {
  localStorage.setItem("movies", JSON.stringify(movies));
}

/**
 * =================================================================
 * 2. GESTIÓN DE FILTROS Y BÚSQUEDA
 * =================================================================
 */

/**
 * Cruza en tiempo real el texto de búsqueda y el género seleccionado del desplegable.
 */
function applyFilters() {
  const textQuery = document.getElementById("search-input").value.toLowerCase().trim();
  const genreQuery = document.getElementById("filter-genero").value.toLowerCase();

  const filtered = movies.filter(movie => {
    const matchesText = movie.titulo.toLowerCase().includes(textQuery);
    const matchesGenre = (genreQuery === "todos") || (movie.genero.toLowerCase() === genreQuery);
    return matchesText && matchesGenre;
  });

  renderMovieList(filtered);
}

/**
 * =================================================================
 * 3. RENDERIZADO Y MANIPULACIÓN DEL DOM (TABLA Y ACCIONES)
 * =================================================================
 */

/**
 * Renderiza dinámicamente la tabla HTML con las películas filtradas o muestra un mensaje vacío.
 * @param {Array} movieData - Lista de películas a mostrar.
 */
function renderMovieList(movieData) {
  const container = document.getElementById("movie-container");
  container.innerHTML = "";

  if (movieData.length === 0) {
    container.innerHTML = "<p class='empty-msg'>No se encontraron películas.</p>";
    return;
  }

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Foto</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Año</th>
          <th>Género</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  `;

  movieData.forEach((movie) => {
    // Mapea el índice exacto en el array global (evita desajustes al estar la tabla filtrada)
    const realIndex = movies.indexOf(movie);

    tableHTML += `
      <tr>
        <td class="poster-cell"><img src="${movie.urlFoto}" alt="${movie.titulo}" class="movie-poster"></td>
        <td><b>${movie.titulo}</b></td>
        <td>${movie.descripcion}</td>
        <td>${movie.año}</td>
        <td>${movie.genero}</td>
        <td class="actions-cell">
          <button class="edit-btn" data-index="${realIndex}">Editar</button>
          <button class="delete-btn" data-index="${realIndex}">Borrar</button>
        </td>
      </tr>
    `;
  });

  tableHTML += `</tbody></table>`;
  container.innerHTML = tableHTML;

         // EVENTOS:
  // --- BORRAR PELÍCULA ---
  container.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      
      // Ventana emergente de confirmación antes de eliminar el registro
      if (confirm("¿Estás seguro de que deseas eliminar esta película?")) {
        movies.splice(idx, 1);
        saveMovies();
        applyFilters();
      }
    });
  });

  // --- EDITAR PELÍCULA (Cargar datos en el formulario) ---
  container.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      const movie = movies[idx];

      document.getElementById("titulo").value = movie.titulo;
      document.getElementById("descripcion").value = movie.descripcion;
      document.getElementById("año").value = movie.año;
      document.getElementById("urlFoto").value = movie.urlFoto;
      document.getElementById("genero").value = movie.genero;

      document.getElementById("edit-index").value = idx;
      document.getElementById("form-title").textContent = "Editar Película";
      document.getElementById("submit-btn").textContent = "Actualizar Película";
      document.getElementById("cancel-edit-btn").classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

/**
 * =================================================================
 * 4. MANEJO DEL FORMULARIO (ALTA Y ACTUALIZACIÓN)
 * =================================================================
 */

/**
 * Restablece el formulario a su estado original (modo creación) y oculta el botón de cancelar.
 */
function resetFormState() {
  document.getElementById("edit-index").value = "-1";
  document.getElementById("form-title").textContent = "Añadir Nueva Película";
  document.getElementById("submit-btn").textContent = "Guardar Película";
  document.getElementById("cancel-edit-btn").classList.remove("active");
  document.getElementById("movie-form").reset();
}

// Evento de envío del formulario (gestiona tanto altas como actualizaciones)
document.getElementById("movie-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const editIndex = parseInt(document.getElementById("edit-index").value);
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const año = parseInt(document.getElementById("año").value.trim());
  const urlFoto = document.getElementById("urlFoto").value.trim();
  const genero = document.getElementById("genero").value;

  // Validación de la regla de negocio para el año (número de 4 cifras entre 1800 y 2026)
  if (isNaN(año) || año < 1800 || año > 2026 || String(año).length !== 4) {
    alert("Por favor, introduce un año válido de 4 cifras entre 1800 y 2026.");
    return;
  }

  // Comprueba que los campos obligatorios estén completos
  if (titulo && descripcion && urlFoto && genero) {
    const movieData = { titulo, descripcion, año, urlFoto, genero };

    if (editIndex === -1) {
      // Caso: Añadir nueva película
      movies.push(movieData);
    } else {
      // Caso: Actualizar película existente
      movies[editIndex] = movieData;
      resetFormState();
    }

    saveMovies();
    applyFilters();
    event.target.reset();
  }
});

// Botón para cancelar el modo edición
document.getElementById("cancel-edit-btn").addEventListener("click", resetFormState);

/**
 * =================================================================
 * 5. INICIALIZACIÓN Y ESCUCHAS DE EVENTOS GLOBALES
 * =================================================================
 */

document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("filter-genero").addEventListener("change", applyFilters);

// Renderiza la tabla inicial al cargar completamente el DOM de la página
document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
});