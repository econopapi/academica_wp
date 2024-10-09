<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       http://example.com
 * @since      0.1
 *
 * @package    academica_wp
 * @subpackage academica_wp/admin/partials
 */
?>
<div class="header-container">
    <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Logo Académica UAM" class="logo">
    <h1 class="title">Grupos Global</h1>
</div>

<p>Alta y gestión de grupos para la evaluación global en el trimestre actual.</p>


<div id="trimestreActual"></div>
<!-- Pantalla de carga -->
<div id="loading-screen" style="display:block">
    <div class="loading-content">
        <img src="https://economia.xoc.uam.mx/archivos/loading-screen-axolotl.png" alt="Cargando" class="loading-image">
        <div class="loader"></div>
    </div>
</div>

<div>
    <button id="addGrupoBtn">Alta de grupo</button>
    <button id="catalogoGruposBtn">Configuración</button>
</div>

<h2>Grupos registrados</h2>
<table class="table-2" style="margin:0!important;">
    <thead>
        <tr>
            <th>Trimestre</th>
            <th>Grupo</th>
            <th>Módulo</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody id="gruposTableBody">
        <!-- Grupos se agregarán aquí -->
    </tbody>
</table>

<div id="popupGrupoDetalle" class="popup">
    <div class="popup-content">
        <span class="closeBtn closeGruposDetalle">&times;</span>
        
        <div class="table-2" id="grupoInfoGeneral">
            <!-- Contenido de Información General -->
        </div>
        <div class="table-2" id="grupoInfoDocentes">
            <!-- Contenido de Información de Docentes -->
        </div>
        
        <div class="table-2" id="grupoInfoAlumnos">
            <!-- Contenido de Información de Alumnos -->
        </div>
    </div>
</div>

<div class="popup" id="popupCatalogoGrupos">
    <div class="popup-content">
        <span class="closeBtn closeCatalogoGrupos">&times;</span>
        <h2>Catálogo de Grupos</h2>
        <form class="search-form-2" id="catalogoGruposForm">
        <div style="display: flex; align-items: center;">
            <div>

                <select name="moduloCatalogoSelect" id="moduloCatalogoSelect">
                    <option value="">Módulo</option>
                </select>

            </div>
            <div id="inputGrupoCatalogoDiv">
                <input type="text" id="grupoCatalogo" name="grupoCatalogo" placeholder="Grupo">                
            </div>
            <div id="buttonGrupoCatalogoDiv">
                <button id="registarGrupoCatalogo">Registrar grupo</button>
            </div>
            <div>
                <p>Use esta interfaz para gestionar y mapear los grupos que cada módulo puede tener y su respectiva nomenclatura. Se sugiere registrar más grupos para tener holgura al momento de dar de alta seguimientos.</p>
            </div>

        </div>
        </form>        
        <div class="table-2" id="catalogoGruposTable">
            <!-- Aquí se mostrarán los grupos por módulo obtenidos de la API -->
        </div>
    </div>
</div>

<div id="popupAltaGrupo" class="popup" style="display:none;">
    <div class="popup-content">
        <span class="closeBtn closeAltaGruposBtn">&times;</span>
        <div class="table-2">
            <form class="search-form-2" id="asignacion-form" enctype="multipart/form-data">       
                <table class="table-1">     
                    
                    <thead>
                        <tr>
                            <th>Trimestre</th>
                            <th>Módulo</th>
                            <th>Grupo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select id="trimestre" name="trimestre" disabled>
                                    <option value="">Trimestre</option>
                                </select>
                            </td>
                            <td>
                                <select id="modulo" name="modulo">}
                                    <option value="">Módulo</option>
                                </select>
                            </td>
                            <td>
                                <select id="grupo" name="grupo">
                                    <option value="">Grupo</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table class="table-1">     
                    
                    <thead>
                        <tr>
                            <th>Componente</th>
                            <th>Docente</th>
                            <th>Coordinación</th>
                        </tr>
                    </thead>
                    <tbody id="componentes-tbody">

                    <!-- <tr>
                        <td>Teoría</td>
                        <td><input type="text" name="teoria" placeholder="Número económico" style="width: 100%!important; padding: 2px!important;"></td>
                        <td><input type="radio" name ="coordinacion" value="teoria"></td>
                    </tr>

                    <tr>
                        <td>Matemáticas</td>
                        <td><input type="text" name="matematicas" placeholder="Número económico" style="width: 100%!important; padding: 2px!important;"></td>
                        <td><input type="radio" name ="coordinacion" value="matematicas"></td>
                    </tr>

                    <tr>
                        <td>Taller</td>
                        <td><input type="text" name="taller" placeholder="Número económico" style="width: 100%!important; padding: 2px!important;"></td>
                        <td><input type="radio" name ="coordinacion" value="taller"></td>
                    </tr>   
                    
                    <tr>
                        <td>Investigación</td>
                        <td><input type="text" name="investigacion" placeholder="Número económico" style="width: 100%!important; padding: 2px!important;"></td>
                        <td><input type="radio" name ="coordinacion" value="investigacion"></td>
                    </tr>  -->
                    </tbody>
                </table>

                <table class="table-2">
                    <thead>
                        <tr>
                            <th>
                                Lista de alumnado
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="center-content">
                                <label>El archivo XLSX debe contener únicamente tres columnas con los siguientes encabezados: <strong>número_lista, matricula, nombre_alumno</strong></label>
                                <a href="https://economia.xoc.uam.mx/archivos/grupo_global_muestra.xlsx"><strong>[Descargar plantilla XLSX de ejemplo]</strong></a>                
                            </td>
                        </tr>
                        <tr>
                            <td class="center-content">
                                <input type="file" id="excel_file" name="excel_file" accept=".xlsx">
                            </td>
                        </tr>
                    </tbody>
                </table>


                
                <input type="submit" value="Registrar grupo">
            </form>
        </div>
    </div>

</div>



<script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
<script src="<?php echo plugins_url('/js/academica-admin-alta-grupos-global.js', dirname(__FILE__)); ?>"></script>


