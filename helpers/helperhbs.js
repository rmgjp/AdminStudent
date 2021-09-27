/**
 * Helper para Handlebars, expande las posibilidades de comparación,
 * permite a Handlebars comparar las variables de los datos.
 */

module.exports = {
    ifeq: function(a, b, options){
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    iflogico: function (v1,operator,v2,options){
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    },
    bar: function(){
        return "BAR!";
    },
    select: function (selected, options){
        return options.fn(this).replace(
            new RegExp(' value=\"' + selected + '\"'),
            '$& selected="selected"');
    },
    inc: function (value, options){
        return parseInt(value)+1;
    }
}