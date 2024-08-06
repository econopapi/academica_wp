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

$api_page = isset($_GET['api_page']) ? $_GET['api_page'] : 1;
echo "<p>Página actual: $api_page</p>";
$limit = isset($_GET['limit']) ? $_GET['limit'] : 10;

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
        echo "<table border='1'>";
        echo "<tr>
                <th>ID</th>
                <th>Número Económico</th>
                <th>Nombre</th>
                <th>Estatus</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Extensión</th>
                <th>Cubículo</th>
              </tr>";

        foreach ($docentes->payload as $docente) {
            echo "<tr>
                    <td>{$docente->id}</td>
                    <td>{$docente->numero_economico}</td>
                    <td>{$docente->nombre}</td>
                    <td>{$docente->estatus}</td>
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
    }
}




