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
    <h1 class="title">Docentes</h1>
</div>
<p>Administración del directorio de docentes.</p>
<button id="openPopupBtn">Agregar docente</button>



<!-- Popup -->
<div id="popupForm" class="popup">
    <div class="popup-content">
        <span class="closeBtn">&times;</span>
        <h2>Alta docente</h2>
        <form id="docenteForm">

            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required><br>
            <label for="numeroEconomico">Número Económico:</label>
            <input type="text" id="numeroEconomico" name="numeroEconomico" required><br>
        
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required><br>
            
            <label for="telefono">Teléfono:</label>
            <input type="text" id="telefono" name="telefono" required><br>
            
            <label for="extension">Extensión:</label>
            <input type="text" id="extension" name="extension" required><br>
            
            <label for="cubiculo">Cubículo:</label>
            <input type="text" id="cubiculo" name="cubiculo" required><br>
            
            <button type="submit">Alta</button>
        </form>
    </div>
</div>

<div class="popup" id="editarDocentePopup">
    <div class="popup-content">
        <span class="closeBtn">&times;</span>
        <h2>Editar docente</h2>
        <form id="editarDocenteForm">

            <label for="editarNombre">Nombre:</label>
            <input type="text" id="editarNombre" name="nombre" required><br>
            <label for="editarNumeroEconomico">Número Económico:</label>
            <input type="text" id="editarNumeroEconomico" name="numeroEconomico" required><br>
        
            
            <label for="editarEmail">Email:</label>
            <input type="email" id="editarEmail" name="email" required><br>
            
            <label for="editarTelefono">Teléfono:</label>
            <input type="text" id="editarTelefono" name="telefono" required><br>
            
            <label for="editarExtension">Extensión:</label>
            <input type="text" id="editarExtension" name="extension" required><br>
            
            <label for="editarCubiculo">Cubículo:</label>
            <input type="text" id="editarCubiculo" name="cubiculo" required><br>
            
            <button type="submit">Actualizar</button>
        </form>
    </div>    
</div>

<?php
$api_page = isset($_GET['api_page']) ? $_GET['api_page'] : 1;
$limit = isset($_GET['limit']) ? $_GET['limit'] : 15;

$endpoint = "https://academica.dlimon.net/historial_academico/docentes?page=$api_page&limit=$limit";

$response = wp_remote_get($endpoint);
$data = wp_remote_retrieve_body($response);

// Verificar si la respuesta contiene datos
if (empty($data)) {
    echo "<p>No se encontraron datos</p>";
    return;
} else {
    $docentes = json_decode($data);
    if ($docentes->status == 'success' && !empty($docentes->payload)) {
        echo "<table class='table-2'>";
        echo "<tr>
                <th>Nombre</th>              
                <th>Número Económico</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Extensión</th>
                <th>Cubículo</th>
                <th>Acciones</th>
              </tr>";

        foreach ($docentes->payload as $docente) {
            echo "<tr>
                    <td>{$docente->nombre}</td>                  
                    <td>{$docente->numero_economico}</td>
                    <td>{$docente->email}</td>
                    <td>{$docente->telefono}</td>
                    <td>{$docente->extension}</td>
                    <td>{$docente->cubiculo}</td>
                    <td><a href='#' class='editarDocenteBtn' data-docente='" . json_encode($docente) . "'>[Editar]</a></td>
                  </tr>";
        }

        echo "</table>";
        // Controles de paginación
        $prev_page = $api_page > 1 ? $api_page - 1 : 1;
        $next_page = $api_page + 1;

        echo "<div class='pagination'>";
        if ($api_page > 1) {
            echo "<a class='paginationBtn'href='?page=academica_docentes&api_page=$prev_page&limit=$limit'>Anterior</a> ";
        }
        echo "<a class='paginationBtn' href='?page=academica_docentes&api_page=$next_page&limit=$limit'>Siguiente</a>";
        echo "</div>";
    } else {
        echo "<p>No se encontraron datos</p>";
        echo "<a href='?page=academica_docentes'>Volver</a> ";
    }
}
?>
<!-- Loading screen -->
<div id="loading-screen" style="display:none">
    <div class="loading-content">
        <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Cargando" class="loading-image">
        <div class="loader"></div>
</div>
<script src="<?php echo plugins_url('/js/academica-admin-alta-docentes.js', dirname(__FILE__)); ?>"></script>
