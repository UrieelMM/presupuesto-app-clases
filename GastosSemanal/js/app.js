//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto");
const gastosListado = document.querySelector("#gastos ul");
// Eventos
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

  formulario.addEventListener("submit", agregarGasto);
}
// Clases
class Prespuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
  }
}
class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }
  // Imprimiar Alerta
  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // Mnesaje de error
    divMensaje.textContent = mensaje;

    // Insertar Mensaje en el HTML
    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    // Quitar Mensaje del HTML
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
  // Agregar gastos al HTML
  mostrarGastosListado(gastos) {
    this.limpiarHTML();

    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group-item-d-flex- justify-content-between align-items-center";
      nuevoGasto.dataset.id = id;

      nuevoGasto.innerHTML = `
            ${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
        `;

      // Botón para borrar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.textContent = "x";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      nuevoGasto.appendChild(btnBorrar);

      // Agregar la lista de gastos al HTML
      gastosListado.appendChild(nuevoGasto);
    });
  }

  // Actualizar el restante en el HTML
  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  // Comprobar el presupuesto y actualizar el color en el HTML
  comprobarPresupuesto(presupuestoObj) {
    // Comprobar 25% del presupuesto
    const restanteDiv = document.querySelector(".restante");
    if (presupuestoObj.presupuesto / 4 > presupuestoObj.restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuestoObj.presupuesto / 2 > presupuestoObj.restante) {
      // Comprobar 50% del presupuesto
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    if (presupuestoObj.restante <= 0) {
      ui.imprimirAlerta("El presupuesto se ha agotado", "error");
      formulario.querySelector("button[type='submit']").disabled = true;
    }
  }

  // Limpiar HTML
  limpiarHTML() {
    while (gastosListado.firstChild) {
      gastosListado.removeChild(gastosListado.firstChild);
    }
  }
}

// Instancias
const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("¿Cual es tu presupuesto semanal?");
  if (
    presupuestoUsuario === null ||
    presupuestoUsuario === "" ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  // Presupuesto valido
  presupuesto = new Prespuesto(presupuestoUsuario);

  // Mostrar presupuesto en el HTML
  ui.insertarPresupuesto(presupuesto);
}
// Funcion que añade gastos
function agregarGasto(e) {
  e.preventDefault();

  // Leer datos de gasto
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  // Validar
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no válida", "error");
    return;
  }

  // Generar un objeto con el gasto
  const gasto = {
    nombre,
    cantidad,
    id: Date.now(),
  };

  // Añade un nuevo gasto
  presupuesto.nuevoGasto(gasto);
  ui.imprimirAlerta("Gasto agregado correctamente", "success");

  // Mostrar los gastos en el HTML
  const { gastos, restante } = presupuesto;
  console.log(restante);
  ui.mostrarGastosListado(gastos);

  // Actualizar el restante
  ui.actualizarRestante(restante);

  // Comprobar cuanto presupuesto queda
  ui.comprobarPresupuesto(presupuesto);

  // Reinicia el formulario
  formulario.reset();
}

// Funcion que eliminar gastos
function eliminarGasto(id) {
  presupuesto.eliminarGasto(id);
  ui.mostrarGastosListado(presupuesto.gastos);
  ui.actualizarRestante(presupuesto.restante);
  ui.comprobarPresupuesto(presupuesto);
}
