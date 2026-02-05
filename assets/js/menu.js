/************************
 *   SELECTORES DEL DOM  *
 ************************/
const $contenedorMovimientos = $("#lista-movimientos") //Contenedor en donde agregaré las etiquetas li
const $elementoSaldo = $("#saldo-actual") // Elemento del DOM a modificar
const $btnDepositarDinero = $("#btn-depositar-dinero"); //Boton Depositar
const $btnEnviarDinero = $("#btn-enviar-dinero"); //Boton Enviar Dinero



/************************
 *     VARIABLES        *
 ************************/

let saldoActual = obtenerSaldo();
let listaMovimientos = obtenerMovimientos();

/************************
 *      FUNCIONES       *
 ************************/

//Escribir la lista de los últimos 5 movimientos en el DOM
function mostrarMovimientos(){
    $contenedorMovimientos.empty();
    let itemHTML; //Escribiremos el código a colocar en el contenedor
    listaMovimientos.slice(-5).toReversed().forEach(function(movimiento){ // Necesito los ultimos 5 movimientos
        if (movimiento.tipo === "entrada"){
            itemHTML = `<li class="list-group-item text-success">Depósito a la cuenta - $ ${movimiento.monto}</li>`;
        } else {
            itemHTML =`<li class="list-group-item text-danger">Envío a ${movimiento.alias}  - $ ${movimiento.monto}</li>`;
        }
        $contenedorMovimientos.append(itemHTML); //agregamos el contenido al contenedor
    })
}

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

// Mostrar saldo en el DOM
function actualizarSaldo(){
    $elementoSaldo.text(saldoActual)  // Escrbir el saldo en el elemento
}

function redirectSendmoney(){ //Redireccionar a Sendmoney
    alert('Redirigiendo a Transferencia')
    window.location.href = "sendmoney.html";
}
function redirectDeposit(){ //Redireccionar a Deposit
    alert('Redirigiendo a Despositar')
    window.location.href = "deposit.html"
}

/************************
 *       EVENTOS        *
 ************************/

$btnEnviarDinero.on('click', redirectSendmoney);
$btnDepositarDinero.on('click', redirectDeposit);


/************************
 *      EJECUCIÓN      *
 ************************/

actualizarSaldo();
mostrarMovimientos();