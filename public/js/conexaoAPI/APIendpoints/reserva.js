const UsuarioController = require('./usuario');
const SalaController = require('./sala');

function ocultarDocumento(documento) {
    if (documento.length <= 5) return documento; 
    const inicio = documento.slice(0, 3);
    const fim = documento.slice(-2);
    const asteriscos = '*'.repeat(documento.length - 5);
    return inicio + asteriscos + fim;
}

class ReservaController{

    static async obterReservas(){
        try{
            return await axios.get(`http://localhost:3000/reserva`);
        }catch(error){
            console.error('Erro ao obter reservas', error);
        }
    }

    static async obterReservaPorId(id){
        try{
            return await axios.get(`http://localhost:3000/reserva/${id}`);
        }catch(error){
            console.error('Erro ao obter reserva por id', error);
        }
    }

    static async obterReservista(id){
        return await UsuarioController.obterUsuarioporId(id);
    }
    static async concluirReserva(id){
        try{
            await axios.put(`http://localhost:3000/reserva/${id}`, { statusReserva: 'Concluída', dataModificacaoStatus: new Date()});
        }catch(error){
            console.error('Erro ao concluir reserva', error);
        }
    }

    static async cancelarReserva(id){
        try{
            await axios.put(`http://localhost:3000/reserva/${id}`, { statusReserva: 'Cancelada', dataModificacaoStatus: new Date()});
        }catch(error){
            console.error('Erro ao cancelar reserva', error);
        }
    }

    static async listarReservas(){
        const tableBody = document.getElementById('reservas-lista');
        if(!tableBody) return;
        tableBody.innerHTML = '';

        try{
            const response = await ReservaController.obterReservas();
            const reservas = response.data;

            const reservistaPromises = reservas.map(reserva => ReservaController.obterReservista(reserva.idUsuario));
            const salaPromises = reservas.map(reserva => SalaController.obterSalaPorId(reserva.idSala));

            const [reservistasResponses, salasResponses] = await Promise.all([Promise.all(reservistaPromises), Promise.all(salaPromises)]);

            const reservistas = reservistasResponses.map(response => response.data);
            const salas = salasResponses.map(response => response.data);

            reservas.forEach((reserva, index) => {
                const reservista = reservistas[index];
                const sala = salas[index];

                const row = document.createElement('tr');

                const salaCell = document.createElement('td');
                salaCell.textContent = sala.nome;
                row.appendChild(salaCell);
                
                const nomeCell = document.createElement('td');
                nomeCell.textContent = reservista.nome;
                row.appendChild(nomeCell);

                const documentoCell = document.createElement('td');
                documentoCell.textContent = ocultarDocumento(reservista.identificador);
                row.appendChild(documentoCell);

                const entradaCell = document.createElement('td');
                const dataReservada = new Date(reserva.dataReservada).toISOString().split('T')[0];
                const [ano, mes, dia] = dataReservada.split('-');
                entradaCell.textContent = `${dia}/${mes}/${ano}`;
                entradaCell.textContent = reserva.horaInicio;
                row.appendChild(entradaCell);

                const saidaCell = document.createElement('td');
                const dataReservadaSaida = new Date(reserva.dataReservada).toISOString().split('T')[0];
                const [anoS, mesS, diaS] = dataReservadaSaida.split('-');
                saidaCell.textContent = `${diaS}/${mesS}/${anoS}`;
                saidaCell.textContent = reserva.horaFimReserva;
                row.appendChild(saidaCell);

                const acaoCell = document.createElement('td');
                const concluirButton = document.createElement('button');
                concluirButton.textContent = 'Concluir';
                concluirButton.addEventListener('click', () => ReservaController.concluirReserva(reserva.id));
                const cancelarButton = document.createElement('button');
                cancelarButton.textContent = 'Cancelar';
                cancelarButton.addEventListener('click', () => ReservaController.cancelarReserva(reserva.id));
                acaoCell.appendChild(concluirButton);
                acaoCell.appendChild(cancelarButton);
                row.appendChild(acaoCell);
            })
        }catch(error){
            console.error('Erro ao listar reservas', error);
        }
    }

    static async listarReservasHoje(){
        const tableBody = document.getElementById('reservas-hoje-lista');
        if(!tableBody) return;
        tableBody.innerHTML = '';

        try{
            const response = await ReservaController.obterReservas();
            let reservas = response.data;
    
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
    
            reservas = reservas.filter(reserva => {
                const reservaDate = new Date(reserva.dataReservada);
                reservaDate.setHours(0, 0, 0, 0);
                return reservaDate.getTime() === hoje.getTime();
            });
    
            const reservistaPromises = reservas.map(reserva => ReservaController.obterReservista(reserva.idUsuario));
            const salaPromises = reservas.map(reserva => SalaController.obterSalaPorId(reserva.idSala));
    
            const [reservistasResponses, salasResponses] = await Promise.all([Promise.all(reservistaPromises), Promise.all(salaPromises)]);
    
            const reservistas = reservistasResponses.map(response => response.data);
            const salas = salasResponses.map(response => response.data);
            reservas.forEach((reserva, index) => {
                const reservista = reservistas[index];
                const sala = salas[index];

                const row = document.createElement('tr');

                const salaCell = document.createElement('td');
                salaCell.textContent = sala.nome;
                row.appendChild(salaCell);
                
                const nomeCell = document.createElement('td');
                nomeCell.textContent = reservista.nome;
                row.appendChild(nomeCell);

                const documentoCell = document.createElement('td');
                documentoCell.textContent = ocultarDocumento(reservista.identificador);
                row.appendChild(documentoCell);

                const entradaCell = document.createElement('td');
                const dataReservada = new Date(reserva.dataReservada).toISOString().split('T')[0];
                const [ano, mes, dia] = dataReservada.split('-');
                entradaCell.textContent = `${dia}/${mes}/${ano}`;
                entradaCell.textContent = reserva.horaInicio;
                row.appendChild(entradaCell);

                const saidaCell = document.createElement('td');
                const dataReservadaSaida = new Date(reserva.dataReservada).toISOString().split('T')[0];
                const [anoS, mesS, diaS] = dataReservadaSaida.split('-');
                saidaCell.textContent = `${diaS}/${mesS}/${anoS}`;
                saidaCell.textContent = reserva.horaFimReserva;
                row.appendChild(saidaCell);

                const acaoCell = document.createElement('td');
                const concluirButton = document.createElement('button');
                concluirButton.textContent = 'Concluir';
                concluirButton.addEventListener('click', () => ReservaController.concluirReserva(reserva.id));
                const cancelarButton = document.createElement('button');
                cancelarButton.textContent = 'Cancelar';
                cancelarButton.addEventListener('click', () => ReservaController.cancelarReserva(reserva.id));
                acaoCell.appendChild(concluirButton);
                acaoCell.appendChild(cancelarButton);
                row.appendChild(acaoCell);
            })
        }catch(error){
            console.error('Erro ao listar reservas', error);
        }
    }
}
module.exports = { ReservaController, ocultarDocumento};