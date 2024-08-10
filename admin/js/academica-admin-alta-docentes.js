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

    fetch('https://academica.dlimon.net/historial_academico/docentes', {
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