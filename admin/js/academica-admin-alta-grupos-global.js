

document.addEventListener('DOMContentLoaded', (event) => {
    var trimestreActual = document.getElementById('trimestreActual');
    var selectTrimestre = document.getElementById('trimestre');
    var selectModulo = document.getElementById('modulo');
    var selectGrupo = document.getElementById('grupo');
    var asignacionForm = document.getElementById('asignacion-form');
    var moduloCatalogoSelect = document.getElementById('moduloCatalogoSelect')
    var catalogoGruposBtn = document.getElementById('catalogoGruposBtn')
    var inputGrupoCatalogoDiv = document.getElementById('inputGrupoCatalogoDiv');
    var buttonGrupoCatalogoDiv = document.getElementById('buttonGrupoCatalogoDiv');
    var componentesTbody = document.getElementById('componentes-tbody');

    inputGrupoCatalogoDiv.style.display = 'none';
    buttonGrupoCatalogoDiv.style.display = 'none';

    selectGrupo.disabled = true;

    // fetch(`${academicaApiConfig.apiUrl}/modulos/`)
    // .then(response => response.json())
    // .then(data => {
    //     if (data.status === 200) {
    //         data.payload.data.forEach(modulo => {
    //             // Crear la primera opción para selectModulo
    //             const option1 = document.createElement('option');
    //             option1.value = modulo.clave_uea;
    //             option1.text = `${modulo.modulo}. ${modulo.nombre_uea}`;
    //             selectModulo.appendChild(option1);

    //             // Crear una segunda opción para moduloCatalogoSelect
    //             const option2 = document.createElement('option');
    //             option2.value = modulo.clave_uea;
    //             option2.text = `${modulo.modulo}. ${modulo.nombre_uea}`;
    //             moduloCatalogoSelect.appendChild(option2);

    //             // Crear y agregar input hidden
    //             const claveUeaHidden = document.createElement('input');
    //             claveUeaHidden.type = 'hidden';
    //             claveUeaHidden.name = `clave_uea_${modulo.modulo}`;
    //             claveUeaHidden.value = modulo.clave_uea;
    //             selectModulo.appendChild(claveUeaHidden);
    //         });
    //     }
    // });
    apiRequest('GET', '/modulos/')
    .then(data => {
        if (data.status === 200) {
            data.payload.data.forEach(modulo => {
                // Crear la primera opción para selectModulo
                const option1 = document.createElement('option');
                option1.value = modulo.modulo;
                option1.text = `${modulo.modulo}. ${modulo.nombre_uea}`;
                selectModulo.appendChild(option1);

                // Crear una segunda opción para moduloCatalogoSelect
                const option2 = document.createElement('option');
                option2.value = modulo.clave_uea;
                option2.text = `${modulo.modulo}. ${modulo.nombre_uea}`;
                moduloCatalogoSelect.appendChild(option2);

                // Crear y agregar input hidden
                const claveUeaHidden = document.createElement('input');
                claveUeaHidden.type = 'hidden';
                claveUeaHidden.name = `clave_uea_${modulo.modulo}`;
                claveUeaHidden.value = modulo.clave_uea;
                selectModulo.appendChild(claveUeaHidden);
            });
        }
    })
    .catch(error => {
        console.error('Error al obtener módulos:', error);
    });
   
    selectModulo.addEventListener('change', async function() {
        const claveUea = this.value;
        const hiddenInput = document.querySelector(`input[name="clave_uea_${claveUea}"]`);
        const hiddenClaveUea = hiddenInput ? hiddenInput.value : '';

        var moduloSeleccionado = this.value;

        // Crear la opción de "Cargando..."
        selectGrupo.innerHTML = '';
        var loadingOption = document.createElement('option');
        loadingOption.value = '';
        loadingOption.text = 'Cargando...';
        selectGrupo.appendChild(loadingOption);

        // fetch(`${academicaApiConfig.apiUrl}/coordinacion/global/grupos?modulo=${moduloSeleccionado}`)
        //     .then(response => response.json())
        //     .then(data => {

        //         selectGrupo.disabled = false;
        //         selectGrupo.innerHTML = '';

        //         var option = document.createElement('option');
        //         option.value = '';
        //         option.text = 'Seleccione un grupo';
        //         selectGrupo.appendChild(option);

        //         data.data.forEach(grupo => {
        //             var option = document.createElement('option');
        //             option.value = grupo;
        //             option.text = grupo.toUpperCase();
        //             selectGrupo.appendChild(option);
        //         });
        //     });
        try {
            const data = await apiRequest('GET', `/modulos/${hiddenClaveUea}/grupos`);
        
            selectGrupo.disabled = false;
            selectGrupo.innerHTML = '';
        
            const option = document.createElement('option');
            option.value = '';
            option.text = 'Seleccione un grupo';
            selectGrupo.appendChild(option);
        
            data.payload.data.forEach(grupo => {
                const option = document.createElement('option');
                option.value = grupo.grupo;
                option.text = grupo.grupo.toUpperCase();
                selectGrupo.appendChild(option);
            });
        } catch (error) {
            console.error('Error al obtener grupos:', error);
        }
    });


    apiRequest('GET', '/trimestres/actual')
    .then(data => {
        if (data.status === 200) {
            const trimestre = data.payload.data[0].trimestre_nombre;

            // Mostrar el trimestre en el DOM
            const trimestreDiv = document.createElement('div');
            trimestreDiv.id = 'trimestre-actual';
            trimestreDiv.style.fontSize = '20px';
            trimestreDiv.style.fontWeight = 'bold';
            trimestreDiv.style.marginBottom = '10px';
            trimestreDiv.innerText = '⭐ Trimestre Actual: ' + trimestre;
            trimestreActual.appendChild(trimestreDiv);

            const trimestreActualData = data.payload.data[0].trimestre;
            selectTrimestre.innerHTML = '';
            const option = document.createElement('option');
            option.value = trimestreActualData;
            option.text = trimestreActualData.toUpperCase();
            selectTrimestre.appendChild(option);
            selectTrimestre.disabled = true;
            fetchGrupos(trimestreActualData);

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

    // async function fetchGrupos(trimestre) {
    //     try {
    //         document.getElementById('loading-screen').style.display = 'block'; 
    //         const response = await fetch(`${academicaApiConfig.apiUrl}/historial_academico/grupos_por_trimestre?trimestre=${trimestre}`);
    //         const data = await response.json();

    //         if (data.status === 'success' && data.payload) {
    //             populateTable(data.payload);
    //             document.querySelector('.table-2 thead').style.display = 'table-header-group';
    //             document.getElementById('loading-screen').style.display = 'none';
    //         } else {
    //             console.error('Failed to fetch data:', data);
    //             document.getElementById('loading-screen').style.display = 'none';
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         document.getElementById('loading-screen').style.display = 'none';
    //     }
    // }
    async function fetchGrupos(trimestre) {
        try {
            document.getElementById('loading-screen').style.display = 'block';
            
            // Utiliza apiRequest en lugar de fetch
            const data = await apiRequest('GET', `/evaluaciones/?trimestre=${trimestre}`);
    
            if (data.status === 200) {
                populateTable(data.payload.data);
                document.querySelector('.table-2 thead').style.display = 'table-header-group';
            } else {
                console.error('Failed to fetch data:', data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            document.getElementById('loading-screen').style.display = 'none'; // Asegúrate de ocultar la pantalla de carga en cualquier caso
        }
    }

    function populateTable(grupos) {
        const tableBody = document.getElementById('gruposTableBody');
        tableBody.innerHTML = ''; // Clear existing rows

        grupos.forEach(grupo => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = grupo.id.toUpperCase();
            row.appendChild(idCell);

            const trimestreCell = document.createElement('td');
            trimestreCell.textContent = trimestre.value.toUpperCase();
            row.appendChild(trimestreCell);

            const grupoCell = document.createElement('td');
            grupoCell.textContent = grupo.grupo.grupo.toUpperCase();
            row.appendChild(grupoCell);

            const moduloCell = document.createElement('td');
            moduloCell.textContent = `${grupo.uea.modulo} - ${grupo.uea.nombre_uea}`;
            row.appendChild(moduloCell);

            const accionesCell = document.createElement('td');
            const detallesButton = document.createElement('button');
            detallesButton.textContent = 'Detalles';
            detallesButton.className = 'detallesButton';
            detallesButton.setAttribute('id-evaluacion', grupo.id);
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
                const idEvaluacion = this.getAttribute('id-evaluacion');
                const grupo = this.getAttribute('data-grupo');
        
                // try {
                //     const data = apiRequest('GET', `/evaluaciones/${idEvaluacion}?detalle=true`);

                    
                //     console.log(JSON.stringify(data))
                //     if (data.status === 200) {
                        
                //         const { informacion_general, calificaciones_alumnos } = data.payload;
        
                //         // Clear previous content
                //         document.getElementById('grupoInfoGeneral').innerHTML = '';
                //         document.getElementById('grupoInfoDocentes').innerHTML = '';
                //         document.getElementById('grupoInfoAlumnos').innerHTML = '';
        
                //         // Display general information
                //         const generalInfoHtml = `
                //             <h3>Información General</h3>
                //             <table>
                //                 <thead>
                //                     <tr>
                //                         <th>Grupo</th>
                //                         <th>Trimestre</th>
                //                         <th>Módulo</th>
                //                         <th>UEA</th>
                //                         <th>Clave UEA</th>
                //                     </tr>
                //                 </thead>
                //                 <tbody>
                //                     <tr>
                //                         <td>${informacion_general.grupo}</td>
                //                         <td>${informacion_general.trimestre}</td>
                //                         <td>${informacion_general.modulo}</td>
                //                         <td>${informacion_general.uea}</td>
                //                         <td>${informacion_general.clave_uea}</td>
                //                     </tr>
                //                 </tbody>
                //             </table>
                //         `;
                //         document.getElementById('grupoInfoGeneral').insertAdjacentHTML('beforeend', generalInfoHtml);

                //             const docentesInfoHtml = `
                //             <h4>Docentes</h4>
                //             <table>
                //                 <tbody>
                //                     <tr>
                //                         <td><strong>Nombre</strong></td>
                //                         ${informacion_general.docentes.map(docente => `<td>${docente.nombre}</td>`).join('')}
                //                     </tr>
                //                     <tr>
                //                         <td><strong>Componente</strong></td>
                //                         ${informacion_general.docentes.map(docente => `<td>${docente.componente}</td>`).join('')}
                //                     </tr>
                //                     <tr>
                //                         <td><strong>Coordinación</strong></td>
                //                         ${informacion_general.docentes.map(docente => `<td>${docente.coordinacion ? 'Sí' : 'No'}</td>`).join('')}
                //                     </tr>
                //                 </tbody>
                //             </table>
                //         `;
                //         document.getElementById('grupoInfoDocentes').insertAdjacentHTML('beforeend', docentesInfoHtml);
        
                //         // Display student grades
                //         const studentGradesHtml = `
                //             <h3>Lista de Alumnos</h3>
                //             <table>
                //                 <thead>
                //                     <tr>
                //                         <th>Número de Lista</th>
                //                         <th>Nombre</th>
                //                         <th>Matrícula</th>
                //                     </tr>
                //                 </thead>
                //                 <tbody>
                //                     ${calificaciones_alumnos.map(alumno => `
                //                         <tr>
                //                             <td>${alumno.numero_lista}</td>
                //                             <td>${alumno.nombre_alumno}</td>
                //                             <td>${alumno.matricula}</td>
                //                         </tr>
                //                     `).join('')}
                //                 </tbody>
                //             </table>
                //         `;
                //         document.getElementById('grupoInfoAlumnos').insertAdjacentHTML('beforeend', studentGradesHtml);

                // // Add delete button
                // const deleteButtonHtml = `
                //     <button id="delete-group-button" data-id="${informacion_general.id_seguimiento_global}">Eliminar Grupo</button>
                // `;
                // document.getElementById('grupoInfoAlumnos').insertAdjacentHTML('beforeend', deleteButtonHtml);

                // // Add event listener to the delete button
                // document.getElementById('delete-group-button').addEventListener('click', async function() {
                //     document.getElementById('loading-screen').style.display = 'block';
                //     const idSeguimientoGlobal = this.getAttribute('data-id');
                //     if (confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
                //         try {
                            
                //             const deleteResponse = await fetch(`${academicaApiConfig.apiUrl}/coordinacion/global/grupos`, {
                //                 method: 'DELETE',
                //                 headers: {
                //                     'Content-Type': 'application/json'
                //                 },
                //                 body: JSON.stringify({
                //                     id_seguimiento_global: parseInt(idSeguimientoGlobal, 10)
                //                 })
                //             });

                //             if (deleteResponse.ok) {
                //                 alert('Grupo eliminado exitosamente.');
                //                 // Optionally, hide the popup or refresh the content
                //                 popupGrupoDetalle.style.display = 'none';
                //                 window.location.reload();
                //             } else {
                //                 alert('Error al eliminar el grupo.');
                //                 window.location.reload();
                //             }
                //         } catch (error) {
                //             console.error('Error deleting group:', error);
                //             alert('Error al eliminar el grupo.');
                //             window.location.reload();
                //         }
                //     }
                // });                                                

                //         // Show the popup
                //         popupGrupoDetalle.style.display = 'block';
                //         // hide the loading screen
                //         document.getElementById('loading-screen').style.display = 'none';
                //     } else {
                //         alert('Error al obtener los detalles del grupo.');
                //         //hide the loading screen
                //         document.getElementById('loading-screen').style.display = 'none';
                //     }
                // } catch (error) {
                //     console.error('Error fetching group details:', error);
                //     alert('Error al obtener los detalles del grupo.');
                //     // hide the loading screen
                //     document.getElementById('loading-screen').style.display = 'none';
                // }
                try {
                    const data = await apiRequest('GET', `/evaluaciones/${idEvaluacion}?detalle=true`);
                
                    if (data.status === 200) {
                        console.log(data)
                        const informacion_general = data.payload.informacion_general[0];
                        const lista_alumnos = data.payload.lista_alumnos;
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
                                        <td>${informacion_general.grupo.grupo.toUpperCase()}</td>
                                        <td>${informacion_general.trimestre.trimestre}</td>
                                        <td>${informacion_general.uea.modulo}</td>
                                        <td>${informacion_general.uea.nombre_uea}</td>
                                        <td>${informacion_general.uea.clave_uea}</td>
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
                                        ${informacion_general.programacion_docente_global.map(docente => `<td>${docente.docente.nombre}</td>`).join('')}
                                    </tr>
                                    <tr>
                                        <td><strong>Componente</strong></td>
                                        ${informacion_general.programacion_docente_global.map(docente => `<td>${docente.componente.nombre_extenso}</td>`).join('')}
                                    </tr>
                                    <tr>
                                        <td><strong>Coordinación</strong></td>
                                        ${informacion_general.programacion_docente_global.map(docente => `<td>${docente.coordinacion ? 'Sí' : 'No'}</td>`).join('')}
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
                                    ${lista_alumnos.map(alumno => `
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
                
                        // Add delete button
                        const deleteButtonHtml = `
                            <button id="delete-group-button" data-id="${idEvaluacion}">Eliminar Grupo</button>
                        `;
                        document.getElementById('grupoInfoAlumnos').insertAdjacentHTML('beforeend', deleteButtonHtml);
                
                        // Add event listener to the delete button
                        document.getElementById('delete-group-button').addEventListener('click', async function() {
                            document.getElementById('loading-screen').style.display = 'block';
                            const idEvaluacion = this.getAttribute('data-id');
                            if (confirm('¿Estás seguro de que deseas eliminar este grupo?')) {
                                try {
                                    const deleteResponse = await apiRequest('DELETE', `/evaluaciones/${idEvaluacion}`);
                
                                    if (deleteResponse.status === 200) {
                                        alert('Grupo eliminado exitosamente.');
                                        // Optionally, hide the popup or refresh the content
                                        popupGrupoDetalle.style.display = 'none';
                                        window.location.reload();
                                    } else {
                                        alert('Error al eliminar el grupo.');
                                        window.location.reload();
                                    }
                                } catch (error) {
                                    console.error('Error deleting group:', error);
                                    alert('Error al eliminar el grupo.');
                                    window.location.reload();
                                }
                            }
                        });
                
                        // Show the popup
                        popupGrupoDetalle.style.display = 'block';
                        document.getElementById('loading-screen').style.display = 'none';
                        
                    } else {
                        alert('Error al obtener los detalles del grupo.');
                        console.error('Error al obtener los detalles del grupo.');
                    }
                } catch (error) {
                    console.error('Error fetching group details:', error);
                    alert('Error al obtener los detalles del grupo.');
                }
            });
        });
    }

    function renderGruposCatalogoTable(grupos) {
        catalogoGruposTable = document.getElementById('catalogoGruposTable');
        // Crea la tabla y su encabezado
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Grupo</th>
                        
                    </tr>
                </thead>
                <tbody>
        `;

        // Itera sobre los datos y genera filas de la tabla

        grupos.forEach(grupo => {
            tableHTML += `
                <tr>
                    <td>${grupo.id}</td>
                    <td>${grupo.grupo.toUpperCase()}</td>
                </tr>
            `;
        });

        // Cierra la tabla
        tableHTML += `
                </tbody>
            </table>
        `;

        // Inserta la tabla generada en el div
        catalogoGruposTable.innerHTML = tableHTML;

    }

    moduloCatalogoSelect.addEventListener('change', async function() {
        inputGrupoCatalogoDiv.style.display = 'block';
        buttonGrupoCatalogoDiv.style.display = 'block';
        const selectedValue = moduloCatalogoSelect.options[moduloCatalogoSelect.selectedIndex].value;

        console.log("Valor seleccionado:", selectedValue); // Solo para ver en la consola
        
        // fetch(`${academicaApiConfig.apiUrl}/historial_academico/grupos_por_modulo?modulo=${selectedValue}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.code === 200) {
        //             renderGruposCatalogoTable(data.data);
        //         } else {
        //             alert('Error al obtener datos');
        //         }
        //     })
        const data = await apiRequest('GET', `/modulos/${selectedValue}/grupos`);
        console.log(data)
        if (data.status === 200) {
            renderGruposCatalogoTable(data.payload.data);
        } else {
            alert('Error al obtener datos');
        }
    })

    // Close popup when clicking the button with class closeGruposDetalle
    document.querySelector('.closeAltaGruposBtn').addEventListener('click', function() {
        popupAltaGrupo.style.display = 'none';
    });

    // Close popup when clicking the button with class closeGruposDetalle
    document.querySelector('.closeGruposDetalle').addEventListener('click', function() {
        popupGrupoDetalle.style.display = 'none';
    });

    document.querySelector('.closeCatalogoGrupos').addEventListener('click', function() {
        popupCatalogoGrupos.style.display = 'none';
    })



    addGrupoBtn.addEventListener('click', function() {
        const popup = document.getElementById('popupAltaGrupo');
        popup.style.display = 'block';
    });

    catalogoGruposBtn.addEventListener('click', function() {
        const popup = document.getElementById('popupCatalogoGrupos');
        popup.style.display = 'block';
    })



    // Fetch modulo/componentes cuando un módulo es seleccionado:
    selectModulo.addEventListener('change', async function() {
        const claveUea = this.value;
        if (claveUea) {

            const hiddenInput = document.querySelector(`input[name="clave_uea_${claveUea}"]`);
            const hiddenClaveUea = hiddenInput ? hiddenInput.value : '';
            // fetch(`${academicaApiConfig.apiUrl}/modulos/${hiddenClaveUea}`)
            //     .then(response => response.json())
            //     .then(data => {
            //         if (data.status === 200) {
            //             const componentes = data.data.mapeo;
            //             componentesTbody.innerHTML = '';

            //             componentes.forEach(componente => {
            //                 const tr = document.createElement('tr');
            //                 const tdNombre = document.createElement('td');
            //                 tdNombre.textContent = componente.nombre_componente;
            //                 tr.appendChild(tdNombre);

            //                 const tdInput = document.createElement('td');
            //                 const input = document.createElement('input');
            //                 input.className='padding-input';
            //                 input.type = 'number';
            //                 input.name = componente.nombre_componente;
            //                 input.placeholder = 'Número económico';
            //                 tdInput.appendChild(input);
            //                 tr.appendChild(tdInput);

            //                 const tdRadio = document.createElement('td');
            //                 const radio = document.createElement('input');
            //                 radio.type = 'radio';
            //                 radio.name = 'coordinacion';
            //                 radio.value = componente.nombre_componente;
            //                 tdRadio.appendChild(radio);
            //                 tr.appendChild(tdRadio);

            //                 componentesTbody.appendChild(tr);
            //             });
            //         }
            //     });
            try {
                const data = await apiRequest('GET', `/modulos/${hiddenClaveUea}`);
            
                if (data.status === 200) {
                    const componentes = data.payload.data[0].mapeo;
                    
                    componentesTbody.innerHTML = '';
            
                    componentes.forEach(componente => {
                        const tr = document.createElement('tr');
            
                        const tdNombre = document.createElement('td');
                        tdNombre.textContent = componente.nombre_componente;
                        tr.appendChild(tdNombre);
            
                        const tdInput = document.createElement('td');
                        const input = document.createElement('input');
                        input.className = 'padding-input';
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
            } catch (error) {
                console.error('Error al obtener módulos:', error);
            }
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

        // Verificar subida de archivo
        var excelFile = document.getElementById('excel_file');
        if (excelFile.files.lenght === 0) {
            alert('Por favor, suba un archivo Excel (.xlsx)');
            document.getElementById('loading-screen').style.display = 'none';
            return;
        }

        if(!excelFile.files[0].name.endsWith('.xlsx')) {
            alert('El archivo debe ser un Excel con extensioń .xlsx');
            document.getElementById('loading-screen').style.display = 'none';
            return;
        }
    
        // Serialización de archivos XLSX de listas de alumnos
        
        // var reader = new FileReader();
        // reader.onload = function(e) {
        //     var data = new Uint8Array(e.target.result);
        //     var workbook = XLSX.read(data, {type: 'array'});
    
        //     var result = [];
        //     workbook.SheetNames.forEach(sheetName => {
        //         var rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        //         if (rows.length) {
        //             rows = rows.map(row => {
        //                 return {
        //                     numero_lista: row['numero_lista'],
        //                     matricula: row['matricula'],
        //                     nombre: row['nombre_alumno'],
        //                 };
        //             });
        //             result = result.concat(rows);
        //         }
        //     });
    
        //     var data = {
        //         uea: modulo,
        //         grupo: grupo,
        //         trimestre: trimestre,
        //         docentes: componentes,
        //         alumnos: result,
        //         coordinacion: docentesCoordinadores.size > 0 // Aquí se marca como true si hay coordinadores
        //     };
    
        //     console.log(JSON.stringify(data, 2, 2));
            
            
    
        //     fetch(`${academicaApiConfig.apiUrl}/coordinacion/global/grupos`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(data)
        //     }).then(response => response.json())
        //       .then(data => {
        //         console.log(data);
        //         alert('Grupo registrado con éxito!');
        //         window.location.reload();
        //       });
        // };

        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook;
            try {
                workbook = XLSX.read(data, {type: 'array'});
            } catch (error) {
                alert('Error al leer el archivo Excel. Asegúrate de que esté correctamente formateado.');
                document.getElementById('loading-screen').style.display = 'none';
                return;
            }
    
            var result = [];
            var validColumns = ['numero_lista', 'matricula', 'nombre_alumno'];
            var isValid = true;
    
            workbook.SheetNames.forEach(sheetName => {
                var rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                if (rows.length) {
                    rows.forEach(row => {
                        // Verificar si el formato de la fila es válido
                        if (!validColumns.every(col => row.hasOwnProperty(col))) {
                            isValid = false;
                        }
                        result.push({
                            numero_lista: row['numero_lista'],
                            matricula: row['matricula'],
                            nombre: row['nombre_alumno'],
                        });
                    });
                }
            });
    
            if (!isValid) {
                alert('El archivo Excel tiene un formato incorrecto. Asegúrate de que las columnas sean correctas.');
                document.getElementById('loading-screen').style.display = 'none';
                return;
            }
    
            var data = {
                tipo: 'global',
                uea: modulo,
                grupo: grupo,
                trimestre: trimestre,
                docentes: componentes,
                alumnos: result,
                coordinacion: docentesCoordinadores.size > 0 // Aquí se marca como true si hay coordinadores
            };
    
            console.log(JSON.stringify(data, null, 2));

            //return;
    
            // fetch(`${academicaApiConfig.apiUrl}/coordinacion/global/grupos`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(data)
            // })
            // .then(response => {
            //     if (response.status === 404) {
            //         return response.json().then(data => {
            //             // Manejo del error 404
            //             alert(`Error: ${data.message}`);
            //             document.getElementById('loading-screen').style.display = 'none';
            //             return Promise.reject('Error 404');
            //         });
            //     } else if (response.ok) {
            //         return response.json();
            //     } else {
            //         throw new Error('Error al registrar el grupo');
            //     }
            // })
            // .then(data => {
            //     alert('Grupo registrado con éxito!');
            //     window.location.reload();
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            //     alert('Error al registrar el grupo');
            //     document.getElementById('loading-screen').style.display = 'none';
            // });
            apiRequest('POST', '/evaluaciones', data)
            .then(response => {
                if (response.status === 404) {
                    // Manejo del error 404
                    alert(`Error: ${response.message}`);
                    document.getElementById('loading-screen').style.display = 'none';
                    return Promise.reject('Error 404');
                } else if (response.status === 200) {
                    alert('Grupo registrado con éxito!');
                    window.location.reload();
                } else {
                    throw new Error('Error al registrar el grupo');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al registrar el grupo');
                document.getElementById('loading-screen').style.display = 'none';
            });
        };     
        reader.readAsArrayBuffer(excelFile.files[0]);
    });
    
});