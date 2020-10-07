// 1 - Mostra/oculta el selector de tornada
//$("#ida1").click(hideReturn);
//$("#vuelta1").click(showReturn);
$(document).on("click", "#ida1", hideReturn);
$(document).on("click", "#vuelta1", showReturn);

function hideReturn() {
    $("#dates_vuelta").hide("fast", "linear");
}

function showReturn() {
    $("#dates_vuelta").show("fast", "linear");
}

// 2 - Validar el formulari de cerca

// fer invisible tots els missatges d'error a sota dels input
// flights
$("#error_message_origen").hide();
$("#error_message_destination").hide();
$("#error_message_ida").hide();
$("#error_message_vuelta").hide();
$("#error_message_psg").hide();
// hotels
$("error_message_destination_hotel").hide();
$("error_message_in").hide();
$("error_message_out").hide();

// crear booleans per la comprovació
// flights
let error_origen;
let error_destination;
let error_ida;
let error_vuelta;



// booleans per controlar si hi ha data de tornada o només anada, agafa el valor true per default perquè quan carreguem
// la pàgina per defecte es veu les dates d'anada i tornada
let isSetReturnDate = true;

// controlar si hi ha data de tornada
//$("#ida1").click(() => {
$(document).on("click", "#ida1", () => {
    isSetReturnDate = false;
});
//$("#vuelta1").click(() => {
$(document).on("click", "#vuelta1", () => {
    isSetReturnDate = true;
});

// validate letters
function isLetters(inputText) {
    return /^[A-Za-z]+$/.test(inputText);
}

// validation functions for validating input type="text" or input type="data"
function checkOrigen() {
    let value = $("#origen").val();
    if ((value !== "") && (isLetters(value))) {
        $("#error_message_origen").hide();
        error_origen = false;
    } else {
        $("#error_message_origen").html("Introduce una ciudad válida");
        $("#error_message_origen").show();
        error_origen = true;
    }
}

function checkDestination() {
    let value = $("#destination").val();
    if ((value !== "") && (isLetters(value))) {
        $("#error_message_destination").hide();
        error_destination = false;
    } else {
        $("#error_message_destination").html("Introduce una ciudad válida");
        $("#error_message_destination").show();
        error_destination = true;
    }
}

function checkDestinationHotel() {
    let value = $("#checkin_hotel").val();
    if ((value !== "") && (isLetters(value))) {
        $("#error_message_destination_hotel").hide();
        error_destination_hotel = false;
    } else {
        $("#error_message_destination_hotel").html("Introduce una ciudad válida");
        $("#error_message_destination_hotel").show();
        error_destination_hotel = true;
    }
}

// validation of dates
function checkDateIda() {
    let value = $("#dia_ida").val();
    if (value !== "") {
        $("#error_message_ida").hide();
        error_ida = false;
    } else {
        $("#error_message_ida").html("Introduce una fecha válida");
        $("#error_message_ida").show();
        error_ida = true;
    }
}

function checkDateVuelta() {
    let value = $("#dia_vuelta").val();
    if (value !== "") {
        $("#error_message_vuelta").hide();
        error_vuelta = false;
    } else {
        $("#error_message_vuelta").html("Introduce una fecha válida");
        $("#error_message_vuelta").show();
        error_vuelta = true;
    }
}





// clickear sobre el botó "search" - flights search
$(document).on("click", "#search", () => {
    checkOrigen();
    checkDestination();
    checkDateIda();
    checkDateVuelta();

    if (isSetReturnDate &&
        error_origen === false &&
        error_destination === false &&
        error_ida === false &&
        error_vuelta === false
    ) location.href = "https://www.uoc.edu/portal/ca/index.html";
    else if (!isSetReturnDate &&
        error_origen === false &&
        error_destination === false &&
        error_ida === false
    ) location.href = "https://www.uoc.edu/portal/ca/index.html";
    else event.preventDefault();
});


// 3 - Mostra finestra modal per iniciar sessió
$("#btn1").click(showOverlay);
$("#tancar").click(hideOverlay);

function showOverlay(event) {
    event.preventDefault();
    $(".overlay").css("display", "grid");
    $(".overlay form").css("display", "block");
}

function hideOverlay(event) {
    event.preventDefault();
    $(".overlay").css("display", "none");
    $(".overlay form").css("display", "none");
}


// 4 - Simular el login amb AJAX

// validar input
// fer invisible tots els missatges d'error a sota dels input
$("#success_message").hide();
$("#error_message").hide();

// guardar url en variable
let url = "https://reqres.in/api/login";


$("#iniciSessio").click(event => {
    let ok = false;
    let errorMessage;
    sendData();
    if (!ok) {
        event.preventDefault();
    }
});

// sending function with fetch
function sendData() {
    let email = $("#email").val();
    let password = $("#password").val();
    let userData = {
        "email": email,
        "password": password
    }

    fetch(url, {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            //console.log(data);
            if ("error" in data) {
                $("#success_message").hide();
                $("#error_message").html(data.error);
                $("#error_message").show();
            }
            if ("token" in data) {
                ok = true;
                $("#error_message").hide();
                $("#success_message").html("El login se ha hecho con éxito");
                $("#success_message").show();
                setTimeout(() => {
                    location.reload();
                }, 5000);
            }
        })
}
