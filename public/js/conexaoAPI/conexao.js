const RecepcionistaController = require('./APIendpoints/recepcionista.js');
const ReservaController = require('./APIendpoints/reserva.js');
const SalaController = require('./APIendpoints/sala.js');
const UsuarioController = require('./APIendpoints/usuario.js');

class Controller{
    static async fazerLogin() { RecepcionistaController.fazerLogin(); }
    static async listarReservas() { ReservaController.listarReservas(); }
    static async listarSalasDropdown() { SalaController.listarSalasDropdown(); }
    static async mostrarSalasTerreo() { SalaController.mostrarSalasTerreo(); }
    static async listarReservasHoje() { ReservaController.listarReservasHoje(); }
    static async listarUsuarios() { UsuarioController.listarUsuarios(); }
    static async listarSalas() { SalaController.listarSalas(); }
}

document.addEventListener('DOMContentLoaded', () => {
    Controller.fazerLogin();
    Controller.listarReservas();
    Controller.listarSalasDropdown();
    Controller.mostrarSalasTerreo();
    Controller.listarReservasHoje();
    Controller.listarUsuarios();
    Controller.listarSalas();
});