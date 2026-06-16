-- População de dados mínima para todas as tabelas do banco
-- Use este script após criar o banco com CREATE_DB_ALMOXARIFADO_GILFER_v4.sql

-- Fornecedores
INSERT INTO Fornecedores (razao_social, nome_fantasia, cnpj, email)
VALUES
    ('Distribuidora Gilfer Ltda.', 'Gilfer Distribuidora', '12345678000199', 'contato@gilfer.com.br'),
    ('Fornecimentos Alfa S/A', 'Alfa Suprimentos', '98765432000188', 'vendas@alfasuprimentos.com');

INSERT INTO Telefone_Fornecedor (id_fornecedor, telefone)
VALUES
    (1, '+55 11 4002-8922'),
    (1, '+55 11 4002-8923'),
    (2, '+55 21 3030-4040');

INSERT INTO Endereco_Fornecedor (id_fornecedor, cep, logradouro, numero, complemento, bairro, cidade, estado)
VALUES
    (1, '01001000', 'Praça da Sé', '100', 'Sala 10', 'Sé', 'São Paulo', 'SP'),
    (2, '20040000', 'Rua da Assembleia', '250', NULL, 'Centro', 'Rio de Janeiro', 'RJ');

-- Cargos
INSERT INTO Cargos (nome_cargo)
VALUES
    ('ALMOXARIFE'),
    ('AUXILIAR');

-- Funcionarios
INSERT INTO Funcionarios (id_funcionario, nome, cpf, email, id_cargo)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Ana Pereira', '11122233344', 'ana.pereira@gilfer.com.br', 1),
    ('22222222-2222-2222-2222-222222222222', 'Bruno Souza', '55566677788', 'bruno.souza@gilfer.com.br', 2);

-- Usuarios do sistema
INSERT INTO Usuarios_Sistema (id_funcionario, password_hash, access_level, ultimo_login, bloqueado)
VALUES
    ('11111111-1111-1111-1111-111111111111', '$2y$12$abcdefghijklmnopqrstuv', 'ALMOXARIFE', NULL, 0),
    ('22222222-2222-2222-2222-222222222222', '$2y$12$qrstuvwxyzabcdef1234', 'AUXILIAR', NULL, 0);

-- Produtos
INSERT INTO Produtos (nome, descricao, preco_custo, unidade_medida, estoque_minimo, estoque_maximo)
VALUES
    ('Parafuso 5mm', 'Parafuso zincado', 0.1200, 'PC', 10.000, 200.000),
    ('Álcool 70%', 'Álcool em gel 70% 500ml', 5.5000, 'LT', 5.000, 50.000);

INSERT INTO Produto_Fornecedor (id_produto, id_fornecedor, preco_negociado)
VALUES
    (1, 1, 0.1000),
    (2, 2, 5.2500);

-- Endereços de almoxarifado
INSERT INTO Endereco_Almoxarifado (logradouro, numero, bairro, cidade, estado, cep)
VALUES
    ('Avenida Paulista', '1500', 'Bela Vista', 'São Paulo', 'SP', '01310100'),
    ('Rua Júlio de Castilhos', '770', 'Centro', 'Porto Alegre', 'RS', '90020000');

-- Almoxarifados
INSERT INTO Almoxarifado (nome, email, id_endereco)
VALUES
    ('Almoxarifado Central', 'central@gilfer.com.br', 1),
    ('Almoxarifado Sul', 'sul@gilfer.com.br', 2);

INSERT INTO Telefone_Almoxarifado (cod_almoxarifado, telefone)
VALUES
    (1, '+55 11 3333-4444'),
    (1, '+55 11 3333-4445'),
    (2, '+55 51 9999-0000');

INSERT INTO Gestao_Almoxarifado (id_funcionario, cod_almoxarifado)
VALUES
    ('11111111-1111-1111-1111-111111111111', 1),
    ('22222222-2222-2222-2222-222222222222', 2);

-- Estoque
INSERT INTO Estoque (id_produto, cod_almoxarifado, quantidade)
VALUES
    (1, 1, 150.000),
    (2, 2, 30.000);

-- Saídas
INSERT INTO Saida (cod_almoxarifado_origem, id_funcionario_responsavel, tipo_saida, cod_almoxarifado_destino, observacao)
VALUES
    (1, '11111111-1111-1111-1111-111111111111', 'CONSUMO', NULL, 'Retirada interna para manutenção'),
    (1, '22222222-2222-2222-2222-222222222222', 'TRANSFERENCIA', 2, 'Transferência para almoxarifado Sul');

INSERT INTO Saida_Item (id_saida, id_produto, quantidade)
VALUES
    (1, 1, 20.000),
    (2, 2, 10.000);

-- Compras
INSERT INTO Compra (id_fornecedor, id_funcionario_comprador, cod_almoxarifado_destino, status_pedido, numero_nota_fiscal, valor_total_pedido)
VALUES
    (1, '11111111-1111-1111-1111-111111111111', 1, 'RECEBIDO', 'NF123456', 25.0000),
    (2, '22222222-2222-2222-2222-222222222222', 2, 'PENDENTE', 'NF987654', 52.5000);

INSERT INTO Item_Compra (id_compra, id_produto, quantidade, preco_unitario_acordado)
VALUES
    (1, 1, 200.000, 0.1000),
    (2, 2, 10.000, 5.2500);
