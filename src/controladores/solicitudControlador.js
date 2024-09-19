// Importamos el modelo de solicitudes
import { solicitudes } from "../modelos/solicitudModelo.js";
import { usuarios } from "../modelos/usuarioModelo.js"; // Asegúrate de que esta línea esté presente
import { mascotas } from "../modelos/mascotaModelo.js"; // También asegúrate de que esto esté presente

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

const crearSolicitud = async (req, res) => {
    const { mascotaId, adoptanteId, estado_adopcion, fechaFin } = req.body;

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
            fechaFin: fechaFin || null,
        };

        await solicitudes.create(dataset);
        res.status(201).json({ mensaje: "Solicitud registrada con éxito!" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error, no se ha podido crear el registro en la base de datos: " + error });
    }
};

// Actualizar solicitud por id
const actualizarSolicitud = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ mensaje: "Se requiere el id para poder buscar el registro" });
    }

    const updates = req.body;
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ mensaje: "No se ha detectado ningún campo para actualizar" });
    }

    solicitudes.update(updates, { where: { id } })
        .then((result) => {
            if (result[0] === 0) {
                return res.status(404).json({ mensaje: "Solicitud no encontrada" });
            }
            res.status(200).json({ mensaje: "Solicitud actualizada exitosamente" });
        })
        .catch((error) => {
            res.status(500).json({ mensaje: "No se pudo alterar el registro en la base de datos: " + error });
        });
};

export { listarSolicitudes, crearSolicitud, buscarSolicitudMascota, buscarSolicitudUser, buscarSolicitud, eliminarSolicitud, actualizarSolicitud };
