import express from "express";
import cors from "cors";
import { db } from "./database/conexion.js";
import { mascostasRouter } from "./rutas/mascotasRouter.js";
import { solicitudesRouter } from "./rutas/solicitudesRouter.js";
import { usuariosRouter } from "./rutas/usuariosRouter.js";

// Crear la instancia de express
const app = express();

// Middleware para procesar datos JSON y formularios en el cuerpo de las solicitudes
app.use('/img', express.static('src/img'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Habilitar CORS

// Definir la constante que contendrá el puerto por el cual correrá el servidor
const PORT = 4000;

// Conectar a la base de datos
db.authenticate()
  .then(() => {
    console.log("La base de datos ha sido cargada con éxito");
  })
  .catch((e) => {
    console.error("Error al cargar la base de datos: ", e);
  });

// Definir las rutas
app.get("/", (req, res) => {
  res.send("Bienvenido a Rincon Peludo");
});

// Definir la ruta para "Acerca de Nosotros"
app.get("/api/about", (req, res) => {
  const aboutInfo = {
    title: 'Acerca de Nosotros',
    content: 'En Rincón Peludo, creemos en el amor y cuidado de las mascotas. Nuestro objetivo es encontrar un hogar adecuado para cada animalito y promover la adopción responsable.'
  };
  res.json(aboutInfo);
});

// Definir las rutas para mascotas y solicitudes
app.use('/mascotas', mascostasRouter);
app.use('/solicitudes', solicitudesRouter);
app.use('/usuarios', usuariosRouter);

// Sincronizar la base de datos y levantar el servidor
db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor inicializado en el puerto: ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("No se pudo sincronizar con la base de datos: ", e);
  });
