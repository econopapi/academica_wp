<?php 

echo "<h1>Académica UAM - Administración de Módulos</h1>";

/*
Endpoints a consultar:

https://academica.dlimon.net/componentes

https://academica.dlimon.net/modulos

*/

// Fetch data from /modulos endpoint
$modulos_json = file_get_contents('https://academica.dlimon.net/modulos');
$modulos_data = json_decode($modulos_json, true);

// Check if the data was fetched successfully
if ($modulos_data['status'] == 200) {
    $modulos = $modulos_data['data'];
} else {
    echo "<p>Error fetching modules data.</p>";
    $modulos = [];
}

?>

<!-- Popup -->
<div id="popupForm" class="popup" style="display:none;">
    <div class="popup-content">
        <span class="closeBtn">&times;</span>
        <h2>Componentes del Módulo</h2>
        <form id="componentesForm">
            <div id="componentesList">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre del Componente</th>
                            <th>Ponderación</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody id="componentesListBody">
                        <!-- Componentes agregados se agregarán aquí -->
                    </tbody>
                </table>
            </div>
            <h3>Agregar Componentes</h3>
            <div id="catalogoComponentes">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre del Componente</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody id="catalogoComponentesBody">
                        <!-- Componentes disponibles se agregarán aquí -->
                    </tbody>
                </table>
            </div>
            <button type="button" id="saveChangesBtn">Guardar Cambios</button>
        </form>
    </div>
</div>

<h2>Lista de Módulos</h2>
<button onclick="location.href='registrar_modulo.php'">Registrar Módulo</button>
<button onclick="location.href='registrar_componente.php'">Registrar Componente</button>
<table class="table-2">
    <thead>
        <tr>
            <th>Clave UEA</th>
            <th>Nombre UEA</th>
            <th>Módulo</th>
            <th>Componentes</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($modulos as $modulo): ?>
            <tr>
                <td><?php echo htmlspecialchars($modulo['clave_uea']); ?></td>
                <td><?php echo htmlspecialchars($modulo['nombre_uea']); ?></td>
                <td><?php echo htmlspecialchars($modulo['modulo']); ?></td>
                <td><button class="componentesBtn" data-modulo-id="<?php echo htmlspecialchars($modulo['clave_uea']); ?>">Componentes</button></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<script src="<?php echo plugins_url('/js/academica-admin-modulos.js', dirname(__FILE__)); ?>"></script>