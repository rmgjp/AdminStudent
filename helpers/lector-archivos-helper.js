const fs = require('fs');
const path = require('path');
const tableToJSON = require('tabletojson').Tabletojson;

function obtenerListaAlumnos(file) {
    var txtFile = path.join(__dirname, '../public/doc/' + file);
    fs.readFile(txtFile, "utf-8", (err, data) => {
        if (err) {
            throw err;
            return;
        } else {
            var json = tableToJSON.convert(data,{onlyColumns:[1,2]});
            console.log(json);
            return json;
        }
    });
}

module.exports = {
    obtenerListaAlumnos
}