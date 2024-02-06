var selectTrimestre = document.getElementById('trimestre');
var selectGrupo = document.getElementById('grupo');
var hiddenDocente = document.getElementById('docente');


// disable the select "grupo" by default
selectGrupo.disabled = true;

// event listener for "trimestre" select element
selectTrimestre.addEventListener('change', function() {
    // Toma el valor seleccionado en "trimestre"
    var trimestreSeleccionado = this.value;
    var docente = hiddenDocente.value;


    // api GET request with selected data
    fetch(`http://localhost:5000/historial_academico/grupos_por_trimestre?trimestre=${trimestreSeleccionado}&docente=${docente}`)
        .then(response => response.json())
        .then(data => {
            // Habilita el select "grupo" y llena sus opciones con la respuesta de la API
            selectGrupo.disabled = false;
            selectGrupo.innerHTML = data['payload'].map(function(grupo) {
                return '<option value="'+ grupo.grupo +'">' + grupo.grupo.toUpperCase() + '</option>';
            }).join('');
        });
});


document.getElementById('seguimiento_global_grupo_form').addEventListener('submit', function(event) {
    event.preventDefault();

    var trimestre = document.getElementById('trimestre').value;
    var grupo = document.getElementById('grupo').value;

    fetch(`http://localhost:5000/historial_academico/seguimiento_global?trimestre=${trimestre}&grupo=${grupo}&detalle=true`)
        .then(response => response.json())
        .then(data => {
            

            // Limpiar tablas existentes
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

        fetch(`http://localhost:5000/historial_academico/seguimiento_global?trimestre=${trimestre}&grupo=${grupo}&detalle=true`)
            .then(response => response.json())
            .then(data => {
                // Hacer algo con los datos devueltos
                console.log(data);

                // Limpiar tablas existentes
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

        fetch(`http://localhost:5000/evaluacion_academica/global/get_seguimiento_id?trimestre=${trimestre}&grupo=${grupo}&docente_email=${hiddenDocente.value}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // fill the div with id "estatus_firma" with the data obtained
            var id_seguimiento_global = data.metadata.id_seguimiento_global; // Store the id_seguimiento_global
            var docente_id = data.metadata.docente_id; // Store the docente_id
            if (data.code === 200) {
                fetch(`http://localhost:5000/evaluacion_academica/global/verificar_estado_evaluacion?id_seguimiento_global=${data.metadata.id_seguimiento_global}&docente_id=${data.metadata.docente_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);

                    if (data.code === 200) {

                        fetch(`http://localhost:5000/evaluacion_academica/global/verificar_firma_acta?id_seguimiento_global=${id_seguimiento_global}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            if (data.code === 200) {
                                var div = document.createElement('div');
                                div.className = 'notification-green';
                                div.textContent = "Acta firmada";
                                document.getElementById('estatus_firma').appendChild(div);
                            } else if (data.code === 422) {
                                var div = document.createElement('div');
                                div.className = 'notification-neutral';
                                div.textContent = "Evaluación completa. Pendiente de firma.";

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
                                submitButton.value = 'Firmar evaluación';

                                form.appendChild(hiddenSeguimientoGlobal);
                                form.appendChild(hiddenDocenteId);
                                form.appendChild(submitButton);

                                
                                document.getElementById('estatus_firma').appendChild(div);
                                document.getElementById('estatus_firma').appendChild(form);


                                form.addEventListener('submit', function(event) {
                                    event.preventDefault();
                                    var id_seguimiento_global = hiddenSeguimientoGlobal.value;
                                    var docente_id = hiddenDocente.value;

                                    let url = 'http://localhost:5000/evaluacion_academica/global/firma_evaluacion';
                                    let params = {
                                        id_seguimiento_global: id_seguimiento_global,
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
                                            alert('Acta firmada con éxito');
                                            window.location.href = '/academica-historial-academico-evaluacion-global-grupo?trimestre=' + selectTrimestre.value + '&grupo=' + selectGrupo.value;
                                        } else {
                                            alert('Error al firmar el acta');
                                        }
                                    })
                                });
                            }
                        })
                        .catch(error => console.error('Error:', error));

                    } else if (data.code === 422) {
                        var div = document.createElement('div');
                        div.className = 'notification-red';
                        div.textContent = "Evaluación incompleta. Faltan componentes por evaluar";
                        document.getElementById('estatus_firma').appendChild(div);
                    }

                    document.getElementById('estatus_firma').textContent = data.payload.estado_evaluacion;
                })
                .catch(error => console.error('Error:', error));
            }

            
        })
        .catch(error => console.error('Error:', error));
});


function createTable(data) {
    var table = document.createElement('table');
    var caption = table.createCaption();
    caption.textContent = 'Calificaciones';
    caption.style.fontWeight = 'bold';

    // Añadir cabeceras de tabla
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');

    Object.keys(data[0]).forEach(key => {
        var th = document.createElement('th');
        th.textContent = key;
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

    // For each property in "informacion_general"
    for (var key in informacion_general) {
        if (key === 'docentes') continue;

        // Create a table row for each property
        var infoTableRow = document.createElement('tr');

        // Create a table header cell for the property
        var infoTableHeaderCell = document.createElement('th');
        infoTableHeaderCell.textContent = key;

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
        headerCell.textContent = key;

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
            docenteCell.textContent = docente[docenteKey];

            // Agregar la celda a la fila
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
}

function loadDataFromUrlParams() {

    console.log('loadDataFromUrlParams');

    // current url
    var url = new URL(window.location.href);

    // get url params
    var trimestre = url.searchParams.get('trimestre');
    var grupo = url.searchParams.get('grupo');

    // verify if the url has the params
    if (trimestre && grupo) {

        fetch(`http://localhost:5000/historial_academico/seguimiento_global?trimestre=${trimestre}&grupo=${grupo}&detalle=true`)
            .then(response => response.json())
            .then(data => {
                // Hacer algo con los datos devueltos
                console.log(data);

                // Limpiar tablas existentes
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

        fetch(`http://localhost:5000/evaluacion_academica/global/get_seguimiento_id?trimestre=${trimestre}&grupo=${grupo}&docente_email=${hiddenDocente.value}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // fill the div with id "estatus_firma" with the data obtained
            var id_seguimiento_global = data.metadata.id_seguimiento_global; // Store the id_seguimiento_global
            var docente_id = data.metadata.docente_id;
            if (data.code === 200) {
                fetch(`http://localhost:5000/evaluacion_academica/global/verificar_estado_evaluacion?id_seguimiento_global=${data.metadata.id_seguimiento_global}&docente_id=${data.metadata.docente_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);

                    if (data.code === 200) {

                        fetch(`http://localhost:5000/evaluacion_academica/global/verificar_firma_acta?id_seguimiento_global=${id_seguimiento_global}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            if (data.code === 200) {
                                var div = document.createElement('div');
                                div.className = 'notification-green';
                                div.textContent = "Acta firmada";
                                document.getElementById('estatus_firma').appendChild(div);
                            } else if (data.code === 422) {
                                var div = document.createElement('div');
                                div.className = 'notification-neutral';
                                div.textContent = "Evaluación completa. Pendiente de firma.";

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
                                submitButton.value = 'Firmar evaluación';

                                form.appendChild(hiddenSeguimientoGlobal);
                                form.appendChild(hiddenDocenteId);
                                form.appendChild(submitButton);

                                
                                document.getElementById('estatus_firma').appendChild(div);
                                document.getElementById('estatus_firma').appendChild(form);


                                form.addEventListener('submit', function(event) {
                                    event.preventDefault();
                                    var id_seguimiento_global = hiddenSeguimientoGlobal.value;
                                    var docente_id = hiddenDocente.value;

                                    let url = 'http://localhost:5000/evaluacion_academica/global/firma_evaluacion';
                                    let params = {
                                        id_seguimiento_global: id_seguimiento_global,
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
                                            alert('Acta firmada con éxito');
                                            window.location.href = '/academica-historial-academico-evaluacion-global-grupo?trimestre=' + selectTrimestre.value + '&grupo=' + selectGrupo.value;
                                        } else {
                                            alert('Error al firmar el acta');
                                        }
                                    })
                                });
                            }
                        })
                        .catch(error => console.error('Error:', error));

                    } else if (data.code === 422) {
                        var div = document.createElement('div');
                        div.className = 'notification-red';
                        div.textContent = "Evaluación incompleta. Faltan componentes por evaluar";
                        document.getElementById('estatus_firma').appendChild(div);
                    }

                    //document.getElementById('estatus_firma').textContent = data.payload.estado_evaluacion;
                })
                .catch(error => console.error('Error:', error));
            }

            
        })
        .catch(error => console.error('Error:', error));
    }

}


window.onload = function(){
    console.log('window.onload');
    loadDataFromUrlParams();
}