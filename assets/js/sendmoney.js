/************************
 *   SELECTORES DEL DOM  *
 ************************/

const $formAgregarContacto = $('#form-nuevo-contacto') //FORM NUEVO CONTACTO
const $formMenuContacto = $('#form-contactos');
const $formTransferir = $('#form-transferir');
const $cerrarModalTransferir = $('#close-transferir');
const $cerrarModalContacto = $('#close-contacto');
const modalTransferir = document.getElementById('modal-enviar-dinero');
const modalAgregarContacto = document.getElementById('modal-agregar-contacto')
const $contenedorContactos = $("#lista-contactos"); //Seleccionamos la lista en la que colocaremos cada contacto
const $montoTransferencia = $('#monto-transferencia') // Monto de la transferencia realizada
const $numCuentaAlert = $('#num-cuenta-alert'); //Alerta del número de cuenta


/************************
 *     VARIABLES        *
 ************************/
// LISTA DE CONTACTOS EN EL LOCALSTORAGE

let listaContactos = obtenerContactos(); //retorna la lista de contactos procesada
let listaMovimientos = obtenerMovimientos();
let saldoActual = obtenerSaldo(); //retorna el saldo actual


/************************
 *      FUNCIONES       *
 ************************/

function obtenerContactos(){ //Recibimos la lista de contactos del localStorage y retornamos la lista preparada para utilizar.
    const contactosGuardados = localStorage.getItem("contactos"); //Llamamos los datos guardados en el LocalStorage
    if(contactosGuardados === null){ // Si no hay lista guardada en el LocalStorage
        return [ //Creamos una lista base para el ejercicio
            {nombre: 'Julio', apellido: 'Cortazar', cuenta: '123456789', alias: 'Julito', banco: 'Santander'},
            {nombre: 'Javiera', apellido: 'Contador', cuenta:'987654321', alias: 'Javi', banco: 'Estado'}
        ]
    } else { //Si hay una lista guardada
        return JSON.parse(contactosGuardados); // La convertimos en un JSON para utilizar los objetos
    }
}

//Mostrar contactos en el DOM
function mostrarContactos(){
    //Limpiamos el DOM
    $contenedorContactos.empty() //para que no se dupliquen los contactos al llamar la función
    
    listaContactos.forEach(function(contacto){ //para cada contacto en la lista crearemos un Li
        const nuevoLi = document.createElement('li'); //Creamos la etiqueta li
        nuevoLi.className = "list-group-item list-group-item-action"; // Le agregamos las clases
        nuevoLi.innerHTML +=  // Le agregamos el contenido dentro de la lista junto con los atributos de cada contacto.
                    `<div class="contact-info">
                        <p>${contacto.nombre} ${contacto.apellido} Cuenta: ${contacto.cuenta}, Alias: ${contacto.alias}, Banco: ${contacto.banco}</p>
                    </div>`
        $contenedorContactos.append(nuevoLi); // Mostramos el li creado en la lista seleccionada

        // Creamos los eventListeners
        nuevoLi.addEventListener('click', function(){

            window.contactoSeleccionado = contacto; //creamos la variable contactoSeleccionado fuera del scope

            //Llenamos el Modal (Dialog)
            $('#nombre-destinatario').text(`${contacto.nombre} ${contacto.apellido} `); 

            modalTransferir.showModal(); //Hacemos que el modal aparezca en pantalla
        })
    })
}
//mostrar modal modal-agregar-contacto
function abrirModalContacto(event){
    event.preventDefault(); //Evitamos se envie el formulario
    modalAgregarContacto.showModal(); //Abrimos el modal-agregar-contacto
}
// Agregar contacto a la lista
function agregarContacto(event){
    event.preventDefault()
    $numCuentaAlert.addClass('hide'); //Limpiamos la alerta en caso de existir

    let nuevoContacto = {
        nombre: $('#nombre').val(), 
        apellido: $('#apellido').val(),
        cuenta: $('#num-cuenta').val(),
        alias: $('#alias').val(), 
        banco: $('#nombre-banco').val()};
        
        if (esCuentaValida(nuevoContacto.cuenta)){
            // agregar el contacto a la listaContactos
            listaContactos.push(nuevoContacto);
            // Alerta para que el usuario sepa que se guardó el contacto
            alert('El contacto fue guardado exitosamente');
            //guardamos en localStorage
            guardarContactos(listaContactos);
            //Limpiar campos
            $formAgregarContacto[0].reset();
            //actualizamos los contactos
            mostrarContactos()
            //cerrar modal
            modalAgregarContacto.close()
        } else {
            $numCuentaAlert.removeClass('hide')
        }
}
//Guardar contacto en local storage
const guardarContactos = (contactos) => localStorage.setItem('contactos', JSON.stringify(contactos));

//Transferir dinero
function transferirDinero(event){
    event.preventDefault();
    // calculamos el monto actual - montoTranferencia
    const monto = parseInt($montoTransferencia.val()); // asegurarmos que se trabaje como entero y no string
    //Nos aseguramos que el monto sea mayor a 0
    if (monto > 0){
        //validamos que haya saldo
        if (saldoActual - monto >= 0){
            saldoActual -= monto;
            guardarTransaccion(listaMovimientos, monto);
            //Alert para avisar al usuario que la transferencia fue realizada
            alert('La transferencia fue realizada con éxito')
            guardarSaldo();
            //Cerrar Modal-enviar-dinero
            modalTransferir.close();
            redirectHome();
        } else {
            alert('Saldo Insuficiente');
        }
    } else {
        alert('No se realizó la transferencia, el monto debe ser mayor a 0')
    }

}

//Obtener Saldo del LocalStorage
function obtenerSaldo(){
    const saldoGuardado = localStorage.getItem("saldo"); //Buscamos el valor en el local Storage

    if (saldoGuardado === null){ //Si no se obtiene un valor del storage (primera vez que se abre)
        return 100000;  // Se le asignará el valor de 100000 (para suponer que tenía dinero)
    } else {
        return parseInt(saldoGuardado); //En caso contrario convertiremos el valor obtenido a un entero
    }
}

function guardarTransaccion(transaccion, deposito){
        transaccion.push({tipo: 'salida', monto: deposito, alias: window.contactoSeleccionado.alias});
        localStorage.setItem("movimientos", JSON.stringify(transaccion));
}

function obtenerMovimientos(){ //Retorna la lista de movimientos
    const movimientosGuardados = localStorage.getItem('movimientos'); //Llamamos a los movimientos en localStorage

    if (movimientosGuardados === null){ //Si no obtenemos nada, como base solo tendremos un deposito
        return [{tipo: 'entrada', monto: 100000, cuenta: 'usuario'}, {tipo: "salida", monto: 100000, alias: 'Javi'}] // la lista guardará objetos con tipo y monto para saber si entró o salió dinero
    } else {
        return JSON.parse(movimientosGuardados); // Convertiremos el string al array de objetos que necesitmos
}
}

function esCuentaValida(numCuenta){
    //validaremos con regEx (9 digitos)
    const patronNumCuenta = /^\d{9}$/;
    return patronNumCuenta.test(numCuenta);
}
//Redirect Home
function redirectHome(){ //Redireccionar a menu
    window.location.href = "menu.html";
}

function guardarSaldo(){
    localStorage.setItem("saldo", saldoActual);
}
/************************
 *       EVENTOS        *
 ************************/

//btn agregar contacto
$formAgregarContacto.on('submit', agregarContacto);
// Abrir modal nuevo contacto
$formMenuContacto.on('submit', abrirModalContacto);
//agregamos evento para cerrar el modal con el boton que colocamos en el modal transferir
$cerrarModalTransferir.on('click', () => modalTransferir.close());
//agregamos evento para cerrar el modal con el boton que colocamos en el modal contactos
$cerrarModalContacto.on('click', () => modalAgregarContacto.close());
//Realizar la transferencia
$formTransferir.on('submit', transferirDinero);

/************************
 *      EJECUCIÓN      *
 ************************/

//AL INICIAR LA PÁGINA, CARGA LOS CONTACTOS
mostrarContactos();
