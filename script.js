/************** Emporio de Películas Tortuga - Fase 1 y Fase 2 ***************/

// Array inicial de películas
const movies = [
  {
    titulo: "Buddy",
    descripcion: "Un grupo de niños se ve atrapado en un programa de televisión infantil presentado por Buddy.",
    anio: 2026,
    urlFoto: "https://m.media-amazon.com/images/M/MV5BMWRkNWJhNjYtY2FkZC00YjFlLWFjMjUtZGFhMjc5MGYyODE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    genero: "terror"
  },
  {
    titulo: "Street Fighter",
    descripcion: "Basada en la saga de videojuegos 'Street Fighter' y ambientada en 1993.",
    anio: 2026,
    urlFoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQxjTOVRmdclq28r3620PfU2lXc6XCOdvT9D-G-VCh2g&s",
    genero: "accion"
  },
  {
    titulo: "IT",
    descripcion: "Cuando empiezan a desaparecer niños en el pueblo de Derry, una pandilla de amigos lidia con un malvado payaso.",
    anio: 2017,
    urlFoto: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhgCOC00zCghuR0rLCWSJ7tQhryRf_dWdC44qypu1NE1ZEDaSoWrlSk2ooOiruO-z9A9LpVKhxt_Yxb3eFBbKIgVdXWiH3i44uPycw5e_2cfqqe1Dh4xL03JfBWtrLaWh3DIP9XmtrMdxti/s1600/IT-POSTER-CARTEL-2017.jpg",
    genero: "terror"
  },
  {
    titulo: "La La Land",
    descripcion: "Un pianista de jazz y una aspirante a actriz se enamoran en Los Ángeles.",
    anio: 2016,
    urlFoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqsawS_-iFGA1VEOyR5qPpqabqxac_LGnV27GgJFFkAesJtugfe4iuAHZX&s=10",
    genero: "romantica"
  }
];

// Función para aplicar filtros combinados (Texto + Género)
function applyFilters() {
  const textQuery = document.getElementById("search-input").value.toLowerCase().trim();
  const genreQuery = document.getElementById("filter-genero").value;

  const filtered = movies.filter(movie => {
    const matchesText = movie.titulo.toLowerCase().includes(textQuery);
    const matchesGenre = (genreQuery === "todos") || (movie.genero === genreQuery);
    return matchesText && matchesGenre;
  });

  renderMovieList(filtered);
}

// Función para renderizar la tabla
function renderMovieList(movieData) {
  const container = document.getElementById("movie-container");
  container.innerHTML = "";

  if (movieData.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #666; padding: 20px;'>No se encontraron películas.</p>";
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
    const realIndex = movies.indexOf(movie); // Índice en el array original

    tableHTML += `
      <tr>
        <td style="text-align: center;"><img src="${movie.urlFoto}" alt="${movie.titulo}" width="100" style="border-radius: 4px;"></td>
        <td><b>${movie.titulo}</b></td>
        <td>${movie.descripcion}</td>
        <td>${movie.anio}</td>
        <td>${movie.genero}</td>
        <td style="text-align: center; white-space: nowrap;">
          <button class="edit-btn" data-index="${realIndex}" style="background-color: #f39c12; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Editar</button>
          <button class="delete-btn" data-index="${realIndex}" style="background-color: #e74c3c; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">Borrar</button>
        </td>
      </tr>
    `;
  });

  tableHTML += `</tbody></table>`;
  container.innerHTML = tableHTML;

  // Asignar eventos de Borrar
  container.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      movies.splice(idx, 1);
      applyFilters();
    });
  });

  // Asignar eventos de Editar (Fase 2)
  container.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      const movie = movies[idx];

      // Cargar los datos en el formulario
      document.getElementById("titulo").value = movie.titulo;
      document.getElementById("descripcion").value = movie.descripcion;
      document.getElementById("anio").value = movie.anio;
      document.getElementById("urlFoto").value = movie.urlFoto;
      document.getElementById("genero").value = movie.genero;

      // Cambiar modo a "Edición"
      document.getElementById("edit-index").value = idx;
      document.getElementById("form-title").textContent = "Editar Película";
      document.getElementById("submit-btn").textContent = "Actualizar Película";
      document.getElementById("cancel-edit-btn").style.display = "inline-block";

      // Desplazar la vista arriba suavemente hacia el formulario
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// Evento de envío del formulario (Añadir o Editar)
document.getElementById("movie-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const editIndex = parseInt(document.getElementById("edit-index").value);
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const anio = parseInt(document.getElementById("anio").value.trim());
  const urlFoto = document.getElementById("urlFoto").value.trim();
  const genero = document.getElementById("genero").value;

  // Validación de año entre 1800 y año actual (2026)
  if (isNaN(anio) || anio < 1800 || anio > 2026 || String(anio).length !== 4) {
    alert("Por favor, introduce un año válido de 4 cifras entre 1800 y 2026.");
    return;
  }

  if (titulo && descripcion && urlFoto && genero) {
    const movieData = { titulo, descripcion, anio, urlFoto, genero };

    if (editIndex === -1) {
      // Modo Agregar
      movies.push(movieData);
    } else {
      // Modo Editar (Fase 2)
      movies[editIndex] = movieData;
      resetFormState();
    }

    applyFilters();
    event.target.reset();
  }
});

// Función para cancelar edición
function resetFormState() {
  document.getElementById("edit-index").value = "-1";
  document.getElementById("form-title").textContent = "Añadir Nueva Película";
  document.getElementById("submit-btn").textContent = "Guardar Película";
  document.getElementById("cancel-edit-btn").style.display = "none";
  document.getElementById("movie-form").reset();
}

document.getElementById("cancel-edit-btn").addEventListener("click", resetFormState);

// Eventos para los filtros (Fase 1 y Fase 2)
document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("filter-genero").addEventListener("change", applyFilters);

// Carga inicial
document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
});