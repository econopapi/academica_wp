

var selectTrimestre = document.getElementById('trimestre');
var selectGrupo = document.getElementById('grupo');
var hiddenDocente = document.getElementById('docente');

// disable the select "grupo" by default
selectGrupo.disabled = true;

function createTable(data, mapeo) {
    if (data.length === 0) return null; // Si no hay datos, no se crea la tabla

    var table = document.createElement('table');
    var caption = table.createCaption();
    caption.textContent = 'Calificaciones';
    caption.style.fontWeight = 'bold';

    // Claves que no se deben exluir:
    var excludeKeys = ['numero_lista', 'nombre_alumno', 'matricula', 'calificacion_numero', 'calificacion_letra'];

    var componentes = mapeo.map(docente => docente.componente);
    // Filtrar las claves del primer objeto para incluir solo las necesarias
    var titles = Object.keys(data[0]).filter(key => 
        excludeKeys.includes(key) || componentes.includes(key)
    );

    // Remover "calificacion_numero" y "calificacion_letra" si están presentes
    titles = titles.filter(title => title !== "calificacion_numero" && title !== "calificacion_letra");

    // Añadir "calificacion_numero" y "calificacion_letra" al final
    titles.push("calificacion_numero", "calificacion_letra");

    // Añadir cabeceras de tabla
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');

    titles.forEach(title => {
        var th = document.createElement('th');
        th.textContent = title.replace(/_/g, ' '); // Reemplaza guiones bajos por espacios
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Añadir filas de datos
    var tbody = document.createElement('tbody');
    data.forEach(item => {
        var row = document.createElement('tr');
        titles.forEach(key => {
            var td = document.createElement('td');
            td.textContent = item[key] !== null ? item[key] : ''; // Manejar valores null
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
    document.getElementById('seguimiento_global_grupo_table').innerHTML = '';
    document.getElementById('asignacion_docente').innerHTML = '';
    document.getElementById('info_general').innerHTML = '';
    document.getElementById('estatus_firma').innerHTML = '';
    document.getElementById('notification').innerHTML = '';
}

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
            selectGrupo.disabled = false;
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


document.getElementById('grupo').addEventListener('change', function(event) {
    event.preventDefault();

    document.getElementById('loading-screen').style.display = 'block';

    var trimestre = document.getElementById('trimestre').value;
    var grupo = document.getElementById('grupo').value;


    fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/get_seguimiento_id?trimestre=${trimestre}&grupo=${grupo}&docente_email=${hiddenDocente.value}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // fill the div with id "estatus_firma" with the data obtained
        var id_seguimiento_global = data.metadata.id_seguimiento_global; // Store the id_seguimiento_global
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
                            document.getElementById('loading-screen').style.display = 'none';
                            evaluacionFirmada(id_seguimiento_global, docente_id);
                            
                        } else if (data.code === 422) {
                        // evaluacion completa. pendiente de confirmacion
                            document.getElementById('loading-screen').style.display = 'none';
                            evaluacionPendienteDeFirma(id_seguimiento_global, docente_id, grupo, trimestre);
                        }
                    })
                    .catch(error => console.error('Error:', error));

                } else if (data.code === 422) {
                // evaluacion incompleta. falta evaluar componentes
                    document.getElementById('loading-screen').style.display = 'none';
                    evaluacionIncompleta();
                }

                document.getElementById('estatus_firma').textContent = data.payload.estado_evaluacion;
            })
            .catch(error => console.error('Error:', error));
        }

        
    })
    .catch(error => console.error('Error:', error));

    fetch(`${academicaApiConfig.apiUrl}/historial_academico/seguimiento_global?trimestre=${trimestre}&grupo=${grupo}&detalle=true`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading-screen').style.display = 'block';
            //console.log(data);
            clearTables();

            // Crear tabla de calificaciones
            var table = createTable(data.payload.calificaciones_alumnos, data.payload.informacion_general.docentes);
            document.getElementById('seguimiento_global_grupo_table').appendChild(table);

            // Crear tabla de información general
            var infoTable = createInfoTable(data.payload.informacion_general);
            document.getElementById('info_general').appendChild(infoTable);

            // Crear tabla de asignación docente
            var docentesTable = createDocentesTable(data.payload.informacion_general.docentes);
            document.getElementById('asignacion_docente').appendChild(docentesTable);
            document.getElementById('loading-screen').style.display = 'none';
        })
        .catch(error => console.error('Error:', error));
});

function evaluacionPendienteDeFirma(id_seguimiento_global, docente_id, trimestre, grupo) {
    var div = document.createElement('div');
    div.className = 'notification-orange';
    div.textContent = "Evaluación completa. Pendiente de confirmación.";

    var form = document.createElement('form');
    form.id = 'firma_form';

    var hiddenSeguimientoGlobal = document.createElement('input');
    hiddenSeguimientoGlobal.type = 'hidden';
    hiddenSeguimientoGlobal.name = 'id_seguimiento_global';
    hiddenSeguimientoGlobal.value = id_seguimiento_global;

    var hiddenDocenteId = document.createElement('input');
    hiddenDocenteId.type = 'hidden';
    hiddenDocenteId.name = 'docente_id';
    hiddenDocenteId.value = docente_id;

    var submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.className = 'firmar-button';
    submitButton.value = 'Ponderar y confirmar';

    form.appendChild(hiddenSeguimientoGlobal);
    form.appendChild(hiddenDocenteId);
    form.appendChild(submitButton);

    // crear boton para volver a la pagina de asignacion docente con el estilo de boton
    var button = document.createElement('button');
    button.className = 'firmar-button';
    button.textContent = 'Volver a asignación docente';
    button.addEventListener('click', function(event) {  
        window.open('/academica-docentes-asignacion-global/', '_self'); 
    });

    document.getElementById('estatus_firma').appendChild(div);
    document.getElementById('notification').appendChild(form);
    document.getElementById('notification').appendChild(button);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        document.getElementById('loading-screen').style.display = 'block';
        var id_seguimiento_global = hiddenSeguimientoGlobal.value;
        var docente_id = hiddenDocente.value;

        let url = `${academicaApiConfig.apiUrl}/evaluacion_academica/firma_evaluacion`;
        let params = {
            id_seguimiento: id_seguimiento_global,
            docente_email: docente_id
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
                window.location.reload();
            }
        })
    });
}


function evaluacionFirmada(id_seguimiento_global, docente_id) {
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
        window.open('/academica-docentes-asignacion-global/', '_self');
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
        window.open('/academica-docentes-asignacion-global/', '_self');
    });

    document.getElementById('estatus_firma').appendChild(div);
    document.getElementById('notification').appendChild(button);


}

function loadDataFromUrlParams() {

    console.log('loadDataFromUrlParams');
    document.getElementById('loading-screen').style.display = 'block';

    // current url
    var url = new URL(window.location.href);

    // get url params
    var trimestre = url.searchParams.get('trimestre');
    var grupo = url.searchParams.get('grupo');

    // verify if the url has the params
    if (trimestre && grupo) {

        fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/get_seguimiento_id?trimestre=${trimestre}&grupo=${grupo}&docente_email=${hiddenDocente.value}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // fill the div with id "estatus_firma" with the data obtained
            var id_seguimiento_global = data.metadata.id_seguimiento_global; // Store the id_seguimiento_global
            var docente_id = data.metadata.docente_id;
            if (data.code === 200) {
                fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/verificar_estado_evaluacion?id_seguimiento=${data.metadata.id_seguimiento_global}&docente_id=${data.metadata.docente_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);

                    if (data.code === 200) {

                        fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/verificar_firma_seguimiento?id_seguimiento=${id_seguimiento_global}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            if (data.code === 200) {
                            // evaluacion completa y firmada
                                document.getElementById('loading-screen').style.display = 'none';
                                evaluacionFirmada(id_seguimiento_global, docente_id);
                            } else if (data.code === 422) {
                                console.log(trimestre, grupo);
                                document.getElementById('loading-screen').style.display = 'none';
                                evaluacionPendienteDeFirma(id_seguimiento_global, docente_id, trimestre, grupo);
                            }
                        })
                        .catch(error => console.error('Error:', error));

                    } else if (data.code === 422) {
                    // evaluacion incompleta. falta evaluar componentes
                        document.getElementById('loading-screen').style.display = 'none';
                        evaluacionIncompleta();
                    }

                    //document.getElementById('estatus_firma').textContent = data.payload.estado_evaluacion;
                })
                .catch(error => console.error('Error:', error));
            }

            
        })
        .catch(error => console.error('Error:', error));

        fetch(`${academicaApiConfig.apiUrl}/historial_academico/seguimiento_global?trimestre=${trimestre}&grupo=${grupo}&detalle=true`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                document.getElementById('loading-screen').style.display = 'block';
                clearTables();

                // Crear tabla de calificaciones
                var table = createTable(data.payload.calificaciones_alumnos, data.payload.informacion_general.docentes);
                document.getElementById('seguimiento_global_grupo_table').appendChild(table);

                // Crear tabla de información general
                var infoTable = createInfoTable(data.payload.informacion_general);
                document.getElementById('info_general').appendChild(infoTable);

                // Crear tabla de asignación docente
                var docentesTable = createDocentesTable(data.payload.informacion_general.docentes);
                document.getElementById('asignacion_docente').appendChild(docentesTable);
                document.getElementById('loading-screen').style.display = 'none';
            })
            .catch(error => console.error('Error:', error));
    }

}

window.onload = function(){
    console.log('window.onload');
    loadDataFromUrlParams();

}