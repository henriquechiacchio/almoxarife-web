/**
 * Define o modelo Sequelize para a tabela Gestao_Almoxarifado.
 *
 * É a tabela de junção (N:M) entre Funcionario e Almoxarifado — quem
 * gerencia qual almoxarifado. Em index.js ela é usada como `through` no
 * belongsToMany. Chave primária COMPOSTA (id_funcionario, cod_almoxarifado),
 * mesmo padrão de Telefone_Fornecedor.
 *
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const GestaoAlmoxarifado = sequelize.define("GestaoAlmoxarifado", {
    id_funcionario: {
      // CHAR(36) porque Funcionario usa UUID como PK.
      type: DataTypes.CHAR(36),
      primaryKey: true
    },
    cod_almoxarifado: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true
    },
    // Atributo extra do vínculo: quando a atribuição foi feita.
    data_atribuicao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "Gestao_Almoxarifado",
    timestamps: false,
    charset: "utf8mb4"
  })

  return GestaoAlmoxarifado
}
