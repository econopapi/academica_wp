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

    fetch(`http://localhost:5000/coordinacion/global/grupos?modulo=${moduloSeleccionado}`)
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


asignacionForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var modulo = this.modulo.value;
    var grupo = this.grupo.value;
    var trimestre = this.trimestre.value;
    var coordinacion = this.coordinacion.value;

    var docentes = [
        {
            docente: parseInt(this.teoria.value),
            componente: 'teoria',
            coordinacion: coordinacion === 'teoria'
        },
        {
            docente: parseInt(this.teoria.value),
            componente: 'matematicas',
            coordinacion: coordinacion === 'matematicas'
        },
        {
            docente: parseInt(this.teoria.value),
            componente: 'taller',
            coordinacion: coordinacion === 'taller'
        },
        {
            docente: parseInt(this.teoria.value),
            componente: 'investigacion',
            coordinacion: coordinacion === 'investigacion'
        },       
    ];

    var data = {
        uea: modulo,
        grupo: grupo,
        trimestre: trimestre,
        docentes: docentes
    };

    //console.log(data);

    fetch('https://conversely-pretty-shad.ngrok-free.app/coordinacion/global/grupos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
      .then(data => console.log(data));

    // Another code
    
});