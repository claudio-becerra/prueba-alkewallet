/************************
 *   SELECTORES DEL DOM  *
 ************************/

const $inputMonto = $("#monto-depositar") //Seleccionamos el input en el DOM
const $elementoSaldo = $("#saldo-actual") // Elemento del DOM a modificar
const $formDeposito = $('#form-deposito');
const $alertDeposito = $('#alert-deposito'); // Alerta que dirá el monto depositado




/************************
 *     VARIABLES        *
 ************************/

let saldoActual = obtenerSaldo();
let listaMovimientos = obtenerMovimientos();


/************************
 *      FUNCIONES       *
 ************************/

function obtenerSaldo(){ //Retorna el saldo guardado procesado
    const saldoGuardado = localStorage.getItem("saldo"); //Buscamos el valor en el local Storage

    if (saldoGuardado === null){ //Si no se obtiene un valor del storage (primera vez que se abre)
        return 100000;  // Se le asignará el valor de 100000 (para suponer que tenía dinero)
    } else {
        return parseInt(saldoGuardado); //En caso contrario convertiremos el valor obtenido a un entero
    }
}

function obtenerMovimientos(){ //Retorna la lista de movimientos
    const movimientosGuardados = localStorage.getItem('movimientos'); //Llamamos a los movimientos en localStorage

    if (movimientosGuardados === null){ //Si no obtenemos nada, como base solo tendremos un deposito
        return [{tipo: 'entrada', monto: 100000, cuenta: 'usuario'}, {tipo: "salida", monto: 100000, alias: 'Javi'}] // la lista guardará objetos con tipo y monto para saber si entró o salió dinero
    } else {
        return JSON.parse(movimientosGuardados); // Convertiremos el string al array de objetos que necesitmos
}
}

function depositar(event){
    event.preventDefault();
    let deposito = parseInt($inputMonto.val()); // Monto ingresado en el input como entero
    //Validamos deposito > 0
    if (esPositivo(deposito)){
        // Sumamos el monto al monto anterior
        saldoActual += deposito;
        guardarTransaccion(listaMovimientos, deposito) //guardamos la transacción en LocalStorage
        //guardamos el nuevo monto
        guardarSaldo();
        mostrarAlerta($alertDeposito, deposito);
        //Actualizamos la información mostrada en el DOM
        actualizarSaldo();
    } else {
        alert('No se pudo realizar el depósito. Debe ingresar un monto mayor a 0')
    }
    //reiniciamos el input
    $inputMonto.val("");
    setTimeout(redirectHome, 2000) // Se demore 2 segundos en redireccionar
}

// Actualizar saldo en la página
function actualizarSaldo(){
    $elementoSaldo.text(saldoActual)// Escrbir el saldo en el elemento
}
// Ver que el número ingresado sea positivo
function esPositivo(numero){
    if (numero > 0){
        return true
    } else {
        return false
    }
}
function guardarTransaccion(transaccion, deposito){
        transaccion.push({tipo: 'entrada', monto: deposito});
        localStorage.setItem("movimientos", JSON.stringify(transaccion));
}

function guardarSaldo(){
    localStorage.setItem("saldo", saldoActual);
}

function redirectHome(){ //Redireccionar a menu
    window.location.href = "menu.html";
}

function mostrarAlerta(contenedor, deposito){
    //rellenar Alerta
    contenedor.text(`Se ha realizado el depósito de $ ${deposito}`);

    contenedor.removeClass('hide')
}
/************************
 *       EVENTOS        *
 ************************/

//Botón Realizar Depósito (formulario)
$formDeposito.on('submit', depositar)

/************************
 *      EJECUCIÓN      *
 ************************/

// AL MOMENTO DE ABRIR LA PÁGINA, RELLENARÁ CON EL MONTO
actualizarSaldo();