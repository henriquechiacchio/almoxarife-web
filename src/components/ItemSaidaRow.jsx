import { Stack, TextField, MenuItem, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

/**
 * Uma linha de item da saida: seletor de Produto + Quantidade + botao remover.
 *
 * Por que existe (mesma logica do EnderecoFields):
 *   tanto Form quanto Edit de Saida renderizam essa mesma linha. Extrair
 *   evita duplicar os campos nos dois arquivos — manutencao em 1 lugar.
 *
 * Props:
 *   - item:        { id_produto, quantidade }
 *   - index:       posicao no array de itens
 *   - produtos:    lista para o select [{ id_produto, nome }]
 *   - onChange:    callback (index, campo, valor)
 *   - onRemove:    callback (index)
 *   - disableRemove: desabilita o botao quando ha so 1 item
 */
export default function ItemSaidaRow({
  item,
  index,
  produtos,
  onChange,
  onRemove,
  disableRemove
}) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
      <TextField
        select
        size="small"
        value={item.id_produto}
        onChange={(e) => onChange(index, "id_produto", e.target.value)}
        required
        SelectProps={{ displayEmpty: true }}
        sx={{ width: { xs: "100%", sm: "60%" } }}
      >
        <MenuItem value="" disabled>
          Produto
        </MenuItem>
        {produtos.map((p) => (
          <MenuItem key={p.id_produto} value={p.id_produto}>
            {p.nome}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        label="Quantidade"
        type="number"
        value={item.quantidade}
        onChange={(e) => onChange(index, "quantidade", e.target.value)}
        required
        // DECIMAL(10,3) no banco => permite ate 3 casas decimais e impede negativo.
        inputProps={{ min: 0, step: "1" }}
        sx={{ width: { xs: "100%", sm: "30%" } }}
      />

      <IconButton
        color="error"
        onClick={() => onRemove(index)}
        disabled={disableRemove}
      >
        <RemoveCircleOutlineIcon />
      </IconButton>
    </Stack>
  );
}
