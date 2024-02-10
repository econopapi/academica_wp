<?php

/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       https://dlimon.net/
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/public/partials
 */
//echo plugins_url('/js/academica-read-evaluacion-global.js', dirname(__FILE__));
//echo plugins_url('/css/academica-public-seguimiento-global-grupo.css', dirname(__FILE__));
require_once("wp-load.php");

$current_user = wp_get_current_user();


if ($current_user->ID != 0) {
    // El usuario está logueado
    $user_id = $current_user->ID;
    $user_login = $current_user->user_login;
    $user_email = $current_user->user_email;
    //$user_email = 'rchavez@correo.xoc.uam.mx';
    $user_roles = $current_user->roles;
    $user_role = !empty($user_roles) ? $user_roles[0] : 'Sin Rol';
    //$user_role = 'editor';

    echo "Usuario logueado: $user_email";

} else {
    // Usuario no logueado. Redirección a homepage
    wp_redirect(home_url());

}

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
    <?php if ($user_role != 'administrator') { ?>
        <input type="hidden" id="docente" name="docente" value="<?php echo $user_email; ?>">
    <?php } ?>
</form>

<div id="head">
    <div id="info_general"></div>
    <div id="asignacion_docente"></div>

</div>

<div class="notification-area">
    <div id="estatus_firma"></div>
    <div id="notification"></div>
</div>


<div id="seguimiento_global_grupo_table">

</div>



<?php if ($user_role == 'administrator') { ?>
    <script src="<?php echo plugins_url('/js/academica-coord-read-evaluacion-global.js', dirname(__FILE__)); ?>"></script>
<?php } else { ?>
    <script src="<?php echo plugins_url('/js/academica-read-evaluacion-global.js', dirname(__FILE__)); ?>"></script>
<?php } ?>
