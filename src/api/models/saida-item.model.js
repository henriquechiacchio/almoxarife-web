/**
 * Define o modelo Sequelize para a tabela Saida_Item.
 *
 * Itens (produtos) de uma saída. PK COMPOSTA (id_saida, id_produto): o mesmo
 * produto não se repete na mesma saída. Em index.js, Saida hasMany SaidaItem
 * com onDelete CASCADE (apagou a saída, somem os itens).
 *
 * Observação: o diagrama de classes previa `valorUnitario` em ItensSaída,
 * mas o SQL atual NÃO tem essa coluna — seguimos o SQL (situação atual).
 * Se a equipe decidir incluir o valor depois, basta adicionar o campo aqui
 * e na tabela.
 *
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const SaidaItem = sequelize.define("SaidaItem", {
    id_saida: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    id_produto: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    quantidade: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false
    }
  }, {
    tableName: "Saida_Item",
    timestamps: false,
    charset: "utf8mb4"
  })

  return SaidaItem
}
