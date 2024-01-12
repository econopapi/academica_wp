<link rel="stylesheet" href="<?php echo plugins_url('/css/academica-public.css', dirname(__FILE__)); ?>">

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
// echo plugins_url('/js/academica-read-evaluacion-global.js', dirname(__FILE__));
require_once("wp-load.php");
?>


<?php

// Obtiene el usuario actual
$current_user = wp_get_current_user();

// Verifica si el usuario está logueado
if ($current_user->ID != 0) {
    // El usuario está logueado

    // Accede a la información del usuario
    $user_id = $current_user->ID;
    $user_login = $current_user->user_login;
    $user_email = $current_user->user_email;

    // Obtiene el rol del usuario
    $user_roles = $current_user->roles;
    $user_role = !empty($user_roles) ? $user_roles[0] : 'Sin Rol';

    // Realiza acciones según la información del usuario
    echo "Usuario logueado: $user_login (ID: $user_id, Email: $user_email, Rol: $user_role)";
} else {
    // redirect to homepage
    wp_redirect(home_url());
}
?>

<h2>Aignación Docente - Evaluación Global</h2>

<!-- Render para Coordinación (usuarios administradores) -->
<?php if ($user_role == 'administrator') { ?>
<form id="asignacion_docente_form" class="search-form-1">
    <label for="trimestre">Trimestre:</label>
    <select id="trimestre" name="trimestre">
        <option value="23p">23 Primavera</option>
        <option value="23i">23 Invierno</option>
    </select>

    <label for="numero_economico">Número económico</label>
    <input type="text" id="numero_economico" name="numero_economico" pattern="[0-9]*" value="">

    <input type="submit" value="Buscar">
</form>
<script src="<?php echo plugins_url('/js/academica-coord-asignacion-docente.js', dirname(__FILE__)); ?>"></script>

<!-- Render para usuarios UAM. Se valida con sistema académico si el correo institucional del usuario está en la lista docente activa -->
<?php } else if (strpos($user_email, 'xoc.uam.mx') !== false) { ?>
    <p>Form de usuario UAM. Se valida con sistema académico si el correo institucional del usuario está en la lista docente activa</p>

    <?php
    /*
    // get request for endpoint: localhost:5000/historial_academico/asignacion_por_docente
    $url = 'http://localhost:5000/historial_academico/asignacion_por_docente?numero_economico=' . $user_login . '&trimestre=23p';
    //requuest
    $response = wp_remote_get($url);
    // check for error
    if (is_wp_error($response)) {
        return false;
    }
    // get body
    $body = wp_remote_retrieve_body($response);
    // decode body
    $data = json_decode($body);

    // check if data is empty
    if (empty($data)) {
        echo 'No se pudo obtener los datos de la API.';
        return;
    }
    // echo data
    echo print_r($data);
    */

    // get request for endpoint: localhost:5000/historial_academico/asignacion_por_docente
    ?>

<!-- Redirección a homepage para usuarios externos -->
<?php } else { wp_redirect(home_url()); } ?>

<div class="asignacion-docente-head">
    <div id="info_docente" class="table-1"></div>
    <div id="asignacion_docente" class="table-2"></div>
</div>

