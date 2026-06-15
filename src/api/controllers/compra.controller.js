import * as compraService from "../services/compra.service.js"

export const listar = async (req, res) => {
  try {
    const { data, numero_nota_fiscal, fornecedor, produto, status } = req.query
    const dados = await compraService.listarCompras({ data, numero_nota_fiscal, fornecedor, produto, status })

    res.json({
      sucesso: true,
      dados,
      total: dados.length
    })
  } catch (erro) {
    res.status(400).json({ sucesso: false, erro: erro.message })
  }
}

export const buscarPorId = async (req, res) => {
  try {
    const dados = await compraService.buscarCompraPorId(req.params.id)
    res.json({ sucesso: true, dados })
  } catch (erro) {
    res.status(404).json({ sucesso: false, erro: erro.message })
  }
}

export const cadastrar = async (req, res) => {
  console.log("DADOS RECEBIDOS:", req.body);
  try {
    const dados = await compraService.cadastrarCompra(req.body)
    res.status(201).json({
      sucesso: true,
      mensagem: "Compra registrada com sucesso!",
      dados
    })
  } catch (erro) {
    res.status(400).json({ sucesso: false, erro: erro.message })
  }
}

export const editar = async (req, res) => {
  try {
    const dados = await compraService.editarCompra(req.params.id, req.body)
    res.json({
      sucesso: true,
      mensagem: "Operação realizada com sucesso!",
      dados
    })
  } catch (erro) {
    const status = erro.message.includes("Nenhum pedido encontrado") ? 404 : 400
    res.status(status).json({ sucesso: false, erro: erro.message })
  }
}

export const excluir = async (req, res) => {
  try {
    await compraService.excluirCompra(req.params.id)
    res.json({ sucesso: true, mensagem: "Compra excluída com sucesso!" })
  } catch (erro) {
    const status = erro.message.includes("Nenhum pedido encontrado") ? 404 : 400
    res.status(status).json({ sucesso: false, erro: erro.message })
  }
}
