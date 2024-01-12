document.getElementById('asignacion_docente_form').addEventListener('submit', function(event) {
    event.preventDefault();

    var trimestre = document.getElementById('trimestre').value;
    var numero_economico = document.getElementById('numero_economico').value;

    fetch(`http://localhost:5000/historial_academico/asignacion_por_docente?trimestre=${trimestre}&numero_economico=${numero_economico}&detalle=true`)
        .then(response => response.json())
        .then(data => {
            // Hacer algo con los datos devueltos
            console.log(data);

            // Limpiar tablas existentes
            clearTables();

            // Asignación
            var table = createTable(data.payload.asignacion);
            document.getElementById('asignacion_docente').appendChild(table);

            // Info Docente
            var infoDocente= createInfoDocenteTable(data.payload);
            document.getElementById('info_docente').appendChild(infoDocente);
        })
        .catch(error => console.error('Error:', error));
});


function createTable(data) {
    var table = document.createElement('table');
    var caption = table.createCaption();
    caption.textContent = 'Asignación';
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

function createInfoDocenteTable(informacion_general) {
    var infoDocenteTable = document.createElement('table');
    var caption = infoDocenteTable.createCaption();
    caption.textContent = 'Docente';
    caption.style.fontWeight = 'bold';

    // For each property in "informacion_general"
    for (var key in informacion_general) {
        if (key === 'asignacion') continue;

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
        infoDocenteTable.appendChild(infoTableRow);
    }

    return infoDocenteTable;
}

function clearTables() {
    document.getElementById('asignacion_docente').innerHTML = '';
    document.getElementById('info_docente').innerHTML = '';
}