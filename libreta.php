<?php
include 'inc/db2.php';
include 'inc/Configuracion.php';
$c = new DBManager();
$configuracion = new Configuracion();
$configuracion->setRuta("cfg/config.ini");
$configuracion->CargarConfiguracion();

$c->Servidor = $configuracion->getDBServer();
$c->BaseDatos = $configuracion->getDataBase();

$c->Conectar();

if(isset($_GET['bmp']))
    $botonMasProducto = $_GET['bmp'];
else
    $botonMasProducto = "20px";

if(isset($_GET['bf']))
    $botonFamilia = $_GET['bf'];
else
    $botonFamilia = "40px";

if(isset($_GET['ncp']))
    $numeroColumnasProducto = $_GET['ncp'];
else
    $numeroColumnasProducto = 3;
?>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Libreta Comandero</title>
        <!-- CSS -->
        <link href="css/bootstrap.css" rel="stylesheet" media="screen">
        <link rel="stylesheet" href="css/lightbox.css">
        <link type="text/css" rel="stylesheet" href="css/PrintArea.css" /> 
        <link rel="stylesheet" href="css/estilos.css">
        <!-- JavaScript -->
        <script src="js/bootstrap.js"></script>
        <script src="js/jquery-1.10.2.min.js"></script>
        <script src="js/libreta.fun.js"></script>
        <script src="js/jquery.PrintArea.js"></script>
    </head>
    <body style=" background-color: white" >
  	<div align="center">
            <div style="height: 10px; text-align: left; display: none;">
                Ultimo Pedido: <span id="idultima">0</span>
            </div>
            <div style="height: 10px; text-align: left;;">
                <?php echo $c->Servidor." -> ".$c->BaseDatos;?>
            </div>
            <div id="libreta" style="width: 100%; position: left">
                <div id="superior">
                    <div align="center">
                        <table style="width: 100%">
                            <tr>
                                <td class="superior_derecha enlace" style="width: 50px">
                                    <span id="comidasalir" onclick="verPendientes(1);"> </span>
                                </td>
                                <td class="superior_derecha enlace" style="width: 50px">
                                    <span id="bebidasalir" onclick="verPendientes(2);"> </span>
                                </td>
                                <td class="superior_medio">
                                    <span id="mesa_importe">B: 0 € C: 0 € <br/> Total: 0 €</span>
                                </td>
                                <td class="enlace" style="background-color: #cdcdcd; text-align: center;width: 64px; height: 50px" onclick="ResumenMesas();$('#lista_mesas').toggle();$('#comidaPendiente').hide();;$('#listaCambioMesa').hide()">
                                    <span id="mesa_nombre">00</span>
                                </td>
                                <td class="boton_menu_productos enlace" style="width: 50px">
                                    <span id="menuProductos" onclick="$('#productos').toggle();$('#comidaPendiente').hide();$('#listaCambioMesa').hide();"><img src="img/productos.png" width="50px" height="50px"/></span>
                                </td>
                            </tr>
                        </table>
                        <div id="lista_mesas" style="display: none; background-color: #b67400">
                                <div align="center">
                                <table style="width: 95%; text-align: center" class="table table-condensed" id="mesas">
                                </table>
                                </div>
                        </div>
                    </div>
                </div>
                <div id="productos" style="display: none">
                    <div id="familias" style="">
                        <div align="center">
                            <table style="border-collapse: separate; border-spacing: 3px;" border="0px">
                                <?php 
                                $f = $c->Seleccion("*", "familias","activo=1","orden");
                                $b=0;
                                $primero = true;
                                foreach ($f AS $e){
                                    if($e['id']<50){
                                        $color = "#299b5e";
                                    }
                                    if($e['id']>=50 && $e['id']<80){
                                        $color = "#bb1515";
                                    }
                                    if($e['id']>=80 && $e['id']<90){
                                        $color = "#a7a3b2";
                                    }
                                    if($b==0)
                                        echo "<tr style=\"height: ".$botonFamilia."\">";
                                    echo "<td class=\"nombre_familia\" style=\"background-color: ".$color."\" onclick=\"$('.producto').hide();$('.descripcion').hide();$('.f".$e['id']."').show();\">";
                                    echo $e['nombre'];
                                    echo "</td>";
                                    $b++;
                                    if($b==5){
                                        echo "</tr>";
                                        $b=0;
                                    }
                                }
                                echo "</tr>";
                                ?>
                            </table>
                        </div>
                    </div>
                    <div id="productos" style="background-color: white">
                        <div align="left">
                            <table style="border-collapse: separate; border-spacing: 3px; font-size: 8px; width: 100%" border="0px">
                                <?php 
                                $f = $c->Seleccion("*", "productos","activo=1","familia,nombre");
                                $familiaAnterior = 0;
                                $col=1;
                                foreach ($f AS $e){
                                    if($familiaAnterior!=$e['familia']){
                                        $familiaAnterior=$e['familia'];
                                        $col=1;
                                    }
                                    $funcion1 = "onclick=\"$('.d".$e['id']."').toggle()\"";
                                    //$funcion2 = "onclick=\"if(confirm('Añadir ".utf8_encode($e['nombre'])." a '+$('#mesa_nombre').html())){Pedir($('#mesa_nombre').html(),".$e['id'].")}\"";
                                    $funcion2 = "onclick=\"Pedir($('#mesa_nombre').html(),".$e['id'].")\"";
                                    $select = "<select id=\"cantidad_".$e['id']."\">";
                                    for ($i=1;$i<=5;$i++)
                                            $select .= "<option value=\"".$i."\">".$i."</option>";
                                    $select .= "</select>";
                                    if($col%$numeroColumnasProducto==1){
                                        echo "<tr class=\"f".$e['familia']." producto\" >";
                                    }
                                    $comentario = "<tr><td colspan='3'><span class=\"descripcion d".$e['id']."\" style=\"display: none\">".utf8_encode($e['texto'])."</span></td></tr>";
                                    /*
                                    echo "<td ".$funcion2." class=\"nombre_producto\" id='p".$e['id']."'>"
                                        ."<span class='unidades' id='u".$e['id']."' style='display: none'>0</span>".utf8_encode( $e['nombre'] )."<br/>".$comentario."</td>"
                                        ."<td style=\"font-size: 12px; text-align: center;width: 40px; background-color: #6da8ec\">".$e['precio']."</td>"
                                        //."<td>".$select."</td>"
                                        ."<td ".$funcion2." style=\"width:27px; \"><img width=\"".$botonMasProducto."\" height=\"".$botonMasProducto."\" style=\"margin: 10px\" src=\"img/mas.png\" /></td>";
                                    */
                                    $nombreTruncado = "";
                                    $longitud = explode(" ", utf8_encode( $e['nombre'] ));
                                    foreach ($longitud as $key => $value) {
                                        if(strlen($value)>8)
                                            $nombreTruncado .= substr($value, 0, 6).". ";
                                        else
                                            $nombreTruncado .= $value." ";
                                    }
                                    echo "<td ".$funcion2." class=\"nombre_producto\" id='p".$e['id']."' width=\"".(100/$numeroColumnasProducto)."%\">";
                                    echo "<table border=0 width='100%'><tr>";
                                    echo "<td><span class='unidades' id='u".$e['id']."' style='display: none'>0</span><br/></td>";								
                                    echo "<td  class=\"nombre_producto\">".$nombreTruncado."</td>";
                                    echo "<td style=\"color: white;margin-left: 20px; padding-top: 5px;font-size: 10px; width: 20px\">".$e['precio']."</td>";
                                    //echo "<td style='width: ".$botonMasProducto."'><img width=\"".$botonMasProducto."\" height=\"".$botonMasProducto."\" style=\"margin: 10px\" src=\"img/mas.png\" /></td>";
                                    echo "<tr>".$comentario."</table>";
                                    echo "</td>";


                                    if($col%$numeroColumnasProducto==0){
                                        echo "</tr>";
                                    }
                                    $col++;
                                    //echo "<tr class=\"descripcion d".$e['id']."\" style=\"display: none\"><td colspan=\"2\" class=\"descripcion_producto\">".utf8_encode($e['texto'])."</td></tr>";
                                }
                            ?>
                            </table>
                        </div>
                    </div>
                </div>
                <div id="listaCambioMesa" style="background-color: #b67400; display: none">
                    <div align="center">
                    <table style="width: 95%; text-align: center" class="table table-condensed" id="cambioMesas">
                    </table>
                    </div>
                </div>
                <div id="centro" align="right">
                    <div align="center">
                    <table id="tabla_pedidos_x_mesa" border="0px" class="table">
                    </table>
                    </div>
                </div>
                <div id="comidaPendiente" style="display: none">
                </div>
                <div id="bebidaPendiente" style="display: none">
                </div>
            </div>
  	</div>
  	<script>
            ResumenMesas();
            $(".producto").hide();
            $(".f1").show();
            var int=self.setInterval("refresh()",3000);
            function refresh(){
                ComidasPendientes();
                BebidasPendientes();
            }
  	</script>
    </body>
</html>