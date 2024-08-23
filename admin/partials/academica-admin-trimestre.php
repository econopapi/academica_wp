<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       http://example.com
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/admin/partials
 */

echo "<h1>Académica UAM - Administración de Trimestre</h1>";
?>

<!--  sección para dar de alta un nuevo trimestre -->
<form method="POST" action="" id="new-trimester-form">
    <h2>Dar de Alta Nuevo Trimestre</h2>
    <label for="trimestre_clave">Clave del Trimestre:</label>
    <input type="text" name="trimestre_clave" id="trimestre_clave" required><br /><br />
    
    <label for="trimestre_nombre">Nombre del Trimestre:</label>
    <input type="text" name="trimestre_nombre" id="trimestre_nombre" required><br /><br />
    
    <button type="button" onclick="addNewTrimester()">Agregar Nuevo Trimestre</button>
</form>

<form method="GET" action="" id="download-form">
    <label for="trimestre">Seleccionar Trimestre:</label>
    <select name="trimestre" id="trimestre">
        <option value="24i">24-Invierno</option>
        <option value="23o">23-Otoño</option>
    </select><br /><br />
    
    <label for="tipo_evaluacion">Seleccionar Tipo de Evaluación:</label>
    <select name="tipo_evaluacion" id="tipo_evaluacion">
        <option value="global">Evaluación Global</option>
        <option value="recuperacion">Evaluación de Recuperación</option>
    </select><br /><br />
    
    <button type="button" onclick="downloadEvaluaciones()">Descargar Evaluaciones Trimestrales</button>
</form>

<!-- Pantalla de carga -->
<div id="loading-screen" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); text-align:center; z-index:1000;">
    <div style="position:relative; top:50%; transform:translateY(-50%); color:white; font-size:20px;">
    <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Cargando" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; z-index: 10;">
        <div class="loader" style="border: 16px solid #f3f3f3; border-radius: 50%; border-top: 16px solid #3498db; width: 80px; height: 80px; animation: spin 2s linear infinite; margin: 0 auto;"></div>
    </div>
</div>

<script>
function downloadEvaluaciones() {
    // Mostrar la pantalla de carga
    document.getElementById('loading-screen').style.display = 'block';

    var trimestre = document.getElementById('trimestre').value;
    var tipoEvaluacion = document.getElementById('tipo_evaluacion').value;
    var baseUrl = 'https://academica.dlimon.net/csv_dump/';
    var endpoint = tipoEvaluacion === 'global' ? 'evaluacion_global' : 'evaluacion_recuperacion';
    var url = baseUrl + endpoint + '?trimestre=' + trimestre;

    // Redireccionar a la URL para iniciar la descarga
    window.location.href = url;

    // Ocultar la pantalla de carga después de un retraso para asegurar que la descarga ha comenzado
    setTimeout(function() {
        document.getElementById('loading-screen').style.display = 'none';
    }, 3000); // Ajusta el tiempo si es necesario
}

// CSS para la animación del loader
var style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);
</script>
