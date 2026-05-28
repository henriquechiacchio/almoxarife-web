import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  IconButton,
  Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";

/**
 * Template de listagem padrão do sistema.
 *
 * IMPORTANTE: a API (os props) foi mantida compatível com a versão anterior:
 *   - title, columns, data, onCreate, onEdit, onInactivate, filters, onSearch
 *
 * NOVO: prop opcional `onRowClick`
 * ----------------------------------------------------------------
 * Adicionada para o módulo de Almoxarifados, onde clicar na linha
 * abre a tela de detalhes (com estoque, fornecedores, etc.).
 *
 * Como é OPCIONAL: páginas que NÃO passam `onRowClick` (Fornecedores,
 * Funcionários) continuam funcionando exatamente como antes. O cursor
 * só vira "pointer" e o hover só fica destacado QUANDO a prop existe.
 *
 * Detalhe técnico importante: `e.stopPropagation()` nos botões de
 * Editar/Inativar — sem isso, clicar no botão também dispara o
 * onRowClick (event bubbling do DOM), abrindo os detalhes E executando
 * a ação ao mesmo tempo. Bug clássico.
 *
 * Sobre os filtros:
 *   Cada página passa via prop `filters` os TextFields específicos do
 *   contexto. Aqui dentro só colocamos esses campos em linha e
 *   adicionamos o botão "Buscar" à direita. Padrão de "inversão de
 *   controle" — o componente pai diz o que mostrar, o filho só organiza.
 */
export default function ListTemplate({
  title,
  filters,
  columns,
  data,
  onCreate,
  onEdit,
  onInactivate,
  onSearch,
  onRowClick // NOVO: opcional, ativa clique na linha
}) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      {/* Cabeçalho: título (esquerda) + botão "+ Novo" (direita) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 2.5
        }}
      >
        <Box>
          {title && (
            <Typography variant="h5" fontWeight={600}>
              {title}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Gerencie os registros de {title?.toLowerCase()}.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          sx={{ whiteSpace: "nowrap" }}
        >
          Novo
        </Button>
      </Box>

      {/* Linha de filtros — campos vêm via prop `filters`, botão Buscar fica à direita */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
        alignItems={{ md: "center" }}
        flexWrap="wrap"
      >
        {filters}
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          sx={{ whiteSpace: "nowrap" }}
        >
          Buscar
        </Button>
      </Stack>

      {/* Tabela */}
      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, i) => (
                <TableCell key={i} sx={{ color: "text.secondary", fontWeight: 600 }}>
                  {col}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 600 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.length ? (
              data.map((item, i) => (
                <TableRow
                  key={i}
                  hover
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  // Só ativa cursor pointer se a linha for clicável
                  sx={onRowClick ? { cursor: "pointer" } : undefined}
                >
                  {columns.map((col, j) => (
                    <TableCell key={j}>{item[col]}</TableCell>
                  ))}
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            // CRÍTICO: impede que o clique no botão "vaze"
                            // para o onClick da TableRow (event bubbling).
                            // Sem isso, clicar em "Editar" abriria os
                            // detalhes E iria para edição ao mesmo tempo.
                            e.stopPropagation();
                            onEdit && onEdit(item);
                          }}
                          sx={{ color: "primary.main" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Inativar">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInactivate && onInactivate(item);
                          }}
                          sx={{ color: "warning.main" }}
                        >
                          <BlockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Mensagem quando não há dados — melhor UX que tabela vazia
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
