var table = $('#table')
var tablaDatos;
var idEliminar = [];

$(function cargarDatos(){
    var lista = document.getElementById("valorTabla").value;
    lista = JSON.parse(lista);




    if(lista){
        console.log("Lista encontrada.")
        table.bootstrapTable('load', lista);
        tablaDatos = table.bootstrapTable('getData');
        document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    }
})

table.on('editable-save.bs.table', function(e, field, row, oldValue, $el){
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
})


$('#add').on('click', function () {
    tablaDatos = table.bootstrapTable('getData');
    if(document.getElementById("ClaveBox").value && document.getElementById('NombreBox').value){
        let existente = false;
        for(dato in tablaDatos){
            if(tablaDatos[dato].clave === document.getElementById("ClaveBox").value.toUpperCase() ||
                tablaDatos[dato].nombre === document.getElementById("NombreBox").value.toUpperCase()){
                existente = true;
            }
        }
       if(!existente){
           table.bootstrapTable('append',{
                   clave:  document.getElementById("ClaveBox").value.toUpperCase(),
                   nombre: document.getElementById('NombreBox').value.toUpperCase(),

           });
           tablaDatos = table.bootstrapTable('getData');
           document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
       }
        document.getElementById("ClaveBox").value = "";
        document.getElementById("NombreBox").value = "";
    }
})

$('#remove').on('click', function () {

    var claves = $.map(table.bootstrapTable('getSelections'), function (row){
        return row.clave
    });
    var ids = $.map(table.bootstrapTable('getSelections'), function (row){
        return row.id
    });

    idEliminar = idEliminar.concat(ids)
    console.log("ids por eliminar: ")
    console.log(idEliminar);
    table.bootstrapTable('remove',{
        field: 'clave',
        values: claves
    })
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    document.getElementById("idAlumnosEliminados").value = JSON.stringify(idEliminar);
})
