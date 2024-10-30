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

    // Function to fetch and display components
    async function fetchAndDisplayComponents(moduloId) {
        // Mostrar la pantalla de carga
        
        // try {
        //     document.getElementById('loading-screen').style.display = 'block'; 
        //     // Fetch all components
            
        //     let response_componentes = await fetch(`${academicaApiConfig.apiUrl}/componentes/`, {
        //         headers: {
        //             'ngrok-skip-browser-warning': 'true'
        //         }
        //     });
        //     let allComponents = await response_componentes.json();

            

        //     // Fetch module mapping
        //     let response = await fetch(`${academicaApiConfig.apiUrl}/modulos/${moduloId}`, {
        //         headers: {
        //             'ngrok-skip-browser-warning': 'true'
        //         }
        //     });
        //     let moduleMapping = await response.json();

        //     // Display components in the popup
        //     let componentesListBody = document.getElementById("componentesListBody");
        //     let catalogoComponentesBody = document.getElementById("catalogoComponentesBody");
        //     if (componentesListBody && catalogoComponentesBody) {
        //         componentesListBody.innerHTML = '';
        //         catalogoComponentesBody.innerHTML = '';

        //         // Display mapped components
        //         moduleMapping.data.mapeo.forEach(mapeo => {
        //             let component = allComponents.data.find(c => c.nombre_componente === mapeo.nombre_componente);
        //             componentesListBody.innerHTML += `
        //                 <tr>
        //                     <td>${component.nombre_extenso}</td>
        //                     <td><input type="number" value="${mapeo.ponderacion}" data-componente-id="${component.id}"></td>
        //                     <td><button type="button" class="removeComponentBtn">Eliminar</button></td>
        //                 </tr>
        //             `;

        //         });

        //         // Display available components in a table
        //         allComponents.data.forEach(component => {
        //             catalogoComponentesBody.innerHTML += `
        //                 <tr>
        //                     <td>${component.nombre_extenso}</td>
        //                     <td><button type="button" class="addComponentBtn" data-componente-id="${component.id}">Agregar</button></td>
        //                 </tr>
        //             `;
        //         });

        //         // Add event listeners for remove buttons
        //         document.querySelectorAll('.removeComponentBtn').forEach(btn => {
        //             btn.onclick = function() {
        //                 this.parentElement.parentElement.remove();
        //             }
        //         });

        //         // Add event listeners for add buttons
        //         document.querySelectorAll('.addComponentBtn').forEach(btn => {
        //             btn.onclick = function() {
        //                 let componentId = this.getAttribute('data-componente-id');
        //                 let component = allComponents.data.find(c => c.id == componentId);
        //                 componentesListBody.innerHTML += `
        //                     <tr>
        //                         <td>${component.nombre_extenso}</td>
        //                         <td><input type="number" value="0" data-componente-id="${component.id}"></td>
        //                         <td><button type="button" class="removeComponentBtn">Eliminar</button></td>
        //                     </tr>
        //                 `;
        //                 // Re-add event listeners for new remove buttons
        //                 document.querySelectorAll('.removeComponentBtn').forEach(btn => {
        //                     btn.onclick = function() {
        //                         this.parentElement.parentElement.remove();
        //                     }
        //                 });
        //             }
        //         });

        //         // Show the popup
        //         popup.style.display = "block";
        //         // Ocultar pantalla de carga
        //         document.getElementById('loading-screen').style.display = 'none';
        //     } else {
        //         console.error('Element "componentesListBody" or "catalogoComponentesBody" not found');
        //     }
        // } catch (error) {
        //     console.error('Error fetching components:', error);
        // }
        try {
            document.getElementById('loading-screen').style.display = 'block';
            // Componentes
            let response_componentes = await apiRequest('GET', '/componentes/');
            let allComponents = response_componentes.payload.data;
            // Mapeo de módulo
            let response = await apiRequest('GET', `/modulos/${moduloId}`);
            let moduleMapping = response.payload.data[0]
            // Componentes en popup
            let componentesListBody = document.getElementById("componentesListBody");
            let catalogoComponentesBody = document.getElementById("catalogoComponentesBody");     
            if (componentesListBody && catalogoComponentesBody) {
                componentesListBody.innerHTML = '';
                catalogoComponentesBody.innerHTML = '';
                // Mostrar componentes mapeados
                moduleMapping.mapeo.forEach(mapeo => {
                    
                    let component = allComponents.find(c => c.nombre_componente === mapeo.nombre_componente);
                    if (component) {
                        componentesListBody.innerHTML += `
                            <tr>
                                <td>${component.nombre_extenso}</td>
                                <td><input type="number" value="${mapeo.ponderacion}" data-componente-id="${component.id}"></td>
                                <td><button type="button" class="removeComponentBtn">Eliminar</button></td>
                            </tr>
                        `;
                    }
                });
                allComponents.forEach(component => {
                    catalogoComponentesBody.innerHTML += `
                        <tr>
                            <td>${component.nombre_extenso}</td>
                            <td><button type="button" class="addComponentBtn" data-componente-id="${component.id}">Agregar</button></td>
                        </tr>
                    `;
                });
                document.querySelectorAll('.removeComponentBtn').forEach(btn => {
                    btn.onclick = function() {
                        this.parentElement.parentElement.remove();
                    }
                });
                // Add event listeners for add buttons
                document.querySelectorAll('.addComponentBtn').forEach(btn => {
                    btn.onclick = function() {
                        let componentId = this.getAttribute('data-componente-id');
                        let component = allComponents.find(c => c.id == componentId);
                        if (component) {
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
                    };
                });

                // Show the popup
                popup.style.display = "block";                      
            } else {
                console.error('Element "componentesListBody" or "catalogoComponentesBody" not found');
            }    
        } catch (error) {
            console.error('Error fetching components:', error);
        } finally {
            document.getElementById('loading-screen').style.display = 'none';
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
            let sumaPonderaciones = 0;

            componentesListBody.querySelectorAll('tr').forEach(tr => {
                let input = tr.querySelector('input');

                // Verificar si el input y su valor son válidos
                if (input) {
                    let ponderacion = parseFloat(input.value);  // Convertir el valor a número

                    if (!isNaN(ponderacion)) {  // Asegurarse de que el valor sea un número válido
                        componentes.push({
                            id_componente: input.getAttribute('data-componente-id'),
                            ponderacion: ponderacion
                        });

                        sumaPonderaciones += ponderacion;
                    } else {
                        console.error(`Valor de ponderación inválido en la fila: ${input.value}`);
                        alert('Valor de ponderación inválido');
                        document.getElementById('loading-screen').style.display = 'none';
                        return;

                    }
                } else {
                    console.error('No se pudo encontrar el input en la fila.');
                    alert('No se pudo encontrar el input en la fila');
                    document.getElementById('loading-screen').style.display = 'none';
                    return;
                }
            });

            // Verificar que la suma de las ponderaciones sea igual a 100
            if (sumaPonderaciones !== 100) {
                alert('La suma de las ponderaciones debe ser exactamente 100.');
                document.getElementById('loading-screen').style.display = 'none';
                return; // No continuar si la suma no es 100
            }

            let payload = {
                clave_uea: currentModuloId,
                mapeo: componentes
            };

            //console.log('Payload:', payload);

            // try {
            //     document.getElementById('loading-screen').style.display = 'block'; 
            //     let response = await fetch(`${academicaApiConfig.apiUrl}/modulos/`, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify(payload)
            //     });

            //     if (response.ok) {
            //         let result = await response.json();
            //         alert('Cambios guardados exitosamente: ' + result.message);
            //         popup.style.display = "none";
            //         document.getElementById('loading-screen').style.display = 'none'; 
            //     } else {
            //         alert('Error al guardar los cambios');
            //         document.getElementById('loading-screen').style.display = 'none'; 
            //     }
            // } catch (error) {
            //     console.error('Error saving changes:', error);
            //     document.getElementById('loading-screen').style.display = 'none'; 
            // }
            try {
                // Mostrar la pantalla de carga
                document.getElementById('loading-screen').style.display = 'block';
        
                // Realizar la solicitud para guardar los cambios
                const result = await apiRequest('POST', '/modulos/', payload);
        
                // Verificar la respuesta de la solicitud
                if (result && result.status === 200) {
                    alert('Cambios guardados exitosamente: ' + result.message);
                    popup.style.display = "none";
                } else {
                    alert('Error al guardar los cambios');
                }
            } catch (error) {
                console.error('Error saving changes:', error);
            } finally {
                // Ocultar la pantalla de carga al final
                document.getElementById('loading-screen').style.display = 'none';
            }
                        

        } else {
            console.error('Element "componentesListBody" not found');
            document.getElementById('loading-screen').style.display = 'none'; 
        }
    }

    /* Begin Componentes */
    
    const registrarComponenteForm = document.getElementById('registrarComponenteForm');
    const componentesList = document.getElementById('componentesList2');
    const popupRegistrarComponente = document.getElementById('popupRegistrarComponente');
    
    // Mostrar el popup de Registrar Componente
    document.getElementById('registrarComponenteBtn').addEventListener('click', function() {
        popupRegistrarComponente.style.display = 'block';
        fetchComponentes();
    });

    // Cerrar el popup de Registrar Componente
    document.querySelector('#popupRegistrarComponente .closeBtn').addEventListener('click', function() {
        popupRegistrarComponente.style.display = 'none';
    });

    // // Manejar el envío del formulario de Registrar Componente
    // registrarComponenteForm.addEventListener('submit', function(event) {
    //     event.preventDefault();
    //     const nombreComponente = document.getElementById('nombreComponente').value;
    //     const nombreExtensoComponente = document.getElementById('nombreExtensoComponente').value;

    //     fetch(`${academicaApiConfig.apiUrl}/componentes/`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             nombre_componente: nombreComponente,
    //             nombre_extenso: nombreExtensoComponente
    //         })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.status === 201) {
    //             alert('Componente registrado correctamente');
    //             registrarComponenteForm.reset();
    //             fetchComponentes();
    //         } else {
    //             alert('Error al registrar el componente');
    //         }
    //     })
    //     .catch(error => console.error('Error:', error));
    // });
    // Manejar el envío del formulario de Registrar Componente
    registrarComponenteForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nombreComponente = document.getElementById('nombreComponente').value;
        const nombreExtensoComponente = document.getElementById('nombreExtensoComponente').value;

        // Payload para la solicitud
        const payload = {
            nombre_componente: nombreComponente,
            nombre_extenso: nombreExtensoComponente
        };

        try {
            // Enviar la solicitud POST usando apiRequest
            const data = await apiRequest('POST', '/componentes/', payload);

            if (data.status === 201) {
                alert('Componente registrado correctamente');
                registrarComponenteForm.reset();
                fetchComponentes(); // Asumimos que esta función ya está definida
            } else {
                alert('Error al registrar el componente');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar el componente: ' + error.message);
        }
    });


    // // Función para cargar los componentes registrados
    // function fetchComponentes() {
    //     console.log('fetchComponentes iniciado');
    //     // Mostrar la pantalla de carga
    //     document.getElementById('loading-screen').style.display = 'block';       
    //     fetch(`${academicaApiConfig.apiUrl}/componentes/`, {
    //         headers: {
    //             'ngrok-skip-browser-warning': 'true'
    //         }
    //     })
    //     .then(response => {
    //         console.log('Respuesta recibida:', response);
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log('Datos recibidos:', data);
    //         if (data.status === 200 && Array.isArray(data.data)) {
    //             //const componentesList = document.getElementById('componentesList'); // Asegúrate de que este ID sea correcto
    //             if (componentesList) {
    //                 console.log('componentesList encontrado');
    //                 console.log(componentesList);
    //             }
        
    //             componentesList.innerHTML = '';
                
    //             data.data.forEach(componente => {
    //                 const componenteDiv = document.createElement('div');
                
    //                 componenteDiv.innerHTML = `
    //                     <div class="componente-item">
    //                     <span class="componente-text">${componente.nombre_componente} - ${componente.nombre_extenso}</span>
    //                     <button class="deleteBtn" data-id="${componente.id}">Eliminar</button>
    //                     </div>
    //                 `;
    //                 componentesList.appendChild(componenteDiv);
    //                 console.log(`Componente añadido: ${componente.nombre_componente} - ${componente.nombre_extenso}`);
    //             });
    //             // Ocultar la pantalla de carga
    //             document.getElementById('loading-screen').style.display = 'none'; 
    //             console.log(componentesList);
    
    //             document.querySelectorAll('.deleteBtn').forEach(btn => {
    //                 btn.addEventListener('click', function() {
    //                     const id = this.getAttribute('data-id');
    //                     deleteComponente(id);
    //                 });
    //             });
    //         } else {
    //             console.error('La respuesta de la API no es válida:', data);
    //             alert('Error al obtener los componentes');
    //             location.reload();
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error en la solicitud fetch:', error);
    //         alert('Error al obtener los componentes');
    //         location.reload();
    //     });
    // }
    // Función para cargar los componentes registrados
    async function fetchComponentes() {
        
        // Mostrar la pantalla de carga
        document.getElementById('loading-screen').style.display = 'block';       

        try {
            // Realizar la solicitud para obtener los componentes
            const data = await apiRequest('GET', '/componentes/');
            if (data.status === 200) {
                const componentesList = document.getElementById('componentesList2'); // Asegúrate de que este ID sea correcto
                
                if (componentesList) {
                    componentesList.innerHTML = '';
                    
                    data.payload.data.forEach(componente => {
                        //
                        const componenteDiv = document.createElement('div');
                        
                        componenteDiv.innerHTML = `
                            <div class="componente-item">
                                <span class="componente-text">${componente.nombre_componente} - ${componente.nombre_extenso}</span>
                                <button class="deleteBtn" data-id="${componente.id}">Eliminar</button>
                            </div>
                        `;
                        componentesList.appendChild(componenteDiv);
                        console.log(`Componente añadido: ${componente.nombre_componente} - ${componente.nombre_extenso}`);
                    });

                    // Ocultar la pantalla de carga
                    document.getElementById('loading-screen').style.display = 'none'; 
                    console.log(componentesList);

                    document.querySelectorAll('.deleteBtn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const id = this.getAttribute('data-id');
                            deleteComponente(id); // Asumimos que esta función ya está definida
                        });
                    });
                } else {
                    console.error('Elemento "componentesList" no encontrado');
                    alert('Error al obtener los componentes');
                    location.reload();
                }
            } else {
                console.error('La respuesta de la API no es válida:', data);
                alert('Error al obtener los componentes');
                location.reload();
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
            alert('Error al obtener los componentes');
            location.reload();
        }
    }

    // // Función para eliminar un componente
    // function deleteComponente(id) {
    //     fetch(`${academicaApiConfig.apiUrl}/componentes/${id}`, {
    //         method: 'DELETE'
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.status === 200) {
    //             alert('Componente eliminado correctamente');
    //             fetchComponentes();
    //         } else {
    //             alert('Error al eliminar el componente');
    //         }
    //     })
    //     .catch(error => console.error('Error:', error));
    // }

    async function deleteComponente(id) {
        try {
            // Mostrar la pantalla de carga
            document.getElementById('loading-screen').style.display = 'block';
    
            // Llamada a la función apiRequest para eliminar el componente
            const data = await apiRequest(`/componentes/${id}`, 'DELETE');
    
            if (data && data.status === 200) {
                alert('Componente eliminado correctamente');
                fetchComponentes();
            } else {
                alert('Error al eliminar el componente');
            }
        } catch (error) {
            console.error('Error eliminando el componente:', error);
        } finally {
            // Ocultar la pantalla de carga
            document.getElementById('loading-screen').style.display = 'none';
        }
    }

    /* End Componentes */

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

        document.getElementById('loading-screen').style.display = 'block';
        const claveUea = document.getElementById('claveUea').value;
        const nombreUea = document.getElementById('nombreUea').value;
        const modulo = document.getElementById('modulo').value;

        try {
            // Mostrar la pantalla de carga
            document.getElementById('loading-screen').style.display = 'block';
    
            // Preparar el payload
            const payload = {
                clave_uea: claveUea,
                nombre_uea: nombreUea,
                modulo: modulo
            };
    
            // Llamada a la función apiRequest para agregar un módulo
            const data = apiRequest('/modulos/', 'POST', payload);
    
            if (data && data.status === 200) {
                alert('Módulo agregado exitosamente');
                window.location.reload();
            } else {
                alert('Error al agregar el módulo');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error agregando el módulo:', error);
            alert('Error al agregar el módulo');
        } finally {
            // Ocultar la pantalla de carga
            document.getElementById('loading-screen').style.display = 'none';
        }
        
    });

    // function fetchModulos() {
    //     // Mostrar la pantalla de carga
    //     document.getElementById('loading-screen').style.display = 'block';       
    //     fetch(`${academicaApiConfig.apiUrl}/modulos/`, {
    //         headers: {
    //             'ngrok-skip-browser-warning': 'true'
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.status === 200 && Array.isArray(data.data)) {
    //             modulosList.innerHTML = '';
    //             data.data.forEach(modulo => {
    //                 const moduloItem = document.createElement('div');
    //                 moduloItem.innerHTML = `
    //                     <div class="modulo-item">
    //                     <span class="modulo-text">${modulo.nombre_uea} (Clave: ${modulo.clave_uea})</span>
    //                     <button type="button" class="deleteModuloBtn" data-clave="${modulo.clave_uea}">Eliminar</button>
    //                     </div>
    //                 `;
    //                 modulosList.appendChild(moduloItem);
    //                         // Ocultar la pantalla de carga
    //                 document.getElementById('loading-screen').style.display = 'none'; 
    //             });

    //             document.querySelectorAll('.deleteModuloBtn').forEach(btn => {
    //                 btn.addEventListener('click', function() {
    //                     const claveUea = this.getAttribute('data-clave');
    //                     deleteModulo(claveUea);
    //                 });
    //             });
    //         } else {
    //             console.error('La respuesta de la API no es válida:', data);
    //             alert('Error al obtener los módulos');
    //             location.reload();
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error al obtener los módulos:', error);
    //         alert('Error al obtener los módulos');
    //         location.reload();
    //     });
    // }

    async function fetchModulos() {
        // Mostrar la pantalla de carga
        document.getElementById('loading-screen').style.display = 'block';       
    
        try {
            // Realizar la solicitud para obtener los módulos
            const data = await apiRequest('GET', '/modulos/');
            //console.log(JSON.stringify(data));
    
            if (data.status === 200 && Array.isArray(data.payload.data)) {
                const modulosList = document.getElementById('modulosList'); // Asegúrate de que este ID sea correcto
                if (modulosList) {
                    modulosList.innerHTML = ''; // Limpiar la lista de módulos
    
                    data.payload.data.forEach(modulo => {
                        const moduloItem = document.createElement('div');
                        moduloItem.innerHTML = `
                            <div class="modulo-item">
                                <span class="modulo-text">${modulo.nombre_uea} (Clave: ${modulo.clave_uea})</span>
                                <button type="button" class="deleteModuloBtn" data-clave="${modulo.clave_uea}">Eliminar</button>
                            </div>
                        `;
                        modulosList.appendChild(moduloItem);
                    });
    
                    // Agregar event listeners para los botones de eliminar
                    document.querySelectorAll('.deleteModuloBtn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const claveUea = this.getAttribute('data-clave');
                            deleteModulo(claveUea); // Asumimos que esta función ya está definida
                        });
                    });
                } else {
                    console.error('Elemento "modulosList" no encontrado');
                    alert('Error al obtener los módulos');
                    location.reload();
                }
            } else {
                console.error('La respuesta de la API no es válida:', data);
                alert('Error al obtener los módulos');
                location.reload();
            }
        } catch (error) {
            console.error('Error al obtener los módulos:', error);
            alert('Error al obtener los módulos');
            location.reload();
        } finally {
            // Ocultar la pantalla de carga al final
            document.getElementById('loading-screen').style.display = 'none'; 
        }
    }

    // function deleteModulo(claveUea) {
    //     // Mostrar la pantalla de carga
    //     document.getElementById('loading-screen').style.display = 'block'; 
    //     fetch(`${academicaApiConfig.apiUrl}/modulos/${claveUea}`, {
    //         method: 'DELETE'
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.status === 200) {
    //             alert('Módulo eliminado exitosamente');
    //             fetchModulos();
    //             // Mostrar la pantalla de carga
    //             document.getElementById('loading-screen').style.display = 'none';
    //             location.reload();
    //         } else {
    //             alert('Error al eliminar el módulo');
    //             location.reload();
    //         }
    //     });
    // }
    async function deleteModulo(claveUea) {
        // Mostrar la pantalla de carga
        document.getElementById('loading-screen').style.display = 'block'; 
    
        try {
            // Realizar la solicitud para eliminar el módulo
            const data = await apiRequest('DELETE', `/modulos/${claveUea}`);
    
            if (data.status === 200) {
                alert('Módulo eliminado exitosamente');
                await fetchModulos(); // Esperar a que se obtengan los módulos nuevamente
            } else {
                alert('Error al eliminar el módulo');
            }
        } catch (error) {
            console.error('Error al eliminar el módulo:', error);
            alert('Error al eliminar el módulo');
        } finally {
            // Ocultar la pantalla de carga al final
            document.getElementById('loading-screen').style.display = 'none';
        }
    }
    /*End Registro/Edicion/Eliminacion Componentes*/


});

//