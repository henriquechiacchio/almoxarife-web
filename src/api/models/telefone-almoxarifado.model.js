/**
 * Define o modelo Sequelize para a tabela Telefone_Almoxarifado.
 *
 * N telefones por almoxarifado (1:N). Mesmo padrao de Telefone_Fornecedor:
 * chave primaria COMPOSTA (cod_almoxarifado, telefone) — o mesmo numero nao
 * se repete no mesmo almoxarifado. Sem colunas de auditoria -> timestamps:false.
 *
 * A associacao (Almoxarifado hasMany TelefoneAlmoxarifado, as: "telefones")
 * fica em models/index.js.
 *
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const TelefoneAlmoxarifado = sequelize.define("TelefoneAlmoxarifado", {
    cod_almoxarifado: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    telefone: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      allowNull: false
    }
  }, {
    tableName: "Telefone_Almoxarifado",
    timestamps: false,
    charset: "utf8mb4"
  })

  return TelefoneAlmoxarifado
}
