const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/reservations', reservationRoutes);

// Teste de conexão e sync banco
sequelize.authenticate()
  .then(() => console.log('✅ Banco conectado com sucesso!'))
  .catch(err => console.error('❌ Falha ao conectar banco:', err));

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tabelas sincronizadas'))
  .catch(err => console.error('❌ Erro sincronizando tabelas:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
