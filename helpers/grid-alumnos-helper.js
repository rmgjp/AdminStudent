var table = $('#table')
var tablaDatos;
var i = 0;

$(function cargarDatos(){
    var lista = document.getElementById("valorTabla").value;
    lista = JSON.parse(lista);

    if(lista){
        console.log("Lista encontrada.")
        var rows= [];
        for(let dato = 0; dato < lista.length; dato++){
            rows.push(lista[dato]);
        }
        table.bootstrapTable('load', rows);
        i = lista.length;
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
            table.bootstrapTable('insertRow',{
                index: i,
                row:{
                    clave:  document.getElementById("ClaveBox").value.toUpperCase(),
                    nombre: document.getElementById('NombreBox').value.toUpperCase(),
                }
            });
            tablaDatos = table.bootstrapTable('getData');
            document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
            i = i + 1;
        }
        document.getElementById("ClaveBox").value = "";
        document.getElementById("NombreBox").value = "";
    }
})

$('#remove').on('click', function () {
    var claves = $.map(table.bootstrapTable('getSelections'), function (row){
        return row.clave
    })
    table.bootstrapTable('remove',{
        field: 'clave',
        values: claves
    })
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    i = i - 1;
})
