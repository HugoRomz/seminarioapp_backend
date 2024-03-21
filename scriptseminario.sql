
-- AGREGAR ON CASCADE PARA EVITARNOS PEDOS DESPUES

CREATE TABLE usuarios(
    usuario_id VARCHAR(15) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_p VARCHAR(50) NOT NULL,
    apellido_m VARCHAR(50) NOT NULL,
    telefono_usuario VARCHAR(15) DEFAULT 'SIN DEFINIR',
    email_usuario VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(15) DEFAULT 'ACTIVO',
    PRIMARY KEY(usuario_id)
);

-- ALUMNOS

INSERT INTO usuarios (usuario_id, nombre, apellido_p, apellido_m, telefono_usuario, email_usuario, password, status)
VALUES ('06041004', 'Dulce Maria', 'Aguilar', 'Lopez', 0, 'dulce.aguilar0101@unach.mx', 'root', 'INACTIVO'),
       ('B190002', 'Saul', 'Altuzar', 'Sanchez', 0, 'saul.altuzar0101@unach.mx', 'root', 'ACTIVO'),
       ('B190021', 'Angel Antonio', 'Hernandez', 'Gomez',0 , 'angel.hernandez0101@unach.mx', 'root', 'ACTIVO'),
       ('B170002', 'Juan Jose', 'Barrientos', 'Mazariegos', 0, 'juan.barrientos0101@unach.mx', 'root', 'ACTIVO'),
       ('B190011', 'Javier', 'Duran', 'Flores', 0, 'javier.duran0101@unach.mx', 'root', 'ACTIVO'),
       ('B190036', 'José Rodrigro', 'Orellana', 'Solorzano',0 , 'jose.orellana0101@unach.mx', 'root', 'ACTIVO'),
       ('B190012', 'Wendy Yoselin', 'Escalante', 'Roblero',0 , 'wendy.escalante0101@unach.mx', 'root', 'ACTIVO'),
       ('B190014', 'Sami David', 'Garcia', 'Arce',0 , 'sami.garcia0101@unach.mx', 'root', 'ACTIVO'),
       ('B201007', 'Seac Sing de Jesus', 'Hau', 'Orduña',0 , 'seac.hau0101@unach.mx', 'root', 'ACTIVO'),
       ('B201015', 'Carlos Eduardo', 'Robles', 'Chacon', 0, 'carlos.robles0101@unach.mx', 'root', 'ACTIVO'),
       ('B181010', 'Sergio Alexander', 'Hernandez', 'Mendez',0 , 'sergio.hernandez0101@unach.mx', 'root', 'ACTIVO'),
       ('B201009', 'Elí', 'Laguna', 'Marroquin',0 , 'eli.marroquin0101@unach.mx', 'root', 'ACTIVO'),
       ('B151121', 'Braulio Freddy', 'Lopez', 'Regalado',0 , 'braulio.lopez0101@unach.mx', 'root', 'ACTIVO'),
       ('B190027', 'Horacio Josue', 'Marroquin', 'Herrera',0 , 'horacio.marroquin0101@unach.mx', 'root', 'ACTIVO'),
       ('B190028', 'Carlos Alberto', 'Martinez', 'Altuzar',0 , 'carlos.martinez0101@unach.mx', 'root', 'ACTIVO'),
       ('B190046', 'Hugo Rafael', 'Rosales', 'Meléndez',0 , 'hugo.rosales0101@unach.mx', 'root', 'ACTIVO'),
       ('B151123', 'Evelio Alexander', 'Laguna', 'Marroquin',0 , 'evelio.laguna0101@unach.mx', 'root', 'ACTIVO'),
       ('B140132', 'Valeria de Jesús', 'Rodas', 'Hernandez', 0, 'valeria.rodas0101@unach.mx', 'root', 'ACTIVO'),
       ('B170033', 'Jose Humberto', 'Peña', 'Diaz', 0, 'eli.marroquin0101@unach.mx', 'root', 'INACTIVO'),
       ('B190047', 'Daniel Eduardo', 'Ruis', 'Lopez', 0, 'daniel.ruis0101@unach.mx', 'root', 'ACTIVO'),
       ('B191022', 'Isaac Isai', 'Tenorio', 'Cruz',0 , 'isaac.tenorio0101@unach.mx', 'root', 'INACTIVO');
       

-- MAESTROS
INSERT INTO usuarios (usuario_id, nombre, apellido_p, apellido_m, telefono_usuario, email_usuario, password, status)
VALUES ('M12024', 'Erwin', 'Bermudez', 'Casillas', 0, 'erwin.bermudez0101@unach.mx', 'root', 'ACTIVO'),
       ('M22024', 'Rosa Isela', 'Aguilar', 'Lopez', 0, 'rosa.aguilar0101@unach.mx', 'root', 'ACTIVO'),
       ('M32024', 'Jesus Arnulfo', 'Zacarias', 'Santos', 0, 'jesus.zacarias0101@unach.mx', 'root', 'ACTIVO'),
       ('M42024', 'Vanessa', 'Benavides', 'Garcia', 0, 'vanessa.benavides0101@unach.mx', 'root', 'ACTIVO'),
       ('M52024', 'Rene Servando', 'Rivera', 'Roblero', 0, 'rene.rivera0101@unach.mx', 'root', 'ACTIVO');


CREATE TABLE roles(
    rol_id SERIAL,
    nombre_rol VARCHAR(50),
    PRIMARY KEY(rol_id)
);

-- ROLES
INSERT INTO roles (nombre_rol) VALUES
    ('Administrador'),
    ('Profesor'),
    ('Alumno'),
    ('Asistente');


CREATE TABLE usuarios_roles(
    rol_id INT NOT NULL,
    usuario_id VARCHAR(50) NOT NULL,
    FOREIGN KEY(rol_id) REFERENCES roles(rol_id),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id),
    PRIMARY KEY(rol_id,usuario_id)
);

-- Asignación de roles a usuarios ALUMNOS'
INSERT INTO usuarios_roles VALUES
    ('06041004',3),
    ('B190002',3),
    ('B190021',3),
    ('B170002',3),
    ('B190011',3),
    ('B190036',3),
    ('B190012',3),
    ('B190014',3),
    ('B201007',3),
    ('B201015',3),
    ('B181010',3),
    ('B201009',3),
    ('B151121',3),
    ('B190027',3),
    ('B190028',3),
    ('B190046',3),
    ('B151123',3),
    ('B140132',3),
    ('B170033',3),
    ('B190047',3),
    ('B191022',3);

-- Asignación de roles a usuarios MAESTROS'    
INSERT INTO usuarios_roles VALUES
    ('M12024',2),
    ('M22024',2),
    ('M32024',2),
    ('M42024',2),
    ('M52024',2);


    

CREATE TABLE tipo_documentacion (
    tipo_documentacion_id SERIAL,
    nombre_tipo_doc VARCHAR(50),
    PRIMARY KEY(tipo_documentacion_id)    
);

CREATE TABLE documentaciones(
    documentacion_id SERIAL,
    usuario_id VARCHAR(50),
    tipo_documentacion_id INT,
    url_documento VARCHAR(255),
    status VARCHAR(15) DEFAULT 'ACTIVO',
    FOREIGN KEY(usuario_id) REFERENCES usuarios(usuario_id),
    FOREIGN KEY(tipo_documentacion_id) REFERENCES tipo_documentacion(tipo_documentacion_id),
    PRIMARY KEY(documentacion_id)
);

CREATE TABLE tesinas(
    tesina_id SERIAL,
    usuario_id_docente VARCHAR(50),
    nombre_tesina VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_registro DATE DEFAULT now(),
    status VARCHAR(15) DEFAULT 'REVISION',
    FOREIGN KEY(usuario_id_docente) REFERENCES usuarios(usuario_id),
    PRIMARY KEY(tesina_id)
);

-- Inserción completa de tesinas 
INSERT INTO tesinas (usuario_id_docente, nombre_tesina, descripcion, status)
VALUES 
  ('M12024', 'Desarrollo del Sistema Integral de Gestión y Reservaciones en Línea para el Hotel Norma', 'Este proyecto tiene como objetivo desarrollar un sistema integral para la gestión y reservación en línea enfocado en mejorar la operatividad del Hotel Norma.', 'REVISION'),
  ('M22024', 'Diseño de una Aplicación Web para el control de entradas, salidas y Citas de los servicios de Mantenimiento y Reparación de Equipos de Cómputo e Impresoras para el negocio "La Carterucha"', 'Este proyecto busca desarrollar una aplicación web que permita la gestión de entradas, salidas y citas para servicios de mantenimiento y reparación en el negocio "La Cartuchera".', 'REVISION'),
  ('M12024', 'Generadora Automática de API REST en SPRING BOOT', 'Desarrollo de un generador automático de API REST utilizando el framework Spring Boot, facilitando la creación de interfaces de programación de aplicaciones de manera eficiente.', 'REVISION'),
  ('M22024', 'Diseño y Desarrollo de un Prototipo de Sistema de Información Para la Gestión del Inventario de la Microempresa "Abarrotes Arce" en la ciudad de Tapachula, Chiapas.', 'Este proyecto implica el diseño y desarrollo de un sistema de gestión de inventarios para la microempresa "Abarrotes Arce", optimizando sus procesos comerciales y de inventario.', 'REVISION'),
  ('M32024', 'CHATBOT (UGO), "LA INFORMACION QUE NECESITAS, CUANDO LA NECESITAS"', 'Desarrollo de un chatbot denominado UGO, diseñado para proporcionar información relevante y oportuna a los usuarios cuando la necesiten.', 'REVISION'),
  ('M42024', 'Optimización del Registro y Control de Cartas Recepción de Activos Tecnológicos', 'Este proyecto se enfoca en optimizar el proceso de registro y control de las cartas de recepción para activos tecnológicos, mejorando la eficiencia y la trazabilidad, desarrollando un Sistema de Software especializado para la empresa.', 'REVISION'),
  ('M52024', 'Sistema de Gestión y Usuario y Curso de MOODLE', 'Este proyecto busca desarrollar y mejorar un sistema de gestión para usuarios y cursos dentro de la plataforma educativa Moodle.', 'REVISION'),
  ('M52024', 'Implementación de una página web integral, con sistema de gestión de citas para un despacho jurídico', 'Desarrollo de una página web que integre un sistema de gestión de citas para mejorar la operatividad y organización de un despacho jurídico.', 'REVISION'),
  ('M32024', 'Sistema de Gestión del Seminario de Titulación (SIGEST)', 'Desarrollo de un sistema para la gestión del seminario de titulación, facilitando a los usuarios la administración y seguimiento de sus procesos de titulación.', 'REVISION'),
  ('M42024', 'Desarrollo de Sistema para Automatización de Pruebas del Formulario HTML', 'Este proyecto tiene como objetivo desarrollar un sistema que permita la automatización de pruebas para formularios HTML, mejorando la eficiencia en el desarrollo web.', 'REVISION'),
  ('M22024', 'Optimización de la Gestión de Actividades en el Área de Almacén de Grupo Pérsico: Desarrollo de un Modulo Web para la Gestión Eficiente de Procesos.', 'Este proyecto busca optimizar la gestión de actividades en el área de almacén de Grupo Pérsico mediante el desarrollo de un módulo web que facilite la gestión eficiente de procesos.', 'REVISION');



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

-- Inserción completa de proyectos con nombres iguales a las tesinas
INSERT INTO proyectos (tesina_id, nombre_proyecto, descripcion, fecha_inicio, fecha_final)
VALUES 
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Desarrollo del Sistema Integral de Gestión y Reservaciones en Línea para el Hotel Norma'), 'Desarrollo del Sistema Integral de Gestión y Reservaciones en Línea para el Hotel Norma', 'Implementación de un sistema de gestión y reservaciones en línea para mejorar la eficiencia del Hotel Norma.', '2024-01-15', '2024-07-15'),
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Diseño de una Aplicación Web para el control de entradas, salidas y Citas de los servicios de Mantenimiento y Reparación de Equipos de Cómputo e Impresoras para el negocio "La Carterucha"'), 'Diseño de una Aplicación Web para el control de entradas, salidas y Citas de los servicios de Mantenimiento y Reparación de Equipos de Cómputo e Impresoras para el negocio "La Carterucha"', 'Desarrollo de una aplicación para controlar entradas, salidas y citas de mantenimiento en La Cartuchera.', '2024-02-01', '2024-08-01'),
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Generadora Automática de API REST en SPRING BOOT'), 'Generadora Automática de API REST en SPRING BOOT', 'Creación de una herramienta para generar de manera automática APIs REST con Spring Boot.', '2024-03-10', '2024-09-10'),
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Diseño y Desarrollo de un Prototipo de Sistema de Información Para la Gestión del Inventario de la Microempresa "Abarrotes Arce" en la ciudad de Tapachula, Chiapas.'), 'Diseño y Desarrollo de un Prototipo de Sistema de Información Para la Gestión del Inventario de la Microempresa "Abarrotes Arce" en la ciudad de Tapachula, Chiapas.', 'Implementación de un sistema de información para la gestión de inventario en Abarrotes Arce.', '2024-04-05', '2024-10-05'),
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'CHATBOT (UGO), "LA INFORMACION QUE NECESITAS, CUANDO LA NECESITAS"'), 'CHATBOT (UGO), "LA INFORMACION QUE NECESITAS, CUANDO LA NECESITAS"', 'Desarrollo de un chatbot para proporcionar información instantánea a los usuarios.', '2024-05-20', '2024-11-20'),
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Optimización del Registro y Control de Cartas Recepción de Activos Tecnológicos'), 'Optimización del Registro y Control de Cartas Recepción de Activos Tecnológicos', 'Mejora en el proceso de registro y control de activos tecnológicos.', '2024-06-15', '2024-12-15'),
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Sistema de Gestión y Usuario y Curso de MOODLE'), 'Sistema de Gestión y Usuario y Curso de MOODLE', 'Desarrollo de un sistema para la gestión de usuarios y cursos en Moodle.', '2024-07-01', '2025-01-01'),
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Implementación de una página web integral, con sistema de gestión de citas para un despacho jurídico'), 'Implementación de una página web integral, con sistema de gestión de citas para un despacho jurídico', 'Desarrollo de una página web con sistema de gestión de citas para un despacho jurídico.', '2024-08-10', '2025-02-10'),
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Sistema de Gestión del Seminario de Titulación (SIGEST)'), 'Sistema de Gestión del Seminario de Titulación (SIGEST)', 'Implementación de un sistema para la gestión del seminario de titulación.', '2024-09-05', '2025-03-05'),
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Desarrollo de Sistema para Automatización de Pruebas del Formulario HTML'), 'Desarrollo de Sistema para Automatización de Pruebas del Formulario HTML', 'Desarrollo de un sistema para automatizar pruebas de formularios HTML.', '2024-10-15', '2025-04-15'),
  ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Optimización de la Gestión de Actividades en el Área de Almacén de Grupo Pérsico: Desarrollo de un Modulo Web para la Gestión Eficiente de Procesos.'), 'Optimización de la Gestión de Actividades en el Área de Almacén de Grupo Pérsico: Desarrollo de un Modulo Web para la Gestión Eficiente de Procesos.', 'Optimización de la gestión de actividades en el almacén de Grupo Pérsico.', '2024-11-01', '2025-05-01');


CREATE TABLE detalle_tesinas(
    cns_detalle_tesina SERIAL,
    tesina_id INT,
    usuario_id_alumno VARCHAR(15),
    FOREIGN KEY(tesina_id) REFERENCES tesinas(tesina_id),
    FOREIGN KEY(usuario_id_alumno) REFERENCES usuarios(usuario_id),
    PRIMARY KEY(cns_detalle_tesina,tesina_id)
);

delete from detalle_tesinas WHERE usuario_id_alumno = 'B190002';
delete from detalle_tesinas WHERE usuario_id_alumno = 'B190021';


INSERT INTO detalle_tesinas (tesina_id, usuario_id_alumno)
VALUES 
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Desarrollo del Sistema Integral de Gestión y Reservaciones en Línea para el Hotel Norma'), 'B190002'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Desarrollo del Sistema Integral de Gestión y Reservaciones en Línea para el Hotel Norma'), 'B190021'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Diseño de una Aplicación Web para el control de entradas, salidas y Citas de los servicios de Mantenimiento y Reparación de Equipos de Cómputo e Impresoras para el negocio "La Carterucha"'), 'B170002'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Generadora Automática de API REST en SPRING BOOT'), 'B190011'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Generadora Automática de API REST en SPRING BOOT'), 'B190036'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Diseño y Desarrollo de un Prototipo de Sistema de Información Para la Gestión del Inventario de la Microempresa "Abarrotes Arce" en la ciudad de Tapachula, Chiapas.'), 'B190012'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Diseño y Desarrollo de un Prototipo de Sistema de Información Para la Gestión del Inventario de la Microempresa "Abarrotes Arce" en la ciudad de Tapachula, Chiapas.'), 'B190014'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'CHATBOT (UGO), "LA INFORMACION QUE NECESITAS, CUANDO LA NECESITAS"'), 'B201007'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'CHATBOT (UGO), "LA INFORMACION QUE NECESITAS, CUANDO LA NECESITAS"'), 'B201015'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Optimización del Registro y Control de Cartas Recepción de Activos Tecnológicos'), 'B181010'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Sistema de Gestión y Usuario y Curso de MOODLE'), 'B201009'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Sistema de Gestión y Usuario y Curso de MOODLE'), 'B151121'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Implementación de una página web integral, con sistema de gestión de citas para un despacho jurídico'), 'B190027'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Sistema de Gestión del Seminario de Titulación (SIGEST)'), 'B190028'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Sistema de Gestión del Seminario de Titulación (SIGEST)'), 'B190046'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Desarrollo de Sistema para Automatización de Pruebas del Formulario HTML'), 'B151123'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Desarrollo de Sistema para Automatización de Pruebas del Formulario HTML'), 'B140132'),
    ((SELECT tesina_id FROM tesinas WHERE nombre_tesina = 'Optimización de la Gestión de Actividades en el Área de Almacén de Grupo Pérsico: Desarrollo de un Modulo Web para la Gestión Eficiente de Procesos.'), 'B190047');
    

CREATE TABLE carreras(
    carrera_id SERIAL,
    nombre_carrera VARCHAR(100) NOT NULL,
    PRIMARY KEY(carrera_id)
);

INSERT INTO carreras ( nombre_carrera) VALUES 
('Licenciatura en Contaduría'),
('Licenciatura en Sistemas Computacionales'),
('Licenciatura en Ingeniería en Desarrollo y Tecnologías de Software');


CREATE TABLE programa_academicos(
    prog_academico_id SERIAL,
    carrera_id INT,
    nombre_prog VARCHAR(100) NOT NULL,
    descripcion_prog TEXT,
    fecha_inicio DATE,
    fecha_cierre DATE,
    FOREIGN KEY(carrera_id) REFERENCES carreras(carrera_id),
    PRIMARY KEY(prog_academico_id)
);

INSERT INTO programa_academicos(carrera_id, nombre_prog, descripcion_prog, fecha_inicio , fecha_cierre) VALUES
(3,'Seminario de Titulación en Programación' , 'El Seminario de Titulación modalidad a distancia, es un conjunto de temas específicos relacionados al área de conocimiento de Programación correspondiente a los planes de estudio de la Licenciatura en Sistemas Computacionales y Licenciatura en Ingeniería en Desarrollo y Tecnologías de Software o programa educativo afín al área de Computación de otra Institución Educativa, siempre y cuando la normatividad vigente lo permita; con una duración total de 125 horas, divididas en cinco módulos.', '2024-01-26', '2024-05-24'),
(3,'Seminario de Titulación de Redes' , 'Descripción:
La opción Seminario de Titulación, es aplicable al alumno regular que se encuentre cursando el último semestre y al egresado que haya concluido la totalidad de los créditos del Plan y Programa de Estudios de que se trate. El seminario de Redes, está integrado por 5 módulos relativos al área de especialidad de redes y telecomunicaciones, permitiendo al estudiante o egresado aprender conocimientos avanzados en configuración y programación de servicios de red; así también, lo relativo a instalación de infraestructura de comunicación.', '2024-01-26', '2024-05-24');



CREATE TABLE materias (
    materia_id SERIAL,
    nombre_materia VARCHAR(100) NOT NULL,
    PRIMARY KEY(materia_id)
);

-- Insertar datos en la tabla materias
INSERT INTO materias (nombre_materia) VALUES 
    ('TECNOLOGÍAS EN OPERACIONES DE NEGOCIO'),
    ('TÓPICOS DE PROGRAMACIÓN AVANZADA'),
    ('BASE DE DATOS DISTRIBUIDAS'),
    ('INTELIGENCIA DE NEGOCIOS'),
    ('ARQUITECTURA SOA Y SERVICIOS WEB');


CREATE TABLE modulos(
    modulo_id SERIAL,
    prog_academico_id INT,  
    usuario_id_docente VARCHAR(15),
    nombre_modulo VARCHAR(100) NOT NULL,
    materia_id INT,
    fecha_inicio DATE NOT NULL,
    fecha_cierre DATE NOT NULL,
    FOREIGN KEY(prog_academico_id) REFERENCES programa_academicos(prog_academico_id), 
    FOREIGN KEY(usuario_id_docente) REFERENCES usuarios(usuario_id),
    FOREIGN KEY(materia_id) REFERENCES materias(materia_id),
    PRIMARY KEY(modulo_id)
);


-- Insertar datos en la tabla modulos
INSERT INTO modulos (prog_academico_id, usuario_id_docente, nombre_modulo, materia_id, fecha_inicio, fecha_cierre) VALUES
    (1, 'M32024', 'MÓDULO 1', 1, '2024-01-26', '2024-02-10'),
    (1, 'M12024', 'MÓDULO 2', 2, '2024-02-16', '2024-03-02'),
    (1, 'M42024', 'MÓDULO 3', 3, '2024-03-08', '2024-03-23'),
    (1, 'M22024', 'MÓDULO 4', 4, '2024-03-29', '2024-04-13'),
    (1, 'M52024', 'MÓDULO 5', 5, '2024-04-19', '2024-05-04');



CREATE TABLE detalle_modulos(
    cns_detalle_modulo SERIAL,
    modulo_id INT,
    usuario_id_alumno VARCHAR(15), 
    calificacion INT DEFAULT 5,
    FOREIGN KEY(modulo_id) REFERENCES modulos(modulo_id),
    FOREIGN KEY(usuario_id_alumno) REFERENCES usuarios(usuario_id),
    PRIMARY KEY(cns_detalle_modulo,modulo_id)
);


-- Insertar datos en la tabla detalle_modulos
INSERT INTO detalle_modulos (modulo_id, usuario_id_alumno)
VALUES 
    (1, '06041004'),
    (1, 'B190002'),
    (1, 'B190021'),
    (1, 'B170002'),
    (1, 'B190011'),
    (1, 'B190036'),
    (1, 'B190012'),
    (1, 'B190014'),
    (1, 'B201007'),
    (1, 'B201015'),
    (1, 'B181010'),
    (1, 'B201009'),
    (1, 'B151121'),
    (1, 'B190027'),
    (1, 'B190028'),
    (1, 'B190046'),
    (1, 'B151123'),
    (1, 'B140132'),
    (1, 'B190047'),
    (1, 'B191022'),

    (2, '06041004'),
    (2, 'B190002'),
    (2, 'B190021'),
    (2, 'B170002'),
    (2, 'B190011'),
    (2, 'B190036'),
    (2, 'B190012'),
    (2, 'B190014'),
    (2, 'B201007'),
    (2, 'B201015'),
    (2, 'B181010'),
    (2, 'B201009'),
    (2, 'B151121'),
    (2, 'B190027'),
    (2, 'B190028'),
    (2, 'B190046'),
    (2, 'B151123'),
    (2, 'B140132'),
    (2, 'B190047'),
    (2, 'B191022'),

    (3, '06041004'),
    (3, 'B190002'),
    (3, 'B190021'),
    (3, 'B170002'),
    (3, 'B190011'),
    (3, 'B190036'),
    (3, 'B190012'),
    (3, 'B190014'),
    (3, 'B201007'),
    (3, 'B201015'),
    (3, 'B181010'),
    (3, 'B201009'),
    (3, 'B151121'),
    (3, 'B190027'),
    (3, 'B190028'),
    (3, 'B190046'),
    (3, 'B151123'),
    (3, 'B140132'),
    (3, 'B190047'),
    (3, 'B191022'),

    (4, '06041004'),
    (4, 'B190002'),
    (4, 'B190021'),
    (4, 'B170002'),
    (4, 'B190011'),
    (4, 'B190036'),
    (4, 'B190012'),
    (4, 'B190014'),
    (4, 'B201007'),
    (4, 'B201015'),
    (4, 'B181010'),
    (4, 'B201009'),
    (4, 'B151121'),
    (4, 'B190027'),
    (4, 'B190028'),
    (4, 'B190046'),
    (4, 'B151123'),
    (4, 'B140132'),
    (4, 'B190047'),
    (4, 'B191022'),

    (5, '06041004'),
    (5, 'B190002'),
    (5, 'B190021'),
    (5, 'B170002'),
    (5, 'B190011'),
    (5, 'B190036'),
    (5, 'B190012'),
    (5, 'B190014'),
    (5, 'B201007'),
    (5, 'B201015'),
    (5, 'B181010'),
    (5, 'B201009'),
    (5, 'B151121'),
    (5, 'B190027'),
    (5, 'B190028'),
    (5, 'B190046'),
    (5, 'B151123'),
    (5, 'B140132'),
    (5, 'B190047'),
    (5, 'B191022');


CREATE TABLE tipo_evidencia(
    tipo_evidencia_id SERIAL,
    nombre_tipo_ev VARCHAR(100) NOT NULL,
    PRIMARY KEY(tipo_evidencia_id)
);

INSERT INTO tipo_evidencia (nombre_tipo_ev) VALUES 
    ('Tarea'),
    ('Examen'),
    ('Proyecto'),
    ('Presentación');

CREATE TABLE evidencias(
    evidencia_id SERIAL,
    modulo_id INT,
    tipo_evidencia_id INT,
    nombre_evidencia VARCHAR(50) NOT NULL,
    descripcion_evidencia VARCHAR(100) NOT NULL,
    FOREIGN KEY (modulo_id) REFERENCES modulos(modulo_id),
    FOREIGN KEY (tipo_evidencia_id) REFERENCES tipo_evidencia(tipo_evidencia_id),
    PRIMARY KEY(evidencia_id)
);

INSERT INTO evidencias (modulo_id, tipo_evidencia_id, nombre_evidencia, descripcion_evidencia) VALUES
    (1, 1, 'Tarea 1', 'Entrega de la primera tarea'),
    (1, 2, 'Examen 1', 'Examen parcial del módulo 1'),
    (1, 1, 'Tarea 2', 'Entrega de la segunda tarea'),
    (1, 2, 'Examen 2', 'Examen parcial del módulo 1'),
    (1, 3, 'Proyecto Final', 'Presentación del proyecto final del módulo 1'),
    (1, 4, 'Presentación', 'Exposición final del módulo 1'),
    (1, 1, 'Tarea 3', 'Entrega de la tercera tarea'),
    (1, 2, 'Examen 3', 'Examen parcial del módulo 1');


CREATE TABLE detalle_evidencias(
    cns_detalle_evidencias SERIAL,
    evidencia_id INT,
    url_evidencia VARCHAR(255),
    FOREIGN KEY(evidencia_id) REFERENCES evidencias(evidencia_id),
    PRIMARY KEY(cns_detalle_evidencias,evidencia_id)
);

INSERT INTO detalle_evidencias (evidencia_id, url_evidencia) VALUES
    (1, 'https://ejemplo.com/tarea1'),
    (2, 'https://ejemplo.com/examen1'),
    (3, 'https://ejemplo.com/tarea2'),
    (4, 'https://ejemplo.com/examen2'),
    (5, 'https://ejemplo.com/proyecto'),
    (6, 'https://ejemplo.com/presentacion'),
    (7, 'https://ejemplo.com/tarea3'),
    (8, 'https://ejemplo.com/examen3');

  


-- Mostrar Usuarios y los roles

SELECT u.*, r.nombre_rol
FROM usuarios u
JOIN usuarios_roles ur ON u.usuario_id = ur.usuario_id
JOIN roles r ON ur.rol_id = r.rol_id;


-- listar tesinas junto con el id del alumno y nombre del docente
SELECT t.*, u.nombre AS nombre_docente, d.usuario_id_alumno
FROM tesinas t
JOIN usuarios u ON t.usuario_id_docente = u.usuario_id
JOIN detalle_tesinas d ON t.tesina_id = d.tesina_id;


-- Cuantos alumnos hay por tesina
SELECT t.nombre_tesina, COUNT(dt.usuario_id_alumno) AS cantidad_alumnos
FROM tesinas t
LEFT JOIN detalle_tesinas dt ON t.tesina_id = dt.tesina_id
GROUP BY t.nombre_tesina;


-- Ver los maeestros y cuantas tesinas tienen asignacas
SELECT u.*, COUNT(t.tesina_id) AS cantidad_tesinas_en_revision
FROM usuarios u
LEFT JOIN tesinas t ON u.usuario_id = t.usuario_id_docente
WHERE EXISTS (SELECT 1 FROM tesinas WHERE usuario_id_docente = u.usuario_id AND status = 'REVISION')
GROUP BY u.usuario_id;



-- CONSULTA PARA VER EL ALUMNO Y DOCENTE CON EL NOMBRE DEL PROYECTO Y TESINA

  SELECT 
    u.usuario_id AS Alumno_ID,
    u.nombre AS Alumno_Nombre,
    u.apellido_p AS Alumno_Apellido_Paterno,
    u.apellido_m AS Alumno_Apellido_Materno,
    t.nombre_tesina AS Nombre_Tesina,
    p.nombre_proyecto AS Nombre_Proyecto,
    d.nombre AS Docente_Nombre,
    d.apellido_p AS Docente_Apellido_Paterno,
    d.apellido_m AS Docente_Apellido_Materno
FROM 
    usuarios u
    JOIN detalle_tesinas dt ON u.usuario_id = dt.usuario_id_alumno
    JOIN tesinas t ON dt.tesina_id = t.tesina_id
    JOIN proyectos p ON t.tesina_id = p.tesina_id
    JOIN usuarios d ON t.usuario_id_docente = d.usuario_id
WHERE 
    u.usuario_id LIKE 'B%';  -- Este filtro es para obtener solo alumnos, ajusta según sea necesario





Nombre de usuario maestro
postgres

Contraseña maestra
seminarioappR

Punto de enlace
seminarioapp.cfem66ekyscr.us-east-2.rds.amazonaws.com