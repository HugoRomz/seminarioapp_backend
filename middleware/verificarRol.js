const verificarRol = (rolesPermitidos) => {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          throw new Error('No se ha verificado la autenticación del usuario.');
        }
  
        const rolesUsuario = req.user.roles.map(rol => rol.nombre_rol);
        const tieneRolPermitido = rolesUsuario.some(rolUsuario => rolesPermitidos.includes(rolUsuario));
  
        if (!tieneRolPermitido) {
          throw new Error('Acceso denegado. No tienes permiso para realizar esta acción.');
        }

      } catch (error) {
        res.status(403).json({ msg: error.message });
      }
    };
  };

  
  export default verificarRol