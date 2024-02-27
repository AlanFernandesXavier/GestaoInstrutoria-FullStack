const Instrutor = require("../models/Instrutor.js")
const Registro = require("../models/Registro.js")

const coordAreaController = {
    listarInstrutores: async (req, res) => {
        try {
            const instrutores = await Instrutor.findAll();
            res.json(instrutores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    listarRegistros: async (req, res) => {
        try {
            const registros = await Registro.findAll({ where: { FKinstrutor: req.params.matricula } });
            res.json(registros)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    validarRegistro: async (req, res) => {
        try {
            const registros = await Registro.update({
                status: "Validado"
            },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );
            res.json(registros)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    validarParcialmenteRegistro: async (req, res) => {
        try {
            const registros = await Registro.update({
                status: "Parcialmente validado",
                justificativa: req.body.justificativa,
                total: req.body.total
            },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );
            res.json(registros)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = coordAreaController;