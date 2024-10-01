import { mascotas } from "../modelos/mascotaModelo.js";
import { solicitudes } from "../modelos/solicitudModelo.js";

// Listar todas las mascotas
const listarMascotas = (req, res) => {
    mascotas.findAll()
        .then((r) => {
            res.status(200).json(r);
        })
        .catch((e) => {
            res.status(500).json({ tipo: 'error', mensaje: "No se ha podido encontrar ningún registro: " + e });
        });
};

// Buscar una mascota por id
const buscarMascota = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ tipo: 'error', mensaje: "El id no puede estar vacío" });
        return;
    }

    mascotas.findByPk(id)
        .then((r) => {
            if (!r) {
                return res.status(404).json({ tipo: 'error', mensaje: "Mascota no encontrada" });
            }
            res.status(200).json(r);
        })
        .catch((e) => {
            res.status(500).json({ tipo: 'error', mensaje: "No se ha podido encontrar el registro: " + e });
        });
};

// Crear una mascota en la tabla
const crearMascota = (req, res) => {
    const { nombre, especie, estado_adopcion, foto, descripcion, raza } = req.body;

    if (!nombre || !especie || !estado_adopcion) {
        res.status(400).json({ tipo: 'error', mensaje: "Los campos nombre, especie y estado son requeridos" });
        return;
    }

    // Validación de la ruta de la foto
    if (foto && !foto.startsWith('/img/')) {
        res.status(400).json({ tipo: 'error', mensaje: "La ruta de la foto debe comenzar con '/img/'" });
        return;
    }

    const dataset = {
        nombre,
        especie,
        raza,
        edad: req.body.edad,
        estado_adopcion,
        foto: foto || '/img/default.jpg', // Valor predeterminado si no hay foto
        descripcion,
    };

    mascotas.create(dataset)
        .then(() => {
            res.status(201).json({ tipo: 'success', mensaje: "Mascota registrada con éxito" });
        })
        .catch((e) => {
            res.status(500).json({ tipo: 'error', mensaje: "No se ha podido registrar la mascota: " + e });
        });
};

// Eliminar una mascota por id
const eliminarMascota = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ tipo: 'error', mensaje: "El id no puede estar vacío" });
        return;
    }

    try {
        // Eliminar las solicitudes asociadas
        await solicitudes.destroy({ where: { mascotaId: id } });

        // Luego eliminar la mascota
        const resultado = await mascotas.destroy({ where: { id } });

        if (resultado === 0) {
            return res.status(404).json({ tipo: 'error', mensaje: "Mascota no encontrada" });
        }

        res.status(200).json({ tipo: 'success', mensaje: "Mascota eliminada exitosamente" });
    } catch (e) {
        res.status(500).json({ tipo: 'error', mensaje: "No se ha podido eliminar el registro: " + e });
    }
};

// Actualizar una mascota por id
const actualizarMascota = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ tipo: 'error', mensaje: "El id no puede estar vacío" });
        return;
    }

    const updates = req.body;

    // Validación de la foto
    if (updates.foto && !updates.foto.startsWith('/img/')) {
        res.status(400).json({ tipo: 'error', mensaje: "La ruta de la foto debe comenzar con '/img/'" });
        return;
    }

    if (Object.keys(updates).length === 0) {
        res.status(400).json({ tipo: 'error', mensaje: "No se ha encontrado ningún dato para actualizar" });
        return;
    }

    mascotas.update(updates, { where: { id } })
        .then((r) => {
            if (r[0] === 0) {
                return res.status(404).json({ tipo: 'error', mensaje: "Mascota no encontrada" });
            }
            res.status(200).json({ tipo: 'success', mensaje: "Mascota actualizada exitosamente" });
        })
        .catch((e) => {
            res.status(500).json({ tipo: 'error', mensaje: "No se ha podido actualizar el registro: " + e });
        });
};

export { crearMascota, listarMascotas, buscarMascota, eliminarMascota, actualizarMascota };
