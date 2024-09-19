import { Sequelize } from "sequelize";
import { db } from "../database/conexion.js";

// Definición del objeto que comunicará con la tabla
const mascotas = db.define('mascotas', {
    // Definición de los atributos
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    especie: {
        type: Sequelize.STRING,
        allowNull: false
    },
    raza: {
        type: Sequelize.STRING,
        allowNull: true
    },
    edad: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    estado_adopcion: {
        type: Sequelize.ENUM('disponible', 'adoptado', 'en proceso'),
        allowNull: false
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

export { mascotas };
