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
            const trimestres = data.payload.data;

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
        parentDiv = document.getElementById('seguimiento_recuperacion_grupo_table')
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
            acc[docente.componente] = docente.nombre_extenso;
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
            console.log(docente);
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
                    alert('Error al firmar evaluación');
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



