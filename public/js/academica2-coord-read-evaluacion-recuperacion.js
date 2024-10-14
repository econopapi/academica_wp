var selectTrimestre = document.getElementById('trimestre');
var selectGrupo = document.getElementById('grupo');
var selectModulo = document.getElementById('modulo');

// Deshabilita el select "grupo" al cargar la página
selectGrupo.disabled = true;

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

// Agrega un evento de cambio al select "trimestre"
selectTrimestre.addEventListener('change', function() {
    // Toma el valor seleccionado en "trimestre"
    var trimestreSeleccionado = this.value;

    // Haz una solicitud GET a la API con el valor seleccionado
    fetch(`${academicaApiConfig.apiUrl}/historial_academico/grupos_por_trimestre?trimestre=${trimestreSeleccionado}`)
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

    fetch(`${academicaApiConfig.apiUrl}/historial_academico/seguimiento_recuperacion?trimestre=${trimestre}&grupo=${grupo}&modulo=${selectModulo.value}&detalle=true`)
        .then(response => response.json())
        .then(data => {
            // Hacer algo con los datos devueltos
            console.log(data);

            // Limpiar tablas existentes
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
        })
        .catch(error => console.error('Error:', error));
});


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

        fetch(`${academicaApiConfig.apiUrl}/historial_academico/seguimiento_recuperacion?trimestre=${trimestre}&grupo=${grupo}&detalle=true`)
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
    }

}

window.onload = function(){
    console.log('window.onload');
    loadDataFromUrlParams();
}