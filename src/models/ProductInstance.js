const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Customer = require('./Customer');

const ProductInstance = sequelize.define('ProductInstance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id',
    },
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  profitPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  totalSalePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  downPayment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  installmentsCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  monthlyAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  saleDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Customer.hasMany(ProductInstance, { foreignKey: 'customerId', as: 'products' });
ProductInstance.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

module.exports = ProductInstance;