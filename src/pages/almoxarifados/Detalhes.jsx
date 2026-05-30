import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Stack,
  TextField,
  Button,
  Box,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Alert
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

import FormPageHeader from "../../components/FormPageHeader";
import SummaryCard from "../../components/SummaryCard";

/**
 * Tela de Detalhes de um Almoxarifado especifico.
 *
 * INTEGRACAO PARCIAL AO BACKEND:
 *  - BLOCO 1 (dados cadastrais): via GET /api/almoxarifados/:id  -> REAL.
 *  - BLOCOS 2 e 3 (estoque): AINDA MOCK. O modulo Estoque nao existe no
 *    backend (model comentado em models/index.js). Quando ele existir,
 *    troque MOCK_ESTOQUE por algo como:
 *        fetch(`${API_URL}/almoxarifados/${id}/estoque`)
 *    e remova este mock. O resto da tela ja esta pronto.
 *
 * RF014 (Consultar Almoxarifado): consulta o estoque com filtros por
 * produto, fornecedor, nota fiscal e data de atualizacao.
 */

const API_URL = "http://localhost:5000/api";

// MOCK do estoque por almoxarifado — permanece ate o modulo Estoque existir.
// No SQL real isso vira da tabela Estoque (junção com Produtos e Compra).
const MOCK_ESTOQUE = {
  1: [
    { id: 101, produto: "Cimento CP-II 50kg", fornecedor: "Votorantim",   nota_fiscal: "NF-2025/0451", qtd: 320, qtd_minima: 100, valor_unit: 38.50, data_atualizacao: "2026-05-26" },
    { id: 102, produto: "Areia média m³",      fornecedor: "Mineração XYZ", nota_fiscal: "NF-2025/0452", qtd:  45, qtd_minima:  20, valor_unit: 85.00, data_atualizacao: "2026-05-24" },
    { id: 103, produto: "Brita 1 m³",          fornecedor: "Mineração XYZ", nota_fiscal: "NF-2025/0452", qtd:  18, qtd_minima:  25, valor_unit: 92.00, data_atualizacao: "2026-05-24" },
    { id: 104, produto: "Vergalhão 10mm 12m", fornecedor: "Gerdau",         nota_fiscal: "NF-2025/0455", qtd: 210, qtd_minima:  50, valor_unit: 48.20, data_atualizacao: "2026-05-22" },
    { id: 105, produto: "Tijolo Cerâmico",     fornecedor: "Cerâmica Sul",  nota_fiscal: "NF-2025/0460", qtd: 1500, qtd_minima: 500, valor_unit: 0.85, data_atualizacao: "2026-05-26" }
  ],
  2: [
    { id: 201, produto: "Cimento CP-II 50kg", fornecedor: "Votorantim",   nota_fiscal: "NF-2025/0501", qtd: 80,  qtd_minima: 100, valor_unit: 38.50, data_atualizacao: "2026-05-25" },
    { id: 202, produto: "Cal Hidratada 20kg",  fornecedor: "Itaú Cal",       nota_fiscal: "NF-2025/0502", qtd: 60,  qtd_minima:  30, valor_unit: 22.00, data_atualizacao: "2026-05-21" },
    { id: 203, produto: "Telha Fibrocimento",  fornecedor: "Brasilit",       nota_fiscal: "NF-2025/0503", qtd: 120, qtd_minima:  40, valor_unit: 65.50, data_atualizacao: "2026-05-19" }
  ],
  3: [
    { id: 301, produto: "Óleo Hidráulico 20L", fornecedor: "Petrobras",      nota_fiscal: "NF-2025/0601", qtd: 12,  qtd_minima:   5, valor_unit: 285.00, data_atualizacao: "2026-05-18" },
    { id: 302, produto: "Filtro de Ar",         fornecedor: "Mann Filter",    nota_fiscal: "NF-2025/0602", qtd:  8,  qtd_minima:  10, valor_unit:  95.00, data_atualizacao: "2026-05-20" },
    { id: 303, produto: "Graxa Industrial 1kg", fornecedor: "Lubrax",          nota_fiscal: "NF-2025/0603", qtd: 24,  qtd_minima:   8, valor_unit:  42.00, data_atualizacao: "2026-05-15" }
  ]
};

export default function AlmoxarifadoDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [almoxarifado, setAlmoxarifado] = useState(null);
  const [estoque, setEstoque] = useState([]);
  const [estoqueFiltrado, setEstoqueFiltrado] = useState([]);
  const [error, setError] = useState("");

  // Filtros conforme RF014: produto, fornecedor, nota fiscal, data.
  const [filtros, setFiltros] = useState({
    produto: "",
    fornecedor: "",
    nota_fiscal: "",
    data: ""
  });

  // Carrega dados quando o `id` da URL muda.
  useEffect(() => {
    setError("");

    // BLOCO 1 — dados cadastrais via API real.
    fetch(`${API_URL}/almoxarifados/${id}`)
      .then(res => res.json())
      .then(result => {
        if (result.sucesso) {
          setAlmoxarifado(result.dados);
        } else {
          setError(result.erro || "Almoxarifado não encontrado.");
        }
      })
      .catch(err => setError("Erro ao carregar: " + err.message));

    // BLOCOS 2 e 3 — estoque AINDA mock (modulo Estoque nao existe no backend).
    const itens = MOCK_ESTOQUE[id] || [];
    setEstoque(itens);
    setEstoqueFiltrado(itens);
  }, [id]);

  // ── Handlers dos filtros do estoque (filtragem LOCAL no mock) ──
  function handleFiltroChange(campo, valor) {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  }

  function handleBuscar() {
    const filtrados = estoque.filter(item => {
      if (filtros.produto && !item.produto.toLowerCase().includes(filtros.produto.toLowerCase())) return false;
      if (filtros.fornecedor && !item.fornecedor.toLowerCase().includes(filtros.fornecedor.toLowerCase())) return false;
      if (filtros.nota_fiscal && !item.nota_fiscal.toLowerCase().includes(filtros.nota_fiscal.toLowerCase())) return false;
      if (filtros.data && item.data_atualizacao !== filtros.data) return false;
      return true;
    });
    setEstoqueFiltrado(filtrados);
  }

  function handleLimpar() {
    setFiltros({ produto: "", fornecedor: "", nota_fiscal: "", data: "" });
    setEstoqueFiltrado(estoque);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleBuscar();
  }

  // ── Calculos derivados ──
  const totalItens = estoque.reduce((sum, it) => sum + it.qtd, 0);
  const valorTotal = estoque.reduce((sum, it) => sum + it.qtd * it.valor_unit, 0);
  const itensBaixoEstoque = estoque.filter(it => it.qtd < it.qtd_minima).length;
  const ultimaAtualizacao = almoxarifado
    ? new Date(almoxarifado.data_atualizacao).toLocaleDateString("pt-BR")
    : "—";

  // Formatacao BR de moeda — Intl.NumberFormat e nativo, nao precisa lib.
  const formatarMoeda = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (error) {
    return (
      <Container maxWidth="lg">
        <FormPageHeader title="Detalhes do Almoxarifado" backTo="/almoxarifados" />
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!almoxarifado) {
    return (
      <Container maxWidth="lg">
        <FormPageHeader title="Carregando..." backTo="/almoxarifados" />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Cabecalho + botao voltar para /almoxarifados */}
      <FormPageHeader
        title={almoxarifado.nome}
        subtitle={`Almoxarifado #${almoxarifado.cod_almoxarifado} — visualização de dados e estoque`}
        backTo="/almoxarifados"
      />

      {/* === BLOCO 1: Dados cadastrais (REAL) === */}
      <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ md: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Dados do almoxarifado
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip
              label={almoxarifado.ativo === 1 ? "Ativo" : "Inativo"}
              color={almoxarifado.ativo === 1 ? "success" : "default"}
              size="small"
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/almoxarifados/${id}/editar`)}
            >
              Editar
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography variant="body2">{almoxarifado.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" color="text.secondary">Telefone</Typography>
            <Typography variant="body2">{almoxarifado.telefones?.map(t => t.telefone).join(", ") || "—"}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">Endereço</Typography>
            <Typography variant="body2">
              {almoxarifado.endereco.logradouro}, {almoxarifado.endereco.numero}
              {" — "}{almoxarifado.endereco.bairro}
              {", "}{almoxarifado.endereco.cidade}/{almoxarifado.endereco.estado}
              {" — CEP "}{almoxarifado.endereco.cep}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* === BLOCO 2: Resumo do estoque (4 cards) — calculado sobre o MOCK === */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<Inventory2Icon />}
            color="#3b82f6"
            value={totalItens.toLocaleString("pt-BR")}
            label="Itens em estoque"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<WarningAmberIcon />}
            color="#f59e0b"
            value={itensBaixoEstoque}
            label="Produtos abaixo do mínimo"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<AttachMoneyIcon />}
            color="#10b981"
            value={formatarMoeda(valorTotal)}
            label="Valor total estocado"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            icon={<UpdateIcon />}
            color="#a78bfa"
            value={ultimaAtualizacao}
            label="Última atualização"
          />
        </Grid>
      </Grid>

      {/* === BLOCO 3: Tabela de estoque com filtros (RF014) — MOCK === */}
      <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
          Itens em estoque
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Consulte os materiais deste almoxarifado e aplique filtros para refinar a busca.
        </Typography>

        {/* Linha de filtros — espelha o padrao do List.jsx (TextField + botao Buscar) */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ mb: 2.5 }}
          alignItems={{ md: "center" }}
          flexWrap="wrap"
        >
          <TextField
            label="Produto"
            size="small"
            value={filtros.produto}
            onChange={(e) => handleFiltroChange("produto", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <TextField
            label="Fornecedor"
            size="small"
            value={filtros.fornecedor}
            onChange={(e) => handleFiltroChange("fornecedor", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <TextField
            label="Nota Fiscal"
            size="small"
            value={filtros.nota_fiscal}
            onChange={(e) => handleFiltroChange("nota_fiscal", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <TextField
            label="Data de Atualização"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filtros.data}
            onChange={(e) => handleFiltroChange("data", e.target.value)}
          />
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={handleBuscar}
            sx={{ whiteSpace: "nowrap" }}
          >
            Buscar
          </Button>
          <Button variant="text" onClick={handleLimpar} sx={{ whiteSpace: "nowrap" }}>
            Limpar
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Tabela read-only (sem botoes de edit/inativar por linha). */}
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>Produto</TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>Fornecedor</TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>Nota Fiscal</TableCell>
                <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 600 }}>Qtd. Atual</TableCell>
                <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 600 }}>Qtd. Mín.</TableCell>
                <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 600 }}>Valor Unit.</TableCell>
                <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 600 }}>Subtotal</TableCell>
                <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>Atualizado em</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estoqueFiltrado.length ? (
                estoqueFiltrado.map((item) => {
                  const baixoEstoque = item.qtd < item.qtd_minima;
                  return (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.produto}</TableCell>
                      <TableCell>{item.fornecedor}</TableCell>
                      <TableCell>{item.nota_fiscal}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                          <span>{item.qtd.toLocaleString("pt-BR")}</span>
                          {baixoEstoque && (
                            <Chip
                              label="Baixo"
                              color="warning"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">{item.qtd_minima.toLocaleString("pt-BR")}</TableCell>
                      <TableCell align="right">{formatarMoeda(item.valor_unit)}</TableCell>
                      <TableCell align="right">{formatarMoeda(item.qtd * item.valor_unit)}</TableCell>
                      <TableCell>{new Date(item.data_atualizacao).toLocaleDateString("pt-BR")}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    Nenhum item encontrado com os filtros informados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Container>
  );
}
