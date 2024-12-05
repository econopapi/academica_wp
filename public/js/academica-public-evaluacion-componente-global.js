document.addEventListener('DOMContentLoaded', function() {
    var data = {
        'id_seguimiento': document.getElementById('id_seguimiento_global').value,
        'numero_economico': document.getElementById('docente_id').value,
        'componente': document.getElementById('componente_id').value,
        'calificaciones': []
    };
    var id_evaluacion = document.getElementById('id_evaluacion').value;
    var docente_email = document.getElementById('docente_email').value;
    var url_params = {
        'trimestre': document.getElementById('trimestre').value,
        'grupo': document.getElementById('grupo').value
    };

    function submitForm(event) {
        event.preventDefault();
        document.getElementById('loading-screen').style.display = 'block';
        
        const matriculas = document.querySelectorAll('input[name^="matriculas"]');
        const calificaciones = document.querySelectorAll('input[name^="calificacion"]');
    
        // Validar y agregar calificaciones al objeto data
        for (let i = 0; i < matriculas.length; i++) {
            const calificacionValue = parseFloat(calificaciones[i].value);
            if (isNaN(calificacionValue) || calificacionValue < 0.0 || calificacionValue > 10.0) {
                alert('La calificación debe ser un número entre 0.0 y 10.0');
                console.log('Error en calificación');
                document.getElementById('loading-screen').style.display = 'none';
                return;
            }
            const calificacion = {
                'matricula_alumno': matriculas[i].value,
                'calificacion_numero': calificacionValue
            };
            data.calificaciones.push(calificacion);
        }
    
        console.log(JSON.stringify(data, null, 4));
        //return;
    
        // Realizar la solicitud POST usando apiRequest
        apiRequest('POST', `/evaluaciones/${id_evaluacion}/componente`, data)
            .then(response => {
                if (response.status === 200) {
                    alert('Evaluación enviada con éxito');
                    window.open(`/academica-evaluacion?evaluacion=${id_evaluacion}&docente=${docente_email}`, '_self');
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
    document.getElementById('lista_componente').addEventListener('submit', submitForm);
});
