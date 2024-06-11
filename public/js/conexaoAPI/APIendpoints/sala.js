class SalaController{

    static async obterSalas(){
        return await axios.get(`http://localhost:3000/sala`);
    }

    static async obterSalaPorId(id){
        return await axios.get(`http://localhost:3000/sala/${id}`);
    }

    static async deletarSala(id){
        try{
            return axios.delete(`http://localhost:3000/sala/${id}`);
        }catch(error){
            console.error('Erro ao deletar sala', error);
        }
    }


    static async listarSalasDropdown(){
        try{
            const response = await this.obterSalas();
            const salas = response.data;
            const dropdown = document.getElementById('sala');
            if(!dropdown) return;
            dropdown.innerHTML = '';
            salas.forEach(sala => {
                const option = document.createElement('option');
                option.value = sala.id;
                option.textContent = `${sala.nome}`
                dropdown.appendChild(option);
            });
        }catch(error){
            console.error('Erro ao listar todas as salas', error);
        }
    }

    static async mostrarSalasTerreo(){
        const salasTerreoContainer = document.getElementById('salas-terreo');
        if(!salasTerreoContainer) return;
        salasTerreoContainer.innerHTML = '';
        try{
            const response = await this.obterSalas();
            const salas = response.data;
            const salasTerreo = salas.filter(sala => Number(sala.andar) == 0);
            salasTerreo.forEach(sala => {
                //aqui vai como vao ser mostradas as salas no front
            });
        }catch(error){
            console.error('Erro ao listar salas do térreo', error);
        }
    }

    static async listarSalas(){
        const tableBody = document.getElementById('salas-lista');
        if(!tableBody) return;
        tableBody.innerHTML = '';

        try{
            const response = await this.obterSalas();
            const salasData = response.data;

            const salaPromises = salasData.map(sala => this.obterSalaPorId(sala.id));
            const [salasResponses] = await Promise.all([Promise.all(salaPromises)]);
            const salas = salasResponses.map(response => response.data);

            salas.forEach((sala, index) => {
                const sala = salas[index];

                const row = document.createElement('tr');

                const nomeCell = document.createElement('td');
                nomeCell.textContent = sala.nome;
                row.appendChild(nomeCell);

                const andarCell = document.createElement('td');
                andarCell.textContent = sala.andar;
                row.appendChild(andarCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = sala.status;
                row.appendChild(statusCell);

                const capacidadeCell = document.createElement('td');
                capacidadeCell.textContent = sala.capacidade;
                row.appendChild(capacidadeCell);

                const acaoCell = document.createElement('td');
                const excluirButton = document.createElement('button');
                excluirButton.textContent = 'Excluir';
                excluirButton.addEventListener('click', async () => this.deletarSala(sala.id));
                acaoCell.appendChild(excluirButton);
                row.appendChild(acaoCell); 
            })
        }catch(errror){
            console.error('Erro ao listar salas', error);
        }
    }

}
module.exports = SalaController;
