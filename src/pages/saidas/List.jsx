import { useEffect, useState } from "react";
import {
  Container,
  Alert,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import ListTemplate from "../../components/ListTemplate";

/**
 * Tela de Listagem de Saidas (RF018 - Consultar Saida).
 *
 * SOMENTE FRONT-END. O backend de Saida ainda nao foi construido; esta tela
 * ja consome a API no formato { sucesso, dados, erro } usado pelos demais
 * modulos, entao quando o backend subir e so plugar.
 *
 * Segue o MESMO molde de almoxarifados/List.jsx:
 *   - reusa o ListTemplate (que ja traz os botoes Editar e Inativar prontos);
 *   - mantem o filtro -> fetch -> map para o formato de exibicao;
 *   - usa um Dialog de confirmacao antes da acao destrutiva.
 *
 * MODELO DE DADOS (origem: schema SQL, tabela Saida):
 *   id_saida, cod_almoxarifado_origem, id_funcionario_responsavel,
 *   tipo_saida ('CONSUMO' | 'TRANSFERENCIA'), cod_almoxarifado_destino (nullable),
 *   data_saida, observacao + itens (Saida_Item: produto + quantidade).
 *
 * Formato esperado de cada registro vindo da API (result.dados[i]):
 *   {
 *     id_saida,
 *     data_saida,                       // ISO string ou timestamp
 *     tipo_saida,                       // 'CONSUMO' | 'TRANSFERENCIA'
 *     almoxarifadoOrigem:  { nome },
 *     almoxarifadoDestino: { nome } | null,
 *     responsavel:         { nome },
 *     itens: [{ ... }]                  // usado so para contar
 *   }
 */

const API_URL = "http://localhost:5000/api";

// Filtros iniciais. 'tipo' vazio = todos (sem filtro de tipo).
const filtrosVazios = { responsavel: "", tipo: "" };

export default function SaidasList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtros, setFiltros] = useState({ ...filtrosVazios });

  // Estado do dialogo de confirmacao (Inativar/Excluir).
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  // Carrega ao montar a tela.
  useEffect(() => {
    carregarSaidas({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Formata o timestamp do banco para dd/mm/aaaa (pt-BR).
   * Defensivo: se vier vazio/invalido, devolve travessao.
   */
  function formatarData(valor) {
    if (!valor) return "—";
    const d = new Date(valor);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("pt-BR");
  }

  /**
   * Busca as saidas na API aplicando os filtros como querystring.
   * Mantem a mesma assinatura/contrato dos outros modulos.
   */
  function carregarSaidas(filtrosAtuais) {
    setLoading(true);
    setError("");

    // Monta a querystring so com os filtros preenchidos.
    const params = new URLSearchParams();
    if (filtrosAtuais.responsavel) params.append("responsavel", filtrosAtuais.responsavel);
    if (filtrosAtuais.tipo) params.append("tipo", filtrosAtuais.tipo);
    const query = params.toString() ? `?${params.toString()}` : "";

    fetch(`${API_URL}/saidas${query}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.sucesso) {
          // Mapeia o registro cru da API para o formato que a tabela exibe.
          const formatado = result.dados.map((s) => ({
            "Data": formatarData(s.data_saida),
            "Origem": s.almoxarifadoOrigem?.nome || "—",
            "Tipo": s.tipo_saida === "TRANSFERENCIA" ? "Transferência" : "Consumo",
            // Destino so faz sentido em transferencia; em consumo nao ha destino.
            "Destino":
              s.tipo_saida === "TRANSFERENCIA"
                ? s.almoxarifadoDestino?.nome || "—"
                : "—",
            "Responsável": s.responsavel?.nome || "—",
            "Itens": `${s.itens?.length || 0} item(ns)`,
            // Campo "oculto" para recuperar o id nos handlers (mesmo truque do almoxarifado).
            __id__: s.id_saida
          }));
          setData(formatado);
        } else {
          setError(result.erro || "Erro ao carregar saídas");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Erro ao conectar com o servidor: " + err.message);
        setLoading(false);
      });
  }

  // ── Handlers dos filtros ──
  function handleFiltroChange(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleBuscar() {
    carregarSaidas(filtros);
  }

  function handleLimpar() {
    setFiltros({ ...filtrosVazios });
    carregarSaidas({});
  }

  // Permite buscar apertando Enter dentro de qualquer campo de filtro.
  function handleKeyDown(e) {
    if (e.key === "Enter") handleBuscar();
  }

  // ── Acoes por linha ──
  function handleEdit(item) {
    navigate(`/saidas/${item.__id__}/editar`);
  }

  function handleExcluirClick(item) {
    setSelectedItem(item);
    setOpenConfirm(true);
  }

  function handleConfirmRemove() {
    setRemovendo(true);
    setError("");

    fetch(`${API_URL}/saidas/${selectedItem.__id__}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.sucesso) {
          carregarSaidas(filtros); // recarrega mantendo os filtros atuais
        } else {
          setError(result.erro || "Erro ao remover a saída");
        }
        finalizarDialogo();
      })
      .catch((err) => {
        setError("Erro ao remover: " + err.message);
        finalizarDialogo();
      });
  }

  function finalizarDialogo() {
    setRemovendo(false);
    setOpenConfirm(false);
    setSelectedItem(null);
  }

  function handleCloseConfirm() {
    if (removendo) return; // evita fechar no meio da requisicao
    setOpenConfirm(false);
    setSelectedItem(null);
  }

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ListTemplate
        title="Saídas"
        columns={["Data", "Origem", "Tipo", "Destino", "Responsável", "Itens"]}
        data={data}
        loading={loading}
        onCreate={() => navigate("/saidas/cadastro")}
        onEdit={handleEdit}
        onInactivate={handleExcluirClick}
        onSearch={handleBuscar}
        onClear={handleLimpar}
        emptyMessage="Nenhuma saída encontrada com os parâmetros informados."
        // Caminho A: a acao da saida e EXCLUSAO real (RF020), nao inativacao.
        // Por isso sobrescrevemos o botao destrutivo padrao do template.
        actionLabel="Excluir"
        actionIcon={<DeleteOutlineIcon fontSize="small" />}
        actionColor="error.main"
        filters={
          <>
            <TextField
              label="Responsável"
              size="small"
              value={filtros.responsavel}
              onChange={(e) => handleFiltroChange("responsavel", e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <TextField
              select
              label="Tipo"
              size="small"
              value={filtros.tipo}
              onChange={(e) => handleFiltroChange("tipo", e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="CONSUMO">Consumo</MenuItem>
              <MenuItem value="TRANSFERENCIA">Transferência</MenuItem>
            </TextField>
          </>
        }
      />

      {/* Dialogo de confirmacao da acao destrutiva (RF020 - Excluir Saida). */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar remoção da saída</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover esta saída? Conforme o RF020, a
            exclusão devolve ao estoque a quantidade que havia sido baixada.
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} disabled={removendo}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmRemove} color="error" disabled={removendo}>
            {removendo ? "Removendo..." : "Remover"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
