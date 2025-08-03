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


exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, duracao, preco, profissionalId } = req.body;

  try {
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Serviço não encontrado' });

    await service.update({ nome, descricao, duracao, preco, profissionalId });
    res.json({ message: 'Serviço atualizado com sucesso', service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar serviço' });
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Serviço não encontrado' });

    await service.destroy();
    res.json({ message: 'Serviço excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir serviço' });
  }
};
