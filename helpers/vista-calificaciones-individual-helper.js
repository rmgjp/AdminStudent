var table = $('#table');
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
        console.log(tablaDatos);
        document.getElementById("valorTabla").value = JSON.stringify(tablaDatos);
    }
})
