let table = $('#table');
let tableS2 = $('#tableS2');

$(function cargarDatos() {
    let lista = document.getElementById("valorTabla").value;
    let listaS2 = document.getElementById("valorTablaS2").value;
    lista = JSON.parse(lista);
    listaS2 = JSON.parse(listaS2);
    table.bootstrapTable('load', lista);
    tableS2.bootstrapTable('load', listaS2);
});