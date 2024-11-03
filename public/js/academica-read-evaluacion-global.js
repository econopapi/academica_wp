var selectTrimestre = document.getElementById('trimestre');
var selectGrupo = document.getElementById('grupo');
var hiddenDocente = document.getElementById('docente');

function loadTrimestres() {
    apiRequest('GET', '/trimestres/')
        .then(data => {
            if (data.status === 200) {
                const trimestres = data.payload.data;

                trimestres.forEach(trimestre => {
                    const option = document.createElement('option');
                    option.value = trimestre.trimestre;
                    option.textContent = trimestre.trimestre_nombre;
                    selectTrimestre.appendChild(option);
                });
            } else {
                console.error('Error al obtener trimestres;', data.message);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {

    // disable the select "grupo" by default
    selectGrupo.disabled = true;

    loadTrimestres();

    function exportExcel() {
        // Captura las tablas HTML
        const infoGeneralTable = document.querySelector("#info_general table");
        const asignacionDocenteTable = document.querySelector("#asignacion_docente table");
        const calificacionesTable = document.querySelector("#seguimiento_recuperacion_grupo_table table");
    
        // Convierte las tablas en hojas de Excel usando SheetJS
        const workbook = XLSX.utils.book_new();
        workbook.Props = { Title: "Datos del Grupo" };
    
        function tableToSheet(table, sheetName) {
            const ws = XLSX.utils.table_to_sheet(table);
    
            // Ajustar el ancho de las columnas
            const colWidths = [];
            const range = XLSX.utils.decode_range(ws['!ref']);
    
            for (let i = range.s.c; i <= range.e.c; i++) {
                const columnLetter = String.fromCharCode('A'.charCodeAt(0) + i);
                const maxLength = Math.max(
                    ...Object.keys(ws)
                        .filter(cell => cell.startsWith(columnLetter))
                        .map(cell => {
                            // Asegurarse de que se manejen correctamente los valores numéricos y vacíos
                            const cellValue = ws[cell].v ? ws[cell].v.toString() : '';
                            return cellValue.length; // Longitud del valor convertido a string
                        })
                );
    
                // Aumentar el margen en 4 para ver si eso mejora el ancho
                colWidths.push({ wpx: (maxLength) * 10 }); // Añadir un margen de 4 caracteres
            }
    
            ws['!cols'] = colWidths; // Establece los anchos de columna
    
            XLSX.utils.book_append_sheet(workbook, ws, sheetName);
        }
    
        tableToSheet(infoGeneralTable, "Información General");
        tableToSheet(asignacionDocenteTable, "Asignación Docente");
        tableToSheet(calificacionesTable, "Calificaciones");
    
        // Descargar el archivo Excel
        const grupoValue = document.getElementById("info_general").querySelector("td").innerText; // Asumiendo que el grupo es la primera celda
        XLSX.writeFile(workbook, `${grupoValue}_Evaluacion.xlsx`);
    }
    
    function exportPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape'); // Horizontal
    
        // Cargar el logo
        const logoUrl = 'https://i.imgur.com/qBflVVw.png'; // Reemplaza con la URL del logo
        const logoWidth = 15; // Ancho del logo
        const logoHeight = 15; // Alto del logo
    
        // Agregar el logo al PDF
        doc.addImage(logoUrl, 'PNG', 10, 10, logoWidth, logoHeight); // Cambia 'PNG' por 'JPEG' si tu logo es en ese formato
    
        // Añadir el título debajo del logo
        doc.setFontSize(16);
        doc.text("Evaluación de recuperación", 30, 20); // Ajusta la posición según sea necesario
    
        // Posición inicial Y
        let currentY = 35; // Establecer una posición arbitraria para el siguiente contenido
    
        // Función para capturar datos de tablas
        function getTableData(tableId) {
            const table = document.getElementById(tableId);
            const bodyData = [];
            const headerData = [];
    
            // Obtiene los encabezados
            const headers = table.getElementsByTagName('th');
            for (let i = 0; i < headers.length; i++) {
                headerData.push(headers[i].innerText);
            }
    
            // Obtiene las filas de datos
            const rows = table.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
                const cols = rows[i].getElementsByTagName('td');
                if (cols.length > 0) {
                    const rowData = [];
                    for (let j = 0; j < cols.length; j++) {
                        rowData.push(cols[j].innerText);
                    }
                    bodyData.push(rowData);
                }
            }
    
            return { header: headerData, body: bodyData };
        }
    
        // Captura datos de "Información General"
        const infoGeneralData = getTableData("info_general");
        const headerColor = [0, 114, 204]; // Color azul especificado (RGB)
    
        // Ajustar los datos de Información General para que se muestren en dos columnas
        const formattedInfoGeneral = [];
        for (let i = 0; i < infoGeneralData.body.length; i++) {
            const row = infoGeneralData.body[i];
            formattedInfoGeneral.push([infoGeneralData.header[i], row[0]]); // Añadir encabezado y valor
        }
    
        // Añade el título y contenido de Información General
        doc.text("Información General", 10, currentY); // Utiliza la posición actual
        currentY += 5; // Incrementa la posición para el siguiente contenido
    
        // Crea la tabla de Información General
        doc.autoTable({
            body: formattedInfoGeneral,
            startY: currentY, // Inicia la tabla en la posición actual
            theme: 'grid',
            columnStyles: { 0: { cellWidth: '50%' }, 1: { cellWidth: '50%' } },
            headStyles: { fillColor: headerColor } // Cambiar el color de fondo del encabezado
        });
    
        // Actualiza la posición Y después de la tabla
        currentY = doc.autoTable.previous.finalY + 10; // Establece la nueva posición Y
    
        // Añade un espacio antes de la siguiente sección
        doc.text("Asignación Docente", 10, currentY);
        currentY += 10; // Incrementa la posición para el siguiente contenido
    
        const asignacionDocenteData = getTableData("asignacion_docente");
    
        // Configura la tabla de asignación docente
        const asignacionDocenteBody = asignacionDocenteData.body.map(row => {
            return row; // Mantener la estructura de columnas tal como está
        });
    
        doc.autoTable({
            head: [asignacionDocenteData.header],
            body: asignacionDocenteBody,
            startY: currentY, // Inicia la tabla en la posición actual
            theme: 'grid',
            columnStyles: { 0: { cellWidth: '50%' }, 1: { cellWidth: '50%' } },
            headStyles: { fillColor: headerColor } // Cambiar el color de fondo del encabezado
        });
    
        // Actualiza la posición Y después de la tabla
        currentY = doc.autoTable.previous.finalY + 10; // Establece la nueva posición Y
    
        // Añade las Calificaciones ocupando todo el ancho
        doc.text("Calificaciones", 10, currentY);
        currentY += 10; // Incrementa la posición para el siguiente contenido
    
        const calificacionesData = getTableData("seguimiento_recuperacion_grupo_table");
    
        // Crea la tabla de calificaciones
        doc.autoTable({
            head: [calificacionesData.header],
            body: calificacionesData.body,
            startY: currentY, // Inicia la tabla en la posición actual
            theme: 'grid',
            columnStyles: { 0: { cellWidth: 'auto' } }, // Ocupa todo el ancho,
            headStyles: { fillColor: headerColor } // Cambiar el color de fondo del encabezado
        });
    
        // Obtener el valor del grupo para nombrar el PDF
        const grupoValue = document.getElementById("info_general").querySelector("td").innerText; // Asumiendo que el grupo es la primera celda
        // Descargar el PDF
        doc.save(`${grupoValue}_Evaluacion.pdf`);
    }
        
    function createTable(data, mapeo) {
        if (data.length === 0) return null; // Si no hay datos, no se crea la tabla
        parentDiv = document.getElementById('seguimiento_global_grupo_table')
        // Crea un div contenedor para los botones
        const contenedorBotones = document.createElement("div");
        contenedorBotones.style.display = "flex";
        contenedorBotones.style.justifyContent = "flex-end"; // Alineación a la derecha
        contenedorBotones.style.gap = "10px"; // Espacio entre botones
        contenedorBotones.className = "contenedor-botones-descarga";

        // Crea el botón de descarga PDF
        const botonDescargarPDF = document.createElement("button");
        botonDescargarPDF.id = "botonDescargarPDF";
        botonDescargarPDF.className = "boton-descarga";
        botonDescargarPDF.innerHTML = '<i class="fas fa-file-pdf"></i> Descargar PDF';
        botonDescargarPDF.addEventListener("click", exportPDF);

        // Crea el botón de descarga Excel
        const botonDescargarExcel = document.createElement("button");
        botonDescargarExcel.id = "botonDescargarExcel";
        botonDescargarExcel.className = "boton-descarga";
        botonDescargarExcel.innerHTML = '<i class="fas fa-file-excel"></i> Descargar Excel';
        botonDescargarExcel.addEventListener("click", exportExcel);

        // Agrega los botones al contenedor de botones
        contenedorBotones.appendChild(botonDescargarPDF);
        contenedorBotones.appendChild(botonDescargarExcel);

        // Agrega el contenedor de botones al contenedor principal
        parentDiv.appendChild(contenedorBotones);    
        var table = document.createElement('table');
        var caption = table.createCaption();
        caption.textContent = 'Calificaciones';
        caption.style.fontWeight = 'bold';
    
        // Claves que no se deben exluir:
        var excludeKeys = ['numero_lista', 'nombre_alumno', 'matricula', 'calificacion_numero', 'calificacion_letra'];
    
        var componentes = mapeo.map(item => item.componente.nombre_componente);
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
            'nombre_uea': 'UEA',
            'clave_uea': 'Clave UEA',
            'coordinador': 'Coordinador/a'
        };

        var generalInfo = informacion_general[0];
        console.log(generalInfo);
        var grupo = generalInfo.grupo.grupo || 'No especificado';
        var trimestre = generalInfo.trimestre.trimestre_nombre || "No especificado";
        var modulo = generalInfo.uea.modulo || "No especificado";
        var nombreUea = generalInfo.uea.nombre_uea || "No especificado";
        var claveUea = generalInfo.uea.clave_uea || "No especificado";        

        // Obtener los coordinadores únicos
        var coordinadores = generalInfo.programacion_docente_global
            .filter(docente => docente.coordinacion)
            .reduce((unique, docente) => {
                if (!unique.some(d => d.nombre === docente.docente.nombre)) {
                    unique.push(docente.docente);
                }
                return unique;
            }, []);
        var coordinadorNames = coordinadores.map(coordinador => coordinador.nombre).join(', ');
    
        // Agregar cada fila a la tabla
        var rowsData = {
            'grupo': grupo.toUpperCase(),
            'trimestre': trimestre,
            'modulo': modulo,
            'nombre_uea': nombreUea,
            'clave_uea': claveUea,
            'coordinador': `⭐ ${coordinadorNames}`
        };

        for (var key in rowsData) {
            var infoTableRow = document.createElement('tr');

            // Crear una celda de encabezado para la propiedad
            var infoTableHeaderCell = document.createElement('th');
            infoTableHeaderCell.textContent = keyMapping[key] || key;
            infoTableRow.appendChild(infoTableHeaderCell);

            // Crear una celda para el valor de la propiedad
            var infoTableCell = document.createElement('td');
            infoTableCell.textContent = rowsData[key];
            infoTableRow.appendChild(infoTableCell);

            // Agregar la fila a la tabla
            infoTable.appendChild(infoTableRow);
        }

        return infoTable;
    }
    
    function createDocentesTable(docentes) {
        var docentesTable = document.createElement('table');
        var caption = docentesTable.createCaption();
        caption.textContent = 'Asignación docente';
        caption.style.fontWeight = 'bold';
    
        // Crear la fila de encabezado
        var headerRow = document.createElement('tr');
    
        // Crear encabezado para el nombre del docente
        var nombreHeaderCell = document.createElement('th');
        nombreHeaderCell.textContent = 'Nombre';
        headerRow.appendChild(nombreHeaderCell);
    
        // Crear encabezado para el nombre del componente
        var componenteHeaderCell = document.createElement('th');
        componenteHeaderCell.textContent = 'Componente';
        headerRow.appendChild(componenteHeaderCell);
    
        // Crear celda de encabezado vacía para la columna de evaluación completada
        var evaluacionHeaderCell = document.createElement('th');
        headerRow.appendChild(evaluacionHeaderCell);
    
        // Agregar la fila de encabezado a la tabla
        docentesTable.appendChild(headerRow);
    
        // Para cada objeto en "docentes"
        docentes.forEach(function(item) {
            var docente = item.docente;
            var componente = item.componente;
    
            // Crear una nueva fila
            var docenteRow = document.createElement('tr');
    
            // Crear celda para el nombre del docente
            var nombreCell = document.createElement('td');
            nombreCell.textContent = docente.nombre;
            docenteRow.appendChild(nombreCell);
    
            // Crear celda para el nombre del componente
            var componenteCell = document.createElement('td');
            componenteCell.textContent = componente.nombre_extenso;
            docenteRow.appendChild(componenteCell);
    
            // Crear celda para el estado de evaluación completada
            var evaluacionCell = document.createElement('td');
            evaluacionCell.textContent = item.evaluacion_completada ? '✅' : '⚠️';
            docenteRow.appendChild(evaluacionCell);
    
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

        selectGrupo.innerHTML='<option value="">Cargando...</option>';

        
    
    
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
    
        // Obtener los valores de trimestre y grupo seleccionados
        var trimestre = document.getElementById('trimestre').value;
        var grupo = document.getElementById('grupo').value;
    
        // Redirigir a la misma página con los parámetros de URL
        window.location.href = `${window.location.pathname}?trimestre=${trimestre}&grupo=${grupo}`;
    });
    
    function evaluacionPendienteDeFirma(id_evaluacion, docente_id, trimestre, grupo) {
        var div = document.createElement('div');
        div.className = 'notification-orange';
        div.textContent = "Evaluación completa. Pendiente de confirmación.";
    
        var form = document.createElement('form');
        form.id = 'firma_form';
    
        var hiddenSeguimientoGlobal = document.createElement('input');
        hiddenSeguimientoGlobal.type = 'hidden';
        hiddenSeguimientoGlobal.name = 'id_seguimiento_global';
        hiddenSeguimientoGlobal.value = id_evaluacion;
    
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
            
            var docente_id = hiddenDocente.value;
            var id_evaluacion = hiddenSeguimientoGlobal.value;
        
            let endpoint = `/evaluaciones/${id_evaluacion}/firma`;
            let params = {
                
                docente_email: docente_id
            };
        
            apiRequest('POST', endpoint, params)
                .then(data => {
                    if (data.status === 200) {
                        alert('Evaluación ponderada y confirmada con éxito!');
                        window.location.reload(); // reload de current page
                    } else {
                        alert('Error al firmar el acta');
                        window.location.reload();
                    }
                })
                .catch(error => {
                    console.error('Error en la solicitud', error);
                    alert('Error en la solicitud');
                    window.location.reload();
                });
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
        //console.log('loadDataFromUrlParams');
        document.getElementById('loading-screen').style.display = 'block';
    
        // current url
        var url = new URL(window.location.href);
    
        // get url params
        var trimestre = url.searchParams.get('trimestre');
        var grupo = url.searchParams.get('grupo');
        var id_evaluacion = url.searchParams.get('evaluacion');
        var docente = url.searchParams.get('docente');
    
        // verify if the url has the params
        if (trimestre && grupo) {
            // Preparar los parámetros para la solicitud
            const endpoint = `/evaluaciones/${id_evaluacion}?detalle=true`;
            // Realizar la solicitud usando apiRequest
            apiRequest('GET', endpoint)
                .then(data => {
                    document.getElementById('loading-screen').style.display = 'block';
                    clearTables();
                    // Crear tabla de notificaciones:
                    if (data.payload.informacion_general[0].evaluacion_completada === false) {
                        evaluacionIncompleta();
                    } else {
                        if (data.payload.informacion_general[0].evaluacion_finalizada === true) {
                            evaluacionFirmada();
                        } else {
                            evaluacionPendienteDeFirma(id_evaluacion, docente);
                        }
                    }
                    // Crear tabla de calificaciones
                    var table = createTable(data.payload.lista_alumnos, data.payload.informacion_general[0].programacion_docente_global);
                    document.getElementById('seguimiento_global_grupo_table').appendChild(table);

                    // Crear tabla de información general
                    var infoTable = createInfoTable(data.payload.informacion_general);
                    document.getElementById('info_general').appendChild(infoTable);

                    // Crear tabla de asignación docente
                    var docentesTable = createDocentesTable(data.payload.informacion_general[0].programacion_docente_global);
                    document.getElementById('asignacion_docente').appendChild(docentesTable);

                    document.getElementById('loading-screen').style.display = 'none';
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('loading-screen').style.display = 'none'; // Ocultar la pantalla de carga en caso de error
                });
        } else {
            document.getElementById('loading-screen').style.display = 'none';
        }
    }  
    window.onload = function(){   
        loadDataFromUrlParams();
    }
})