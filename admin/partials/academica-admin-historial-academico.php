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
?>
<div class="header-container">
    <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Logo Académica UAM" class="logo">
    <h1 class="title">Historial Académico</h1>
</div>

<p>Descargar historial de evaluaciones por trimestre.</p>


<div id="trimestreActual"></div>


<form method="GET" action="" id="download-form" class="api-form" style="display:inline-block; vertical-align: top;">
    <h2>Historial de evaluaciones</h2>
    <label for="trimestre">Seleccionar Trimestre:</label>
    <select name="trimestre" id="trimestre">
        <option value="">Trimestre</option>
        
    </select><br /><br />
    
    <label for="tipo_evaluacion">Seleccionar Tipo de Evaluación:</label>
    <select name="tipo_evaluacion" id="tipo_evaluacion">
        <option value="global">Evaluación Global</option>
        <option value="recuperacion">Evaluación de Recuperación</option>
    </select><br /><br />
    
    <button type="button" onclick="downloadEvaluaciones()">Descargar Evaluaciones Trimestrales</button>
</form>



<!-- Pantalla de carga -->
<div id="loading-screen" style="display:none;">
    <div class="loading-content">
        <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Cargando" class="loading-image">
        <div class="loader"></div>
</div>

<script src="<?php echo plugins_url('/js/academica-admin-trimestres.js', dirname(__FILE__)); ?>"></script>