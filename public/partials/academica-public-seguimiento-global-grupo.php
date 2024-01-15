<?php

/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       http://dlimon.net/
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/public/partials
 */
//echo plugins_url('/js/academica-read-evaluacion-global.js', dirname(__FILE__));
//echo plugins_url('/css/academica-public-seguimiento-global-grupo.css', dirname(__FILE__));
?>
<link rel="stylesheet" href="<?php echo plugins_url('/css/academica-public-seguimiento-global-grupo.css', dirname(__FILE__)); ?>">
<link rel="stylesheet" href="<?php echo plugins_url('/css/academica-public.css', dirname(__FILE__)); ?>">
<h2>Evaluaciones globales</h2>
<form id="seguimiento_global_grupo_form" class="search-form-1">
    <label for="trimestre">Trimestre:</label>
    <select id="trimestre" name="trimestre">
        <option value="">Trimestre</option>
        <option value="23o">23 Otoño</option>
        <option value="23p">23 Primavera</option>
    </select>

    <label for="grupo">Grupo:</label>
    <select id="grupo" name="grupo">
        <option value="">Grupo</option>
    </select>

    <input type="submit" value="Buscar">
</form>

<div id="head">
    <div id="info_general"></div>
    <div id="asignacion_docente"></div>
</div>

<div id="seguimiento_global_grupo_table"></div>

<script src="<?php echo plugins_url('/js/academica-read-evaluacion-global.js', dirname(__FILE__)); ?>"></script>