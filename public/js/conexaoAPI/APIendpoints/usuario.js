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
    
}
module.exports = UsuarioController;
