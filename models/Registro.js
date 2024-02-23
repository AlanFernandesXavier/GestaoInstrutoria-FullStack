const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connection'); // Certifique-se de importar sua instância do sequelize corretamente

class Registro extends Model {}

Registro.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dataServico: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    horaFinal: {
        type: DataTypes.TIME,
        allowNull: false
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Em Análise', 'Validado', 'Recusado', 'Parcialmente Validado'),
        defaultValue: 'Em Análise',
        allowNull: false
    },
    justificativa: {
        type: DataTypes.TEXT,
        allowNull: true // Pode ser nulo, dependendo da situação
    },
    FKinstrutor: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Instrutor',
            key: 'matricula'
        }
    },
    FKservico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Servico',
            key: 'id'
        }
    },
    FKcoordenador: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'CoordenadorArea',
            key: 'matricula'
        }
    }
}, {
    sequelize,
    modelName: 'Registro',
    timestamps: true // Adiciona automaticamente createdAt e updatedAt
});

module.exports = Registro;