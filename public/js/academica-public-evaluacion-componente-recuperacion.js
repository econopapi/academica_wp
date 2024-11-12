

document.addEventListener('DOMContentLoaded', function() {
    const calificacionInputs = document.querySelectorAll('input[name^="calificacion"]');

    // calificacionInputs.forEach(input => {
    //     const globalCalificacion = parseFloat(input.getAttribute('data-global'));

    //     // Si el valor de global_json del componente es 6 o más, desactivar el input
    //     if (!isNaN(globalCalificacion) && globalCalificacion >= 6) {
    //         input.disabled = true;
    //         input.title = "Calificación acreditada en evaluación global";
    //         input.style.backgroundColor = "#d4edda"; // Fondo verde claro
    //         input.style.color = "#155724"; // Texto verde oscuro

    //         // Agregar texto adicional junto al input
    //         const acreditadoText = document.createElement('span');
    //         acreditadoText.innerText = "< Acreditado en Global";
    //         acreditadoText.style.color = "#155724";
    //         acreditadoText.style.fontWeight = "bold";
    //         input.parentNode.appendChild(acreditadoText);
    //     }
    // });
    calificacionInputs.forEach(input => {
        const globalCalificacion = parseFloat(input.getAttribute('data-global'));

        // Si el valor de global_json del componente es 6 o más, desactivar el input
        if (!isNaN(globalCalificacion) && globalCalificacion >= 6) {
            input.disabled = true;
            input.title = "Calificación acreditada en evaluación global";
            input.style.backgroundColor = "#d4edda"; // Fondo verde claro
            input.style.color = "#155724"; // Texto verde oscuro

            // Agregar texto adicional junto al input
            const acreditadoText = document.createElement('span');
            acreditadoText.innerText = " Acreditado en global ";
            acreditadoText.style.color = "#155724";
            acreditadoText.style.fontWeight = "bold";
            
            // Crear enlace de "Editar"
            const editarLink = document.createElement('a');
            editarLink.href = "#";
            editarLink.innerText = "[Editar]";
            editarLink.style.color = "#007bff"; // Color de enlace
            editarLink.style.marginLeft = "5px";
            editarLink.style.cursor = "pointer";

            // Evento para habilitar el input al hacer clic en "Editar"
            editarLink.addEventListener('click', function(event) {
                event.preventDefault(); // Evitar que la página se desplace al inicio
                input.disabled = false;
                input.focus(); // Opcional: poner foco en el input
                editarLink.style.display = 'none'; // Ocultar el enlace después de activarlo
                acreditadoText.style.display = 'none'; // Ocultar el texto "Acreditado en Global" si prefieres
            });

            // Agregar los elementos al DOM
            input.parentNode.appendChild(acreditadoText);
            input.parentNode.appendChild(editarLink);
        }
    });

    var data = {
        'id_seguimiento': document.getElementById('id_seguimiento_recuperacion').value,
        'numero_economico': document.getElementById('docente_id').value,
        'componente': document.getElementById('componente_id').value,
        'recuperacion': 'true', // This is the only difference between this file and academica-public-evaluacion-componente-global.js
        'calificaciones': []
    };
    var id_evaluacion = document.getElementById('id_evaluacion').value;
    var docente_email = document.getElementById('docente_email').value;
    var url_params = {
        'trimestre': document.getElementById('trimestre').value,
        'grupo': document.getElementById('grupo').value,
        //'modulo': document.getElementById('modulo').value
    };
    
    function submitForm(event) {
        event.preventDefault();
        document.getElementById('loading-screen').style.display = 'block';
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
    
        // var xhr = new XMLHttpRequest();
        // var requestSuccessful = false; // Variable para almacenar el estado de la solicitud
        // xhr.open('POST', `${academicaApiConfig.apiUrl}/evaluacion_academica/componente`, true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.send(JSON.stringify(data));
        // xhr.onload = function () {
        //     if (xhr.status === 200) {
        //         alert('Evaluación enviada con éxito');
        //         window.open('/academica-historial-academico-evaluacion-recuperacion-grupo?trimestre=' + url_params.trimestre + '&grupo=' + url_params.grupo + '&modulo=' + url_params.modulo, '_self');
        //     } else {
        //         alert('Error al enviar la evaluación');
        //         window.location.reload();
        //     }
        // };

        // Realizar la solicitud POST usando apiRequest
        apiRequest('POST', `/evaluaciones/${id_evaluacion}/componente`, data)
        .then(response => {
            if (response.status === 200) {
                //alert('Evaluación enviada con éxito');
                window.open(`/academica-evaluacion/?evaluacion=${id_evaluacion}&docente=${docente_email}`, '_self');
            } else {
                alert('Error al enviar la evaluación');
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Error al enviar la evaluación!');
            document.getElementById('loading-screen').style.display = 'none';
        });
        
    }
    
    
    document.getElementById('lista_componente').addEventListener('submit', submitForm);
});
