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
?>

<h2>Asignación Docente - Evaluación Global</h2>

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


<div class="asignacion-docente-head">
    <div id="info_docente" class="table-1"></div>
    <div id="asignacion_docente" class="table-2"></div>
</div>

<script src="<?php echo plugins_url('/js/academica-coord-asignacion-docente.js', dirname(__FILE__)); ?>"></script>

<!-- Render para usuarios UAM. Se valida con sistema académico si el correo institucional del usuario está en la lista docente activa -->
<?php } else if (strpos($user_email, 'xoc.uam.mx') !== false) { ?>

    <!-- get trimestre actual y detalles de docente -->
    <?php
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
    
    $asignacion_request = 'https://academica.dlimon.net/historial_academico/asignacion_por_docente?numero_economico='.$numero_economico.'&trimestre='.$trimestre;
    $asignacion_response = wp_remote_get($asignacion_request);
    // check for error
    if (is_wp_error($asignacion_response)) {
        return false;
    }
    // get body
    $asignacion_body = wp_remote_retrieve_body($asignacion_response);
    // decode body
    $asignacion_json = json_decode($asignacion_body, true);


    // check if data is empty
    if (!empty($asignacion_json['payload'])) {
        $asignacion = $asignacion_json['payload'];
        
    } else {
        echo 'No se pudo obtener la asignación de la API.';
    }

    
    ?>

    <div class="asignacion-docente-head">
        <div id="info_docente" class="table-1">
            
            <table>
                <caption>Docente</caption>
                <tbody>
                    <tr>
                        <td><strong>Nombre:</strong></td>
                        <td><?php echo $docente_response_json['payload']['nombre']; ?></td>
                    </tr>
                    <tr>
                        <td><strong>Número económico:</strong></td>
                        <td><?php echo $docente_response_json['payload']['numero_economico']; ?></td>
                    </tr>
                    <tr>
                        <td><strong>Trimestre:</strong></td>
                        <td><?php echo strtoupper($trimestre_response_json['payload']['trimestre']); ?></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="asignacion_docente" class="table-2">

            <table class="table-1">
                <caption>Asignación</caption>
                <thead>
                    <tr>
                        <th>Grupo</th>
                        <th>Módulo</th>
                        <th>UEA</th>
                        <th>Componente</th>
                        <th>Estatus</th>
                    </tr>
                </thead>
                <tbody>
                
                <?php for ($i = 0; $i < count($asignacion)+1; $i++) { ?>
                    <?php if (empty($asignacion['asignacion'][$i]['grupo'])) {
                        continue;
                    } ?>
                    <tr>
                        <td><?php echo strtoupper($asignacion['asignacion'][$i]['grupo']); ?></td>
                        <td><?php echo $asignacion['asignacion'][$i]['modulo']; ?></td>
                        <td><?php echo $asignacion['asignacion'][$i]['uea']; ?></td>
                        <td><?php echo ucfirst($asignacion['asignacion'][$i]['componente']); ?></td>
                        <td><?php 
                            if (empty($asignacion['asignacion'][$i]['grupo'])) {
                                continue;
                            } else {
                                if ($asignacion['asignacion'][$i]['evaluacion_firmada'] == True) {
                                    echo 'Finalizada ';
                                    echo '<a href="/academica-historial-academico-evaluacion-global-grupo?grupo='
                                        . urlencode($asignacion['asignacion'][$i]['grupo'])
                                        . '&trimestre=' . urlencode($trimestre_response_json['payload']['trimestre']) . '">[Ver evaluación]</a>';

                                    
                                } else {
                                    if ($asignacion['asignacion'][$i]['evaluacion_completada'] == True) {
                                        echo 'Completada ';
                                        echo '<a href="/academica-docentes-evaluacion-componente-global?grupo='
                                            . urlencode($asignacion['asignacion'][$i]['grupo'])
                                            . '&componente=' . urlencode($asignacion['asignacion'][$i]['componente'])
                                            . '&trimestre=' . urlencode($trimestre_response_json['payload']['trimestre'])
                                            . '&docente=' . urlencode($docente_response_json['payload']['numero_economico']) . '">[Editar]</a>';
                                    } else {
                                        echo 'Pendiente ';
                                        echo '<a href="/academica-docentes-evaluacion-componente-global?grupo='
                                            . urlencode($asignacion['asignacion'][$i]['grupo'])
                                            . '&componente=' . urlencode($asignacion['asignacion'][$i]['componente'])
                                            . '&trimestre=' . urlencode($trimestre_response_json['payload']['trimestre'])
                                            . '&docente=' . urlencode($docente_response_json['payload']['numero_economico']) . '">[Evaluar]</a>';
                                    }
                                }
                            }
                            ?>
                            </td>
                    </tr>
                    
                <?php } ?>
                </tbody>
            </table>
        </div>

<!-- Redirección a homepage para usuarios externos -->
<?php } else { wp_redirect(home_url()); } ?>



