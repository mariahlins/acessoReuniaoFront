const moment = require('moment');

function ocultarDocumento(documento) {
    const inicio = documento.slice(0, 3);
    const fim = documento.slice(-2);
    const asteriscos = '*'.repeat(documento.length - 5);
    return inicio + asteriscos + fim;
}

function formatarData(data){
    return moment(data).tz('America/Sao_Paulo').format('DD/MM/YYYY');
}

module.exports = { ocultarDocumento, formatarData }