/************************
 *   SELECTORES DEL DOM  *
 ************************/

const $elementoSaldo = $("#saldo-actual") // Elemento del DOM a modificar
const $liMovimiento = $("#lista-movimientos") //Elemento en donde agregaré las etiquetas li
const $selectTipo = $('#filtro-tipo') //Select del tipo de movimiento

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


// Escribir lista de movimientos en el DOM
function mostrarMovimientos(){
    $liMovimiento.empty();
    let itemHTML;
    listaMovimientos.toReversed().forEach(function(movimiento,){
        switch ($selectTipo.val()){ //Dependiendo de la option, crea la lista
            case 'todos':
                if (movimiento.tipo == "entrada"){
                    itemHTML = `<li class="list-group-item text-success">Depósito a la cuenta - $ ${movimiento.monto}</li>`
                } else {
                    itemHTML =`<li class="list-group-item text-danger">Envío a ${movimiento.alias}  - $ ${movimiento.monto}</li>`;
                }
                $liMovimiento.append(itemHTML);
                break
            case 'entrada':
                if (movimiento.tipo == "entrada"){
                    itemHTML = `<li class="list-group-item text-success">Depósito a la cuenta - $ ${movimiento.monto}</li>`
                    $liMovimiento.append(itemHTML);
                };
                break
            case 'salida':
                if (movimiento.tipo == "salida"){
                    itemHTML =`<li class="list-group-item text-danger">Envío a ${movimiento.alias}  - $ ${movimiento.monto}</li>`;
                    $liMovimiento.append(itemHTML);
                }
                break
        }
    })
}

function actualizarSaldo(){
    $elementoSaldo.text(saldoActual); // Escrbir el saldo en el elemento
}

/************************
 *       EVENTOS        *
 ************************/

$selectTipo.on('change', mostrarMovimientos) //Al cambiar la selección, actualiza la lista


/************************
 *      EJECUCIÓN      *
 ************************/

actualizarSaldo();
mostrarMovimientos();