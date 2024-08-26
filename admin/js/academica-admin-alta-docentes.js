// Get the popup
var popup = document.getElementById("popupForm");

// Get the button that opens the popup
var btn = document.getElementById("openPopupBtn");

// Get the <span> element that closes the popup
var span = document.getElementsByClassName("closeBtn")[0];

// When the user clicks the button, open the popup 
btn.onclick = function() {
    popup.style.display = "block";
}

// When the user clicks on <span> (x), close the popup
span.onclick = function() {
    popup.style.display = "none";
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // docentes Form Event Manager
    document.getElementById("docenteForm").addEventListener("submit", function(event){

        event.preventDefault();

        const formData = {
            nombre: document.getElementById("nombre").value,
            estatus: true,
            numero_economico: parseInt(document.getElementById("numeroEconomico").value),
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
            extension: document.getElementById("extension").value,
            cubiculo: document.getElementById("cubiculo").value
        };

        fetch(`${academicaApiConfig.apiUrl}/historial_academico/docentes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.status == 200) {
                alert('Docente registrado correctamente');
                location.reload();
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    //editar docente
    const editarDocentePopup = document.getElementById('editarDocentePopup');
    const closeBtns = document.querySelectorAll('.closeBtn');
    const editarDocenteForm = document.getElementById('editarDocenteForm');

    document.querySelectorAll('.editarDocenteBtn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const docenteData = JSON.parse(this.getAttribute('data-docente'));

            document.getElementById('editarNombre').value = docenteData.nombre;
            document.getElementById('editarNumeroEconomico').value = docenteData.numero_economico;
            document.getElementById('editarEmail').value = docenteData.email;
            document.getElementById('editarTelefono').value = docenteData.telefono;
            document.getElementById('editarExtension').value = docenteData.extension;
            document.getElementById('editarCubiculo').value = docenteData.cubiculo;

            editarDocentePopup.style.display = 'block';
        });
    });

    document.querySelectorAll('.paginationBtn').forEach(button => {
        button.addEventListener('click', function () {
            document.getElementById('loading-screen').style.display = 'block';
        });
    });
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            editarDocentePopup.style.display = 'none';
        });
    });

    // window.addEventListener('click', function (event) {
    //     if (event.target == editarDocentePopup) {
    //         editarDocentePopup.style.display = 'none';
    //     }
    // });

    editarDocenteForm.addEventListener('submit', function (event) {
        // show the loading screen
        document.getElementById('loading-screen').style.display = 'block';
        event.preventDefault();

        const docenteData = {
            numero_economico: document.getElementById('editarNumeroEconomico').value,
            nombre: document.getElementById('editarNombre').value,
            email: document.getElementById('editarEmail').value,
            telefono: document.getElementById('editarTelefono').value,
            extension: document.getElementById('editarExtension').value,
            cubiculo: document.getElementById('editarCubiculo').value,
            estatus: "true"
        };

        fetch(`${academicaApiConfig.apiUrl}/historial_academico/docentes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(docenteData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Docente actualizado exitosamente');
                location.reload();
            } else {
                alert('Error al actualizar el docente');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar el docente');
        });
    });
});
