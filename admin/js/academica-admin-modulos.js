/* API Config can be obtained from:

academicaApiConfig.apiUrl,
academicaApiConfig.apiKey
*/


document.addEventListener('DOMContentLoaded', function() {
    // Get the popup
    var popup = document.getElementById("popupForm");

    // Get the <span> element that closes the popup
    var span = document.getElementsByClassName("closeBtn")[0];

    // Close the popup when the user clicks on <span> (x)
    if (span) {
        span.onclick = function() {
            popup.style.display = "none";
        }
    }

    // Close the popup when the user clicks anywhere outside of the popup
    // window.onclick = function(event) {
    //     if (event.target == popup) {
    //         popup.style.display = "none";
    //     }
    // }

    // Function to fetch and display components
    async function fetchAndDisplayComponents(moduloId) {
        try {
            // Fetch all components
            
            let response_componentes = await fetch(`${academicaApiConfig.apiUrl}/componentes/`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            let allComponents = await response_componentes.json();

            

            // Fetch module mapping
            let response = await fetch(`${academicaApiConfig.apiUrl}/modulos/${moduloId}`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            let moduleMapping = await response.json();

            // Display components in the popup
            let componentesListBody = document.getElementById("componentesListBody");
            let catalogoComponentesBody = document.getElementById("catalogoComponentesBody");
            if (componentesListBody && catalogoComponentesBody) {
                componentesListBody.innerHTML = '';
                catalogoComponentesBody.innerHTML = '';

                // Display mapped components
                moduleMapping.data.mapeo.forEach(mapeo => {
                    let component = allComponents.data.find(c => c.nombre_componente === mapeo.nombre_componente);
                    componentesListBody.innerHTML += `
                        <tr>
                            <td>${component.nombre_extenso}</td>
                            <td><input type="number" value="${mapeo.ponderacion}" data-componente-id="${component.id}"></td>
                            <td><button type="button" class="removeComponentBtn">Eliminar</button></td>
                        </tr>
                    `;
                });

                // Display available components in a table
                allComponents.data.forEach(component => {
                    catalogoComponentesBody.innerHTML += `
                        <tr>
                            <td>${component.nombre_extenso}</td>
                            <td><button type="button" class="addComponentBtn" data-componente-id="${component.id}">Agregar</button></td>
                        </tr>
                    `;
                });

                // Add event listeners for remove buttons
                document.querySelectorAll('.removeComponentBtn').forEach(btn => {
                    btn.onclick = function() {
                        this.parentElement.parentElement.remove();
                    }
                });

                // Add event listeners for add buttons
                document.querySelectorAll('.addComponentBtn').forEach(btn => {
                    btn.onclick = function() {
                        let componentId = this.getAttribute('data-componente-id');
                        let component = allComponents.data.find(c => c.id == componentId);
                        componentesListBody.innerHTML += `
                            <tr>
                                <td>${component.nombre_extenso}</td>
                                <td><input type="number" value="0" data-componente-id="${component.id}"></td>
                                <td><button type="button" class="removeComponentBtn">Eliminar</button></td>
                            </tr>
                        `;
                        // Re-add event listeners for new remove buttons
                        document.querySelectorAll('.removeComponentBtn').forEach(btn => {
                            btn.onclick = function() {
                                this.parentElement.parentElement.remove();
                            }
                        });
                    }
                });

                // Show the popup
                popup.style.display = "block";
            } else {
                console.error('Element "componentesListBody" or "catalogoComponentesBody" not found');
            }
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    }

    // Add event listeners to "Componentes" buttons
    document.querySelectorAll('.componentesBtn').forEach(btn => {
        btn.onclick = function() {
            currentModuloId = this.getAttribute('data-modulo-id');
            fetchAndDisplayComponents(currentModuloId);
        }
    });

    // Save changes
    document.getElementById("saveChangesBtn").onclick = async function() {
        let componentesListBody = document.getElementById("componentesListBody");
        if (componentesListBody) {
            let componentes = [];

            componentesListBody.querySelectorAll('tr').forEach(tr => {
                let input = tr.querySelector('input');
                componentes.push({
                    id_componente: input.getAttribute('data-componente-id'),
                    ponderacion: input.value
                });
            });

            let payload = {
                clave_uea: currentModuloId,
                mapeo: componentes
            };

            console.log('Payload:', payload);

            try {
                let response = await fetch(`${academicaApiConfig.apiUrl}/modulos/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    let result = await response.json();
                    alert('Cambios guardados exitosamente: ' + result.message);
                    popup.style.display = "none";
                } else {
                    alert('Error al guardar los cambios');
                }
            } catch (error) {
                console.error('Error saving changes:', error);
            }
        } else {
            console.error('Element "componentesListBody" not found');
        }
    }

    /* Begin Registro/Edicion/Eliminacion Compoentes */
    const registrarModuloBtn = document.getElementById('registrarModuloBtn');
    const popupRegistrarModulo = document.getElementById('popupRegistrarModulo');
    const closeBtns = document.querySelectorAll('.closeBtn');
    const modulosList = document.getElementById('modulosList');

    registrarModuloBtn.addEventListener('click', function() {
        popupRegistrarModulo.style.display = 'block';
        fetchModulos();
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            popupRegistrarModulo.style.display = 'none';
        });
    });

    document.getElementById('addModuloBtn').addEventListener('click', function() {
        const claveUea = document.getElementById('claveUea').value;
        const nombreUea = document.getElementById('nombreUea').value;
        const modulo = document.getElementById('modulo').value;

        fetch(`${academicaApiConfig.apiUrl}/modulos/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clave_uea: claveUea,
                nombre_uea: nombreUea,
                modulo: modulo
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                alert('Módulo agregado exitosamente');
                fetchModulos();
            } else {
                alert('Error al agregar el módulo');
            }
        });
    });

    function fetchModulos() {
        fetch(`${academicaApiConfig.apiUrl}/modulos/`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200 && Array.isArray(data.data)) {
                modulosList.innerHTML = '';
                data.data.forEach(modulo => {
                    const moduloItem = document.createElement('div');
                    moduloItem.innerHTML = `
                        <span>${modulo.nombre_uea} (Clave: ${modulo.clave_uea})</span>
                        <button type="button" class="deleteModuloBtn" data-clave="${modulo.clave_uea}">Eliminar</button>
                    `;
                    modulosList.appendChild(moduloItem);
                });

                document.querySelectorAll('.deleteModuloBtn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const claveUea = this.getAttribute('data-clave');
                        deleteModulo(claveUea);
                    });
                });
            } else {
                console.error('La respuesta de la API no es válida:', data);
                alert('Error al obtener los módulos');
            }
        })
        .catch(error => {
            console.error('Error al obtener los módulos:', error);
            alert('Error al obtener los módulos');
        });
    }

    function deleteModulo(claveUea) {
        fetch(`${academicaApiConfig.apiUrl}/modulos/${claveUea}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                alert('Módulo eliminado exitosamente');
                fetchModulos();
            } else {
                alert('Error al eliminar el módulo');
            }
        });
    }
    /*End Registro/Edicion/Eliminacion Componentes*/
});

//