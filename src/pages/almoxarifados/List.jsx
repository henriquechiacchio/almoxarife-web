import {
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ListTemplate from "../../components/ListTemplate";

/**
 * Tela de Listagem de Almoxarifados (RF014 — Consultar Almoxarifado).
 *
 * Por que esta tela existe?
 * -------------------------
 * Atende ao RF014 da especificação: o usuário acessa o menu "Almoxarifados",
 * vê a listagem paginada de almoxarifados cadastrados e pode filtrar.
 *
 * Também serve como ponto de entrada para:
 *   - RF013: Cadastrar (botão "Novo" no topo)
 *   - RF015: Editar (ícone de edição na linha)
 *   - RF016: Inativar (ícone de bloqueio na linha)
 *   - Visualização detalhada (clique na linha → /almoxarifados/:id)
 *
 * Por que mock e não fetch?
 * -------------------------
 * O backend de almoxarifados ainda não existe. Para não quebrar a tela ao abrir,
 * uso dados mockados. Quando o backend ficar pronto, basta substituir o
 * trecho marcado com TODO por um fetch — TODA a lógica de filtros, edit,
 * inativação e navegação JÁ ESTÁ PRONTA.
 *
 * Esse padrão (fronend funcional com mock + TODO) é melhor que deixar a
 * tela quebrada esperando o backend — você consegue mostrar o fluxo
 * completo para a equipe / cliente e validar UX antes de codar API.
 */

// MOCK: substituir por GET /api/almoxarifados quando o backend existir
const MOCK_ALMOXARIFADOS = [
  {
    cod_almoxarifado: 1,
    nome: "Almoxarifado Central",
    email: "central@gilferreira.com.br",
    telefone: "(77) 3434-1010",
    endereco: {
      logradouro: "Av. Industrial",
      numero: "1500",
      bairro: "Distrito Industrial",
      cidade: "Caculé",
      estado: "BA",
      cep: "46300000"
    },
    ativo: 1
  },
  {
    cod_almoxarifado: 2,
    nome: "Almoxarifado Obra Norte",
    email: "obra.norte@gilferreira.com.br",
    telefone: "(77) 3434-2020",
    endereco: {
      logradouro: "Rua das Pedreiras",
      numero: "230",
      bairro: "Setor Norte",
      cidade: "Guanambi",
      estado: "BA",
      cep: "46430000"
    },
    ativo: 1
  },
  {
    cod_almoxarifado: 3,
    nome: "Almoxarifado Manutenção",
    email: "manutencao@gilferreira.com.br",
    telefone: "(77) 3434-3030",
    endereco: {
      logradouro: "Rua das Oficinas",
      numero: "88",
      bairro: "Centro",
      cidade: "Brumado",
      estado: "BA",
      cep: "46100000"
    },
    ativo: 1
  }
];

export default function AlmoxarifadosList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inactivating, setInactivating] = useState(false);
  const [error, setError] = useState("");

  // Estado dos filtros (controlled inputs).
  // Conforme RF014: filtros por nome, cidade ou e-mail.
  // (A especificação original cita "Data de Atualização, Fornecedor, Produto
  //  ou Nota Fiscal" — esses filtros fazem sentido na tela de DETALHES
  //  do almoxarifado, pois consultam os itens DENTRO dele. Aqui na
  //  listagem geral, faz mais sentido filtrar pelos dados do próprio
  //  almoxarifado, no mesmo padrão das telas de Funcionários e Fornecedores.)
  const [filtros, setFiltros] = useState({
    nome: "",
    cidade: ""
  });

  // Carrega a lista assim que a tela monta.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    carregarAlmoxarifados();
  }, []);

  // ── Função central de busca ──
  // Mesmo padrão do List.jsx de Fornecedores:
  // recebe filtros opcionais; se vazio, retorna tudo.
  function carregarAlmoxarifados(filtrosBusca = {}) {
    setError("");

    // TODO: substituir o bloco abaixo por fetch quando o backend existir.
    // const params = new URLSearchParams();
    // Object.entries(filtrosBusca).forEach(([k, v]) => {
    //   if (v && String(v).trim() !== "") params.append(k, String(v).trim());
    // });
    // const qs = params.toString();
    // fetch(`${API_URL}/almoxarifados${qs ? `?${qs}` : ""}`)
    //   .then(res => res.json())
    //   .then(result => { ... });

    // FILTRO LOCAL (apenas para a versão mockada):
    // Só lista os ativos (ativo === 1) e aplica os filtros informados.
    const filtrados = MOCK_ALMOXARIFADOS
      .filter(a => a.ativo === 1)
      .filter(a => {
        if (filtrosBusca.nome && !a.nome.toLowerCase().includes(filtrosBusca.nome.toLowerCase())) {
          return false;
        }
        if (filtrosBusca.cidade && !a.endereco.cidade.toLowerCase().includes(filtrosBusca.cidade.toLowerCase())) {
          return false;
        }
        return true;
      });

    // Formato esperado pelo ListTemplate: as CHAVES devem bater com
    // as strings passadas em `columns`. Por isso o map abaixo "renomeia"
    // os campos para que apareçam exatamente como queremos na tabela.
    const formatado = filtrados.map(a => ({
      "Nome": a.nome,
      "Cidade": `${a.endereco.cidade}/${a.endereco.estado}`,
      "Telefone": a.telefone,
      "Email": a.email,
      // Campo "oculto" prefixado com __ — não está em columns,
      // então o ListTemplate não exibe, mas posso recuperar nos
      // handlers de edit / inativar / clique.
      __id__: a.cod_almoxarifado
    }));

    setData(formatado);
  }

  // ── Handlers dos filtros ──
  function handleFiltroChange(campo, valor) {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  }

  function handleBuscar() {
    carregarAlmoxarifados(filtros);
  }

  // Permite buscar apertando Enter dentro de qualquer campo de filtro.
  // Pequeno detalhe de UX que economiza um clique do usuário a cada busca.
  function handleKeyDown(e) {
    if (e.key === "Enter") handleBuscar();
  }

  // ── Ações por linha ──

  // Clique na LINHA (não nos botões): abre a tela de detalhes.
  // Os botões usam stopPropagation, então não disparam este handler.
  function handleRowClick(item) {
    navigate(`/almoxarifados/${item.__id__}`);
  }

  function handleEdit(item) {
    navigate(`/almoxarifados/${item.__id__}/editar`);
  }

  function handleInactivateClick(item) {
    setSelectedItem(item);
    setOpenConfirm(true);
  }

  function handleConfirmInactivate() {
    setInactivating(true);
    setError("");

    // TODO: trocar por fetch DELETE quando o backend estiver pronto.
    // fetch(`${API_URL}/almoxarifados/${selectedItem.__id__}`, { method: "DELETE" })
    //   .then(res => res.json())
    //   .then(result => { ... });

    // Simulação de inativação local (mock):
    // Marca como inativo no array e recarrega a lista.
    const alvo = MOCK_ALMOXARIFADOS.find(a => a.cod_almoxarifado === selectedItem.__id__);
    if (alvo) alvo.ativo = 0;

    setTimeout(() => {
      carregarAlmoxarifados(filtros);
      setInactivating(false);
      setOpenConfirm(false);
      setSelectedItem(null);
    }, 300); // pequeno delay para simular latência de rede
  }

  function handleCloseConfirm() {
    setOpenConfirm(false);
    setSelectedItem(null);
  }

  return (
    <Container maxWidth="lg">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <ListTemplate
        title="Almoxarifados"
        columns={["Nome", "Cidade", "Telefone", "Email"]}
        data={data}
        onCreate={() => navigate("/almoxarifados/cadastro")}
        onEdit={handleEdit}
        onInactivate={handleInactivateClick}
        onSearch={handleBuscar}
        onRowClick={handleRowClick}
        filters={
          <>
            <TextField
              label="Nome"
              size="small"
              value={filtros.nome}
              onChange={(e) => handleFiltroChange("nome", e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <TextField
              label="Cidade"
              size="small"
              value={filtros.cidade}
              onChange={(e) => handleFiltroChange("cidade", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </>
        }
      />

      {/* Diálogo de confirmação de inativação (RF016).
          Mesmo padrão do List.jsx de Fornecedores: usa Dialog do MUI
          com um aviso explicando o efeito da ação. */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar Inativação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja inativar o almoxarifado <strong>{selectedItem?.Nome}</strong>?
            <br />
            Esta ação altera o status para "Inativo". O registro será mantido
            no sistema para fins de histórico e auditoria.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} disabled={inactivating}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmInactivate}
            color="warning"
            variant="contained"
            disabled={inactivating}
          >
            {inactivating ? "Inativando..." : "Inativar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
