import db from "../models/index.js"
import { Op } from "sequelize"

const Almoxarifado = db.Almoxarifado
const EnderecoAlmoxarifado = db.EnderecoAlmoxarifado

export async function criar(dados) {
    return await Almoxarifado.create(dados)
}

export async function listarTodos(filtros = {}) {
    const where = { ativo: 1 }
    const include = [
        { model: EnderecoAlmoxarifado, as: "endereco" }
    ]

    if (filtros.nome) {
        where.nome = { [Op.like]: `%${filtros.nome}%` }
    }

    if (filtros.email) {
        where.email = { [Op.like]: `%${filtros.email}%` }
    }

    if (filtros.telefone) {
        where.telefone = { [Op.like]: `%${filtros.telefone}%` }
    }

    if (filtros.cidade) {
        include[0].where = {
            ...(include[0].where || {}),
            cidade: { [Op.like]: `%${filtros.cidade}%` }
        }
    }

    if (filtros.estado) {
        include[0].where = {
            ...(include[0].where || {}),
            estado: { [Op.like]: `%${filtros.estado}%` }
        }
    }

    return await Almoxarifado.findAll({
        where,
        include,
        order: [["nome", "ASC"]]
    })
}

export async function criarEndereco(dadosEndereco) {
    return await EnderecoAlmoxarifado.create(dadosEndereco)
}

export async function atualizarEndereco(id, dadosEndereco) {
    await EnderecoAlmoxarifado.update(dadosEndereco, {
        where: { id_endereco: id }
    })

    return await EnderecoAlmoxarifado.findByPk(id)
}

export async function buscarPorId(id) {
    return await Almoxarifado.findByPk(id, {
        include: includeAll
    })
}

export async function buscarPorEmail(email) {
    return await Almoxarifado.findOne({
        where: { email }
    })
}

export async function atualizar(id, dados) {
    await Almoxarifado.update(dados, {
        where: { cod_almoxarifado: id }
    })

    return await buscarPorId(id)
}

export async function inativar(id) {
    const almoxarifado = await Almoxarifado.findByPk(id)

    if (almoxarifado && almoxarifado.ativo === 0) {
        throw new Error("Almoxarifado já está inativo")
    }

    return await Almoxarifado.update(
        { ativo: 0 },
        { where: { cod_almoxarifado: id } }
    )
}