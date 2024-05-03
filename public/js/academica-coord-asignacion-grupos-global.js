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


document.addEventListener('DOMContentLoaded', (event) => {
    asignacionForm.addEventListener('submit', function(event) {
        event.preventDefault();
    
        // Info de asignación docente, grupo, módulo y trimestre
    
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
    

    
        //Serialización de archivos XLSX de listas de alumnos
    
        var excelFile = document.getElementById('excel_file');
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {type: 'array'});
    
            var result = [];
            workbook.SheetNames.forEach(sheetName => {
                var rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                if (rows.length) result = result.concat(rows);
            });
    
            var data = {
                uea: modulo,
                grupo: grupo,
                trimestre: trimestre,
                docentes: docentes,
                alumnos: result
            };
    
            console.log(JSON.stringify(data, 2, 2));
        }
        reader.readAsArrayBuffer(excelFile.files[0]);


    
        // fetch('https://conversely-pretty-shad.ngrok-free.app/coordinacion/global/grupos', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // }).then(response => response.json())
        //   .then(data => console.log(data));
    
        // // Another code
        
    });
});

