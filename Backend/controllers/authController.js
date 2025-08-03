const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Criar usuário
    const user = await User.create({
      nome,
      email,
      senha: hashedPassword,
      tipo: tipo || 'cliente',
    });

    // Criar payload e token JWT
    const payload = {
      id: user.id,
      nome: user.nome,
      tipo: user.tipo,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: payload,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token JWT
    const payload = {
      id: user.id,
      nome: user.nome,
      tipo: user.tipo,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user: payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
