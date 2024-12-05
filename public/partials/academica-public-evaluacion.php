<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<?php

/**
 * Display detallado para evaluaciones globales/recuperación. Muestra
 * toda la información de la evaluación: datos del grupo, módulo, trimestre,
 * datos de la asignación docente, lista de grupo y calificaciones desglosadas.
 * 
 * Muestra un menú de descarga para obtener la evaluación en PDF o en Excel.
 * 
 * También muestra controles sobre la evaluación al coordinador de módulo.
 *
 * @link       https://academica.dlimon.net/docs
 * @since      0.1
 *
 * @package    Academica
 * @subpackage Academica/public/partials
 */

$tipo_evaluacion = (isset($_GET['evaluacion']) && $_GET['evaluacion'][0] === 'r') ? 'recuperacion' : ((isset($_GET['evaluacion']) && $_GET['evaluacion'][0] === 'g') ? 'global' : 'global');
$current_user = wp_get_current_user();

if ($current_user->ID != 0) {
    // El usuario está logueado
    $user_id = $current_user->ID;
    $user_login = $current_user->user_login;
    $user_email = $current_user->user_email;
    //$user_email = 'lsanchez@correo.xoc.uam.mx';
    $user_roles = $current_user->roles;
    $user_role = !empty($user_roles) ? $user_roles[0] : 'Sin Rol';
    //$user_role = 'editor';
    echo "<p style='margin: 25px;'><strong>Usuario activo: $user_email</strong></p>";
} else {
    // Usuario no logueado. Redirección a homepage
    echo $current_user->user_login;
    wp_redirect(home_url());
    exit();
}

?>
<script>var tipoEvaluacion = "<?php echo $tipo_evaluacion; ?>"</script>
<div class="overlay">
    <div class="loadingScreen"></div>
</div>

<link rel="stylesheet" href="<?php echo plugins_url('/css/academica-public-seguimiento-global-grupo.css', dirname(__FILE__)); ?>">
<link rel="stylesheet" href="<?php echo plugins_url('/css/academica-public.css', dirname(__FILE__)); ?>">
<h2>
    <?php echo ($tipo_evaluacion == 'global') ? 'Evaluación global' : 'Evaluación de recuperación'; ?>
</h2>

<form id="seguimiento_global_grupo_form" class="search-form-1">
    <label for="trimestre">Trimestre:</label>
    <select id="trimestre" name="trimestre">
        <option value="">Trimestre</option>
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
<img class="center" src="https://uam.dlimon.net/wp-content/uploads/2024/02/AXOLOTL-1.png" alt="axolotl">
</div>

<!-- Pantalla de carga -->
<div id="loading-screen" style="display:block">
    <div class="loading-content">
        <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Cargando" class="loading-image">
        <div class="loader"></div>
    </div>
</div>
<!-- Biblioteca jsPDF para la creación de PDFs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.14/jspdf.plugin.autotable.min.js"></script>
<!-- Biblioteca SheetJS para la creación de archivos Excel -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>

<script src="<?php echo plugins_url('/js/academica-read-evaluacion.js', dirname(__FILE__)); ?>"></script>