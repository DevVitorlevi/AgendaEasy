const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.tipo)) {
      return res.status(403).json({ message: 'Acesso negado: perfil sem permissão' });
    }
    next();
  };
};

module.exports = allowRoles;
