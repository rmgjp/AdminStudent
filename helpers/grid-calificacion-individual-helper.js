var table = $('#table')
var tablaDatos;
var i = 0;


$(function cargarDatos(){
    var lista = document.getElementById("valorTabla").value;
    lista = JSON.parse(lista);

    if(lista){
        console.log("Lista encontrada.")
        var rows= [];
        for(let alumno= 0; alumno < lista.length; alumno++){
            rows.push(lista[alumno]);
        }
        table.bootstrapTable('load', rows);
        i = lista.length;
        tablaDatos = table.bootstrapTable('getData');
        document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    }
})


$('#table').on('editable-save.bs.table', function(e, field, row, oldValue, $el){
    tablaDatos = table.bootstrapTable('getData');
    document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    console.log(tablaDatos);
})
