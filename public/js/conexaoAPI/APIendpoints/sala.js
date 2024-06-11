class SalaController{

    static async obterSalas(){
        return await axios.get('http://localhost:3000/sala');
    }

    static async obterSalaPorId(id){
        return await axios.get(`http://localhost:3000/sala/${id}`);
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

}
module.exports = SalaController;
