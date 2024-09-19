import Sequelize from "sequelize";

const db = new Sequelize("mascotas", "mascotas", "mascotas2024",{
    dialect: "mysql",
    host: "localhost"
})

export {db}