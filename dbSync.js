import { sequelize } from './models/index.js';

sequelize.sync({ force: false })
  .then(() => {
    console.log('Conexión a la base de datos establecida y modelos sincronizados');
    // Tu código para iniciar el servidor aquí
  })
  .catch(err => {
    console.error('Error al sincronizar los modelos con la base de datos:', err);
  });
