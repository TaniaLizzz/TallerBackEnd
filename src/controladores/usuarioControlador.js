// Importar el modelo de usuarios
import { usuarios } from "../modelos/usuarioModelo.js";

// Listar todos los usuarios
const listarUsuarios = (req, res) => {
    usuarios.findAll()
        .then((r) => {
            res.status(200).json(r);
        })
        .catch((e) => {
            res.status(500).json({ tipo: 'error', mensaje: "No se ha podido encontrar ningún registro: " + e });
        });
};

// Buscar un usuario por id
const buscarUsuario = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ tipo: 'error', mensaje: "El id no puede estar vacío" });
        return;
    }

    usuarios.findByPk(id)
        .then((r) => {
            if (!r) {
                return res.status(404).json({ tipo: 'error', mensaje: "Usuario no encontrado" });
            }
            res.status(200).json(r);
        })
        .catch((e) => {
            res.status(500).json({ tipo: 'error', mensaje: "No se ha podido encontrar el registro: " + e });
        });
};

// Buscar un usuario por nombre
const buscarUsuarioNombre = (req, res) => {
    const { usuario } = req.params;

    if (!usuario) {
        res.status(400).json({ tipo: 'error', mensaje: "El nombre de usuario no puede estar vacío" });
        return;
    }

    usuarios.findOne({ where: { usuario } })
        .then((r) => {
            if (!r) {
                return res.status(404).json({ tipo: 'error', mensaje: "Usuario no encontrado" });
            }
            res.status(200).json(r);
        })
        .catch((e) => {
            res.status(500).json({ tipo: 'error', mensaje: "No se ha podido encontrar el registro: " + e });
        });
};

// Crear un usuario en la tabla
const crearUsuario = (req, res) => {
    const { nombres, usuario, password, rol } = req.body;

    if (!nombres || !usuario || !password || !rol) {
        res.status(400).json({ tipo: 'error', mensaje: "Los campos nombres, usuario, contraseña y rol son requeridos" });
        return;
    }

    const dataset = {
        nombres,
        edad: req.body.edad,
        usuario,
        password,
        foto: req.body.foto,
        rol,
        telefono: req.body.telefono,
    };

    usuarios.create(dataset)
        .then(() => {
            res.status(201).json({ tipo: 'success', mensaje: "Usuario registrado con éxito" });
        })
        .catch((e) => {
            res.status(500).json({ tipo: 'error', mensaje: "No se ha podido registrar el usuario: " + e });
        });
};

// Eliminar un usuario por id
const eliminarUsuario = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ tipo: 'error', mensaje: "El id no puede estar vacío" });
        return;
    }

    usuarios.destroy({ where: { id } })
        .then((r) => {
            if (r === 0) {
                return res.status(404).json({ tipo: 'error', mensaje: "Usuario no encontrado" });
            }
            res.status(200).json({ tipo: 'success', mensaje: "Usuario eliminado exitosamente" });
        })
        .catch((e) => {
            res.status(500).json({ tipo: 'error', mensaje: "No se ha podido eliminar el registro: " + e });
        });
};

// Actualizar un usuario por id
const actualizarUsuario = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ tipo: 'error', mensaje: "El id no puede estar vacío" });
        return;
    }

    const updates = req.body;
    if (Object.keys(updates).length === 0) {
        res.status(400).json({ tipo: 'error', mensaje: "No se ha encontrado ningún dato para actualizar" });
        return;
    }

    usuarios.update(updates, { where: { id } })
        .then((r) => {
            if (r[0] === 0) {
                return res.status(404).json({ tipo: 'error', mensaje: "Usuario no encontrado" });
            }
            res.status(200).json({ tipo: 'success', mensaje: "Usuario actualizado exitosamente" });
        })
        .catch((e) => {
            res.status(500).json({ tipo: 'error', mensaje: "No se ha podido actualizar el registro: " + e });
        });
};

export { crearUsuario, listarUsuarios, buscarUsuarioNombre, buscarUsuario, eliminarUsuario, actualizarUsuario };
