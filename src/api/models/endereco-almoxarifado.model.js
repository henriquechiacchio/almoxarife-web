/**
 * Define o modelo Sequelize para a tabela Endereco_Almoxarifado.
 *
 * Tabela de apoio do Almoxarifado: 1 endereço pode ser referenciado por
 * vários almoxarifados (ver associação em index.js). Não possui colunas de
 * auditoria no SQL, por isso timestamps: false.
 *
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const EnderecoAlmoxarifado = sequelize.define("EnderecoAlmoxarifado", {
    id_endereco: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    logradouro: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "uc_endereco_unico"
    },
    numero: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "uc_endereco_unico"
    },
    bairro: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estado: {
      type: DataTypes.CHAR(2),
      allowNull: false
    },
    cep: {
      // No SQL deste módulo o CEP é VARCHAR(8) (diferente do CHAR(8) usado
      // em Endereco_Fornecedor). Mantido fiel ao script atual.
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: "uc_endereco_unico"
    }
  }, {
    tableName: "Endereco_Almoxarifado",
    timestamps: false,
    charset: "utf8mb4"
  })

  return EnderecoAlmoxarifado
}
