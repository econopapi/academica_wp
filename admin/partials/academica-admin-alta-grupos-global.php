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

echo "<h1>Académica UAM - Alta de Grupos (Evaluación Global)</h1>";
?>

<div class="evaluacion-componente-head">
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
                            <option value="24i">24 Invierno</option>
                        </select>
                    </td>
                    <td>
                        <select id="modulo" name="modulo">}
                            <option value="">Módulo</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </td>
                    <td>
                        <select id="grupo" name="grupo">
                            <option value="">Grupo</option>
                            <option value="23o">SD01E</option>
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
            <tbody>

            <tr>
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
            </tr> 
            </tbody>
        </table>

        <table class="table-1">
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
                        <label>El archivo XLSX debe contener únicamente tres columnas: número de lista, matrícula y nombre</label>                
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

<script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
<script src="<?php echo plugins_url('/js/academica-admin-alta-grupos-global.js', dirname(__FILE__)); ?>"></script>


