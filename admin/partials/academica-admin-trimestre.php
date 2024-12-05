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
    <h1 class="title">Trimestres</h1>
</div>

<p>Administración de Trimestres.</p>


<div id="trimestreActual"></div>


    <!--  sección para dar de alta un nuevo trimestre -->
    <form method="POST" action="" id="new-trimester-form" class="api-form" style="display:inline-block; vertical-align: top; margin-right: 20px;">
        <h2>Dar de Alta Nuevo Trimestre</h2>
        <label for="trimestre_clave">Clave del Trimestre:</label>
        <input placeholder="ej: 25p" type="text" name="trimestre_clave" id="trimestre_clave" required><br /><br />
        
        <label for="trimestre_nombre">Nombre del Trimestre:</label>
        <input placeholder="ej: 25-Primavera" type="text" name="trimestre_nombre" id="trimestre_nombre" required><br /><br />
        
        <button type="button" onclick="addTrimestre()">Agregar Nuevo Trimestre</button>
    </form>

<!-- Pantalla de carga -->
<div id="loading-screen" style="display:none;">
    <div class="loading-content">
        <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Cargando" class="loading-image">
        <div class="loader"></div>
</div>

<script src="<?php echo plugins_url('/js/academica-admin-trimestres.js', dirname(__FILE__)); ?>"></script>