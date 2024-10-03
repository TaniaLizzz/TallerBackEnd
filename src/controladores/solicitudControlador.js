import { solicitudes } from "../modelos/solicitudModelo.js";
import { usuarios } from "../modelos/usuarioModelo.js";
import { mascotas } from "../modelos/mascotaModelo.js";

// Listar todas las solicitudes
const listarSolicitudes = (req, res) => {
    solicitudes.findAll()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(500).json({ mensaje: "No se ha podido consultar las solicitudes: " + error });
        });
};

// Buscar solicitud por id
const buscarSolicitud = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ mensaje: "Se requiere el id para poder buscar el registro" });
    }

    solicitudes.findByPk(id)
        .then((result) => {
            if (!result) {
                return res.status(404).json({ mensaje: "Solicitud no encontrada" });
            }
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(500).json({ mensaje: "No se ha podido encontrar el registro: " + error });
        });
};

// Buscar solicitudes de un usuario
const buscarSolicitudUser = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ mensaje: "Se requiere el id para poder buscar el registro" });
    }

    solicitudes.findAll({ where: { adoptanteId: id } })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(500).json({ mensaje: "No se ha podido encontrar el registro: " + error });
        });
};

// Buscar solicitudes de una mascota
const buscarSolicitudMascota = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ mensaje: "Se requiere el id para poder buscar el registro" });
    }

    solicitudes.findAll({ where: { mascotaId: id } })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(500).json({ mensaje: "No se ha podido encontrar el registro: " + error });
        });
};

// Eliminar solicitud por id
const eliminarSolicitud = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ mensaje: "Se requiere el id para poder buscar el registro" });
    }

    solicitudes.destroy({ where: { id } })
        .then((result) => {
            if (result === 0) {
                return res.status(404).json({ mensaje: "Solicitud no encontrada" });
            }
            res.status(200).json({ mensaje: "Registro eliminado con éxito!" });
        })
        .catch((error) => {
            res.status(500).json({ mensaje: "No se ha podido remover el registro de la base de datos: " + error });
        });
};

// Crear solicitud
const crearSolicitud = async (req, res) => {
    const { mascotaId, adoptanteId, estado_adopcion } = req.body;

    if (!mascotaId || !adoptanteId || !estado_adopcion) {
        return res.status(400).json({ mensaje: "Los campos mascotaId, adoptanteId y estado_adopcion son requeridos" });
    }

    try {
        // Verificar que el adoptante exista
        const adoptante = await usuarios.findByPk(adoptanteId);
        if (!adoptante) {
            return res.status(404).json({ mensaje: "El adoptante no existe" });
        }

        // Verificar que la mascota exista
        const mascota = await mascotas.findByPk(mascotaId);
        if (!mascota) {
            return res.status(404).json({ mensaje: "La mascota no existe" });
        }

        const dataset = {
            mascotaId,
            adoptanteId,
            estado_adopcion,
            fechaCreacion: new Date(),
            fechaFin: estado_adopcion === 'Adoptado' ? new Date() : 'En proceso', // Manejo de fechaFin
        };

        await solicitudes.create(dataset);
        res.status(201).json({ mensaje: "Solicitud registrada con éxito!" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error, no se ha podido crear el registro en la base de datos: " + error });
    }
};

// Actualizar solicitud por id
const actualizarSolicitud = async (req, res) => {
    const id = parseInt(req.params.id);
    const { estado_adopcion, mascotaId, adoptanteId } = req.body; // Asegúrate de incluir todos los campos necesarios

    if (isNaN(id)) {
        return res.status(400).json({ tipo: 'error', mensaje: "El id no puede estar vacío" });
    }

    if (!estado_adopcion) {
        return res.status(400).json({ tipo: 'error', mensaje: "El campo estado es requerido" });
    }

    try {
        const solicitud = await solicitudes.findByPk(id);
        if (!solicitud) {
            return res.status(404).json({ tipo: 'error', mensaje: "Solicitud no encontrada" });
        }

        // Actualizar los campos de la solicitud
        solicitud.estado_adopcion = estado_adopcion;
        solicitud.mascotaId = mascotaId; // Actualiza la mascota si es necesario
        solicitud.adoptanteId = adoptanteId; // Actualiza el adoptante si es necesario

        // Actualizar fechaFin según el estado
        if (estado_adopcion === 'Adoptado') {
            solicitud.fechaFin = new Date(); // Fecha actual
        } else if (estado_adopcion === 'En proceso') {
            solicitud.fechaFin = "En proceso"; // Asignar "En proceso"
        }

        await solicitud.save();

        // Cambiar el estado de la mascota a 'Adoptado' si es necesario
        if (estado_adopcion === 'Adoptado') {
            await mascotas.update(
                { estado_adopcion: 'Adoptado' },
                { where: { id: solicitud.mascotaId } }
            );
        }

        res.status(200).json({ tipo: 'success', mensaje: "Solicitud actualizada exitosamente" });
    } catch (e) {
        res.status(500).json({ tipo: 'error', mensaje: "No se ha podido actualizar la solicitud: " + e });
    }
};


export {
    crearSolicitud,
    listarSolicitudes,
    buscarSolicitud,
    buscarSolicitudUser,
    buscarSolicitudMascota,
    eliminarSolicitud,
    actualizarSolicitud,
};
