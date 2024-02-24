import User from "../models/user.js";
let clients = [];

const userController = {
    addNickname: async (req, res) => {
        try {
            const { nickname } = req.body;
            console.log("Nuevo nickname recibido:", nickname); 
            const newUser = new User({ nickname });
            console.log("Nuevo usuario creado:", newUser); 
            const savedUser = await newUser.save();
            console.log("Nickname guardado exitosamente:", savedUser);

            clients.forEach(clientId => {
                req.app.get('io').to(clientId).emit('newNickname', nickname);
            });
            
            res.status(200).json(savedUser);
        } catch (error) {
            console.error("Error al guardar el nickname:", error);
            res.status(500).json({ message: "Error al guardar el nickname" });
        }
    },

    getNicknames: async (req, res) => {
        try {
            const users = await User.find({});
            res.status(200).json(users.map(user => user.nickname));
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los nicknames" });
        }
    },

};

export default userController;
