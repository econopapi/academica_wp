// // Crear el overlay y la pantalla de carga
// var overlay = document.createElement('div');
// overlay.id = 'overlay';
// overlay.style.display = 'none';
// document.body.appendChild(overlay);

// var loadingScreen = document.createElement('div');
// loadingScreen.id = 'loadingScreen';
// loadingScreen.style.display = 'none';
// document.body.appendChild(loadingScreen);

// // Mostrar el overlay y la pantalla de carga
// overlay.style.display = 'block';
// loadingScreen.style.display = 'block';

// // Ejecutar tus funciones
// asyncFunction1().then(() => {
// return asyncFunction2();
// }).then(() => {
// return asyncFunction3();
// }).then(() => {
// // Ocultar el overlay y la pantalla de carga
// overlay.style.display = 'none';
// loadingScreen.style.display = 'none';
// }).catch((error) => {
// console.error(error);
// // Asegúrate de ocultar el overlay y la pantalla de carga incluso si hay un error
// overlay.style.display = 'none';
// loadingScreen.style.display = 'none';
// });

var selectTrimestre = document.getElementById('trimestre');
var selectGrupo = document.getElementById('grupo');
var selectModulo = document.getElementById('modulo');
var hiddenDocente = document.getElementById('docente');

// disable the select "grupo" by default
selectGrupo.disabled = true;
selectModulo.disabled = true;

function loadTrimestres() {
    fetch(`${academicaApiConfig.apiUrl}/trimestres/`)
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            const trimestres = data.data;

            trimestres.forEach(trimestre => {
                const option = document.createElement('option');
                option.value = trimestre.trimestre;
                option.textContent = trimestre.trimestre_nombre;
                selectTrimestre.appendChild(option)
            });
        } else {
            console.error('Error al obtener trimestres;', data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud', error);
    })
}

loadTrimestres()
selectTrimestre.disabled = false;

function createTable(data) {
    var table = document.createElement('table');
    var caption = table.createCaption();
    caption.textContent = 'Calificaciones';
    caption.style.fontWeight = 'bold';

    // Añadir cabeceras de tabla
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');

    var titles = ['Lista', 'Nombre', 'Matrícula', 'Teoría', 'Matemáticas', 'Taller', 'Investigación', 'Calificación número', 'Calificación letra'];

    titles.forEach(title => {
        var th = document.createElement('th');
        th.textContent = title;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Añadir filas de datos
    var tbody = document.createElement('tbody');
    data.forEach(item => {
        var row = document.createElement('tr');
        Object.keys(item).forEach(key => {
            var td = document.createElement('td');
            td.textContent = item[key];
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    return table;
}

function createInfoTable(informacion_general) {
    var infoTable = document.createElement('table');
    var caption = infoTable.createCaption();
    caption.textContent = 'Información general';
    caption.style.fontWeight = 'bold';

    // Mapping of current keys to desired names
    var keyMapping = {
        'grupo': 'Grupo',
        'trimestre': 'Trimestre',
        'modulo': 'Módulo',
        'uea': 'UEA',
        'clave_uea': 'Clave UEA'
    };

    // For each property in "informacion_general"
    for (var key in informacion_general) {
        if (key === 'docentes') continue;

        // Create a table row for each property
        var infoTableRow = document.createElement('tr');

        // Create a table header cell for the property
        var infoTableHeaderCell = document.createElement('th');
        infoTableHeaderCell.textContent = keyMapping[key] || key;  // Use the mapped key name if it exists, otherwise use the original key

        // Add the header cell to the row
        infoTableRow.appendChild(infoTableHeaderCell);

        // Create a table cell for the property value
        var infoTableCell = document.createElement('td');
        infoTableCell.textContent = informacion_general[key];

        // Add the cell to the row
        infoTableRow.appendChild(infoTableCell);

        // Add the row to the table
        infoTable.appendChild(infoTableRow);
    }

    return infoTable;
}

function createDocentesTable(docentes) {
    var docentesTable = document.createElement('table');
    var caption = docentesTable.createCaption();
    caption.textContent = 'Asignación docente';
    caption.style.fontWeight = 'bold';

    // Obtener las claves de la primera docente
    var firstDocente = docentes[0];

    var docenteKeys = Object.keys(firstDocente).filter(key => !key.includes('coordinacion') && key !== 'numero_economico');

    // Crear la fila de encabezado
    var headerRow = document.createElement('tr');

    // Para cada clave en docenteKeys
    docenteKeys.forEach(function(key) {
        // Crear una celda para cada clave
        var headerCell = document.createElement('th');
        // Capitalizar la primera letra de la clave
        var capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        headerCell.textContent = capitalizedKey;

        // Agregar la celda al encabezado
        headerRow.appendChild(headerCell);
    });

    // Agregar la fila de encabezado a la tabla
    docentesTable.appendChild(headerRow);

    // Para cada objeto en "docentes"
    docentes.forEach(function(docente) {
        // Crear una nueva fila
        var docenteRow = document.createElement('tr');

        // Para cada propiedad en el objeto
        for (var docenteKey in docente) {
            if (docenteKey.includes('coordinacion') || docenteKey.includes('numero_economico')) continue;
            // Crear una celda para cada propiedad en el objeto
            var docenteCell = document.createElement('td');

            if (docenteKey === 'componente') {
                docenteCell.textContent = docente[docenteKey].charAt(0).toUpperCase() + docente[docenteKey].slice(1);
            } else {
                docenteCell.textContent = docente[docenteKey];
            }
            docenteRow.appendChild(docenteCell);
        }

        // Agregar la fila a la tabla
        docentesTable.appendChild(docenteRow);
    });

    return docentesTable;
}

function clearTables() {
    document.getElementById('seguimiento_recuperacion_grupo_table').innerHTML = '';
    document.getElementById('asignacion_docente').innerHTML = '';
    document.getElementById('info_general').innerHTML = '';
    document.getElementById('estatus_firma').innerHTML = '';
    document.getElementById('notification').innerHTML = '';
}

/*

 PENDIENTE en selectTrimestre.addEventListener('change', function() {}
 
    1. Adaptar flujo de formulario para obtener modulos asignados por
    docente en evaluación de recuperación

De momento el formulario hace queries a las tablas de evaluación global 

*/

// event listener for "trimestre" select element
selectTrimestre.addEventListener('change', function() {
    // Toma el valor seleccionado en "trimestre"
    var trimestreSeleccionado = this.value;
    var docente = hiddenDocente.value;


    // api GET request with selected data
    fetch(`${academicaApiConfig.apiUrl}/historial_academico/grupos_por_trimestre?trimestre=${trimestreSeleccionado}&docente=${docente}`)
        .then(response => response.json())
        .then(data => {
            // Habilita el select "grupo" y llena sus opciones con la respuesta de la API
            selectModulo.disabled = false;
            var seen = {};
            var options = data['payload'].reduce(function(acc, grupo) {
                if (!seen[grupo.grupo]) {
                    acc.push('<option value="'+ grupo.grupo +'">' + grupo.grupo.toUpperCase() + '</option>');
                    seen[grupo.grupo] = true;
                }
                return acc;
            }, []);
            selectGrupo.innerHTML = '<option value="">Grupo</option>' + options.join('');
        });
});

selectModulo.addEventListener('change', function() {

    var moduloSeleccionado = this.value;

    fetch(`${academicaApiConfig.apiUrl}/historial_academico/grupos_por_trimestre?trimestre=${selectTrimestre.value}&modulo=${moduloSeleccionado}&recuperacion=true`)
        .then(response => response.json())
        .then(data => {
            // Habilitar selector de grupo y llenar opciones
            selectGrupo.disabled = false;
            var seen = {};
            var options = data['payload'].reduce(function(acc, item) {
                var grupo = item.grupo.grupo; // Ajuste aquí para acceder correctamente al valor de grupo
                if (!seen[grupo]) {
                    acc.push('<option value="'+ grupo +'">' + grupo.toUpperCase() + '</option>');
                    seen[grupo] = true;
                }
                return acc;
            }, []);
            selectGrupo.innerHTML = '<option value="">Grupo</option>' + options.join('');
        });
});


document.getElementById('grupo').addEventListener('change', function(event) {
    event.preventDefault();

    var trimestre = document.getElementById('trimestre').value;
    var grupo = document.getElementById('grupo').value;


    fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/get_seguimiento_id?trimestre=${trimestre}&grupo=${grupo}&docente_email=${hiddenDocente.value}&recuperacion=true&modulo=${selectModulo.value}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // fill the div with id "estatus_firma" with the data obtained
        var id_seguimiento_recuperacion = data.metadata.id_seguimiento_recuperacion; // Store the id_seguimiento_global
        var docente_id = data.metadata.docente_id; // Store the docente_id

        
        if (data.code === 200) {
            fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/verificar_estado_evaluacion?id_seguimiento=${data.metadata.id_seguimiento_global}&docente_id=${data.metadata.docente_id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                if (data.code === 200) {
                // verificar si la evaluacion ya fue firmada
                    fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/verificar_firma_seguimiento?id_seguimiento=${id_seguimiento_global}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        if (data.code === 200) {
                        // evaluacion completa y firmada
                            evaluacionFirmada(id_seguimiento_recuperacion, docente_id);
                            
                        } else if (data.code === 422) {
                        // evaluacion completa. pendiente de confirmacion

                            evaluacionPendienteDeFirma(id_seguimiento_recuperacion, docente_id, grupo, trimestre);
                        }
                    })
                    .catch(error => console.error('Error:', error));

                } else if (data.code === 422) {
                // evaluacion incompleta. falta evaluar componentes
                    evaluacionIncompleta();
                }

                document.getElementById('estatus_firma').textContent = data.payload.estado_evaluacion;
            })
            .catch(error => console.error('Error:', error));
        }

        
    })
    .catch(error => console.error('Error:', error));

    fetch(`${academicaApiConfig.apiUrl}/historial_academico/seguimiento_recuperacion?trimestre=${trimestre}&grupo=${grupo}&modulo=${selectModulo.value}&detalle=true`)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            clearTables();

            // Crear tabla de calificaciones
            var table = createTable(data.payload.calificaciones_alumnos);
            document.getElementById('seguimiento_global_grupo_table').appendChild(table);

            // Crear tabla de información general
            var infoTable = createInfoTable(data.payload.informacion_general);
            document.getElementById('info_general').appendChild(infoTable);

            // Crear tabla de asignación docente
            var docentesTable = createDocentesTable(data.payload.informacion_general.docentes);
            document.getElementById('asignacion_docente').appendChild(docentesTable);
        })
        .catch(error => console.error('Error:', error));
});

function evaluacionPendienteDeFirma(id_seguimiento_recuperacion, docente_id, trimestre, grupo) {
    var div = document.createElement('div');
    div.className = 'notification-orange';
    div.textContent = "Evaluación completa. Pendiente de confirmación.";

    var form = document.createElement('form');
    form.id = 'firma_form';

    var hiddenSeguimientoRecuperacion = document.createElement('input');
    hiddenSeguimientoRecuperacion.type = 'hidden';
    hiddenSeguimientoRecuperacion.name = 'id_seguimiento_recuperacion';
    hiddenSeguimientoRecuperacion.value = id_seguimiento_recuperacion;

    var hiddenDocenteId = document.createElement('input');
    hiddenDocenteId.type = 'hidden';
    hiddenDocenteId.name = 'docente_id';
    hiddenDocenteId.value = docente_id;

    var submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.className = 'firmar-button';
    submitButton.value = 'Ponderar y confirmar';

    form.appendChild(hiddenSeguimientoRecuperacion);
    form.appendChild(hiddenDocenteId);
    form.appendChild(submitButton);

    // crear boton para volver a la pagina de asignacion docente con el estilo de boton
    var button = document.createElement('button');
    button.className = 'firmar-button';
    button.textContent = 'Volver a asignación docente';
    button.addEventListener('click', function(event) {  
        window.open('/academica-docentes-asignacion-recuperacion/', '_self'); 
    });

    document.getElementById('estatus_firma').appendChild(div);
    document.getElementById('notification').appendChild(form);
    document.getElementById('notification').appendChild(button);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var id_seguimiento_recuperacion = hiddenSeguimientoRecuperacion.value;
        var docente_id = hiddenDocente.value;

        let url = `${academicaApiConfig.apiUrl}/evaluacion_academica/firma_evaluacion`;
        let params = {
            id_seguimiento: id_seguimiento_recuperacion,
            docente_email: docente_id,
            recuperacion: true
        };   

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code === 200) {
                alert('Evaluación ponderada y confirmada con éxito!');
                //window.location.href = '/academica-historial-academico-evaluacion-global-grupo?trimestre=' + trimestre.value + '&grupo=' + grupo.value;
                // reload de current page
                window.location.reload();
            } else {
                alert('Error al firmar el acta');
            }
        })
    });
}


function evaluacionFirmada(id_seguimiento_recuperacion, docente_id) {
    var div = document.createElement('div');
    div.className = 'notification-green';
    div.textContent = "Evaluación finalizada.";

    var reminderDiv = document.createElement('div');
    //reminderDiv.textContent = "Recuerde que ésto es sólo un seguimiento interno de la Coordinación. Las califiaciones oficiales deben ser cargadas y firmadas en el Sistema Integral de Información Académica de la UAM, como siempre se ha hecho.";
    reminderDiv.innerHTML = 'Recuerde que ésto es sólo un seguimiento interno de la Coordinación de Economía.<br />Las califiaciones oficiales deben ser cargadas y firmadas en el <a href="#" onclick=\'window.open("https://sae.uam.mx/siae/acceso_siia.html");return false;\'>Sistema Integral de Información Académica de la UAM</a>, como siempre se ha hecho.';
    // crear boton para volver a la pagina de asignacion docente con el estilo de boton
    var button = document.createElement('button');
    button.className = 'firmar-button';
    button.textContent = 'Volver a asignación docente';
    button.addEventListener('click', function(event) {
        window.open('/academica-docentes-asignacion-recuperacion/', '_self');
    });

    document.getElementById('estatus_firma').appendChild(div);
    document.getElementById('notification').appendChild(reminderDiv);
    document.getElementById('notification').appendChild(button);
}

function evaluacionIncompleta() {
    var div = document.createElement('div');
    div.className = 'notification-red';
    div.textContent = "Evaluación incompleta. Faltan componentes por evaluar";

    // crear boton para volver a la pagina de asignacion docente con el estilo de boton
    var button = document.createElement('button');
    button.className = 'firmar-button';
    button.textContent = 'Volver a asignación docente';
    button.addEventListener('click', function(event) {
        window.open('/academica-docentes-asignacion-recuperacion/', '_self');
    });

    document.getElementById('estatus_firma').appendChild(div);
    document.getElementById('notification').appendChild(button);


}

function loadDataFromUrlParams() {

    console.log('loadDataFromUrlParams');

    // current url
    var url = new URL(window.location.href);

    // get url params
    var trimestre = url.searchParams.get('trimestre');
    var grupo = url.searchParams.get('grupo');
    var modulo = url.searchParams.get('modulo');

    // verify if the url has the params
    if (trimestre && grupo && modulo) {

        fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/get_seguimiento_id?recuperacion=true&trimestre=${trimestre}&grupo=${grupo}&docente_email=${hiddenDocente.value}&modulo=${modulo}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // fill the div with id "estatus_firma" with the data obtained
            var id_seguimiento_recuperacion = data.metadata.id_seguimiento_recuperacion; // Store the id_seguimiento_global
            var docente_id = data.metadata.docente_id;
            if (data.code === 200) {
                fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/verificar_estado_evaluacion?recuperacion=true&id_seguimiento=${data.metadata.id_seguimiento_recuperacion}&docente_id=${data.metadata.docente_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);

                    if (data.code === 200) {

                        fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/verificar_firma_seguimiento?recuperacion=true&id_seguimiento=${id_seguimiento_recuperacion}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            if (data.code === 200) {
                            // evaluacion completa y firmada
                                evaluacionFirmada (id_seguimiento_recuperacion, docente_id);
                            } else if (data.code === 422) {
                                console.log(trimestre, grupo);
                                evaluacionPendienteDeFirma(id_seguimiento_recuperacion, docente_id, trimestre, grupo);
                            }
                        })
                        .catch(error => console.error('Error:', error));

                    } else if (data.code === 422) {
                    // evaluacion incompleta. falta evaluar componentes
                        evaluacionIncompleta();
                    }

                    //document.getElementById('estatus_firma').textContent = data.payload.estado_evaluacion;
                })
                .catch(error => console.error('Error:', error));
            }

            
        })
        .catch(error => console.error('Error:', error));

        fetch(`${academicaApiConfig.apiUrl}/historial_academico/seguimiento_recuperacion?&modulo=${modulo}&trimestre=${trimestre}&grupo=${grupo}&detalle=true`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                clearTables();

                // Crear tabla de calificaciones
                var table = createTable(data.payload.calificaciones_alumnos);
                document.getElementById('seguimiento_recuperacion_grupo_table').appendChild(table);

                // Crear tabla de información general
                var infoTable = createInfoTable(data.payload.informacion_general);
                document.getElementById('info_general').appendChild(infoTable);

                // Crear tabla de asignación docente
                var docentesTable = createDocentesTable(data.payload.informacion_general.docentes);
                document.getElementById('asignacion_docente').appendChild(docentesTable);
            })
            .catch(error => console.error('Error:', error));
    }

}

window.onload = function(){
    console.log('window.onload');
    loadDataFromUrlParams();
}