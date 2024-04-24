
-- AGREGAR ON CASCADE PARA EVITARNOS PEDOS DESPUES

CREATE DATABASE seminarioapp;

CREATE TABLE usuarios(
    usuario_id SERIAL NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_p VARCHAR(50) NOT NULL,
    apellido_m VARCHAR(50) NOT NULL,
    telefono_usuario VARCHAR(15) DEFAULT 'SIN DEFINIR',
    email_usuario VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(15) DEFAULT 'ACTIVO',
    PRIMARY KEY(usuario_id)
);

CREATE TABLE alumnos(
    matricula VARCHAR(50),
    calificacionFinal int,
    usuario_id int,
    PRIMARY KEY(matricula),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id)
);

CREATE TABLE docentes(
    num_plaza VARCHAR(50),
    licenciatura VARCHAR(50),
    maestria VARCHAR(50),
    doctorado VARCHAR(50),
    usuario_id int,
    PRIMARY KEY(num_plaza),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id)
);

CREATE TABLE egresados(
    cod_egresado VARCHAR(50),
    trabajando BOOLEAN,
    especializado BOOLEAN,
    calificacionFinal int,
    usuario_id int,
    PRIMARY KEY(cod_egresado),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id)
);


CREATE TABLE roles(
    rol_id SERIAL,
    nombre_rol VARCHAR(50),
    PRIMARY KEY(rol_id)
);

-- ROLES
INSERT INTO roles (nombre_rol) VALUES
    ('Administrador'),
    ('Docente'),
    ('Alumno'),
    ('Asistente');

CREATE TABLE usuarios_roles(
    rol_id INT NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY(rol_id) REFERENCES roles(rol_id),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id),
    PRIMARY KEY(rol_id,usuario_id)
);


CREATE TABLE tesinas(
    tesina_id SERIAL,
    usuario_id_docente int,
    usuario_id_alumno int,
    nombre_tesina VARCHAR(255) NOT NULL,
    descripcion_tesina TEXT NOT NULL,
    fecha_registro DATE DEFAULT now(),
    status VARCHAR(15) DEFAULT 'REVISION',
    calificacion int CHECK (calificacion >= 2),
    FOREIGN KEY(usuario_id_docente) REFERENCES usuarios(usuario_id),
    FOREIGN KEY(usuario_id_alumno) REFERENCES usuarios(usuario_id),
    PRIMARY KEY(tesina_id)
);


CREATE TABLE proyectos(
    proyecto_id SERIAL,
    tesina_id INT,
    nombre_proyecto VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_inicio DATE,
    fecha_final DATE,
    FOREIGN KEY (tesina_id) REFERENCES tesinas(tesina_id),
    PRIMARY KEY(proyecto_id)
);

-- PARTE ESTATICA

CREATE TABLE carreras(
    carrera_id SERIAL,
    nombre_carrera VARCHAR(100) NOT NULL,
    PRIMARY KEY(carrera_id)
);

CREATE TABLE materias (
    materia_id SERIAL,
    nombre_materia VARCHAR(100) NOT NULL,
    PRIMARY KEY(materia_id)
);

CREATE TABLE cursos(
    curso_id SERIAL,
    nombre_curso VARCHAR(100),
    carrera_id INT,
    FOREIGN KEY(carrera_id) REFERENCES carreras(carrera_id),
    PRIMARY KEY(curso_id)
);

CREATE TABLE det_cursos(
    det_curso_id SERIAL,
    curso_id INT,
    materia_id INT, 
    FOREIGN KEY(curso_id) REFERENCES cursos(curso_id),
    FOREIGN KEY(materia_id) REFERENCES materias(materia_id),
    PRIMARY KEY(det_curso_id)
);

-- PARTE DINAMICA

CREATE TABLE periodo (
    periodo_id SERIAL,
    descripcion VARCHAR(255) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    status BOOLEAN NOT NULL,
     PRIMARY KEY (periodo_id)
);

CREATE TABLE curso_periodo(
    curso_periodo_id SERIAL,
    periodo_id int,
    curso_id int,
    FOREIGN KEY(periodo_id) REFERENCES periodo(periodo_id),
    FOREIGN KEY(curso_id) REFERENCES cursos(curso_id),
    PRIMARY KEY(curso_periodo_id)
);

CREATE TABLE preregistro (
    preregistro_id SERIAL PRIMARY KEY,
    codigo_alumno VARCHAR(255) NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    telefono VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    checkSeminario BOOLEAN NOT NULL,
    egresado BOOLEAN NOT NULL,
    curso_periodo_id INT,
    FOREIGN KEY (curso_periodo_id) REFERENCES curso_periodo(curso_periodo_id)
);


CREATE TABLE modulo(
    modulo_id SERIAL,
    det_curso_id INT,  
    usuario_id int,
    nombre_modulo VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_cierre DATE NOT NULL,
    curso_periodo_id int,
    FOREIGN KEY(det_curso_id) REFERENCES det_cursos(det_curso_id), 
    FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id),
    FOREIGN KEY(curso_periodo_id) REFERENCES curso_periodo(curso_periodo_id),
    PRIMARY KEY(modulo_id)
);


CREATE TABLE calificaciones(
    calificacion_id SERIAL,
    modulo_id INT,
    usuario_id int, 
    calificacion INT DEFAULT 5,
    FOREIGN KEY(modulo_id) REFERENCES modulo(modulo_id),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id),
    PRIMARY KEY(calificacion_id)
);

CREATE TABLE tipo_evidencias(
    tipo_evidencia_id SERIAL,
    nombre_tipo_ev VARCHAR(100) NOT NULL,
    PRIMARY KEY(tipo_evidencia_id)
);

INSERT INTO tipo_evidencias (nombre_tipo_ev) VALUES 
    ('Tarea'),
    ('Examen'),
    ('Proyecto'),
    ('Presentación');


CREATE TABLE evidencias(
    evidencia_id SERIAL,
    modulo_id INT,
    tipo_evidencia_id INT,
    nombre_evidencia VARCHAR(50) NOT NULL,
    descripcion_evi VARCHAR(100) NOT NULL,
    FOREIGN KEY (modulo_id) REFERENCES modulo(modulo_id),
    FOREIGN KEY (tipo_evidencia_id) REFERENCES tipo_evidencias(tipo_evidencia_id),
    PRIMARY KEY(evidencia_id)
);


CREATE TABLE detalle_evidencias(
    cns_detalle_evidencias SERIAL,
    evidencia_id INT,
    url_evidencia VARCHAR(255),
    FOREIGN KEY(evidencia_id) REFERENCES evidencias(evidencia_id),
    PRIMARY KEY(cns_detalle_evidencias,evidencia_id)
);


CREATE TABLE documentos(
    documento_id SERIAL,
    nombre_documento VARCHAR(255),
    PRIMARY KEY(documento_id) 
);

CREATE TABLE det_doc_alumno(
    det_alumno_id SERIAL,
    documento_id INT,
    curso_id INT,
    FOREIGN KEY (documento_id) REFERENCES documentos(documento_id),
    FOREIGN KEY (curso_id) REFERENCES cursos(curso_id),
    PRIMARY KEY(det_alumno_id)
);

CREATE TABLE det_doc_docente(
    det_docente_id SERIAL,
    documento_id INT,
    curso_id INT,
    FOREIGN KEY (documento_id) REFERENCES documentos(documento_id),
    FOREIGN KEY (curso_id) REFERENCES cursos(curso_id),
    PRIMARY KEY(det_docente_id)
);

CREATE TABLE doc_alumnos_estado(
    alumno_estado_id SERIAL,
    det_alumno_id INT,
    usuario_id INT,
    comentarios TEXT,
    url_file TEXT,
    status VARCHAR(15),
    FOREIGN KEY (det_alumno_id) REFERENCES det_doc_alumno(det_alumno_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),
    PRIMARY KEY(alumno_estado_id)
);

CREATE TABLE doc_docente_estado(
    docente_estado_id SERIAL,
    det_docente_id INT,
    usuario_id INT,
    comentarios TEXT,
    url_file TEXT,
    status VARCHAR(15),
    FOREIGN KEY (det_docente_id) REFERENCES det_doc_docente(det_docente_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),
    PRIMARY KEY(docente_estado_id)
);




-- ALUMNOS
INSERT INTO usuarios (nombre, apellido_p, apellido_m, telefono_usuario, email_usuario, password, status)
VALUES 
('Dulce Maria', 'Aguilar', 'Lopez', 'SIN DEFINIR', 'dulce.aguilar0101@unach.mx', 'root', 'INACTIVO'),
('Saul', 'Altuzar', 'Sanchez', 'SIN DEFINIR', 'saul.altuzar0101@unach.mx', 'root', 'ACTIVO'),
('Angel Antonio', 'Hernandez', 'Gomez', 'SIN DEFINIR', 'angel.hernandez0101@unach.mx', 'root', 'ACTIVO'),
('Juan Jose', 'Barrientos', 'Mazariegos', 'SIN DEFINIR', 'juan.barrientos0101@unach.mx', 'root', 'ACTIVO'),
('Javier', 'Duran', 'Flores', 'SIN DEFINIR', 'javier.duran0101@unach.mx', 'root', 'ACTIVO'),
('José Rodrigro', 'Orellana', 'Solorzano', 'SIN DEFINIR', 'jose.orellana0101@unach.mx', 'root', 'ACTIVO'),
('Wendy Yoselin', 'Escalante', 'Roblero', 'SIN DEFINIR', 'wendy.escalante0101@unach.mx', 'root', 'ACTIVO'),
('Sami David', 'Garcia', 'Arce', 'SIN DEFINIR', 'sami.garcia0101@unach.mx', 'root', 'ACTIVO'),
('Seac Sing de Jesus', 'Hau', 'Orduña', 'SIN DEFINIR', 'seac.hau0101@unach.mx', 'root', 'ACTIVO'),
('Carlos Eduardo', 'Robles', 'Chacon', 'SIN DEFINIR', 'carlos.robles0101@unach.mx', 'root', 'ACTIVO'),
('Sergio Alexander', 'Hernandez', 'Mendez', 'SIN DEFINIR', 'sergio.hernandez0101@unach.mx', 'root', 'ACTIVO'),
('Elí', 'Laguna', 'Marroquin', 'SIN DEFINIR', 'eli.marroquin0101@unach.mx', 'root', 'ACTIVO'),
('Braulio Freddy', 'Lopez', 'Regalado', 'SIN DEFINIR', 'braulio.lopez0101@unach.mx', 'root', 'ACTIVO'),
('Horacio Josue', 'Marroquin', 'Herrera', 'SIN DEFINIR', 'horacio.marroquin0101@unach.mx', 'root', 'ACTIVO'),
('Carlos Alberto', 'Martinez', 'Altuzar', 'SIN DEFINIR', 'carlos.martinez0101@unach.mx', 'root', 'ACTIVO'),
('Hugo Rafael', 'Rosales', 'Meléndez', 'SIN DEFINIR', 'hugo.rosales0101@unach.mx', 'root', 'ACTIVO'),
('Evelio Alexander', 'Laguna', 'Marroquin', 'SIN DEFINIR', 'evelio.laguna0101@unach.mx', 'root', 'ACTIVO'),
('Valeria de Jesús', 'Rodas', 'Hernandez', 'SIN DEFINIR', 'valeria.rodas0101@unach.mx', 'root', 'ACTIVO'),
('Jose Humberto', 'Peña', 'Diaz', 'SIN DEFINIR', 'eli.marroquin0101@unach.mx', 'root', 'INACTIVO'),
('Daniel Eduardo', 'Ruis', 'Lopez', 'SIN DEFINIR', 'daniel.ruis0101@unach.mx', 'root', 'ACTIVO'),
('Isaac Isai', 'Tenorio', 'Cruz', 'SIN DEFINIR', 'isaac.tenorio0101@unach.mx', 'root', 'INACTIVO');

INSERT INTO alumnos (matricula, calificacionFinal, usuario_id) VALUES
('B190002', 8, 8),
('B190021', 8, 9),
('B190011', 8, 11),
('B190036', 8, 12),
('B190012', 8, 13),
('B190014', 8, 14),
('B201007', 8, 15),
('B201015', 8, 16),
('B201009', 8, 18),
('B190027', 8, 20),
('B190028', 8, 21),
('B190046', 8, 22),
('B190047', 8, 26),
('B191022', 8, 27);

INSERT INTO egresados (cod_egresado,calificacionFinal, trabajando,especializado, usuario_id) VALUES
('06041004', 8,TRUE,TRUE,7),
('B151123', 8,TRUE,TRUE,23),
('B181010', 8,FALSE,FALSE,17),
('B140132', 8,TRUE,TRUE,24),
('B170033', 8,TRUE,FALSE,25),
('B170002', 8,TRUE,FALSE,10),
('B151121', 8,TRUE,TRUE,19);
       

-- MAESTROS
INSERT INTO usuarios 
(nombre, apellido_p, apellido_m, telefono_usuario, email_usuario, password, status)
VALUES 
('Erwin', 'Bermudez', 'Casillas', 'SIN DEFINIR', 'erwin.bermudez0101@unach.mx', 'root', 'ACTIVO'),
('Rosa Isela', 'Aguilar', 'Lopez', 'SIN DEFINIR', 'rosa.aguilar0101@unach.mx', 'root',  'ACTIVO'),
('Jesus Arnulfo', 'Zacarias', 'Santos', 'SIN DEFINIR', 'jesus.zacarias0101@unach.mx', 'root','ACTIVO'),
('Vanessa', 'Benavides', 'Garcia', 'SIN DEFINIR', 'vanessa.benavides0101@unach.mx', 'root', 'ACTIVO'),
('Rene Servando', 'Rivera', 'Roblero', 'SIN DEFINIR', 'rene.rivera0101@unach.mx', 'root', 'ACTIVO');


INSERT INTO docentes (num_plaza, licenciatura, maestria, doctorado, usuario_id) VALUES
('M12024','SIN DEFINIR','SIN DEFINIR','SIN DEFINIR',28),
('M22024','SIN DEFINIR','SIN DEFINIR','SIN DEFINIR',29),
('M32024','SIN DEFINIR','SIN DEFINIR','SIN DEFINIR',30),
('M42024','SIN DEFINIR','SIN DEFINIR','SIN DEFINIR',31),
('M52024','SIN DEFINIR','SIN DEFINIR','SIN DEFINIR',32);


-- Asignación de roles a usuarios ALUMNOS'
INSERT INTO usuarios_roles VALUES
    (3,7),
    (3,8),
    (3,9),
    (3,10),
    (3,11),
    (3,12),
    (3,13),
    (3,14),
    (3,15),
    (3,16),
    (3,17),
    (3,18),
    (3,19),
    (3,20),
    (3,21),
    (3,22),
    (3,23),
    (3,24),
    (3,25),
    (3,26),
    (3,27);
-- Asignación de roles a usuarios MAESTROS'    
INSERT INTO usuarios_roles VALUES
    (2,28),
    (2,29),
    (2,30),
    (2,31),
    (2,32);

INSERT INTO usuarios_roles VALUES
    (1,29);

-- Inserción completa de tesinas 
INSERT INTO tesinas (usuario_id_docente,usuario_id_alumno, nombre_tesina, descripcion_tesina, status, calificacion)
VALUES 
  (28,8, 'Desarrollo del Sistema Integral de Gestión y Reservaciones en Línea para el Hotel Norma', 'Este proyecto tiene como objetivo desarrollar un sistema integral para la gestión y reservación en línea enfocado en mejorar la operatividad del Hotel Norma.', 'REVISION', 2),
  (28,9, 'Desarrollo del Sistema Integral de Gestión y Reservaciones en Línea para el Hotel Norma', 'Este proyecto tiene como objetivo desarrollar un sistema integral para la gestión y reservación en línea enfocado en mejorar la operatividad del Hotel Norma.', 'REVISION', 2),
  (29,10, ,'Diseño de una Aplicación Web para el control de entradas, salidas y Citas de los servicios de Mantenimiento y Reparación de Equipos de Cómputo e Impresoras para el negocio "La Carterucha"', 'Este proyecto busca desarrollar una aplicación web que permita la gestión de entradas, salidas y citas para servicios de mantenimiento y reparación en el negocio "La Cartuchera".', 'REVISION', 2),
  (28,11, 'Generadora Automática de API REST en SPRING BOOT', 'Desarrollo de un generador automático de API REST utilizando el framework Spring Boot, facilitando la creación de interfaces de programación de aplicaciones de manera eficiente.', 'REVISION', 2),
  (28,12, 'Generadora Automática de API REST en SPRING BOOT', 'Desarrollo de un generador automático de API REST utilizando el framework Spring Boot, facilitando la creación de interfaces de programación de aplicaciones de manera eficiente.', 'REVISION', 2),
  (29,13, 'Diseño y Desarrollo de un Prototipo de Sistema de Información Para la Gestión del Inventario de la Microempresa "Abarrotes Arce" en la ciudad de Tapachula, Chiapas.', 'Este proyecto implica el diseño y desarrollo de un sistema de gestión de inventarios para la microempresa "Abarrotes Arce", optimizando sus procesos comerciales y de inventario.', 'REVISION', 2),
  (29,14, 'Diseño y Desarrollo de un Prototipo de Sistema de Información Para la Gestión del Inventario de la Microempresa "Abarrotes Arce" en la ciudad de Tapachula, Chiapas.', 'Este proyecto implica el diseño y desarrollo de un sistema de gestión de inventarios para la microempresa "Abarrotes Arce", optimizando sus procesos comerciales y de inventario.', 'REVISION', 2),
  (30,15, 'CHATBOT (UGO), "LA INFORMACION QUE NECESITAS, CUANDO LA NECESITAS"', 'Desarrollo de un chatbot denominado UGO, diseñado para proporcionar información relevante y oportuna a los usuarios cuando la necesiten.', 'REVISION', 2),
  (30,16, 'CHATBOT (UGO), "LA INFORMACION QUE NECESITAS, CUANDO LA NECESITAS"', 'Desarrollo de un chatbot denominado UGO, diseñado para proporcionar información relevante y oportuna a los usuarios cuando la necesiten.', 'REVISION', 2),
  (31,17, 'Optimización del Registro y Control de Cartas Recepción de Activos Tecnológicos', 'Este proyecto se enfoca en optimizar el proceso de registro y control de las cartas de recepción para activos tecnológicos, mejorando la eficiencia y la trazabilidad, desarrollando un Sistema de Software especializado para la empresa.', 'REVISION', 2),
  (32,18, 'Sistema de Gestión y Usuario y Curso de MOODLE', 'Este proyecto busca desarrollar y mejorar un sistema de gestión para usuarios y cursos dentro de la plataforma educativa Moodle.', 'REVISION', 2),
  (32,19, 'Sistema de Gestión y Usuario y Curso de MOODLE', 'Este proyecto busca desarrollar y mejorar un sistema de gestión para usuarios y cursos dentro de la plataforma educativa Moodle.', 'REVISION', 2),
  (32,20, 'Implementación de una página web integral, con sistema de gestión de citas para un despacho jurídico', 'Desarrollo de una página web que integre un sistema de gestión de citas para mejorar la operatividad y organización de un despacho jurídico.', 'REVISION', 2),
  (30,21, 'Sistema de Gestión del Seminario de Titulación (SIGEST)', 'Desarrollo de un sistema para la gestión del seminario de titulación, facilitando a los usuarios la administración y seguimiento de sus procesos de titulación.', 'REVISION', 2),
  (30,22, 'Sistema de Gestión del Seminario de Titulación (SIGEST)', 'Desarrollo de un sistema para la gestión del seminario de titulación, facilitando a los usuarios la administración y seguimiento de sus procesos de titulación.', 'REVISION', 2),
  (31,23, 'Desarrollo de Sistema para Automatización de Pruebas del Formulario HTML', 'Este proyecto tiene como objetivo desarrollar un sistema que permita la automatización de pruebas para formularios HTML, mejorando la eficiencia en el desarrollo web.', 'REVISION', 2),
  (31,24, 'Desarrollo de Sistema para Automatización de Pruebas del Formulario HTML', 'Este proyecto tiene como objetivo desarrollar un sistema que permita la automatización de pruebas para formularios HTML, mejorando la eficiencia en el desarrollo web.', 'REVISION', 2),
  (29,26, 'Optimización de la Gestión de Actividades en el Área de Almacén de Grupo Pérsico: Desarrollo de un Modulo Web para la Gestión Eficiente de Procesos.', 'Este proyecto busca optimizar la gestión de actividades en el área de almacén de Grupo Pérsico mediante el desarrollo de un módulo web que facilite la gestión eficiente de procesos.', 'REVISION', 2);


-- Inserción completa de proyectos con nombres iguales a las tesinas
INSERT INTO proyectos (tesina_id, nombre_proyecto, descripcion, fecha_inicio, fecha_final)
VALUES 
  (1, 'Desarrollo del Sistema Integral de Gestión y Reservaciones en Línea para el Hotel Norma', 'Implementación de un sistema de gestión y reservaciones en línea para mejorar la eficiencia del Hotel Norma.', '2024-01-15', '2024-07-15'),
  (2, 'Desarrollo del Sistema Integral de Gestión y Reservaciones en Línea para el Hotel Norma', 'Implementación de un sistema de gestión y reservaciones en línea para mejorar la eficiencia del Hotel Norma.', '2024-01-15', '2024-07-15'),
  (3, 'Diseño de una Aplicación Web para el control de entradas, salidas y Citas de los servicios de Mantenimiento y Reparación de Equipos de Cómputo e Impresoras para el negocio "La Carterucha"', 'Desarrollo de una aplicación para controlar entradas, salidas y citas de mantenimiento en La Cartuchera.', '2024-02-01', '2024-08-01'),
  (4, 'Generadora Automática de API REST en SPRING BOOT', 'Creación de una herramienta para generar de manera automática APIs REST con Spring Boot.', '2024-03-10', '2024-09-10'),
  (5, 'Generadora Automática de API REST en SPRING BOOT', 'Creación de una herramienta para generar de manera automática APIs REST con Spring Boot.', '2024-03-10', '2024-09-10'),
  (6, 'Diseño y Desarrollo de un Prototipo de Sistema de Información Para la Gestión del Inventario de la Microempresa "Abarrotes Arce" en la ciudad de Tapachula, Chiapas.', 'Implementación de un sistema de información para la gestión de inventario en Abarrotes Arce.', '2024-04-05', '2024-10-05'),
  (7, 'Diseño y Desarrollo de un Prototipo de Sistema de Información Para la Gestión del Inventario de la Microempresa "Abarrotes Arce" en la ciudad de Tapachula, Chiapas.', 'Implementación de un sistema de información para la gestión de inventario en Abarrotes Arce.', '2024-04-05', '2024-10-05'),
  (8, 'CHATBOT (UGO), "LA INFORMACION QUE NECESITAS, CUANDO LA NECESITAS"', 'Desarrollo de un chatbot para proporcionar información instantánea a los usuarios.', '2024-05-20', '2024-11-20'),
  (9, 'CHATBOT (UGO), "LA INFORMACION QUE NECESITAS, CUANDO LA NECESITAS"', 'Desarrollo de un chatbot para proporcionar información instantánea a los usuarios.', '2024-05-20', '2024-11-20'),
  (10, 'Optimización del Registro y Control de Cartas Recepción de Activos Tecnológicos', 'Mejora en el proceso de registro y control de activos tecnológicos.', '2024-06-15', '2024-12-15'),
  (11, 'Sistema de Gestión y Usuario y Curso de MOODLE', 'Desarrollo de un sistema para la gestión de usuarios y cursos en Moodle.', '2024-07-01', '2025-01-01'),
  (12, 'Sistema de Gestión y Usuario y Curso de MOODLE', 'Desarrollo de un sistema para la gestión de usuarios y cursos en Moodle.', '2024-07-01', '2025-01-01'),
  (13, 'Implementación de una página web integral, con sistema de gestión de citas para un despacho jurídico', 'Desarrollo de una página web con sistema de gestión de citas para un despacho jurídico.', '2024-08-10', '2025-02-10'),
  (14, 'Sistema de Gestión del Seminario de Titulación (SIGEST)', 'Implementación de un sistema para la gestión del seminario de titulación.', '2024-09-05', '2025-03-05'),
  (15, 'Sistema de Gestión del Seminario de Titulación (SIGEST)', 'Implementación de un sistema para la gestión del seminario de titulación.', '2024-09-05', '2025-03-05'),
  (16, 'Desarrollo de Sistema para Automatización de Pruebas del Formulario HTML', 'Desarrollo de un sistema para automatizar pruebas de formularios HTML.', '2024-10-15', '2025-04-15'),
  (17, 'Desarrollo de Sistema para Automatización de Pruebas del Formulario HTML', 'Desarrollo de un sistema para automatizar pruebas de formularios HTML.', '2024-10-15', '2025-04-15'),
  (18, 'Optimización de la Gestión de Actividades en el Área de Almacén de Grupo Pérsico: Desarrollo de un Modulo Web para la Gestión Eficiente de Procesos.', 'Optimización de la gestión de actividades en el almacén de Grupo Pérsico.', '2024-11-01', '2025-05-01');



INSERT INTO carreras ( nombre_carrera) VALUES 
('Licenciatura en Sistemas Computacionales'),
('Licenciatura en Ingeniería en Desarrollo y Tecnologías de Software');


-- Insertar datos en la tabla materias
INSERT INTO materias (nombre_materia) VALUES 
    ('TECNOLOGÍAS EN OPERACIONES DE NEGOCIO'),
    ('TÓPICOS DE PROGRAMACIÓN AVANZADA'),
    ('BASE DE DATOS DISTRIBUIDAS'),
    ('INTELIGENCIA DE NEGOCIOS'),
    ('ARQUITECTURA SOA Y SERVICIOS WEB');


INSERT INTO cursos(nombre_curso, carrera_id) VALUES
    ('Seminario de Titulación en Programación',2),
    ('Seminario de Titulación de Redes',2);

INSERT INTO det_cursos (curso_id, materia_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5);

INSERT INTO periodo (descripcion, fecha_inicio, fecha_fin, status) VALUES
    ('Enero 2023', '2023-01-26', '2023-05-11', FALSE),
    ('Enero 2024', '2024-01-26', '2024-05-11', TRUE);

INSERT INTO curso_periodo(periodo_id, curso_id) VALUES 
    (2,1);

INSERT INTO preregistro (codigo_alumno, nombres, apellidos, telefono, email, checkSeminario, egresado, curso_periodo_id) VALUES 
('123456', 'Juan', 'Pérez', '+1234567890', 'juan@example.com', true, true, 1),
('B190046', 'Kelly', 'Pérez', '+1234567890', 'juan@example.com', true, FALSE, 1);


INSERT INTO modulo(det_curso_id, usuario_id, nombre_modulo, fecha_inicio, fecha_cierre, curso_periodo_id) VALUES
(1, 30, 'Tecnologías en Operaciones de Negocio', '2023-06-26', '2023-07-11',1),
(2, 28, 'Tópicos de Programación Avanzada', '2023-07-17', '2023-08-01',1),
(3, 31, 'Bases de Datos Distribuidas', '2023-08-07', '2023-08-22',1),
(4, 29, 'Inteligencia de Negocios', '2023-08-28', '2023-09-12',1),
(5, 32, 'Arquitectura SOA y Servicios Web', '2023-09-18', '2023-10-03',1);

INSERT INTO calificaciones (modulo_id, usuario_id, calificacion)
VALUES (1, 8, 8),
(1, 9, 8),
(1, 10, 8),
(1, 11, 8);


INSERT INTO documentos (nombre_documento) VALUES
('Acta de nacimiento'),
('Constancia de terminación de servicio'),
('Historial académico'),
('Constancia Fiscal'),
('Carta pasante');

-- Insertar detalles del documento para un alumno
INSERT INTO det_doc_alumno (documento_id, curso_id) VALUES (1, 1);
INSERT INTO det_doc_alumno (documento_id, curso_id) VALUES (2, 1);
INSERT INTO det_doc_alumno (documento_id, curso_id) VALUES (3, 1);

-- Insertar detalles del documento para un docente
INSERT INTO det_doc_docente (documento_id, curso_id) VALUES (4, 1);
INSERT INTO det_doc_docente (documento_id, curso_id) VALUES (1, 1);


-- Insertar estado del documento para un alumno
INSERT INTO doc_alumnos_estado (det_alumno_id, usuario_id, comentarios, url_file, status)
VALUES (2, 8, 'Comentarios sobre el estado del documento del alumno', 'https://ejemplo.com/documento_alumno.pdf', 'Aprobado');

-- Insertar estado del documento para un docente
INSERT INTO doc_docente_estado (det_docente_id, usuario_id, comentarios, url_file, status)
VALUES (1, 30, 'Comentarios sobre el estado del documento del docente', 'https://ejemplo.com/documento_docente.pdf', 'Aprobado');

