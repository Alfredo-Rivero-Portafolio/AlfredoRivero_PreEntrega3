// Array donde se guardarán los estudiantes
let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

// Si estudiantes no es un array, inicialízalo como un array vacío
if (!Array.isArray(estudiantes)) {
   estudiantes = [];
}

// Función para guardar los datos del formulario
function guardarDatos() {
   let grado = document.querySelector("#grado").value;
   let dni = document.querySelector("#dni").value.trim();
   let nombre = document.querySelector("#nombre").value.trim();
   let apellido = document.querySelector("#apellido").value.trim ();
   let materia = document.querySelector("#materia").value;
   let nota1 = parseInt(document.querySelector("#nota1").value);
   let nota2 = parseInt(document.querySelector("#nota2").value);
   let nota3 = parseInt(document.querySelector("#nota3").value);
   let nota4 = parseInt(document.querySelector("#nota4").value);
   let nota5 = parseInt(document.querySelector("#nota5").value);

   // Verificar que las notas estén en el rango correcto
   if (validarNotas([nota1, nota2, nota3, nota4, nota5])) {

      // Calcular promedio
      let promedio = calcularPromedio(nota1, nota2, nota3, nota4, nota5);

      // Crear objeto estudiante
      let estudiante = {
         grado: grado,
         dni: dni,
         nombre: nombre,
         apellido: apellido,
         materia: materia,
         promedio: promedio,
      };

      // Agregar estudiante al array
      estudiantes.push(estudiante);

      // Converte el array de estudiantes a cadena JSON y guardar en localStorage
      localStorage.setItem("estudiantes", JSON.stringify(estudiantes));

      // Limpiar formulario
      limpiarFormulario();

      // Preguntar si desea agregar otro estudiante
      let agregarOtro = confirm("¿Desea agregar otro estudiante?");
      if (!agregarOtro) {
         mostrarEstudiantes();
      }
   }
}

function limitarCaracteresDni(e) {
   // Reemplazamos cualquier carácter no numérico por una cadena vacía
   e.value = e.value.replace(/\D/g, '');

   // Limitamos la cantidad máxima de caracteres a 8
   if (e.value.length > 8) {
      e.value = e.value.slice(0, 8);
   }
}

// Función para validar que las notas estén en el rango correcto
function validarNotas(notas) {
   for (let i = 0; i < notas.length; i++) {
      if (isNaN(notas[i]) || notas[i] < 0 || notas[i] > 10) {
         return false;
      }
   }
   return true;
}

// Función para calcular el promedio de notas
function calcularPromedio(nota1, nota2, nota3, nota4, nota5) {
   let suma = nota1 + nota2 + nota3 + nota4 + nota5;
   return suma / 5;
}

// Función para limpiar el formulario
function limpiarFormulario() {
   document.querySelector("#formulario").reset();
}

// Función para calcular el estado del estudiante (aprobado o reprobado)
function calcularEstado(promedio) {
   return promedio >= 5 ? "Aprobado" : "Reprobado";
}

// Variable para almacenar los ID de los estudiantes ya mostrados
let estudiantesMostrados = new Set();

// Función para mostrar los estudiantes
function mostrarEstudiantes() {
   let tabla = document.getElementById("tablaEstudiantes");

   // Si la tabla no existe, la creamos
   if (!tabla) {
      tabla = document.createElement("table");
      tabla.setAttribute("id", "tablaEstudiantes");

       // Encabezados de la tabla
      tabla.innerHTML = `
            <tr>
               <th>Grado</th>
               <th>DNI</th>
               <th>Nombre</th>
               <th>Apellido</th>
               <th>Materia</th>
               <th>Promedio</th>
               <th>Estado</th>
            </tr>`;
      
      document.body.appendChild(tabla);
   }
    // Filtramos los estudiantes que aún no han sido mostrados
   let estudiantesNuevos = estudiantes.filter(estudiante => !estudiantesMostrados.has(estudiante.dni));

    // Agregamos los estudiantes nuevos a la tabla
   estudiantesNuevos.forEach(estudiante => {
      let estado = calcularEstado(estudiante.promedio);
      let fila = `
            <tr>
               <td class='celda'>${estudiante.grado} año</td>
               <td class='celda'>${estudiante.dni}</td>
               <td class='celda'>${estudiante.nombre}</td>
               <td class='celda'>${estudiante.apellido}</td>
               <td class='celda'>${estudiante.materia}</td>
               <td class='celda'>${estudiante.promedio.toFixed(1)}</td>
               <td class='celda'>${estado}</td>
            </tr>`;
         tabla.innerHTML += fila;
        // Añadimos el ID del estudiante mostrado al conjunto
      estudiantesMostrados.add(estudiante.dni);
   });
}

function buscarEstudiantePorDNI() {
   // Obtener el DNI ingresado por el usuario
   const dni = document.querySelector("#inputDNI").value;

   // Obtener los datos de estudiantes almacenados en localStorage
   const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

   // Filtrar los estudiantes que coinciden con el DNI ingresado
   const estudiantesFiltrados = estudiantes.filter(estudiante => estudiante.dni === dni);

   // Mostrar los datos de los estudiantes filtrados en una tabla HTML
   if (estudiantesFiltrados.length > 0) {
      mostrarDatosEstudiante(estudiantesFiltrados);
   } else {
      // Mostrar un mensaje si no se encuentra ningún estudiante con ese DNI
      alert("No se encontró ningún estudiante con ese DNI.");
   }
}

// Función para mostrar los datos del estudiante en una tabla HTML
function mostrarDatosEstudiante(estudiantesFiltrados) {
   // Creamos la estructura de la tabla
   const tabla = document.createElement("table");
   tabla.id = "tablaEstudiante";
   const thead = document.createElement("thead");
   thead.innerHTML = `
      <tr>
         <th>Dni</th>
         <th>Nombre</th>
         <th>Apellido</th>
         <th>Materia</th>
         <th>Promedio</th>
      </tr>
   `;
   const tbody = document.createElement("tbody");

   // Iteramos sobre cada estudiante y creamos una fila para cada uno
   estudiantesFiltrados.forEach(estudiante => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
      <td>${estudiante.dni}</td>
      <td>${estudiante.nombre}</td>
      <td>${estudiante.apellido}</td>
      <td>${estudiante.materia}</td>
      <td>${estudiante.promedio}</td>
   `;
      tbody.appendChild(fila);
   });

   // Agregamos la tabla al documento, agregamos el thead y el tbody a la tabla
   tabla.appendChild(thead);
   tabla.appendChild(tbody);
   document.body.appendChild(tabla);
}