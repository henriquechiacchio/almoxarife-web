import * as almoxarifadoRepo from "../repositories/almoxarifado.repository.js"
import { validarEmail } from "../utils/validations/email.validation.js"

const validarCamposObrigatorios = (dados) => {
  if (!dados.nome || !dados.email || !dados.telefone) {
    throw new Error("Campos obrigatórios: nome, email, telefone")
  }

  if (!dados.endereco) {
    throw new Error("Endereço é obrigatório")
  }

  const { cep, logradouro, numero, bairro, cidade, estado } = dados.endereco

  if (!cep || !logradouro || !numero || !bairro || !cidade || !estado) {
    throw new Error("Campos obrigatórios do endereço: cep, logradouro, numero, bairro, cidade, estado")
  }

  validarEmail(dados.email)
}

const normalizarFiltros = (filtros = {}) => {
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

export const editarAlmoxarifado = async (id, dados) => {
  const almoxarifado = await almoxarifadoRepo.buscarPorId(id)

  if (!almoxarifado) {
    throw new Error("Almoxarifado não encontrado")
  }

  validarCamposObrigatorios(dados)

  const emailExistente = await almoxarifadoRepo.buscarPorEmail(dados.email)
  if (
    emailExistente &&
    emailExistente.cod_almoxarifado !== parseInt(id)
  ) {
    throw new Error("Email já registrado no sistema")
  }

  await almoxarifadoRepo.atualizarEndereco(almoxarifado.id_endereco, {
    cep: dados.endereco.cep,
    logradouro: dados.endereco.logradouro,
    numero: dados.endereco.numero,
    bairro: dados.endereco.bairro,
    cidade: dados.endereco.cidade,
    estado: dados.endereco.estado
  })

  await almoxarifadoRepo.atualizar(id, {
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone
  })

  return await almoxarifadoRepo.buscarPorId(id)
}

export const inativarAlmoxarifado = async (id) => {
  const almoxarifado = await almoxarifadoRepo.buscarPorId(id)

  if (!almoxarifado) {
    throw new Error("Almoxarifado não encontrado")
  }

  return await almoxarifadoRepo.inativar(id)
}

export const cadastrarAlmoxarifado = async (dados) => {
  validarCamposObrigatorios(dados)

  const emailExistente = await almoxarifadoRepo.buscarPorEmail(dados.email)
  if (emailExistente) {
    throw new Error("Email já registrado no sistema")
  }

  const enderecoCriado = await almoxarifadoRepo.criarEndereco({
    cep: dados.endereco.cep,
    logradouro: dados.endereco.logradouro,
    numero: dados.endereco.numero,
    bairro: dados.endereco.bairro,
    cidade: dados.endereco.cidade,
    estado: dados.endereco.estado
  })

  const almoxarifadoCriado = await almoxarifadoRepo.criar({
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    id_endereco: enderecoCriado.id_endereco
  })

  return await almoxarifadoRepo.buscarPorId(almoxarifadoCriado.cod_almoxarifado)
}