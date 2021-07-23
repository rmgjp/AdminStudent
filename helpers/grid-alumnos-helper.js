var table = $('#table')
var tablaDatos;

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
        console.log(tablaDatos);
        document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    }
})

table.on('editable-save.bs.table', function(e, field, row, oldValue, $el){
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    console.log(tablaDatos);
})


$('#add').on('click', function () {
    if(document.getElementById("ClaveBox").value && document.getElementById('NombreBox').value){

        table.bootstrapTable('insertRow',{
            index: i,
            row:{
                clave:  document.getElementById("ClaveBox").value,
                nombre: document.getElementById('NombreBox').value,
            }
        });
        document.getElementById("ClaveBox").value = "";
        document.getElementById("NombreBox").value = "";
        tablaDatos = table.bootstrapTable('getData');
        document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
        i = i + 1
        console.log(tablaDatos);
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
    i = i - 1
})
