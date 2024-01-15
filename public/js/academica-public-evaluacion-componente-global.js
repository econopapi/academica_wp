function submitForm(event) {
    event.preventDefault();

    var data = {
        'id_seguimiento_global': document.getElementById('id_seguimiento_global').value,
        'numero_economico': document.getElementById('docente_id').value,
        'componente': document.getElementById('componente_id').value,
        'calificaciones': []
    };

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
    xhr.open('POST', 'http://localhost:5000/evaluacion_academica/global/componente', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Evaluación enviada con éxito');
        } else {
            alert('Error al enviar la evaluación');
        }
    };
    xhr.send(JSON.stringify(data));
}

document.getElementById('lista_componente').addEventListener('submit', submitForm);