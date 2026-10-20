// Catálogo inicial de películas precargadas 
// Se usó let en vez de const por cuestion de flexibilidad respecto a reasignación.
// Al iniciar, intenta cargar desde el localStorage; si está vacío, usa el catálogo por defecto
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

// Guarda el estado actual del array de películas en el almacenamiento local del navegador
function saveMovies() {
  localStorage.setItem("movies", JSON.stringify(movies));
}

// Cruza en tiempo real el texto de búsqueda y el género seleccionado del desplegable
function applyFilters() {
  const textQuery = document.getElementById("search-input").value.toLowerCase().trim();
  const genreQuery = document.getElementById("filter-genero").value.toLowerCase();

  const filtered = movies.filter(movie => {  // Filtra el catálogo de forma combinada (por título y género) en tiempo real
    const matchesText = movie.titulo.toLowerCase().includes(textQuery);
    const matchesGenre = (genreQuery === "todos") || (movie.genero.toLowerCase() === genreQuery);
    return matchesText && matchesGenre;
  });

  renderMovieList(filtered);
}

// Esto renderiza dinámicamente la tabla HTML con las películas filtradas o muestra un mensaje vacío
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

  // Asigna el evento de escucha para eliminar la película del array global y actualizar la vista
  container.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      movies.splice(idx, 1);
      saveMovies();
      applyFilters();
    });
  });

  // Asigna el evento de escucha para cargar los datos de la película en el formulario y activar el modo edición
  // En otras palabras, esto rellena el formulario automáticamente.
  container.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      const movie = movies[idx];

      document.getElementById("titulo").value = movie.titulo;
      document.getElementById("descripcion").value = movie.descripcion;
      document.getElementById("año").value = movie.año;
      document.getElementById("urlFoto").value = movie.urlFoto;
      document.getElementById("genero").value = movie.genero;

      document.getElementById("edit-index").value = idx; // Esto guarda el indice oculto
      document.getElementById("form-title").textContent = "Editar Película";
      document.getElementById("submit-btn").textContent = "Actualizar Película";
      document.getElementById("cancel-edit-btn").classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// Maneja el evento de envío del formulario para capturar los valores y procesar la actualización de una película
document.getElementById("movie-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const editIndex = parseInt(document.getElementById("edit-index").value);
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const año = parseInt(document.getElementById("año").value.trim());
  const urlFoto = document.getElementById("urlFoto").value.trim();
  const genero = document.getElementById("genero").value;

  // Valida que el año introducido cumpla con la regla de negocio (número de 4 cifras entre 1800 y 2026)
  if (isNaN(año) || año < 1800 || año > 2026 || String(año).length !== 4) {
    alert("Por favor, introduce un año válido de 4 cifras entre 1800 y 2026.");
    return;
  }

  // Comprueba que los campos estén completos y decide si añade un registro nuevo o actualiza uno existente
  if (titulo && descripcion && urlFoto && genero) {
    const movieData = { titulo, descripcion, año, urlFoto, genero };

    if (editIndex === -1) {
      movies.push(movieData);
    } else {
      movies[editIndex] = movieData;
      resetFormState();
    }

    saveMovies();
    applyFilters();
    event.target.reset();
  }
});

// Restablece el formulario a su estado original para modo creación y oculta el botón de cancelar edición
function resetFormState() {
  document.getElementById("edit-index").value = "-1";
  document.getElementById("form-title").textContent = "Añadir Nueva Película";
  document.getElementById("submit-btn").textContent = "Guardar Película";
  document.getElementById("cancel-edit-btn").classList.remove("active");
  document.getElementById("movie-form").reset();
}

document.getElementById("cancel-edit-btn").addEventListener("click", resetFormState);

document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("filter-genero").addEventListener("change", applyFilters);

document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
});

