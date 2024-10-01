import { Sequelize } from "sequelize";
import { db } from "../database/conexion.js";
import { mascotas } from "./mascotaModelo.js";
import { usuarios } from "./usuarioModelo.js";

// Definición del objeto que comunicará con la tabla
const solicitudes = db.define('solicitudes', {
    // Definición de los atributos
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    mascotaId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    adoptanteId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    estado_adopcion: {
        type: Sequelize.ENUM('Disponible', 'Adoptado', 'En proceso'),
        allowNull: false
    },
    fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    fechaFin: {
        type: Sequelize.DATE,
        allowNull: true
    }
});

// Definir la relación de solicitud con mascota
solicitudes.belongsTo(mascotas, { foreignKey: 'mascotaId' });
// La relación con usuario
solicitudes.belongsTo(usuarios, { foreignKey: 'adoptanteId' });

export { solicitudes };
