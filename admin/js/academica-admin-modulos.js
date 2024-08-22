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
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }

    // Function to fetch and display components
    async function fetchAndDisplayComponents(moduloId) {
        try {
            // Fetch all components
            let response = await fetch('https://academica.dlimon.net/componentes');
            let allComponents = await response.json();

            // Fetch module mapping
            response = await fetch(`https://academica.dlimon.net/modulos/${moduloId}`);
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
            let moduloId = this.getAttribute('data-modulo-id');
            fetchAndDisplayComponents(moduloId);
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
                clave_uea: document.querySelector('.componentesBtn[data-modulo-id]').getAttribute('data-modulo-id'),
                mapeo: componentes
            };

            try {
                let response = await fetch('https://academica.dlimon.net/modulos', {
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
});