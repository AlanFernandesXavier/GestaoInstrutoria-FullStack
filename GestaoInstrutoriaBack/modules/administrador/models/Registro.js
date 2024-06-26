const { DataTypes, Model } = require('sequelize');
const Servico = require("./Servico");
const Usuario = require('../../usuario/model/Usuario');
const sequelize = require('../../../config/connection'); 
// Certifique-se de importar sua instância do sequelize corretamente

class Registro extends Model {}

Registro.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dataServico: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A data do serviço é obrigatória!'
            },
            isDate: {
                msg: 'Forneça uma data válida!'
            }
        }
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A hora de início é obrigatória!'
            }
        }
    },
    horaFinal: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'A hora de término é obrigatória!'
            }
        }
    },
    total: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O total de horas é obrigatório!'
            }
        }
    },
    titulo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'O título é obrigatório!'
            },
            len: {
                args: [5, 50],
                msg: 'O título deve ter no mínimo 5 caracteres e no máximo 50 caracteres!'
            }
        }
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: 'A descrição pode ter no máximo 500 caracteres!'
            }
        }
    },
    status: {
        type: DataTypes.ENUM('Em Análise', 'Validado', 'Recusado', 'Parcialmente Validado'),
        defaultValue: 'Em Análise',
        allowNull: false,
        validate: {
            isIn: {
                args: [['Em Análise', 'Validado', 'Recusado', 'Parcialmente Validado']],
                msg: 'Forneça um status válido!'
            }
        }
    },
    justificativa: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: 'A justificativa pode ter no máximo 500 caracteres!'
            }
        }
    },
    FKinstrutor: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'matricula'
        },
        validate: {
            notNull: {
                msg: 'A matrícula do instrutor é obrigatória!'
            },
            len: {
                args: [4, 6],
                msg: 'A matricula deve ter no mínimo 4 caracteres e no máximo 6'
            }
        }
    },
    FKservico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Servico',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'O ID do serviço é obrigatório!'
            },
            isInt: {
                msg: 'Forneça um ID de serviço válido!'
            }
        }
    },
    FKcoordenador: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'Usuario',
            key: 'matricula'
        },
        validate: {
            len: {
                args: [4, 6],
                msg: 'A matricula deve ter no mínimo 4 caracteres e no máximo 6'
            }
        }
    }
}, {
    sequelize,
    modelName: 'Registro',
    timestamps: true // Desativa o timestamps padrão
});

Registro.belongsTo(Servico, { foreignKey: 'FKservico' });
Registro.belongsTo(Usuario, { as: 'instrutor', foreignKey: 'FKinstrutor' });
Registro.belongsTo(Usuario, { as: 'coordenador', foreignKey: 'FKcoordenador' });

module.exports = Registro;
