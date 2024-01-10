<?php

/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       http://dlimon.net/
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/public/partials
 */
?>
<style>
body {
    font-family: Arial, Helvetica, sans-serif;
}

h2 {
    text-align: center;
}

#info_general {
    order: 1
}

#asignacion_docente {
    order: 2;
}


#seguimiento_global_grupo_form {
    display: flex;
    justify-content: center;
    align-items: center;
}

#seguimiento_global_grupo_table,
#head {
    margin: 0 auto;
    width: 70%;
}


#asignacion_docente th,
#asignacion_docente td,
#info_general td{
    font-size: 20px;

    padding-left: 20px;
    padding-right: 20px;
    padding-top: 0px;
    text-align: left;
    border-bottom: 1px solid #ddd;

}



/* Cool style for the table */
#seguimiento_global_grupo_table table, {
    margin: 16px 16px;
    border-collapse: collapse;
    width: 100%;
}

#seguimiento_global_grupo_table th,
#seguimiento_global_grupo_table td {
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 6px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

#seguimiento_global_grupo_table th {
    background-color: #f2f2f2;
    color: #333;
}

#seguimiento_global_grupo_table tr:nth-child(even) {
    background-color: #f9f9f9;
}

#seguimiento_global_grupo_table tr:hover {
    background-color: #f5f5f5;
}

#head {
    display: flex;
    justify-content: space-between;
}
</style>
<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<h2>Evaluaciones globales</h2>
<form id="seguimiento_global_grupo_form">
    <label for="trimestre">Trimestre:</label>
    <select id="trimestre" name="trimestre">
        <option value="23p">23 Primavera</option>
        <option value="23i">23 Invierno</option>
    </select>

    <label for="grupo">Grupo:</label>
    <select id="grupo" name="grupo">
        <option value="sd01e">SD01E</option>
        <option value="sd02e">SD02E</option>
        <option value="sd03e">SD03E</option>
        <option value="sd51e">SD51E</option>
        <option value="sd52e">SD52E</option>
        <option value="sf01e">SF51E</option>
        <option value="sj51e">SJ51E</option>
        <option value="sl01e">SL01E</option>
        <option value="sl02e">SL02E</option>
    </select>

    <input type="submit" value="Submit">
</form>

<div id="head">
    <div id="info_general"></div>
    <div id="asignacion_docente"></div>
</div>

<div id="seguimiento_global_grupo_table"></div>

<script>
document.getElementById('seguimiento_global_grupo_form').addEventListener('submit', function(event) {
    event.preventDefault();

    var trimestre = document.getElementById('trimestre').value;
    var grupo = document.getElementById('grupo').value;

fetch(`http://localhost:5000/historial_academico/seguimiento_global?trimestre=${trimestre}&grupo=${grupo}&detalle=true`)
        .then(response => response.json())
        .then(data => {
            // Hacer algo con los datos devueltos
            console.log(data);    
            var table = createTable(data.payload.calificaciones_alumnos);
            document.getElementById('seguimiento_global_grupo_table').innerHTML = '';
            document.getElementById('asignacion_docente').innerHTML = '';
            document.getElementById('info_general').innerHTML = '';
            
            var infoTable = document.createElement('table');
            var infoTableCaption = infoTable.createCaption();
            infoTableCaption.textContent = 'Información general';
            infoTableCaption.style.fontWeight = 'bold';

            // For each property in "informacion_general"
            for (var key in data.payload.informacion_general) {
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
                infoTableCell.textContent = data.payload.informacion_general[key];

                // Add the cell to the row
                infoTableRow.appendChild(infoTableCell);

                // Add the row to the table
                infoTable.appendChild(infoTableRow);
            }

            

            // Crear una nueva tabla para "docentes"
            var docentesTable = document.createElement('table');
            var caption = docentesTable.createCaption();
            caption.textContent = 'Asignación docente';
            caption.style.fontWeight = 'bold';

            // Obtener las claves de la primera docente
            var firstDocente = data.payload.informacion_general.docentes[0];

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
            data.payload.informacion_general.docentes.forEach(function(docente) {
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

            // Agregar la tabla al documento
            //document.getElementById('seguimiento_global_grupo_table').appendChild(infoTable);
            document.getElementById('asignacion_docente').appendChild(docentesTable);
            document.getElementById('info_general').appendChild(infoTable);
            document.getElementById('seguimiento_global_grupo_table').appendChild(table);
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

</script>