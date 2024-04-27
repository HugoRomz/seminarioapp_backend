import { sequelize } from '../config/db.js';
import { Usuarios } from './Usuarios.js';
import { Roles } from './Roles.js';
import { Usuarios_Roles } from './Usuarios_Roles.js';
import { Periodos } from './Periodo.js'; 
import { Cursos } from './Cursos.js';
import { Carreras } from './Carreras.js'; 
import { Materias } from './Materias.js'; 
import { Tesinas } from './Tesinas.js'; 
import { Modulos } from './Modulos.js'; 
import { Evidencias } from './Evidencias.js'; 
import { Documentos } from './Documentos.js'; 

export { sequelize, Usuarios, Roles, Usuarios_Roles, Periodos, Cursos, Carreras, Materias, Tesinas, Modulos, Evidencias, Documentos };
