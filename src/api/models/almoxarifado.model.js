/**
 * Define o modelo Sequelize para a tabela Almoxarifado.
 *
 * PK = cod_almoxarifado (auto incremento). Possui auditoria própria
 * (data_criacao / data_atualizacao) e a coluna `ativo` para soft delete,
 * no mesmo padrão de Fornecedores e Funcionarios.
 *
 * NOTA: o `telefone` NAO fica mais aqui. Os telefones do almoxarifado
 * agora vivem na tabela Telefone_Almoxarifado (1:N), igual ao Fornecedor.
 * A associacao (hasMany ... as: "telefones") fica em models/index.js.
 *
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const Almoxarifado = sequelize.define("Almoxarifado", {
    cod_almoxarifado: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    // FK para Endereco_Almoxarifado. A associação (belongsTo) fica em index.js.
    id_endereco: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    ativo: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: "Almoxarifado",
    // O Sequelize gerencia as colunas de auditoria, mas com os nomes do SQL:
    timestamps: true,
    createdAt: "data_criacao",
    updatedAt: "data_atualizacao",
    charset: "utf8mb4"
  })

  return Almoxarifado
}
