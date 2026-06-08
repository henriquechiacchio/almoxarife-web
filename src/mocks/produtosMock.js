// ──────────────────────────────────────────────────────────────
// Mock TEMPORARIO de produtos para testar o modulo de Saidas enquanto
// o backend de Produtos (/api/produtos) nao existe.
//
// TODO: substituir por fetch(`${API_URL}/produtos`) quando o modulo de
//       Produtos estiver pronto, e remover este arquivo.
//
// IMPORTANTE: os `id_produto` aqui COINCIDEM com os do SEED_produtos_estoque.sql.
// Use os dois juntos:
//   - este mock popula o <select> de produtos na tela de Saida;
//   - o seed cria as linhas reais em Produtos/Estoque para que a saida
//     consiga ser SALVA (a FK Saida_Item -> Produtos exige produto existente,
//     e a baixa de estoque exige saldo).
//
// O ItemSaidaRow usa apenas { id_produto, nome }; `unidade_medida` vai junto
// para ficar realista e ja servir quando a tela exibir a unidade.
// ──────────────────────────────────────────────────────────────
export const PRODUTOS_MOCK = [
  { id_produto: 1, nome: "Cimento CP-II 50kg", unidade_medida: "SC" },
  { id_produto: 2, nome: "Areia média", unidade_medida: "M3" },
  { id_produto: 3, nome: "Brita 1", unidade_medida: "M3" },
  { id_produto: 4, nome: "Vergalhão CA-50 10mm", unidade_medida: "BR" },
  { id_produto: 5, nome: "Bloco cerâmico 9x19x39", unidade_medida: "UN" },
  { id_produto: 6, nome: "Tinta acrílica 18L", unidade_medida: "LT" }
]
