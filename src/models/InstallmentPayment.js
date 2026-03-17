const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ProductInstance = require('./ProductInstance');

const InstallmentPayment = sequelize.define('InstallmentPayment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    productInstanceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: ProductInstance,
            key: 'id',
        },
    },
    amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Paid',
    },
});

ProductInstance.hasMany(InstallmentPayment, { foreignKey: 'productInstanceId', as: 'installmentHistory' });
InstallmentPayment.belongsTo(ProductInstance, { foreignKey: 'productInstanceId', as: 'product' });

module.exports = InstallmentPayment;