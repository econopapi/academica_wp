var selectModulo = document.getElementById('modulo');
var selectGrupo = document.getElementById('grupo');
var asignacionForm = document.getElementById('asignacion-form');

selectGrupo.disabled = true;
selectModulo.addEventListener('change', function() {

    var moduloSeleccionado = this.value;

    // Crear la opción de "Cargando..."
    selectGrupo.innerHTML = '';
    var loadingOption = document.createElement('option');
    loadingOption.value = '';
    loadingOption.text = 'Cargando...';
    selectGrupo.appendChild(loadingOption);

    fetch(`${academicaApiConfig.apiUrl}/coordinacion/global/grupos?modulo=${moduloSeleccionado}`)
        .then(response => response.json())
        .then(data => {

            selectGrupo.disabled = false;
            selectGrupo.innerHTML = '';

            var option = document.createElement('option');
            option.value = '';
            option.text = 'Seleccione un grupo';
            selectGrupo.appendChild(option);

            data.data.forEach(grupo => {
                var option = document.createElement('option');
                option.value = grupo;
                option.text = grupo.toUpperCase();
                selectGrupo.appendChild(option);
            });
        });
});

document.addEventListener('DOMContentLoaded', (event) => {
    fetch(`${academicaApiConfig.apiUrl}/historial_academico/trimestre_actual`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.code === 200) {
                trimestreActual = document.getElementById('trimestreActual');
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

    addGrupoBtn = document.getElementById('addGrupoBtn');
    var closeBtn = document.getElementsByClassName("closeBtn")[0];

    if (closeBtn) {
        closeBtn.onclick = function() {
            document.getElementById('popupAltaGrupo').style.display = "none";
        }
    }

    let trimestreActual;
    // Fetching and rendering modulos/componentes
    var selectTrimestre = document.getElementById('trimestre');
    var modulosSelect = document.getElementById('modulo');
    var componentesTbody = document.getElementById('componentes-tbody');

    // Obtener trimestre actual
    fetch(`${academicaApiConfig.apiUrl}/historial_academico/trimestre_actual`)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                const trimestreActual = data.payload.trimestre;
                selectTrimestre.innerHTML = '';
                const option = document.createElement('option');
                option.value = trimestreActual;
                option.text = trimestreActual.toUpperCase();
                selectTrimestre.appendChild(option);
                selectTrimestre.disabled = true;
                fetchGrupos(trimestreActual);
            }
        });

    async function fetchGrupos(trimestre) {
        try {
            document.getElementById('loading-screen').style.display = 'block'; 
            const response = await fetch(`${academicaApiConfig.apiUrl}/historial_academico/grupos_por_trimestre?trimestre=${trimestre}`);
            const data = await response.json();

            if (data.status === 'success' && data.payload) {
                populateTable(data.payload);
                document.querySelector('.table-2 thead').style.display = 'table-header-group';
                document.getElementById('loading-screen').style.display = 'none';
            } else {
                console.error('Failed to fetch data:', data);
                document.getElementById('loading-screen').style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('loading-screen').style.display = 'none';
        }
    }

    function populateTable(grupos) {
        const tableBody = document.getElementById('gruposTableBody');
        tableBody.innerHTML = ''; // Clear existing rows

        grupos.forEach(grupo => {
            const row = document.createElement('tr');

            const trimestreCell = document.createElement('td');
            trimestreCell.textContent = trimestre.value.toUpperCase();
            row.appendChild(trimestreCell);

            const grupoCell = document.createElement('td');
            grupoCell.textContent = grupo.grupo;
            row.appendChild(grupoCell);

            const moduloCell = document.createElement('td');
            moduloCell.textContent = `${grupo.modulo.modulo} - ${grupo.modulo.nombre_uea}`;
            row.appendChild(moduloCell);

            const accionesCell = document.createElement('td');
            const detallesButton = document.createElement('button');
            detallesButton.textContent = 'Detalles';
            detallesButton.className = 'detallesButton';
            detallesButton.setAttribute('data-grupo', grupo.grupo);
            detallesButton.setAttribute('data-trimestre', trimestre.value);
            accionesCell.appendChild(detallesButton);
            row.appendChild(accionesCell);

            tableBody.appendChild(row);
        });

        // Event listener for "Detalles" buttons
        const detalleButtons = document.querySelectorAll('.detallesButton');
        const popupGrupoDetalle = document.getElementById('popupGrupoDetalle');
        const popupContent = popupGrupoDetalle.querySelector('.popup-content');

        detalleButtons.forEach(button => {
            button.addEventListener('click', async function() {
                // show the loading screen
                document.getElementById('loading-screen').style.display = 'block';
                const trimestre = this.getAttribute('data-trimestre');
                const grupo = this.getAttribute('data-grupo');
        
                try {
                    const response = await fetch(`${academicaApiConfig.apiUrl}/historial_academico/seguimiento_global?trimestre=${trimestre}&grupo=${grupo}&detalle=true`);
                    const data = await response.json();
        
                    if (data.status === 'success') {
                        const { informacion_general, calificaciones_alumnos } = data.payload;
        
                        // Clear previous content
                        document.getElementById('grupoInfoGeneral').innerHTML = '';
                        document.getElementById('grupoInfoDocentes').innerHTML = '';
                        document.getElementById('grupoInfoAlumnos').innerHTML = '';
        
                        // Display general information
                        const generalInfoHtml = `
                            <h3>Información General</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Grupo</th>
                                        <th>Trimestre</th>
                                        <th>Módulo</th>
                                        <th>UEA</th>
                                        <th>Clave UEA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${informacion_general.grupo}</td>
                                        <td>${informacion_general.trimestre}</td>
                                        <td>${informacion_general.modulo}</td>
                                        <td>${informacion_general.uea}</td>
                                        <td>${informacion_general.clave_uea}</td>
                                    </tr>
                                </tbody>
                            </table>
                        `;
                        document.getElementById('grupoInfoGeneral').insertAdjacentHTML('beforeend', generalInfoHtml);

                            const docentesInfoHtml = `
                            <h4>Docentes</h4>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><strong>Nombre</strong></td>
                                        ${informacion_general.docentes.map(docente => `<td>${docente.nombre}</td>`).join('')}
                                    </tr>
                                    <tr>
                                        <td><strong>Componente</strong></td>
                                        ${informacion_general.docentes.map(docente => `<td>${docente.componente}</td>`).join('')}
                                    </tr>
                                    <tr>
                                        <td><strong>Coordinación</strong></td>
                                        ${informacion_general.docentes.map(docente => `<td>${docente.coordinacion ? 'Sí' : 'No'}</td>`).join('')}
                                    </tr>
                                </tbody>
                            </table>
                        `;
                        document.getElementById('grupoInfoDocentes').insertAdjacentHTML('beforeend', docentesInfoHtml);
        
                        // Display student grades
                        const studentGradesHtml = `
                            <h3>Lista de Alumnos</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Número de Lista</th>
                                        <th>Nombre</th>
                                        <th>Matrícula</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${calificaciones_alumnos.map(alumno => `
                                        <tr>
                                            <td>${alumno.numero_lista}</td>
                                            <td>${alumno.nombre_alumno}</td>
                                            <td>${alumno.matricula}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        `;
                        document.getElementById('grupoInfoAlumnos').insertAdjacentHTML('beforeend', studentGradesHtml);
        
                        // Show the popup
                        popupGrupoDetalle.style.display = 'block';
                        // hide the loading screen
                        document.getElementById('loading-screen').style.display = 'none';
                    } else {
                        alert('Error al obtener los detalles del grupo.');
                        //hide the loading screen
                        document.getElementById('loading-screen').style.display = 'none';
                    }
                } catch (error) {
                    console.error('Error fetching group details:', error);
                    alert('Error al obtener los detalles del grupo.');
                    // hide the loading screen
                    document.getElementById('loading-screen').style.display = 'none';
                }
            });
        });
    }

    // Close popup when clicking the button with class closeGruposDetalle
    document.querySelector('.closeGruposDetalle').addEventListener('click', function() {
        popupGrupoDetalle.style.display = 'none';
    });


    fetch(`${academicaApiConfig.apiUrl}/modulos/`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                data.data.forEach(modulo => {
                    const option = document.createElement('option');
                    option.value = modulo.modulo;
                    option.text = `${modulo.modulo}. ${modulo.nombre_uea}`;
                    modulosSelect.appendChild(option);

                    const claveUeaHidden = document.createElement('input');
                    claveUeaHidden.type = 'hidden';
                    claveUeaHidden.name = `clave_uea_${modulo.modulo}`;
                    claveUeaHidden.value = modulo.clave_uea;
                    modulosSelect.appendChild(claveUeaHidden);
                });
            }
        });

    addGrupoBtn.addEventListener('click', function() {
        const popup = document.getElementById('popupAltaGrupo');
        popup.style.display = 'block';
    });

    // Fetch modulo/componentes cuando un módulo es seleccionado:
    modulosSelect.addEventListener('change', function() {
        const claveUea = this.value;
        if (claveUea) {

            const hiddenInput = document.querySelector(`input[name="clave_uea_${claveUea}"]`);
            const hiddenClaveUea = hiddenInput ? hiddenInput.value : '';
            fetch(`${academicaApiConfig.apiUrl}/modulos/${hiddenClaveUea}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        const componentes = data.data.mapeo;
                        componentesTbody.innerHTML = '';

                        componentes.forEach(componente => {
                            const tr = document.createElement('tr');
                            const tdNombre = document.createElement('td');
                            tdNombre.textContent = componente.nombre_componente;
                            tr.appendChild(tdNombre);

                            const tdInput = document.createElement('td');
                            const input = document.createElement('input');
                            input.className='padding-input';
                            input.type = 'number';
                            input.name = componente.nombre_componente;
                            input.placeholder = 'Número económico';
                            tdInput.appendChild(input);
                            tr.appendChild(tdInput);

                            const tdRadio = document.createElement('td');
                            const radio = document.createElement('input');
                            radio.type = 'radio';
                            radio.name = 'coordinacion';
                            radio.value = componente.nombre_componente;
                            tdRadio.appendChild(radio);
                            tr.appendChild(tdRadio);

                            componentesTbody.appendChild(tr);
                        });
                    }
                });
        }
    });

    asignacionForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // show loading screen
        document.getElementById('loading-screen').style.display = 'block';
    
        // Info de asignación docente, grupo, módulo y trimestre
        var modulo = this.modulo.value;
        var grupo = this.grupo.value;
        var trimestre = this.trimestre.value;
    
        // Obtener los componentes dinámicamente
        var componentes = Array.from(componentesTbody.querySelectorAll('tr')).map(tr => {
            var nombreComponente = tr.querySelector('td').textContent;
            var docente = parseInt(tr.querySelector('input[type="number"]').value);
            var esCoordinacion = tr.querySelector('input[type="radio"]').checked;
            return {
                docente: docente,
                componente: nombreComponente,
                coordinacion: esCoordinacion
            };
        });
    
        // Identificar docentes coordinadores
        var coordinadores = componentes.filter(c => c.coordinacion).map(c => c.docente);
        var docentesCoordinadores = new Set(coordinadores);
    
        // Marcar todos los componentes del docente coordinador como 'true' en coordinacion
        componentes = componentes.map(c => {
            if (docentesCoordinadores.has(c.docente)) {
                return {
                    ...c,
                    coordinacion: true
                };
            }
            return c;
        });
    
        // Serialización de archivos XLSX de listas de alumnos
        var excelFile = document.getElementById('excel_file');
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {type: 'array'});
    
            var result = [];
            workbook.SheetNames.forEach(sheetName => {
                var rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                if (rows.length) {
                    rows = rows.map(row => {
                        return {
                            numero_lista: row['numero_lista'],
                            matricula: row['matricula'],
                            nombre: row['nombre_alumno'],
                        };
                    });
                    result = result.concat(rows);
                }
            });
    
            var data = {
                uea: modulo,
                grupo: grupo,
                trimestre: trimestre,
                docentes: componentes,
                alumnos: result,
                coordinacion: docentesCoordinadores.size > 0 // Aquí se marca como true si hay coordinadores
            };
    
            console.log(JSON.stringify(data, 2, 2));
            
            
    
            fetch(`${academicaApiConfig.apiUrl}/coordinacion/global/grupos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json())
              .then(data => {
                console.log(data);
                alert('Grupo registrado con éxito!');
                window.location.reload();
              });
        };
        reader.readAsArrayBuffer(excelFile.files[0]);
    });
    
});