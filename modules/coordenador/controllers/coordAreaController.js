const Usuario = require("../../usuario/model/Usuario.js");
const Instrutor = require("../../instrutor/models/Instrutor.js");
const Registro = require("../../administrador/models/Registro.js");
const Servico = require("../../administrador/models/Servico.js");
const sequelize = require('../../../config/connection.js');
const { Op } = require('sequelize');

class RegistroServico {
    static async listarInstrutoresPorArea(area) {
        // dá pra tentar buscar á area pelo registro do coordenador (ele possui o campo de área)
        return await Instrutor.findAll({ where: { area } });
    }
     
    static async buscarNomeInstrutor(matriculaInstrutor){
        const instrutor = await Usuario.findOne({
            attributes: ['nome'],
            where: {
                matricula: matriculaInstrutor,
                tipoUsuario: 'instrutor'
            }
        });
        return instrutor.nome;
    }

    static async listarRegistrosEmAnalisePorInstrutor(matricula) {
        return await Registro.findAll({
        attributes: ['id','titulo', 'dataServico', 'horaInicio', 'horaFinal', 'total'],
            include: [{
                model: Servico,
                attributes: ['id','nome'],
                where: { id: sequelize.col('Registro.FKservico') }
            }
        ],
        where: { FKinstrutor: matricula, status: "Em Análise" } });
    }

    static async isRegistroEmAnalisePorId(id) {
        const registro = await Registro.findOne({ where: { id } });
        return registro && registro.status === 'Em Análise';
    }

    static async isRegistroEmAnalisePorInstrutor(matricula) {
        const registros = await Registro.findAll({ where: { FKinstrutor: matricula } });
        return registros.some(registro => registro.status === 'Em Análise');
    }

    static async atualizarRegistro(id, dados) {
        return await Registro.update(dados, { where: { id } });
    }

    static async obterTotalRegistroPorId(id) {
        const registro = await Registro.findOne({
            attributes: ['total'],
            where: { id } });

        return registro ? registro.total : null;
    }

    static async cadastrarRegistro(novoRegistro) {
        return await Registro.create(novoRegistro);
    }

    static async calcularHoras(idRegistro) {
        const registro = await Registro.findOne({ where: { id: idRegistro } });
        if (!registro) return;

        const instrutor = await Instrutor.findOne({ where: { matricula: registro.FKinstrutor } });
        if (!instrutor) return;

        const horasAtualizadas = RegistroServico.somarHoras(registro.total, instrutor.horasTrabalhadas);

        await Instrutor.update({ horasTrabalhadas: horasAtualizadas }, { where: { matricula: instrutor.matricula } });
    }

    static somarHoras(horasTrab, horasRegis) {
        const [trabHoras, trabMinutos] = horasTrab.split(':').map(Number);
        const [regisHoras, regisMinutos] = horasRegis.split(':').map(Number);

        let somaHoras = trabHoras + regisHoras;
        let somaMinutos = trabMinutos + regisMinutos;

        if (somaMinutos >= 60) {
            somaHoras += Math.floor(somaMinutos / 60);
            somaMinutos %= 60;
        }

        return `${somaHoras.toString().padStart(2, '0')}:${somaMinutos.toString().padStart(2, '0')}`;
    }

    static validarDescricao(desc) {
        const regex = /^(?!.*\b\d{4,}\b)(?!.*\b[A-Za-z]{20,}\b)[a-zA-Z0-9\s.,À-ÖØ-öø-ÿ\-!?\']+(?: [a-zA-Z0-9\s.,À-ÖØ-öø-ÿ\-!?\']+)*$/;
        return (regex.test(desc) && desc.length > 15);
    }

    static conferirDataValida(data) {
        const hoje = new Date();
        const dataServico = new Date(data);
        return dataServico <= hoje;
    }

    static calcularDiferencaHoras(horaInicio, horaFinal) {
        const horaInicioMs = new Date(`1970-01-01T${horaInicio}`).getTime();
        const horaFinalMs = new Date(`1970-01-01T${horaFinal}`).getTime();
        return (horaFinalMs - horaInicioMs) / (1000 * 60 * 60);
    }

    static async conferirRegistros(dataServico, FKinstrutor, horaInicio, horaFinal, registroEditadoId = null) {
        const whereClause = { FKinstrutor, dataServico };

        if (registroEditadoId) {
            whereClause.id = { [Op.ne]: registroEditadoId };
        }

        const registrosNoMesmoDia = await Registro.findAll({ where: whereClause });

        const novoInicio = new Date(`1970-01-01T${horaInicio}`);
        const novoFim = new Date(`1970-01-01T${horaFinal}`);

        return registrosNoMesmoDia.some(registro => {
            const registroInicio = new Date(`1970-01-01T${registro.horaInicio}`);
            const registroFim = new Date(`1970-01-01T${registro.horaFinal}`);

            return (
                (novoInicio >= registroInicio && novoInicio < registroFim) ||
                (novoFim > registroInicio && novoFim <= registroFim) ||
                (novoInicio <= registroInicio && novoFim >= registroFim)
            );
        });
    }
}

class CoordAreaController {
    static async listarInstrutores(req, res) {
        try {
            const instrutores = await RegistroServico.listarInstrutoresPorArea(req.params.area);
            res.json(instrutores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async listarRegistros(req, res) {
        try {
            const { matricula } = req.params;

            const registros = await RegistroServico.listarRegistrosEmAnalisePorInstrutor(matricula);
            const nomeIntrutor = await RegistroServico.buscarNomeInstrutor(matricula)

            res.json({nomeIntrutor, registros});
        } catch (error) {
            res.status (500).json({ error: error.message });
        }
    }

    static async verificaSituacao(req, res) {
        try {
            const emAnalise = await RegistroServico.isRegistroEmAnalisePorInstrutor(req.params.matricula);
            res.json(emAnalise);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async validarRegistro(req, res) {
        try {
            const { id, FKcoordenador } = req.params;
            if (!await RegistroServico.isRegistroEmAnalisePorId(id)) {
                return res.status(400).json({ error: "O registro não está em análise." });
            }

            const atualizado = await RegistroServico.atualizarRegistro(id, {
                status: "Validado",
                FKcoordenador
            });

            await RegistroServico.calcularHoras(id);

            res.json(atualizado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // nessa função ainda tem que fazer um casting de string para time 
    // assim vai dar pra fazer a comparação certa.
    static async validarParcialmenteRegistro(req, res) {
        try {
            const { id, FKcoordenador } = req.params;
            const { justificativa, total } = req.body;

            // Verificar se o registro está "Em Análise"
            if (!await RegistroServico.isRegistroEmAnalisePorId(id)) {
                return res.status(400).json({ error: "O registro não está em análise." });
            }

            // Validar justificativa
            if (!RegistroServico.validarDescricao(justificativa)) {
                return res.status(400).json({ error: "Justificativa inválida." });
            }

            // Obter total original do registro
            const totalOriginal = await RegistroServico.obterTotalRegistroPorId(id);

            console.log(total, totalOriginal)

            // Determinar o novo status do registro
            let status;
            if (total == "00:00:00") {
                status = "Recusado";
            } else if (total < totalOriginal) {
                status = "Parcialmente validado";
            } else if (total === totalOriginal) {
                status = "Validado";
            } else {
                return res.status(400).json({ error: "A quantidade de horas foi excedida." });
            }

            // Atualizar o registro com novo status, total e justificativa
            const atualizado = await RegistroServico.atualizarRegistro(id, {
                status,
                justificativa,
                total,
                FKcoordenador
            });

            // await RegistroServico.calcularHoras(id);
            
            res.status(200).json({msg: "Serviço educacional avalidado com sucesso!"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async cadastrarRegistro(req, res) {
        try {
            const { dataServico, horaInicio, horaFinal, titulo, descricao, FKservico } = req.body;
            const FKcoordenador = req.params.matriculaC;
            const FKinstrutor = req.params.matriculaI;

            // Validar descrição
            if (!RegistroServico.validarDescricao(descricao)) {
                return res.status(400).json({ error: "Descrição inválida." });
            }

            // Conferir se a data não é no futuro
            if (!RegistroServico.conferirDataValida(dataServico)) {
                return res.status(400).json({ error: "Não é permitido cadastrar registros para datas futuras." });
            }

            // Conferir se existe sobreposição de horário
            if (await RegistroServico.conferirRegistros(dataFormatada, FKinstrutor, horaInicio, horaFinal)) {
                return res.status(400).json({ error: "Já existe um registro com horário sobreposto para este instrutor nesta data." });
            }

            // Calcular total de horas
            const total = RegistroServico.calcularDiferencaHoras(horaInicio, horaFinal);

            // Cadastrar novo registro
            await RegistroServico.cadastrarRegistro({
                dataServico: dataFormatada,
                horaInicio,
                horaFinal,
                total,
                titulo,
                descricao,
                status: "Validado",
                FKservico,
                FKinstrutor,
                FKcoordenador
            });

            res.json({ msg: "Registro cadastrado." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CoordAreaController;