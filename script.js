/*
   =================================================================use
   1. ESTADO GLOBAL Y PERSISTENCIA 
   =================================================================
 */

/* Intenta cargar las películas desde el almacenamiento local; si está vacío, utiliza el catálogo inicial por defecto
   Por cuestiones de flexibilidad, usamos let en vez de const para el array de películas. De esta forma permitiendo la reasignacion
   total de la variable en memoria (Si acaso necesitamos reasignarla por completo para iniciarla con el LocalStorage) */

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

/*
   Esta función guarda el array actual de películas en el localStorage del navegador:
 */
function saveMovies() {
  localStorage.setItem("movies", JSON.stringify(movies));
}

/*
   =================================================================
   2. GESTIÓN DE FILTROS Y BÚSQUEDA
   =================================================================
 */

/*
   Cruza en tiempo real el texto de búsqueda y el género seleccionado del desplegable.
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

/*
   =================================================================
   3. RENDERIZADO Y MANIPULACIÓN DEL DOM (TABLA Y ACCIONES)
   =================================================================
 */

/*
   Renderiza dinámicamente la tabla HTML con las películas filtradas o muestra un mensaje vacío.
   @param {Array} movieData - Esto quiere decir la lista de películas a mostrar.
 
  "@param" le indica al editor de codigo que la función renderMovieList espera si o si un array (siendo de la lista de Películas)
 */

function renderMovieList(movieData) {
  const container = document.getElementById("movie-container");
  container.innerHTML = "";

 // Esto funciona de esta forma: Si escribes algo que NO se ubica ni en el array por defecto ni lo añadiste tú:
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
        <td>${formatGenre(movie.genero)}</td>     
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

/*
 * Formatea el texto del género para mostrarlo con mayúscula y tilde en la interfaz.
(Fué imposible el que en la seccion de generos de la web las primeras letras quedaran en mayus, así que fue necesario este codigo) */
function formatGenre(genre) {
  const genreMap = {
    accion: "Acción",
    terror: "Terror",
    comedia: "Comedia",
    romantica: "Romántica"
  };
  return genreMap[genre] || genre;
}

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

/* 
   =================================================================
   4. MANEJO DEL FORMULARIO (ALTA Y ACTUALIZACIÓN)
   =================================================================
 */

/* 
   Restablece el formulario a su estado original (modo creación) y oculta el botón de cancelar.
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

/*
   =================================================================
   5. INICIALIZACIÓN Y ESCUCHAS DE EVENTOS GLOBALES
   =================================================================
 */

document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("filter-genero").addEventListener("change", applyFilters);

// Renderiza la tabla inicial al cargar completamente el DOM de la página
document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
});

  
/* RESUMEN TÉCNICO:
 
 1. ¿Qué es un array en esta web?
    - Es la lista ordenada de elementos (siendo la variable global 'movies').
    - Almacena objetos JavaScript que representan cada película con sus propiedades:
      { titulo, descripcion, año, urlFoto, genero }.
    - Lo usamos para recorrer los datos con métodos como .filter(), añadir elementos con
      .push(), eliminarlos con .splice() según su índice, y sincronizarlos con 
     el almacenamiento local mediante JSON.stringify().
  
 2. ¿Cómo está estructurado el formulario?
    - Cuenta con un campo oculto ('edit-index') cuyo valor por defecto es "-1" (modo creación).
      Si toma un valor numérico de índice, indica que estamos editando un registro existente.
    - Contiene inputs de texto y numéricos para el título, descripción, año y URL de la foto,
      además de un selector (<select>) controlado para el género.
    - Posee dos botones principales: el de envío dinámico ("Guardar" o "Actualizar Película")
      y el botón de cancelar edición, que solo se activa mediante la clase ".active".
 
 3. ¿Cúal es el flujo al clickear "Guardar Pelicula"?
    - Se intercepta el evento submit predeterminado con event.preventDefault().
    - Se leen y limpian los valores de los inputs, validando reglas de negocio (ej. el año).
    - Se empaquetan los datos en un objeto y se evalúa el 'edit-index':
        * Si es -1: Se añade al final del array con movies.push().
        * Si es distinto de -1: Se sobrescribe la posición exacta movies[editIndex].
    - Se llama a saveMovies() para actualizar el localStorage y a applyFilters() 
      para redibujar la tabla de forma inmediata y reflejar los cambios en pantalla.
 
 4. ¿Cómo funciona el LocalStorage?
    - Es una API que permite guardar datos en el navegador del usuario 
      de forma persistente para que los datos no se borran así se cierre o recargue la pestaña).
    - Como el localStorage solo guarda cadenas de texto (strings), utilizamos dos métodos clave:
        * JSON.stringify(movies): Este convierte el array de objetos de JavaScript a formato texto 
          antes de guardarlo.
        * JSON.parse(...): Convierte de nuevo ese texto almacenado en un array de objetos 
          legible para JavaScript al iniciar la aplicación.
 
 5. ¿Como funciona el sistema de películas y su flujo de datos?
    - Estado Global: El "let movies" Mantiene la lista de películas activa en la memoria de la aplicación.
    - Cada vez que se añade, edita o borra una película, se invoca 
      inmediatamente la función saveMovies() para actualizar el localStorage.
    - Renderizado dinámico (renderMovieList): Toma el array (ya sea completo o filtrado por 
      la barra de búsqueda y el selector de género) y reconstruye por completo la estructura 
      HTML de la tabla en tiempo real.
  
 6. ¿Por qué usamos 'let' en vez de 'const' para el array de películas?
  
  - Reasignación total: 'let' permite que la variable 'movies' pueda ser reasignada 
    por completo si fuera necesario (por ejemplo, al inicializarla con los datos 
    del localStorage o establecer un array vacío/alternativo).
  - Aunque 'const' permite modificar el contenido interno de un array (como añadir 
    o borrar elementos con .push() o .splice()), 'let' nos otorga la flexibilidad 
    de cambiar la referencia completa de la variable en memoria si el flujo de la 
    aplicación lo requiere. */
  
 
 