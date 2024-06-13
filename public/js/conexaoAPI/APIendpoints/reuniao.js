
class ReuniaoController{

    static async obterReunioes(){
        try{
            return await axios.get(`http://localhost:3000/reuniao`);
        }catch(error){
            console.error('Erro ao obter reuniões', error);
        }
    }

    static async contarParticipantesDaReserva(IdReserva){
        let contParticipantes = 0;
        try{
            const reunioes = await this.obterReunioes();
            reunioes.data.forEach(reuniao => {
                if(reuniao.reservaId === IdReserva){
                    contParticipantes++;
                }
            });
            return contParticipantes;
        } catch(error){
            console.error('Erro ao obter participantes da reserva', error);
        }
    }
}
module.exports = { ReuniaoController};