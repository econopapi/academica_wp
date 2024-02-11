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

function submitForm(event) {
    event.preventDefault();
    var matriculas = document.querySelectorAll('input[name^="matriculas"]');
    var calificaciones = document.querySelectorAll('input[name^="calificacion"]');

    for (var i = 0; i < matriculas.length; i++) {
        var calificacionValue = parseFloat(calificaciones[i].value);
        if (isNaN(calificacionValue) || calificacionValue < 0.0 || calificacionValue > 10.0) {
            alert('La calificación debe ser un número entre 0.0 y 10.0');
            console.log('Error en calificación');
            return;
        }
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
            window.open('/academica-historial-academico-evaluacion-global-grupo?trimestre=' + url_params.trimestre + '&grupo=' + url_params.grupo, '_self');
        } else {
            alert('Error al enviar la evaluación');
        }
    };
    
}


document.getElementById('lista_componente').addEventListener('submit', submitForm);