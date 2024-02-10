var data = {
    'id_seguimiento_global': document.getElementById('id_seguimiento_global').value,
    'numero_economico': document.getElementById('docente_id').value,
    'componente': document.getElementById('componente_id').value,
    'calificaciones': []
};

var url_params = {
    'trimestre': document.getElementById('trimestre').value,
    'grupo': document.getElementById('grupo').value
};

function showModalWithUrl() {
    // Crear una ventana modal
    var modal = document.createElement("div");
    modal.style.width = "300px";
    modal.style.height = "200px";
    modal.style.background = "#fff";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";
    modal.style.textAlign = "center";

    // Crear un mensaje
    var message = document.createElement("p");
    message.textContent = "Evaluación enviada con éxito";
    modal.appendChild(message);

    // Crear un botón
    var button = document.createElement("button");
    button.textContent = "OK";
    button.onclick = function() {
        // Abrir la URL cuando se hace click en el botón
        window.open('/academica-historial-academico-evaluacion-global-grupo?trimestre=' + url_params.trimestre + '&grupo=' + url_params.grupo, '_self');
        // Cerrar la ventana modal
        document.body.removeChild(modal);
    };
    modal.appendChild(button);

    // Mostrar la ventana modal
    document.body.appendChild(modal);
}

function submitForm(event) {
    event.preventDefault();



    var matriculas = document.querySelectorAll('input[name^="matriculas"]');
    var calificaciones = document.querySelectorAll('input[name^="calificacion"]');

    for (var i = 0; i < matriculas.length; i++) {
        var calificacion = {
            'matricula_alumno': matriculas[i].value,
            'calificacion_numero': parseFloat(calificaciones[i].value)
        };
        data.calificaciones.push(calificacion);
    }

    console.log(data)

    var xhr = new XMLHttpRequest();
    var requestSuccessful = false; // Variable para almacenar el estado de la solicitud
    xhr.open('POST', 'https://academica.dlimon.net/evaluacion_academica/global/componente', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Evaluación enviada con éxito');
            showModalWithUrl();
        } else {
            alert('Error al enviar la evaluación');
        }
    };
    
}


document.getElementById('lista_componente').addEventListener('submit', submitForm);