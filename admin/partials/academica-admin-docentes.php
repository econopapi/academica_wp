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

echo "<h1>Académica UAM - Administración de Docentes</h1>";
?>

<div class="pagination">
    <button id="openPopupBtn">Agregar docente</button>
</div>

<!-- Popup -->
<div id="popupForm" class="popup">
    <div class="popup-content">
        <span class="closeBtn">&times;</span>
        <h2>Alta docente</h2>
        <form id="docenteForm">
            <label for="numeroEconomico">Número Económico:</label>
            <input type="text" id="numeroEconomico" name="numeroEconomico" required><br>
            
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required><br>
            
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
                
                <th>Número Económico</th>
                <th>Nombre</th>
                
                <th>Email</th>
                <th>Teléfono</th>
                <th>Extensión</th>
                <th>Cubículo</th>
              </tr>";

        foreach ($docentes->payload as $docente) {
            echo "<tr>
                    
                    <td>{$docente->numero_economico}</td>
                    <td>{$docente->nombre}</td>
                    
                    <td>{$docente->email}</td>
                    <td>{$docente->telefono}</td>
                    <td>{$docente->extension}</td>
                    <td>{$docente->cubiculo}</td>
                  </tr>";
        }

        echo "</table>";
        // Controles de paginación
        $prev_page = $api_page > 1 ? $api_page - 1 : 1;
        $next_page = $api_page + 1;

        echo "<div class='pagination'>";
        if ($api_page > 1) {
            echo "<a href='?page=academica_docentes&api_page=$prev_page&limit=$limit'>Anterior</a> ";
        }
        echo "<a href='?page=academica_docentes&api_page=$next_page&limit=$limit'>Siguiente</a>";
        echo "</div>";
    } else {
        echo "<p>No se encontraron datos</p>";
        echo "<a href='?page=academica_docentes'>Volver</a> ";
    }
}
?>

<script src="<?php echo plugins_url('/js/academica-admin-alta-docentes.js', dirname(__FILE__)); ?>"></script>




