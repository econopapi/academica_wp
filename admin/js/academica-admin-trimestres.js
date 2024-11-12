document.addEventListener('DOMContentLoaded', function() {
    // Hacer la solicitud para obtener el trimestre actual
    var trimestreActual = document.getElementById('trimestreActual');

    apiRequest('GET', '/trimestres/actual').then(data => {
        if (data.status === 200) {
            if (data.payload.count > 0 && data.payload.data.length > 0) {
                var trimestre = data.payload.data[0].trimestre_nombre;
                // Mostrar el trimestre en el DOM
                var trimestreDiv = document.createElement('div');
                trimestreDiv.id = 'trimestre-actual';
                trimestreDiv.style.fontSize = '20px';
                trimestreDiv.style.fontWeight = 'bold';
                trimestreDiv.style.marginBottom = '10px';
                trimestreDiv.innerText = '⭐ Trimestre Actual: ' + trimestre;
                trimestreActual.appendChild(trimestreDiv);
            } else {
                trimestreActual.innerText = 'No se encontraron trimestres';
            }       
        } else {
            trimestreActual.innerText = 'Error al obtener el trimestre actual';
            console.error('Error al obtener el trimestre actual');            
        }
    }).catch(error => console.error('Error en la solicitud: ', error));


    if (document.getElementById('download-form')) {
            apiRequest('GET', '/trimestres/').then(data => {
                if (data.status === 200) {
                    var trimestres = data.payload.data; // Asegúrate de acceder correctamente al payload
                    var trimestreSelect = document.getElementById('trimestre');

                    // Limpiar las opciones actuales del select
                    trimestreSelect.innerHTML = '';

                    // Agregar las nuevas opciones al select
                    trimestres.forEach(function(trimestre) {
                        var option = document.createElement('option');
                        option.value = trimestre.trimestre; // ID del trimestre
                        option.textContent = trimestre.trimestre_nombre; // Nombre del trimestre
                        trimestreSelect.appendChild(option);
                    });
                } else {
                    console.error('Error al obtener los trimestres');
                }
            }).catch(error => console.error('Error en la segunda solicitud:', error));        
        }
});

async function addTrimestre() {
    // show the loading screen
    document.getElementById('loading-screen').style.display = 'block';
    // Retrieve values from the form inputs
    const trimestreClave = document.getElementById('trimestre_clave').value;
    const trimestreNombre = document.getElementById('trimestre_nombre').value;

    // Construct the request payload
    const payload = {
        trimestre: trimestreClave,
        trimestre_nombre: trimestreNombre
    };

    try {
        // Enviar la solicitud POST utilizando apiRequest
        const response = await apiRequest('POST', '/trimestres', payload);

        // Manejar la respuesta
        if (response.status === 200) {
            alert('Trimestre añadido exitosamente');
            // Recargar la página
            location.reload();
        } else {
            alert('Error al añadir el trimestre: ' + (response.message || 'Error desconocido'));
        }
    } catch (error) {
        // Manejar cualquier error potencial
        alert('Error al añadir el trimestre: ' + error.message);
    } finally {
        // Ocultar la pantalla de carga
        document.getElementById('loading-screen').style.display = 'none';
    }
}

function downloadEvaluaciones() {
    // Mostrar la pantalla de carga
    document.getElementById('loading-screen').style.display = 'block';

    var trimestre = document.getElementById('trimestre').value;
    var tipoEvaluacion = document.getElementById('tipo_evaluacion').value;
    var baseUrl = `${academicaApiConfig.apiUrl}/csv_dump/`;
    var endpoint = tipoEvaluacion === 'global' ? 'evaluacion_global' : 'evaluacion_recuperacion';
    var url = baseUrl + endpoint + '?trimestre=' + trimestre;

    // Redireccionar a la URL para iniciar la descarga
    window.location.href = url;

    // Ocultar la pantalla de carga después de un retraso para asegurar que la descarga ha comenzado
    setTimeout(function() {
        document.getElementById('loading-screen').style.display = 'none';
    }, 6000); // Ajusta el tiempo si es necesario
}