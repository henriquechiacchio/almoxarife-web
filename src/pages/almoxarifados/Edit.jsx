import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Alert,
  IconButton,
  Divider,
  Grid,
  Box,
  CircularProgress
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import FormPageHeader from "../../components/FormPageHeader";
import EnderecoFields from "../../components/EnderecoFields";

/**
 * Tela de Edição de Almoxarifado (RF015).
 *
 * DIFERENÇAS EM RELAÇÃO AO Form.jsx (cadastro)
 * ---------------------------------------------
 * 1. Lê o `id` da URL via `useParams()` (rota /almoxarifados/:id/editar).
 * 2. Tem um `useEffect` inicial que CARREGA os dados existentes e
 *    pré-preenche o formulário (sem isso o usuário começaria com
 *    tudo em branco e teria que digitar tudo de novo).
 * 3. Tem state `loading` para mostrar spinner enquanto carrega.
 * 4. No submit, usa PUT (atualizar) em vez de POST (criar).
 *
 * POR QUE NÃO MERGEAR Form + Edit EM UM SÓ ARQUIVO?
 * --------------------------------------------------
 * Tecnicamente daria — é só ter um `if (id) carrega() else iniciaVazio()`.
 * Mas a equipe já adotou o padrão "Form.jsx" + "Edit.jsx" separados
 * (ver pasta fornecedores/). Seguir o padrão existente é mais importante
 * que economizar duplicação aqui. Quando ALGUÉM da equipe abrir o
 * projeto pela primeira vez, vai esperar ver os 2 arquivos. Surpresa =
 * fricção cognitiva. Consistência > "DRY a qualquer custo".
 *
 * RF015 — campos editáveis: Nome, Endereço, Telefone, E-mail
 * (todos os 4 estão presentes neste form).
 */

// TODO: ativar quando o backend de almoxarifados estiver pronto
// const API_URL = "http://localhost:5000/api";

const enderecoVazio = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: ""
};

// MOCK: este mock SOMENTE para o Edit funcionar sem backend.
// Quando o backend existir, este objeto vira a resposta do
// GET /api/almoxarifados/:id. Os dados aqui espelham os mocks do
// List.jsx e do Detalhes.jsx para que a navegação faça sentido.
const MOCK_ALMOXARIFADOS = {
  1: {
    cod_almoxarifado: 1,
    nome: "Almoxarifado Central",
    email: "central@gilferreira.com.br",
    telefones: ["(77) 3434-1010"],
    endereco: {
      cep: "46300000",
      logradouro: "Av. Industrial",
      numero: "1500",
      complemento: "",
      bairro: "Distrito Industrial",
      cidade: "Caculé",
      estado: "BA"
    }
  },
  2: {
    cod_almoxarifado: 2,
    nome: "Almoxarifado Obra Norte",
    email: "obra.norte@gilferreira.com.br",
    telefones: ["(77) 3434-2020"],
    endereco: {
      cep: "46430000",
      logradouro: "Rua das Pedreiras",
      numero: "230",
      complemento: "",
      bairro: "Setor Norte",
      cidade: "Guanambi",
      estado: "BA"
    }
  },
  3: {
    cod_almoxarifado: 3,
    nome: "Almoxarifado Manutenção",
    email: "manutencao@gilferreira.com.br",
    telefones: ["(77) 3434-3030"],
    endereco: {
      cep: "46100000",
      logradouro: "Rua das Oficinas",
      numero: "88",
      complemento: "",
      bairro: "Centro",
      cidade: "Brumado",
      estado: "BA"
    }
  }
};

export default function AlmoxarifadoEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({ nome: "", email: "" });
  const [telefones, setTelefones] = useState([""]);
  const [endereco, setEndereco] = useState({ ...enderecoVazio });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Carrega os dados do almoxarifado ao abrir a tela ou trocar de :id.
  // Por que `[id]` na dependência? Porque se o usuário navegar entre
  // /almoxarifados/1/editar e /almoxarifados/2/editar SEM voltar antes,
  // o componente NÃO desmonta — só o param muda. Sem `[id]` o useEffect
  // não roda de novo e o usuário continuaria vendo dados antigos.
  useEffect(() => {
    setLoading(true);
    setError("");

    // TODO: substituir por fetch quando o backend existir.
    // fetch(`${API_URL}/almoxarifados/${id}`)
    //   .then(res => res.json())
    //   .then(result => {
    //     if (result.sucesso) {
    //       const a = result.dados;
    //       setForm({ nome: a.nome, email: a.email });
    //       setTelefones(a.telefones?.length ? a.telefones.map(t => t.telefone) : [""]);
    //       setEndereco(a.endereco || { ...enderecoVazio });
    //     } else {
    //       setError("Almoxarifado não encontrado");
    //     }
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setError("Erro ao carregar: " + err.message);
    //     setLoading(false);
    //   });

    // Simulação local (mock)
    const found = MOCK_ALMOXARIFADOS[id];
    if (!found) {
      setError("Almoxarifado não encontrado.");
      setLoading(false);
      return;
    }

    setForm({ nome: found.nome, email: found.email });
    setTelefones(found.telefones.length ? found.telefones : [""]);
    setEndereco(found.endereco);
    setLoading(false);
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // === Telefones ===
  function handleTelefoneChange(index, value) {
    const novos = [...telefones];
    novos[index] = value;
    setTelefones(novos);
  }
  function adicionarTelefone() {
    setTelefones([...telefones, ""]);
  }
  function removerTelefone(index) {
    if (telefones.length === 1) return;
    setTelefones(telefones.filter((_, i) => i !== index));
  }

  // === Endereço único ===
  function handleEnderecoChange(_index, campo, valor) {
    setEndereco(prev => ({ ...prev, [campo]: valor }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const telefonesValidos = telefones.filter(t => t.trim() !== "");
    if (telefonesValidos.length === 0) {
      setError("Informe ao menos um telefone para contato.");
      setSaving(false);
      return;
    }

    const dados = {
      ...form,
      telefones: telefonesValidos,
      endereco
    };

    // TODO: trocar por fetch PUT quando o backend existir.
    // Repare: aqui é PUT (atualiza), não POST (cria).
    // fetch(`${API_URL}/almoxarifados/${id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(dados)
    // })
    //   .then(res => res.json())
    //   .then(result => {
    //     if (result.sucesso) navigate("/almoxarifados");
    //     else setError(result.erro || "Erro ao atualizar almoxarifado");
    //     setSaving(false);
    //   })
    //   .catch(err => {
    //     setError("Erro ao atualizar: " + err.message);
    //     setSaving(false);
    //   });

    // Simulação local (mock) — só loga e volta.
    console.log(`Almoxarifado #${id} atualizado:`, dados);
    setTimeout(() => {
      setSaving(false);
      navigate("/almoxarifados");
    }, 400);
  }

  // Loading state — evita mostrar o form vazio enquanto os dados não
  // chegaram (UX ruim: o usuário acharia que está sem dados).
  if (loading) {
    return (
      <Container maxWidth="lg">
        <FormPageHeader title="Carregando..." backTo="/almoxarifados" />
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Erro fatal de carregamento (almoxarifado não existe). Não mostra
  // formulário, só a mensagem + botão voltar (já incluso no header).
  if (error && !form.nome) {
    return (
      <Container maxWidth="lg">
        <FormPageHeader title="Editar Almoxarifado" backTo="/almoxarifados" />
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <FormPageHeader
        title="Editar Almoxarifado"
        subtitle={`Atualizando os dados de "${form.nome}"`}
        backTo="/almoxarifados"
      />

      <Paper sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
        {/* Alerta para erros de SUBMIT (após o form já estar carregado).
            Diferente do alerta de erro fatal acima — aqui o form continua
            visível para o usuário corrigir e tentar de novo. */}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          {/* === Dados principais === */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Dados do almoxarifado
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <TextField
                name="nome"
                label="Nome"
                value={form.nome}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* === Telefones === */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Telefones
            </Typography>
            <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={adicionarTelefone}>
              Adicionar
            </Button>
          </Box>

          <Stack spacing={1.5}>
            {telefones.map((tel, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  label={`Telefone ${i + 1}`}
                  value={tel}
                  onChange={(e) => handleTelefoneChange(i, e.target.value)}
                  required={i === 0}
                />
                <IconButton
                  color="error"
                  onClick={() => removerTelefone(i)}
                  disabled={telefones.length === 1}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* === Endereço único === */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
            Endereço
          </Typography>

          <EnderecoFields
            endereco={endereco}
            index={0}
            onChange={handleEnderecoChange}
          />

          {/* === Ações === */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate(-1)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
