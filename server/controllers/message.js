import Message from "../models/message.js";

const controller = {
    save: async (req, res) => {
        try {
            const params = req.body;
            const message = new Message({
                message: params.message,
                from: params.from
            });
            
            const messageStored = await message.save();
            if (!messageStored) {
                return res.status(404).send({
                    status: "error",
                    message: "Mensaje no guardado"
                });
            }

            return res.status(200).send({
                status: "success",
                messageStored
            });
        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Error al guardar el mensaje"
            });
        }
    },

    getMessages: async (req, res) => {
        try {
            const messages = await Message.find({}).sort("-_id");
            if (!messages || messages.length === 0) {
                return res.status(404).send({
                    status: "error",
                    message: "No se encontraron mensajes"
                });
            }

            return res.status(200).send({
                status: "Éxito",
                messages
            });
        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Error al obtener los mensajes"
            });
        }
    }
};

export default controller;