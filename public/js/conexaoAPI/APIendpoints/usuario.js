const { ocultarDocumento } = require('./helpers/functions.js');

class UsuarioController{

    static async obterUsuarios(){
        try{
            return await axios.get(`http://localhost:3000/usuario`);
        }catch(error){
            console.error('Erro ao obter usuários', error);
        }
    }

    static async obterUsuarioporId(id){
        try{
            return await axios.get(`http://localhost:3000/usuario/${id}`);
        }catch(error){
            console.error('Erro ao obter usuário por id', error);
        }
    }

    static deletarUsuario(id){
        try{
            return axios.delete(`http://localhost:3000/usuario/${id}`);
        }catch(error){
            console.error('Erro ao deletar usuário', error);
        }
    } 

    static async listarUsuarios(){
        const tableBody = document.getElementById('usuarios-lista');
        if(!tableBody) return;
        tableBody.innerHTML = '';

        try{
            const response = await this.obterUsuarios();
            const user = response.data;

            const userPromises = user.map(user => UsuarioController.obterUsuarioporId(user.idUsuario));
            const [userResponses] = await Promise.all([Promise.all(userPromises)]);
            const users = userResponses.map(response => response.data);

            users.forEach((user, index) => {
                const user = users[index];

                const row = document.createElement('tr');

                const nomeCell = document.createElement('td');
                nomeCell.textContent = user.nome;
                row.appendChild(nomeCell);

                const cpfCell = document.createElement('td');
                cpfCell.textContent = ocultarDocumento(user.cpf);
                row.appendChild(cpfCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = user.status;
                row.appendChild(statusCell);

                const acaoCell = document.createElement('td');
                const excluirButton = document.createElement('button');
                excluirButton.textContent = 'Excluir';
                excluirButton.addEventListener('click', async () => UsuarioController.deletarUsuario(user.idUsuario));
                acaoCell.appendChild(excluirButton);
                row.appendChild(acaoCell);
            })

        }catch(error){
            console.error('Erro ao listar usuários', error);
        }
    }
 
}
module.exports = UsuarioController;
