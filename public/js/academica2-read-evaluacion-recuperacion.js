var selectTrimestre = document.getElementById('trimestre');
var selectModulo = document.getElementById('modulo');
var selectGrupo = document.getElementById('grupo');
var hiddenDocente = document.getElementById('docente');

//selectModulo.disabled = true;

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

document.addEventListener('DOMContentLoaded', function() {

    // disable the select "grupo" by default
    selectGrupo.disabled = true;
    selectModulo.style.display = 'none';
    
    

    loadTrimestres();
        
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
    
        // Crear un objeto que mapee los valores de "componente" a "componente_extenso"
        var componenteMap = mapeo.reduce((acc, docente) => {
            acc[docente.componente] = docente.componente_extenso;
            return acc;
        }, {});
    
        // Agregar un objeto para mapear los títulos de las columnas fijas
        var fixedColumnTitles = {
            'numero_lista': 'Lista',
            'nombre_alumno': 'Nombre',
            'matricula': 'Matrícula',
            'calificacion_numero': 'Calificación (Número)',
            'calificacion_letra': 'Calificación (Letra)'
        };
    
        // Añadir cabeceras de tabla
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
    
        titles.forEach(title => {
            var th = document.createElement('th');
            th.textContent = fixedColumnTitles[title] || title.replace(/_/g, ' '); // Reemplaza guiones bajos por espacios
    
            // Utiliza el objeto "componenteMap" para obtener el título correspondiente
            if (componenteMap[title]) {
                th.textContent = componenteMap[title];
            }
    
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
            'clave_uea': 'Clave UEA',
            'coordinador': 'Coordinador/a'
        };
    
        // Get unique coordinators
        var coordinadores = informacion_general.docentes
            .filter(docente => docente.coordinacion)
            .reduce((unique, docente) => {
                if (!unique.some(d => d.nombre === docente.nombre)) {
                    unique.push(docente);
                }
                return unique;
            }, []);
    
        // Combine coordinator names into a single string
        var coordinadorNames = coordinadores.map(coordinador => coordinador.nombre).join(', ');
    
        // Add each property from "informacion_general" except "docentes"
        for (var key in informacion_general) {
            if (key === 'docentes') continue;
    
            var infoTableRow = document.createElement('tr');
    
            var infoTableHeaderCell = document.createElement('th');
            infoTableHeaderCell.textContent = keyMapping[key] || key;
            infoTableRow.appendChild(infoTableHeaderCell);
    
            var infoTableCell = document.createElement('td');
            infoTableCell.textContent = informacion_general[key];
            infoTableRow.appendChild(infoTableCell);
    
            infoTable.appendChild(infoTableRow);
        }
    
        // Add a row for the coordinator(s)
        var coordinatorRow = document.createElement('tr');
        var coordinatorHeaderCell = document.createElement('th');
        coordinatorHeaderCell.textContent = keyMapping['coordinador'];
        coordinatorRow.appendChild(coordinatorHeaderCell);
    
        var coordinatorCell = document.createElement('td');
        coordinatorCell.textContent = `⭐ ${coordinadorNames}`;
        coordinatorRow.appendChild(coordinatorCell);
    
        infoTable.appendChild(coordinatorRow);
    
        return infoTable;
    }
    
    function createDocentesTable(docentes) {
        var docentesTable = document.createElement('table');
        var caption = docentesTable.createCaption();
        caption.textContent = 'Asignación docente';
        caption.style.fontWeight = 'bold';
    
        // Crear la fila de encabezado
        var headerRow = document.createElement('tr');
    
        // Crear celdas para las columnas "nombre" y "componente_extenso"
        var headerCell1 = document.createElement('th');
        headerCell1.textContent = 'Nombre';
        var headerCell2 = document.createElement('th');
        headerCell2.textContent = 'Componente';
    
        // Agregar las celdas al encabezado
        headerRow.appendChild(headerCell1);
        headerRow.appendChild(headerCell2);
    
        // Agregar la fila de encabezado a la tabla
        docentesTable.appendChild(headerRow);
    
        // Para cada objeto en "docentes"
        docentes.forEach(function(docente) {
            // Crear una nueva fila
            var docenteRow = document.createElement('tr');
    
            // Crear celdas para las columnas "nombre" y "componente_extenso"
            var docenteCell1 = document.createElement('td');
            docenteCell1.textContent = docente.nombre;
            var docenteCell2 = document.createElement('td');
            docenteCell2.textContent = docente.componente_extenso;
    
            // Agregar las celdas a la fila
            docenteRow.appendChild(docenteCell1);
            docenteRow.appendChild(docenteCell2);
    
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
    
    // event listener for "trimestre" select element
    selectTrimestre.addEventListener('change', function() {
        // Toma el valor seleccionado en "trimestre"
        var trimestreSeleccionado = this.value;
        var docente = hiddenDocente.value;

        selectGrupo.innerHTML='<option value="">Cargando...</option>';

        
    
    
    // API GET request with selected data
    fetch(`${academicaApiConfig.apiUrl}/historial_academico/grupos_por_trimestre?recuperacion=true&trimestre=${trimestreSeleccionado}&docente=${docente}`)
        .then(response => response.json())
        .then(data => {
            // Habilita el select "grupo" y llena sus opciones con la respuesta de la API
            selectGrupo.disabled = false;
            var seen = {};
            var options = data['payload'].reduce(function(acc, item) {
                const grupo = item.grupo.grupo; // Accede a "grupo.grupo"
                const modulo = item.uea.modulo;
                if (!seen[grupo]) {
                    acc.push('<option value="'+ grupo +'" modulo="'+modulo+'">' + grupo.toUpperCase() + '</option>');
                    seen[grupo] = true;
                }
                return acc;
            }, []);
            selectGrupo.innerHTML = '<option value="">Grupo</option>' + options.join('');
        });
    });
    
    document.getElementById('grupo').addEventListener('change', function(event) {
        event.preventDefault();
    
        // Obtener los valores de trimestre y grupo seleccionados
        var trimestre = document.getElementById('trimestre').value;
        var grupo = document.getElementById('grupo').value;
        var modulo = document.getElementById('grupo').selectedOptions[0].getAttribute('modulo');
        //alert(modulo);
    
        // Redirigir a la misma página con los parámetros de URL
        window.location.href = `${window.location.pathname}?trimestre=${trimestre}&grupo=${grupo}&modulo=${modulo}`;
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
            document.getElementById('loading-screen').style.display = 'block';
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
                    //window.location.href = '/academica-historial-academico-evaluacion-recuperacion-grupo?trimestre=' + trimestre.value + '&grupo=' + grupo.value;
                    // reload de current page
                    window.location.reload();
                } else {
                    alert('Error al firmar el acta');
                    window.location.reload();
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
        var modulo = url.searchParams.get('modulo')
    
        // verify if the url has the params
        if (trimestre && grupo) {
    
            fetch(`${academicaApiConfig.apiUrl}/evaluacion_academica/get_seguimiento_id?recuperacion=true&modulo=${modulo}&trimestre=${trimestre}&grupo=${grupo}&docente_email=${hiddenDocente.value}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // fill the div with id "estatus_firma" with the data obtained
                var id_seguimiento_recuperacion = data.metadata.id_seguimiento_recuperacion; // Store the id_seguimiento_recuperacion
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
                                    document.getElementById('loading-screen').style.display = 'none';
                                    evaluacionFirmada(id_seguimiento_recuperacion, docente_id);
                                } else if (data.code === 422) {
                                    console.log(trimestre, grupo);
                                    document.getElementById('loading-screen').style.display = 'none';
                                    evaluacionPendienteDeFirma(id_seguimiento_recuperacion, docente_id, trimestre, grupo);
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
            
            
            fetch(`${academicaApiConfig.apiUrl}/historial_academico/seguimiento_recuperacion?recuperacion=true&modulo=${modulo}&trimestre=${trimestre}&grupo=${grupo}&detalle=true`)
                .then(response => response.json())
                .then(data => {
                    //console.log(data);
                    document.getElementById('loading-screen').style.display = 'block';
                    clearTables();
    
                    // Crear tabla de calificaciones
                    var table = createTable(data.payload.calificaciones_alumnos, data.payload.informacion_general.docentes);
                    document.getElementById('seguimiento_recuperacion_grupo_table').appendChild(table);
    
                    // Crear tabla de información general
                    var infoTable = createInfoTable(data.payload.informacion_general);
                    document.getElementById('info_general').appendChild(infoTable);
    
                    // Crear tabla de asignación docente
                    var docentesTable = createDocentesTable(data.payload.informacion_general.docentes);
                    document.getElementById('asignacion_docente').appendChild(docentesTable);
                    document.getElementById('loading-screen').style.display = 'none';
                })
                .catch(error => console.error('Error:', error));
        } else {
            // fetch(`${academicaApiConfig.apiUrl}/trimestres/`)
            // .then(response => response.json())
            // .then(data => {
            //     if (data.status === 200) {
            //         const trimestres = data.data;

            //         trimestres.forEach(trimestre => {
            //             const option = document.createElement('option');
            //             option.value = trimestre.trimestre;
            //             option.textContent = trimestre.trimestre_nombre;
            //             selectTrimestre.appendChild(option);
                        
            //         });
            //         document.getElementById('loading-screen').style.display = 'none';
            //         selectGrupo.disabled = true;  // Mantener deshabilitado el grupo hasta que se seleccione un trimestre
            //     } else {
            //         console.error('Error al obtener trimestres:', data.message);
            //     }
            // })
            // .catch(error => console.error('Error en la solicitud', error));
            //loadTrimestres();
            document.getElementById('loading-screen').style.display = 'none';
        }
    
    }
    
    window.onload = function(){
        console.log('window.onload');
        loadDataFromUrlParams();
    }
    
})



