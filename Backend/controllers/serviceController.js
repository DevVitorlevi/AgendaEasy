// controllers/serviceController.js
const Service = require('../models/Service')
const User = require('../models/User')

exports.createService = async (req, res) => {
  try {
    const { nome, descricao, duracao, preco, profissionalId } = req.body;
    const service = await Service.create({ nome, descricao, duracao, preco, profissionalId });
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar serviço' });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.findAll({ include: { model: User, as: 'profissional' } });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar serviços' });
  }
};
