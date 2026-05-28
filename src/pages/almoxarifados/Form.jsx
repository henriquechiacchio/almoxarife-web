import { useState } from "react";
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
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import FormPageHeader from "../../components/FormPageHeader";
import EnderecoFields from "../../components/EnderecoFields";

/**
 * Tela de Cadastro de Almoxarifado (RF013).
 *
 * COMO ESTA TELA SE COMPARA AO FORM DE FORNECEDOR?
 * -------------------------------------------------
 * O Form de Fornecedor permite N endereços (lista) porque uma empresa
 * pode ter sede + filiais. No SQL real, a tabela `Almoxarifado` tem
 * APENAS 1 chave estrangeira `id_endereco` — porque cada almoxarifado
 * é UM lugar físico único. Logo:
 *
 *   - 1 único bloco de endereço (sem botão "adicionar endereço")
 *   - Mas N telefones (mesmo padrão do fornecedor — ramal, celular, etc.)
 *
 * CAMPOS OBRIGATÓRIOS (RF013):
 *   - nome (obrigatório)
 *   - endereço (obrigatório)
 *   - telefone (obrigatório — ao menos 1)
 *   - email (vem do SQL: NOT NULL)
 *
 * FLUXOS DE EXCEÇÃO MAPEADOS NO RF013:
 *   - Campos obrigatórios não preenchidos → mensagem padrão
 *   - Nome já existente → "Nome já registrado."
 *   - Telefone inválido → "Telefone inválido."
 *
 * Essas validações ficam no backend (regra de negócio). Aqui no front
 * só fazemos as validações nativas de HTML (`required`) e exibimos o
 * erro retornado pela API.
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

export default function AlmoxarifadoForm() {
  const navigate = useNavigate();

  // Estado dos dados principais (escalares).
  // Mantenho `form` separado de `telefones` e `endereco` porque cada um
  // tem uma "forma" diferente: form é objeto plano, telefones é array,
  // endereco é objeto. Misturar tudo num state só complica os updates.
  const [form, setForm] = useState({
    nome: "",
    email: ""
  });

  // Array de telefones — começa com um item vazio.
  // RF013 diz "telefone (obrigatório)" no singular, mas como o padrão
  // do projeto (Fornecedor) usa array, mantemos consistência.
  const [telefones, setTelefones] = useState([""]);

  // Único endereço (não é array, conforme o SQL).
  const [endereco, setEndereco] = useState({ ...enderecoVazio });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // === Telefones (mesmo padrão do FornecedorForm) ===
  function handleTelefoneChange(index, value) {
    const novos = [...telefones];
    novos[index] = value;
    setTelefones(novos);
  }
  function adicionarTelefone() {
    setTelefones([...telefones, ""]);
  }
  function removerTelefone(index) {
    if (telefones.length === 1) return; // impede ficar com 0 telefones
    setTelefones(telefones.filter((_, i) => i !== index));
  }

  // === Endereço único ===
  // O EnderecoFields espera assinatura (index, campo, valor) porque foi
  // feito para arrays. Como aqui só temos 1, ignoramos o index e
  // atualizamos direto o objeto único.
  function handleEnderecoChange(_index, campo, valor) {
    setEndereco(prev => ({ ...prev, [campo]: valor }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Filtra telefones vazios antes de enviar (usuário pode ter clicado
    // "adicionar" e não preenchido). Se sobrar 0, é erro do usuário.
    const telefonesValidos = telefones.filter(t => t.trim() !== "");
    if (telefonesValidos.length === 0) {
      setError("Informe ao menos um telefone para contato.");
      setSaving(false);
      return;
    }

    const dados = {
      ...form,
      telefones: telefonesValidos,
      endereco // objeto único (não array)
    };

    // TODO: trocar por fetch POST quando o backend existir.
    // fetch(`${API_URL}/almoxarifados`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(dados)
    // })
    //   .then(res => res.json())
    //   .then(result => {
    //     if (result.sucesso) navigate("/almoxarifados");
    //     else setError(result.erro || "Erro ao cadastrar almoxarifado");
    //     setSaving(false);
    //   })
    //   .catch(err => {
    //     setError("Erro ao cadastrar: " + err.message);
    //     setSaving(false);
    //   });

    // Simulação local (mock) — só loga e navega de volta.
    console.log("Almoxarifado a cadastrar:", dados);
    setTimeout(() => {
      setSaving(false);
      navigate("/almoxarifados");
    }, 400);
  }

  return (
    <Container maxWidth="lg">
      <FormPageHeader
        title="Cadastrar Almoxarifado"
        subtitle="Preencha os dados do novo almoxarifado."
        backTo="/almoxarifados"
      />

      <Paper sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
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
                helperText="Ex.: Almoxarifado Central, Almoxarifado Obra Norte"
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
                  required={i === 0} // pelo menos o primeiro é obrigatório
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

          {/* === Endereço (único) ===
              Não passo `onRemove` ao EnderecoFields porque almoxarifado
              tem 1 endereço só. O componente já sabe esconder o botão
              de remover quando essa prop não é fornecida (ver
              EnderecoFields.jsx: `{onRemove && (...)}`). */}
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
