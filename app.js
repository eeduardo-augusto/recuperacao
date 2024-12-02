const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let clientes = [];
let carros = [];
let servicos = [];
let agendamentos = [];

const generateId = (array) => (array.length ? array[array.length - 1].id + 1 : 1);

const validateCodigo = (codigo, res) => {
  if (codigo <= 0) {
    return res.status(400).json({ mensagem: "'codigo' deve ser maior que 0" });
  }
};

app.get("/clientes", (req, res) => {
  res.status(200).json(clientes);
});

app.post("/clientes", (req, res) => {
  const { nome, telefone } = req.body;

  if (!nome || nome.length < 3) {
    return res.status(400).json({ mensagem: "'nome' deve conter no mínimo 3 caracteres" });
  }
  if (nome.length > 150) {
    return res.status(400).json({ mensagem: "'nome' deve conter no máximo 150 caracteres" });
  }
  if (!telefone || telefone.length !== 11 || isNaN(telefone)) {
    return res
      .status(400)
      .json({ mensagem: "'telefone' deve conter exatamente 11 dígitos e ser composto apenas por números" });
  }

  const novoCliente = {
    id: generateId(clientes),
    nome,
    telefone, 
  };

  clientes.push(novoCliente);
  res.status(201).json({ mensagem: "Cliente cadastrado com sucesso" });
});

app.get("/clientes/:codigo", (req, res) => {
  const codigo = parseInt(req.params.codigo);
  validateCodigo(codigo, res);

  const cliente = clientes.find((c) => c.id === codigo);
  if (!cliente) {
    return res.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  res.status(200).json(cliente);
});

app.put("/clientes/:codigo", (req, res) => {
  const codigo = parseInt(req.params.codigo);
  validateCodigo(codigo, res);

  const { nome, telefone } = req.body;
  if (nome && (nome.length < 3 || nome.length > 150)) {
    return res
      .status(400)
      .json({ mensagem: nome.length < 3 ? "'nome' deve conter no mínimo 3 caracteres" : "'nome' deve conter no máximo 150 caracteres" });
  }
  if (telefone && (telefone.length !== 11 || isNaN(telefone))) {
    return res
      .status(400)
      .json({ mensagem: "'telefone' deve conter exatamente 11 dígitos e ser composto apenas por números" });
  }

  const clienteIndex = clientes.findIndex((c) => c.id === codigo);
  if (clienteIndex === -1) {
    return res.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  clientes[clienteIndex] = { id: codigo, nome: nome || clientes[clienteIndex].nome, telefone: telefone || clientes[clienteIndex].telefone };
  res.status(200).json({ mensagem: "Cliente atualizado com sucesso" });
});

app.delete("/clientes/:codigo", (req, res) => {
  const codigo = parseInt(req.params.codigo);
  validateCodigo(codigo, res);

  const clienteIndex = clientes.findIndex((c) => c.id === codigo);
  if (clienteIndex === -1) {
    return res.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  clientes.splice(clienteIndex, 1);
  res.status(200).json({ mensagem: "Cliente removido com sucesso" });
});

const PORT = 3000;
const suaVariavelApi = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/carros', (req, res) => {
  res.json(carros);
});

app.post('/carros', (req, res) => {
  const { marca, modelo, tamanho, id_cliente } = req.body;

  if (!marca || marca.length < 3 || marca.length > 50) {
    return res.status(400).json({ mensagem: "'marca' deve conter no mínimo 3 e no máximo 50 caracteres" });
  }
  if (!modelo || modelo.length < 2 || modelo.length > 50) {
    return res.status(400).json({ mensagem: "'modelo' deve conter no mínimo 2 e no máximo 50 caracteres" });
  }
  if (!["HATCH", "SEDAN", "SUV", "PICAPE"].includes(tamanho)) {
    return res.status(400).json({ mensagem: "'tamanho' deve ser HATCH, SEDAN, SUV ou PICAPE" });
  }
  if (!id_cliente || !clientes.some(cliente => cliente.id === id_cliente)) {
    return res.status(400).json({ mensagem: "'id_cliente' não corresponde a um cliente cadastrado" });
  }

  const novoCarro = {
    id: carros.length + 1,
    marca,
    modelo,
    tamanho,
    id_cliente
  };

  carros.push(novoCarro);
  res.status(201).json({ mensagem: "Carro cadastrado com sucesso" });
});

app.get('/carros/:codigo', (req, res) => {
  const carro = carros.find(c => c.id === parseInt(req.params.codigo));
  if (!carro) {
    return res.status(404).json({ mensagem: "Carro não encontrado" });
  }
  res.json(carro);
});

app.put('/carros/:codigo', (req, res) => {
  const { marca, modelo, tamanho, id_cliente } = req.body;
  const codigo = parseInt(req.params.codigo);
  const carroIndex = carros.findIndex(c => c.id === codigo);

  if (carroIndex === -1) {
    return res.status(404).json({ mensagem: "Carro não encontrado" });
  }
  if (!marca || marca.length < 3 || marca.length > 50) {
    return res.status(400).json({ mensagem: "'marca' deve conter no mínimo 3 e no máximo 50 caracteres" });
  }
  if (!modelo || modelo.length < 2 || modelo.length > 50) {
    return res.status(400).json({ mensagem: "'modelo' deve conter no mínimo 2 e no máximo 50 caracteres" });
  }
  if (!["HATCH", "SEDAN", "SUV", "PICAPE"].includes(tamanho)) {
    return res.status(400).json({ mensagem: "'tamanho' deve ser HATCH, SEDAN, SUV ou PICAPE" });
  }
  if (!id_cliente || !clientes.some(cliente => cliente.id === id_cliente)) {
    return res.status(400).json({ mensagem: "'id_cliente' não corresponde a um cliente cadastrado" });
  }

  carros[carroIndex] = { id: codigo, marca, modelo, tamanho, id_cliente };
  res.json({ mensagem: "Carro Atualizado com sucesso" });
});

app.delete('/carros/:codigo', (req, res) => {
  const codigo = parseInt(req.params.codigo);
  const carroIndex = carros.findIndex(c => c.id === codigo);

  if (carroIndex === -1) {
    return res.status(404).json({ mensagem: "Carro não encontrado" });
  }

  carros.splice(carroIndex, 1);
  res.json({ mensagem: "Carro removido com sucesso" });
});

app.get('/servicos', (req, res) => {
  res.json(servicos);
});

app.post('/servicos', (req, res) => {
  const { descricao, valores } = req.body;

  if (!descricao || descricao.length < 5 || descricao.length > 100) {
    return res.status(400).json({ mensagem: "'descricao' deve conter no mínimo 5 e no máximo 100 caracteres" });
  }
  for (const valor of valores) {
    if (valor.valor < 0) {
      return res.status(400).json({ mensagem: `O valor para '${valor.tamanho}' deve ser igual ou maior que 0` });
    }
  }

  const novoServico = {
    id: servicos.length + 1,
    descricao,
    valores
  };

  servicos.push(novoServico);
  res.status(201).json({ mensagem: "Serviço cadastrado com sucesso" });
});

app.get('/servicos/:codigo', (req, res) => {
  const servico = servicos.find(s => s.id === parseInt(req.params.codigo));
  if (!servico) {
    return res.status(404).json({ mensagem: "Serviço não encontrado" });
  }
  res.json(servico);
});

app.put('/servicos/:codigo', (req, res) => {
  const { descricao, valores } = req.body;
  const codigo = parseInt(req.params.codigo);
  const servicoIndex = servicos.findIndex(s => s.id === codigo);

  if (servicoIndex === -1) {
    return res.status(404).json({ mensagem: "Serviço não encontrado" });
  }
  if (!descricao || descricao.length < 5 || descricao.length > 100) {
    return res.status(400).json({ mensagem: "'descricao' deve conter no mínimo 5 e no máximo 100 caracteres" });
  }
  for (const valor of valores) {
    if (valor.valor < 0) {
      return res.status(400).json({ mensagem: `O valor para '${valor.tamanho}' deve ser igual ou maior que 0` });
    }
  }

  servicos[servicoIndex] = { id: codigo, descricao, valores };
  res.json({ mensagem: "Serviço atualizado com sucesso" });
});

app.delete('/servicos/:codigo', (req, res) => {
  const codigo = parseInt(req.params.codigo);
  const servicoIndex = servicos.findIndex(s => s.id === codigo);

  if (servicoIndex === -1) {
    return res.status(404).json({ mensagem: "Serviço não encontrado" });
  }

  servicos.splice(servicoIndex, 1);
  res.json({ mensagem: "Serviço removido com sucesso" });
});

app.get('/agendamentos', (req, res) => {
  res.json(agendamentos);
});

app.post('/agendamentos', (req, res) => {
  const { id_carro, id_servico, data_hora } = req.body;

  if (!id_carro || !carros.some(carro => carro.id === id_carro)) {
    return res.status(400).json({ mensagem: "'id_carro' não corresponde a um carro cadastrado" });
  }
  if (!id_servico || !servicos.some(servico => servico.id === id_servico)) {
    return res.status(400).json({ mensagem: "'id_servico' não corresponde a um serviço cadastrado" });
  }
  if (!data_hora) {
    return res.status(400).json({ mensagem: "'data_hora' deve ser informado" });
  }

  const novoAgendamento = {
    id: agendamentos.length + 1,
    id_carro,
    id_servico,
    data_hora
  };

  agendamentos.push(novoAgendamento);
  res.status(201).json({ mensagem: "Agendamento cadastrado com sucesso" });
});

module.exports = suaVariavelApi;
