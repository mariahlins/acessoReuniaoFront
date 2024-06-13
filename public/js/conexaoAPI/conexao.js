import { fazerLogin as _fazerLogin } from './APIendpoints/recepcionista.js';
import { listarReservas as _listarReservas, listarReservasHoje as _listarReservasHoje } from './APIendpoints/reserva.js';
import { listarSalasDropdown as _listarSalasDropdown, mostrarSalasTerreo as _mostrarSalasTerreo, listarSalas as _listarSalas } from './APIendpoints/sala.js';
import { listarUsuarios as _listarUsuarios } from './APIendpoints/usuario.js';

class Controller{
    static async fazerLogin() { _fazerLogin(); }
    static async listarReservas() { _listarReservas(); }
    static async listarSalasDropdown() { _listarSalasDropdown(); }
    static async mostrarSalasTerreo() { _mostrarSalasTerreo(); }
    static async listarReservasHoje() { _listarReservasHoje(); }
    static async listarUsuarios() { _listarUsuarios(); }
    static async listarSalas() { _listarSalas(); }
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