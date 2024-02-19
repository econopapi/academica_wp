<link rel="stylesheet" href="<?php echo plugins_url('/css/academica-public.css', dirname(__FILE__)); ?>">

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


require_once("wp-load.php");

$current_user = wp_get_current_user();


if ($current_user->ID != 0) {
    // El usuario está logueado
    $user_id = $current_user->ID;
    $user_login = $current_user->user_login;
    $user_email = $current_user->user_email;
    $user_roles = $current_user->roles;
    $user_role = !empty($user_roles) ? $user_roles[0] : 'Sin Rol';

    echo "<p style='margin: 25px;'><strong>Usuario activo: $user_email</strong></p>";
} else {
    // redirect to homepage
    wp_redirect(home_url());
}

$grupo = $_GET['grupo'];
$modulo = $_GET['modulo'];
$componente = $_GET['componente'];
$trimestre = $_GET['trimestre'];
$docente = $_GET['docente'];

$docente_request = 'https://academica.dlimon.net/historial_academico/docentes?email=' . $user_email;
$docente_response = wp_remote_get($docente_request);

$trimestre_request = 'https://academica.dlimon.net/historial_academico/trimestre_actual';
$trimestre_response = wp_remote_get($trimestre_request);

if (is_wp_error($docente_response) || is_wp_error($trimestre_response)) {
    return false;
}

$docente_response_body = wp_remote_retrieve_body($docente_response);
$docente_response_json = json_decode($docente_response_body, true);

$trimestre_response_body = wp_remote_retrieve_body($trimestre_response);
$trimestre_response_json = json_decode($trimestre_response_body, true);



if (!empty($docente_response_json['payload']['numero_economico'])) {
    $numero_economico = $docente_response_json['payload']['numero_economico'];
} else {
    echo 'No se pudo obtener el número económico en la API.';
}

if (!empty($trimestre_response_json['payload']['trimestre'])) {
    $trimestre = $trimestre_response_json['payload']['trimestre'];
} else {
    echo 'No se pudo obtener el trimestre en la API.';
}

if ($docente != $docente_response_json['payload']['numero_economico']
    || $trimestre != $trimestre_response_json['payload']['trimestre']) {
    echo 'No tienes permiso para ver estos datos ;).';
    return false;
}

$lista_request = 'https://academica.dlimon.net/historial_academico/lista_alumnos_componente_recuperacion?trimestre='.$trimestre.'&grupo='.$grupo.'&componente='.$componente . '&modulo=' . $modulo;
$lista_response = wp_remote_get($lista_request);
// check for error
if (is_wp_error($lista_response)) {
    return false;
}
// get body
$lista_body = wp_remote_retrieve_body($lista_response);
// decode body
$lista_json = json_decode($lista_body, true);

?>

<h2>Evaluación de componente - Recuperación</h2>

<div class="evaluacion-componente-head">
    <div class="table-1">
                
        <table>
            <tbody>
                <tr>
                    <td><strong>Grupo:</strong></td>
                    <td><?php echo strtoupper($grupo); ?></td>
                </tr>
                <tr>
                    <td><strong>Módulo:</strong></td>
                    <td><?php echo ucfirst($modulo); ?></td>
                <tr>
                    <td><strong>Componente:</strong></td>
                    <td><?php echo ucfirst($componente); ?></td>
                </tr>
                <tr>
                    <td><strong>Trimestre:</strong></td>
                    <td><?php echo strtoupper($trimestre); ?></td>
                </tr>
                <tr>
                    <td><strong>Docente:</strong></td>
                    <td><?php echo $docente; ?></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="table-2">
    <form class="search-form-2" id="lista_componente">       
        <table class="table-1">     
            <caption>Lista</caption>
            <thead>
                <tr>
                    <th>Lista</th>
                    <th>Matrícula</th>
                    <th>Alumno</th>
                    <th>Calificación</th>
                </tr>
            </thead>
            <p class="bold">Nota: Las calificaciones preasignadas corresponden a las notas que la alumna/o obtuvo en la evaluación global. Favor de asignar la calificación sólo en las casillas vacías. </p>
            <tbody>

            <?php for ($i = 0; $i < count($lista_json['payload']['lista_alumnos']); $i++) { ?>
                <tr>
                    <td><?php echo $lista_json['payload']['lista_alumnos'][$i]['numero_lista']; ?></td>
                    <td><?php echo $lista_json['payload']['lista_alumnos'][$i]['matricula']; ?>
                    <input type="hidden" name="matriculas[<?php echo $i; ?>]" value="<?php echo $lista_json['payload']['lista_alumnos'][$i]['matricula']; ?>">
                    <td><?php echo $lista_json['payload']['lista_alumnos'][$i]['nombre_alumno']; ?></td>
                    <td>
                        <input type="number" step="0.01" name="calificacion[<?php echo $i; ?>]" value="<?php echo $lista_json['payload']['lista_alumnos'][$i][$componente]; ?>">
                    </td>
                </tr>
            <?php } ?>
            </tbody>
        </table>
        <input type="hidden" id="id_seguimiento_recuperacion" value="<?php echo $lista_json['payload']['id_seguimiento']; ?>">
        <input type="hidden" id="docente_id" value="<?php echo $docente; ?>">
        <input type="hidden" id="componente_id" value="<?php echo $componente; ?>">
        <input type="hidden" id="trimestre" value="<?php echo $trimestre; ?>">
        <input type="hidden" id="grupo" value="<?php echo $grupo; ?>">
        <input type="hidden" id="modulo" value="<?php echo $modulo; ?>">
        
        <input type="submit" value="Enviar evaluación">
    </form>
    
    </div>
</div>

<script src="<?php echo plugins_url('/js/academica-public-evaluacion-componente-recuperacion.js', dirname(__FILE__)); ?>"></script>


