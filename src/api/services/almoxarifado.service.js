import * as almoxarifadoRepo from "../repositories/almoxarifado.repository.js"

// ──────────────────────────────────────────────────────────────
// Validacao de campos obrigatorios.
// Agora `telefones` e um ARRAY (>= 1 telefone). O endereco precisa
// dos campos que a tabela Endereco_Almoxarifado exige (sem complemento,
// que nao existe nessa tabela).
// ──────────────────────────────────────────────────────────────
function validarCamposObrigatorios(dados) {
  if (!dados.nome || !String(dados.nome).trim()) {
    throw new Error("O nome do almoxarifado é obrigatório")
  }
  if (!dados.email || !String(dados.email).trim()) {
    throw new Error("O email é obrigatório")
  }

  const telefonesValidos = Array.isArray(dados.telefones)
    ? dados.telefones.filter(t => String(t).trim() !== "")
    : []
  if (telefonesValidos.length === 0) {
    throw new Error("Informe ao menos um telefone para contato")
  }

  if (!dados.endereco) {
    throw new Error("O endereço é obrigatório")
  }
  const e = dados.endereco
  for (const campo of ["cep", "logradouro", "numero", "bairro", "cidade", "estado"]) {
    if (!e[campo] || !String(e[campo]).trim()) {
      throw new Error(`O campo de endereço "${campo}" é obrigatório`)
    }
  }
}

// Remove espacos e descarta telefones vazios; sempre retorna array de strings.
function normalizarTelefones(telefones) {
  return (telefones || [])
    .map(t => (typeof t === "string" ? t.trim() : String(t?.telefone || "").trim()))
    .filter(t => t !== "")
}

function normalizarFiltros(filtros = {}) {
  const limpos = {}
  const trim = (v) => (typeof v === "string" ? v.trim() : v)

  if (trim(filtros.nome)) limpos.nome = trim(filtros.nome)
  if (trim(filtros.email)) limpos.email = trim(filtros.email)
  if (trim(filtros.telefone)) limpos.telefone = trim(filtros.telefone)
  if (trim(filtros.cidade)) limpos.cidade = trim(filtros.cidade)
  if (trim(filtros.estado)) limpos.estado = trim(filtros.estado)

  return limpos
}

export const listarAlmoxarifados = async (filtros = {}) => {
  const filtrosLimpos = normalizarFiltros(filtros)
  return await almoxarifadoRepo.listarTodos(filtrosLimpos)
}

export const buscarAlmoxarifadoPorId = async (id) => {
  const almoxarifado = await almoxarifadoRepo.buscarPorId(id)

  if (!almoxarifado) {
    throw new Error("Almoxarifado não encontrado")
  }

  return almoxarifado
}

export const cadastrarAlmoxarifado = async (dados) => {
  validarCamposObrigatorios(dados)

  const emailExistente = await almoxarifadoRepo.buscarPorEmail(dados.email)
  if (emailExistente) {
    throw new Error("Email já registrado no sistema")
  }

  // 1) Cria o endereco (tabela independente, criada antes do almoxarifado).
  const enderecoCriado = await almoxarifadoRepo.criarEndereco({
    cep: dados.endereco.cep,
    logradouro: dados.endereco.logradouro,
    numero: dados.endereco.numero,
    bairro: dados.endereco.bairro,
    cidade: dados.endereco.cidade,
    estado: dados.endereco.estado
  })

  // 2) Cria o almoxarifado + telefones de uma vez (include no repository).
  const telefones = normalizarTelefones(dados.telefones)
  const almoxarifadoCriado = await almoxarifadoRepo.criar({
    nome: dados.nome,
    email: dados.email,
    id_endereco: enderecoCriado.id_endereco,
    telefones: telefones.map(t => ({ telefone: t }))
  })

  return await almoxarifadoRepo.buscarPorId(almoxarifadoCriado.cod_almoxarifado)
}

export const editarAlmoxarifado = async (id, dados) => {
  const almoxarifado = await almoxarifadoRepo.buscarPorId(id)
  if (!almoxarifado) {
    throw new Error("Almoxarifado não encontrado")
  }

  validarCamposObrigatorios(dados)

  const emailExistente = await almoxarifadoRepo.buscarPorEmail(dados.email)
  if (emailExistente && emailExistente.cod_almoxarifado !== parseInt(id)) {
    throw new Error("Email já registrado no sistema")
  }

  // Atualiza o endereco vinculado.
  await almoxarifadoRepo.atualizarEndereco(almoxarifado.id_endereco, {
    cep: dados.endereco.cep,
    logradouro: dados.endereco.logradouro,
    numero: dados.endereco.numero,
    bairro: dados.endereco.bairro,
    cidade: dados.endereco.cidade,
    estado: dados.endereco.estado
  })

  // Atualiza os dados principais.
  await almoxarifadoRepo.atualizar(id, {
    nome: dados.nome,
    email: dados.email
  })

  // Substitui todos os telefones (apaga os antigos e grava os novos).
  await almoxarifadoRepo.substituirTelefones(id, normalizarTelefones(dados.telefones))

  return await almoxarifadoRepo.buscarPorId(id)
}

export const inativarAlmoxarifado = async (id) => {
  const almoxarifado = await almoxarifadoRepo.buscarPorId(id)
  if (!almoxarifado) {
    throw new Error("Almoxarifado não encontrado")
  }

  return await almoxarifadoRepo.inativar(id)
}
