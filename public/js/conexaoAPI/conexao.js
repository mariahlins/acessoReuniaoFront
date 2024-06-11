const RecepcionistaController = require('./APIendpoints/recepcionista.js');
const ReservaController = require('./APIendpoints/reserva.js');
const SalaController = require('./APIendpoints/sala.js');

class Controller{

    static async fazerLogin(){
        RecepcionistaController.fazerLogin();
    }
    
    static async listarReservas(){
        ReservaController.listarReservas();
    }

    static async listarSalasDropdown(){
        SalaController.listarSalasDropdown();
    }

    static async mostrarSalasTerreo(){
        SalaController.mostrarSalasTerreo();
    }


}
document.addEventListener('DOMContentLoaded', () => {
    Controller.fazerLogin();
    Controller.listarReservas();
    Controller.listarSalasDropdown();
    Controller.mostrarSalasTerreo();
});