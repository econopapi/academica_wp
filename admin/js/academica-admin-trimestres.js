document.addEventListener('DOMContentLoaded', function() {
    // Hacer la solicitud para obtener el trimestre actual
    var trimestreActual = document.getElementById('trimestreActual');
    fetch(`${academicaApiConfig.apiUrl}/historial_academico/trimestre_actual`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.code === 200) {
                var trimestre = data.payload.trimestre_nombre;
                // Mostrar el trimestre en el DOM
                var trimestreDiv = document.createElement('div');
                trimestreDiv.id = 'trimestre-actual';
                trimestreDiv.style.fontSize = '20px';
                trimestreDiv.style.fontWeight = 'bold';
                trimestreDiv.style.marginBottom = '10px';
                trimestreDiv.innerText = '⭐ Trimestre Actual: ' + trimestre;
                trimestreActual.appendChild(trimestreDiv);
            } else {
                trimestreActual.innerText = 'Error al obtener el trimestre actual';
                console.error('Error al obtener el trimestre actual');
            }
        })
        .catch(error => console.error('Error en la solicitud:', error));

        if (document.getElementById('download-form')) {
            // Hacer la segunda solicitud fetch solo si "download-form" existe
            fetch(`${academicaApiConfig.apiUrl}/trimestres`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200 && data.message === 'success') {
                        var trimestres = data.data; // Accedemos a "data.data"
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
                })
                .catch(error => console.error('Error en la segunda solicitud:', error));
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
        // Send a POST request to the specified endpoint
        const response = await fetch(`${academicaApiConfig.apiUrl}/historial_academico/trimestre_actual`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Handle the response
        if (response.ok) {
            const data = await response.json();
            alert('Trimestre añadido exitosamente');
            // reload the page
            location.reload();
        } else {
            const errorData = await response.json();
            alert('Error al añadir el trimestre: ' + errorData.message);
            // hide the loading screen
            document.getElementById('loading-screen').style.display = 'none';
        }
    } catch (error) {
        // Handle any potential errors
        alert('Error al añadir el trimestre: ' + error.message);
        // hide the loading screen
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