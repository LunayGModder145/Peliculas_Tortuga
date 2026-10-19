// Array principal con el catálogo de películas precargadas
const movies = [
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
    urlFoto: "https://m.media-amazon.com/images/I/5135YTHG01L._AC_.jpg",
    genero: "comedia"
  }
];

// Aplica los filtros combinados de texto y género (blindado con toLowerCase)
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

// Renderiza la tabla de películas en el DOM sin estilos inline
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

  // Asignar eventos de borrado
  container.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      movies.splice(idx, 1);
      applyFilters();
    });
  });

  // Asignar eventos de edición
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

// Manejo del formulario (Crear / Actualizar)
document.getElementById("movie-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const editIndex = parseInt(document.getElementById("edit-index").value);
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const año = parseInt(document.getElementById("año").value.trim());
  const urlFoto = document.getElementById("urlFoto").value.trim();
  const genero = document.getElementById("genero").value;

  if (isNaN(año) || año < 1800 || año > 2026 || String(año).length !== 4) {
    alert("Por favor, introduce un año válido de 4 cifras entre 1800 y 2026.");
    return;
  }

  if (titulo && descripcion && urlFoto && genero) {
    const movieData = { titulo, descripcion, año, urlFoto, genero };

    if (editIndex === -1) {
      movies.push(movieData);
    } else {
      movies[editIndex] = movieData;
      resetFormState();
    }

    applyFilters();
    event.target.reset();
  }
});

// Restablecer estado del formulario
function resetFormState() {
  document.getElementById("edit-index").value = "-1";
  document.getElementById("form-title").textContent = "Añadir Nueva Película";
  document.getElementById("submit-btn").textContent = "Guardar Película";
  document.getElementById("cancel-edit-btn").classList.remove("active");
  document.getElementById("movie-form").reset();
}

document.getElementById("cancel-edit-btn").addEventListener("click", resetFormState);

// Escuchadores de filtros
document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("filter-genero").addEventListener("change", applyFilters);

// Carga inicial
document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
});