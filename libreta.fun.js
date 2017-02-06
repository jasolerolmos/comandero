function ListarComandaMesa(mesa){
	$.ajax({
		statusCode: {
		    404: function() {
		      alert('Libreria no encontrada');
		    }
		  },
		url: 'inc/libreta.api.php',
		type: "POST",
		data: "accion=listar&mesa="+mesa,
		beforeSend: function(){
			$("#tabla_pedidos_x_mesa").html("Cargando datos.....");
		},
		success: function(datos){
			$("#tabla_pedidos_x_mesa").html(datos);
			$("#centro").show();
			DineroMesa(mesa);
		}
	});
}
function ListarPorSeparado(mesa){
	$.ajax({
		statusCode: {
		    404: function() {
		      alert('Libreria no encontrada');
		    }
		  },
		url: 'inc/libreta.api.php',
		type: "POST",
		data: "accion=separado&mesa="+mesa,
		beforeSend: function(){
			$("#tabla_pedidos_x_mesa").html("Cargando datos.....");
		},
		success: function(datos){
			$("#tabla_pedidos_x_mesa").html(datos);
			$("#centro").show();
			DineroMesa(mesa);
		}
	});
}
function agruparPago(){
	var ids = "";
	$('#tabla_pedidos_x_mesa tr').each(function (index){
		var p = $(this).attr("prod")
		if(p>0 && $('#select_'+p).html()>0){
			ids = ids+"&p"+p+"="+$('#select_'+p).html();
		}
	});
	$.ajax({
            statusCode: {
                404: function() {
                    alert('Libreria no encontrada');
                }
            },
            url: 'inc/libreta.api.php',
            type: "POST",
            data: "accion=creargrupo"+ids,
            beforeSend: function(){

            },
            success: function(datos){
                    alert(datos);
            }
	});
}
function ConfirmarPedido(id){
    $.ajax({
        statusCode: {
            404: function() {
                alert('Libreria no encontrada');
            }
        },
        url: 'inc/libreta.api.php',
        type: "POST",
        data: "accion=confirmarpedido&lugar="+id,
        beforeSend: function(){

        },
        success: function(datos){
            ListarComandaMesa(id);
        }
    });
}
function PasarSeparado(id){
	$('#linea_'+id).css("background-color","red")
	var cantidad = $('#cantidad_'+id).html()*1
	if(cantidad>0){
		cantidad = cantidad-1;
		$('#cantidad_'+id).html(cantidad)
		
		cantidad = $('#select_'+id).html()*1
		cantidad = cantidad+1;
		$('#select_'+id).html(cantidad)
	}
	$('#linea_'+id).css("background-color","#abbdd1")
}
function QuitarSeparado(id){
	$('#linea_'+id).css("background-color","red")
	var cantidad = $('#select_'+id).html()*1
	if(cantidad>0){
		cantidad = cantidad-1;
		$('#select_'+id).html(cantidad)
		
		cantidad = $('#cantidad_'+id).html()*1
		cantidad = cantidad+1;
		$('#cantidad_'+id).html(cantidad)
	}
	$('#linea_'+id).css("background-color","#abbdd1")
}
function DineroMesa(mesa){	
	$.ajax({
		statusCode: {
		    404: function() {
		      alert('Libreria no encontrada');
		    }
		  },
		url: 'inc/libreta.api.php',
		type: "POST",
		data: "accion=dinero&mesa="+mesa,
		beforeSend: function(){
		},
		success: function(datos){
			$("#mesa_importe").html(datos);
		}
	});
}
function Pedir(mesa,objeto){
	if($('#mesa_nombre').html()!="00"){
		$(".p"+objeto).css("background-color","#6d78ec");
		$("#u"+objeto).html(($("#u"+objeto).html()*1)+1);
		$("#p"+objeto).css("background-color","#a2a4a5");
		$.ajax({
			statusCode: {
			    404: function() {
			      alert('Libreria no encontrada');
			    }
			  },
			url: 'inc/libreta.api.php',
			type: "POST",
			data: "accion=pedir&mesa="+mesa+"&objeto="+objeto,
			beforeSend: function(){
			},
			success: function(datos){
				$("#u"+objeto).html(($("#u"+objeto).html()*1)-1);
				ListarComandaMesa(mesa);
				$("#p"+objeto).css("background-color","#6da8ec");
			}
		});	
	}
}
function AbrirMesa(mesa){
    $("#tabla_pedidos_x_mesa").show();
    $.ajax({
        statusCode: {
            404: function() {
              alert('Libreria no encontrada');
            }
          },
        url: 'inc/libreta.api.php',
        type: "POST",
        data: "accion=estadomesa&mesa="+mesa,
        beforeSend: function(){
            $("#comidaPendiente").hide();
            $("#bebidaPendiente").hide();
        },
        success: function(datos){
            if(datos>0){
                ListarComandaMesa(mesa);
            }
            else{
                if(confirm("Mesa sin abrir. Abrirla?")){
                    CrearHoja(mesa)
                    ListaVacia(mesa);
                    ResumenMesas();
                }
                else{
                        $('#mesa_nombre').html("00");
                    }
            }
        }
    });
}
function MesaNula(){
	ListaVacia();
	$("#tabla_pedidos_x_mesa").toggle();
	$('#lista_mesas').toggle();
	ResumenMesas();
	$('#mesa_nombre').html("00");
	$('#mesa_importe').html("B: 0 € C: 0 € <br/> Total: 0 €")
	$('#productos').show();
}
function CerrarMesa(mesa){
	$.ajax({
            statusCode: {
                404: function() {
                    alert('Libreria no encontrada');
                }
              },
            url: 'inc/libreta.api.php',
            type: "POST",
            data: "accion=cerrar&mesa="+mesa,
            beforeSend: function(){
            },
            success: function(datos){
                if(datos==0){
                    MesaNula();
                    $('#productos').hide();
                    alert("Mesa cobrada y cerrada");
                }
                else{
                        alert("No se puede cerrar la mesa correctamente.\n"+datos+"\n")
                    }
            }
	});
}
function CrearHoja(mesa){
	$.ajax({
		statusCode: {
		    404: function() {
		      alert('Libreria no encontrada');
		    }
		  },
		url: 'inc/libreta.api.php',
		type: "POST",
		data: "accion=abrir&mesa="+mesa,
		beforeSend: function(){
		},
		success: function(datos){
		}
	});
}
function ListaVacia(mesa){
	$.ajax({
		statusCode: {
		    404: function() {
		      alert('Libreria no encontrada');
		    }
		  },
		url: 'inc/libreta.api.php',
		type: "POST",
		data: "accion=listavacia&mesa="+mesa,
		beforeSend: function(){
		},
		success: function(datos){
			$("#tabla_pedidos_x_mesa").html(datos);
		}
	});
}
function ResumenMesas(){
	$.ajax({
		statusCode: {
		    404: function() {
		      alert('Libreria no encontrada');
		    }
		  },
		url: 'inc/libreta.api.php',
		type: "POST",
		data: "accion=resumenmesas",
		beforeSend: function(){
		},
		success: function(datos){
			$("#mesas").html(datos);
		}
	});
}
function MesasDisponibles(mesa){
	$.ajax({
		statusCode: {
		    404: function() {
		      alert('Libreria no encontrada');
		    }
		  },
		url: 'inc/libreta.api.php',
		type: "POST",
		data: "accion=mesasdisponibles&mesa="+mesa,
		beforeSend: function(){
		},
		success: function(datos){
                    $("#listaCambioMesa").show();
                    $("#cambioMesas").html(datos);
		}
	});
}
function CambiarMesa(mesa,nueva){
	$.ajax({
		statusCode: {
		    404: function() {
		      alert('Libreria no encontrada');
		    }
		  },
		url: 'inc/libreta.api.php',
		type: "POST",
		data: "accion=cambiarmesa&nueva="+nueva+"&mesa="+mesa,
		beforeSend: function(){
		},
		success: function(datos){
                    $('#mesa_nombre').html(nueva)
                    ListarComandaMesa(nueva);
		}
	});
}
function Servido(objeto,estado,despues){
    $.ajax({
        statusCode: {
            404: function() {
                alert('Libreria no encontrada');
            }
        },
        url: 'inc/libreta.api.php',
        type: "POST",
        data: "accion=servido&id="+objeto+"&e="+estado,
        beforeSend: function(){
        },
        success: function(datos){
            if(despues==1){
                $("#comidaPendiente").hide();
                verPendientes(despues);
            }
            else{
                $("#bebidaPendiente").hide();
                verPendientes(despues);
            }
        }
    });
}
function verPendientes(tipo){
    if(tipo==1){
        if($('#comidaPendiente').css('display')=='none'){
            $.ajax({
                statusCode: {
                    404: function() {
                      alert('Libreria no encontrada');
                    }
                  },
                url: 'inc/libreta.api.php',
                type: "POST",
                data: "accion=entregasPendientes&tipo="+tipo,
                beforeSend: function(){
                },
                success: function(datos){
                    if(tipo==1){
                        $("#comidaPendiente").html(datos);
                    }
                    else{
                        $("#bebidaPendiente").html(datos);
                    }
                    $("#bebidaPendiente").hide();
                    $("#comidaPendiente").toggle();
                }
            });
            $('#centro').hide();
            $('#productos').hide();
        }
	else{
            $('#comidaPendiente').toggle()
            $('#centro').toggle();
            if($('#productos').css('display')=='block')
                    $('#productos').hide();
	}
    }
    if(tipo==2){
        if($('#bebidaPendiente').css('display')=='none'){
            $.ajax({
                statusCode: {
                    404: function() {
                      alert('Libreria no encontrada');
                    }
                  },
                url: 'inc/libreta.api.php',
                type: "POST",
                data: "accion=entregasPendientes&tipo="+tipo,
                beforeSend: function(){
                },
                success: function(datos){
                    if(tipo==1){
                        $("#comidaPendiente").html(datos);
                    }
                    else{
                        $("#bebidaPendiente").html(datos);
                    }
                    $("#comidaPendiente").hide();
                    $("#bebidaPendiente").toggle();
                }
            });
            $('#centro').hide();
            $('#productos').hide();
        }
	else{
            $('#bebidaPendiente').toggle()
            $('#centro').toggle();
            if($('#productos').css('display')=='block')
                    $('#productos').hide();
	}
    }
}
function ComidasPendientes(){
    $.ajax({
        statusCode: {
            404: function() {
              alert('Libreria no encontrada');
            }
          },
        url: 'inc/libreta.api.php',
        type: "POST",
        data: "accion=faltanservir&tipo=1",
        beforeSend: function(){
        },
        success: function(datos){
                    $("#comidasalir").html(datos);
            }
    });
}
function BebidasPendientes(){
    $.ajax({
        statusCode: {
            404: function() {
              alert('Libreria no encontrada');
            }
          },
        url: 'inc/libreta.api.php',
        type: "POST",
        data: "accion=faltanservir&tipo=2",
        beforeSend: function(){
        },
        success: function(datos){
                $("#bebidasalir").html(datos);
            }
    });
}
function BorrarPedido(obj){
	$.ajax({
		statusCode: {
		    404: function() {
		      alert('Libreria no encontrada');
		    }
		  },
		url: 'inc/libreta.api.php',
		type: "POST",
		data: "accion=borrarpedido&obj="+obj,
		beforeSend: function(){
		},
		success: function(datos){
			ListarComandaMesa($('#mesa_nombre').html());
		}
	});
}
function SumarPedido(obj){
	$.ajax({
		statusCode: {
		    404: function() {
		      alert('Libreria no encontrada');
		    }
		  },
		url: 'inc/libreta.api.php',
		type: "POST",
		data: "accion=sumarpedido&obj="+obj,
		beforeSend: function(){
		},
		success: function(datos){
                    ListarComandaMesa($('#mesa_nombre').html());
		}
	});
}
