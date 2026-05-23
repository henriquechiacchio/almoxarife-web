/**
 * Define o modelo Sequelize para a tabela Estoque.
 *
 * Saldo de um Produto dentro de um Almoxarifado. PK COMPOSTA
 * (id_produto, cod_almoxarifado) — cada par só pode existir uma vez.
 *
 * Particularidade: o SQL tem SÓ a coluna `ultima_atualizacao` (sem data de
 * criação). Por isso configuramos timestamps com createdAt desligado e
 * updatedAt apontando para essa coluna — assim o Sequelize atualiza o saldo
 * com o horário automaticamente a cada mudança de quantidade.
 *
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const Estoque = sequelize.define("Estoque", {
    id_produto: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    cod_almoxarifado: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    quantidade: {
      // DECIMAL(10,3): suporta unidades fracionadas (ex.: KG, LT).
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      defaultValue: 0.000
    }
  }, {
    tableName: "Estoque",
    timestamps: true,
    createdAt: false,
    updatedAt: "ultima_atualizacao",
    charset: "utf8mb4"
  })

  return Estoque
}
