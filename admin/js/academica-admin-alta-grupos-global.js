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
            const response = await fetch(`${academicaApiConfig.apiUrl}/historial_academico/grupos_por_trimestre?trimestre=${trimestre}`);
            const data = await response.json();

            if (data.status === 'success' && data.payload) {
                populateTable(data.payload);
                document.querySelector('.table-2 thead').style.display = 'table-header-group';
            } else {
                console.error('Failed to fetch data:', data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
            accionesCell.appendChild(detallesButton);
            row.appendChild(accionesCell);

            tableBody.appendChild(row);
        });
    }
        
    

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

        // Info de asignación docente, grupo, módulo y trimestre
        var modulo = this.modulo.value;
        var grupo = this.grupo.value;
        var trimestre = this.trimestre.value;
        var coordinacion = this.coordinacion.value;

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
                alumnos: result
            };

            console.log(JSON.stringify(data, 2, 2));

            fetch(`${academicaApiConfig.apiUrl}/coordinacion/global/grupos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json())
              .then(data => console.log(data));
        };
        reader.readAsArrayBuffer(excelFile.files[0]);
    });
});