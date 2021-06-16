const fs = require('fs');
const path = require('path');
const tableToJSON = require('tabletojson').Tabletojson;

async function obtenerListaAlumnos(file) {
    var txtFile = path.join(__dirname, '../public/doc/' + file);
    await fs.readFile(txtFile, "utf-8", (err, data) => {
        if (err) {
            throw err;
            return;
        } else {
            var json = tableToJSON.convert(data,{onlyColumns:[1,2]});
            //console.log(json);
            return json;
        }
    });
}

async function obtenerDatosGrupo(file){
    var txtFile = path.join(__dirname, '../public/doc/' + file);
    await fs.readFile(txtFile, "utf-8", (err, data) => {
        if(err){
            throw err;
            return;
        }
        else{
            //Se busca el inicio el cierre de la etiqueta <PRE> para obtener los indices del contenido.
            var inicioPRE = data.indexOf('PRE')
            var finPRE = data.indexOf("/PRE");
            var contenidoPRE = data.substring(inicioPRE, finPRE);
            //Se busca el inicio y el final del contendio de MATERIA haciendo uso de una expresion regular
            var materiaIndex = data.search(/^(MATERIA)\s*:\s?(\w+)\s*((\w+)\s?(\w+)\s?)*/mg, data);
            var materiaLastIndex = data.search("MAESTRO", data)-1;
            //Se obtiene un subString con los indices encontrados
            var materiaContenido = data.substring(materiaIndex,materiaLastIndex).trim();
            //Se busca el inicio y el final del contendio de GRUPO haciendo uso de una expresion regular
            var grupoIndex = data.search(/\s+(GRUPO)\s*:\s?(\w+)/mg, data);
            var grupoLastIndex = data.search("EXTEN", data)-1;
            //Se obtiene un subString con los indices encontrados
            var grupoContenido = data.substring(grupoIndex, grupoLastIndex).trim();
            var grupo = grupoContenido.split(":");
            var materia = materiaContenido.split(":");

            var datos = {grupo: grupo[1].trim(), materia:materia[1].trim()}
            return datos;
        }
    });
}

module.exports = {
    obtenerListaAlumnos,
    obtenerDatosGrupo
}