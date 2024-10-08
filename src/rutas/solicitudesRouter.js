import express from "express";
import { listarSolicitudes, crearSolicitud, buscarSolicitud, eliminarSolicitud, actualizarSolicitud, buscarSolicitudUser, buscarSolicitudMascota } from "../controladores/solicitudControlador.js";

// Crear la instancia de tipo router
const solicitudesRouter = express.Router();

// Rutas
// Tipo GET
solicitudesRouter.get('/', (req, res) => {
    listarSolicitudes(req, res);
});

solicitudesRouter.get('/buscar/:id', (req, res) => {
    buscarSolicitud(req, res);
});

solicitudesRouter.get('/buscar/mascota/:id', (req, res) => {
    buscarSolicitudMascota(req, res);
});

solicitudesRouter.get('/buscar/usuario/:id', (req, res) => {
    buscarSolicitudUser(req, res);
});

// Tipo POST
solicitudesRouter.post('/crear', (req, res) => {
    crearSolicitud(req, res);
});

// Tipo DELETE
solicitudesRouter.delete('/eliminar/:id', (req, res) => {
    eliminarSolicitud(req, res);
});

// Tipo PUT
solicitudesRouter.put('/actualizar/:id', (req, res) => {
    actualizarSolicitud(req, res);
});

export { solicitudesRouter };
