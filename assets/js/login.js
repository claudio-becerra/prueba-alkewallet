/************************
 *   SELECTORES DEL DOM  *
 ************************/
const $formLogin = $('#login-form') //Botón de inicio de sesión
const $mail = $('#email'); //Campo email
const $password = $('#password'); // Campo password
const $alertLoginSuccess = $('#alert-success') //Alerta al ingresar los datos correctos
const $alertLoginDanger = $('#alert-danger') //Alerta al ingresar datos erroneos

/************************
 *     VARIABLES        *
 ************************/

const loginInfo = ["user@correo.com", "admin123"]; //Datos de inicio de sesión

/************************
 *      FUNCIONES       *
 ************************/

//Validar datos de inicio de sesión
function validarLogin(event){ 
    event.preventDefault();
    limpiarAlerta(); //Colocamos las clases hide en caso de que ya se hubiera ingresado datos erroneos
    //Validar los datos
    if ($mail.val() === loginInfo[0] && $password.val() === loginInfo[1]){ //Si los datos son correctos
        $alertLoginSuccess.removeClass('hide').fadeIn();
        redirectMenu() //Redirigir a menú
    } else {
        $alertLoginDanger.removeClass('hide').fadeIn();
    }
}
//Redireccionar a menú
function redirectMenu(){
    window.location.href = 'assets/pages/menu.html';
}
//Limpiar alertas Login
function limpiarAlerta(){
    $alertLoginDanger.addClass('hide');
}

/************************
 *       EVENTOS        *
 ************************/
//Botón de iniciar sesión
$formLogin.on('submit', validarLogin);
