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
        <option value="23p">23 Primavera</option>
        <option value="23i">23 Invierno</option>
    </select>

    <label for="grupo">Grupo:</label>
    <select id="grupo" name="grupo">
        <option value="sd01e">SD01E</option>
        <option value="sd02e">SD02E</option>
        <option value="sd03e">SD03E</option>
        <option value="sd51e">SD51E</option>
        <option value="sd52e">SD52E</option>
        <option value="sf01e">SF51E</option>
        <option value="sj51e">SJ51E</option>
        <option value="sl01e">SL01E</option>
        <option value="sl02e">SL02E</option>
    </select>

    <input type="submit" value="Buscar">
</form>

<div id="head">
    <div id="info_general"></div>
    <div id="asignacion_docente"></div>
</div>

<div id="seguimiento_global_grupo_table"></div>

<script src="<?php echo plugins_url('/js/academica-read-evaluacion-global.js', dirname(__FILE__)); ?>"></script>