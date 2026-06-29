

-- 1. ROLES (skip if already exist)
INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'ADMIN'), (2, 'DOCENTE'), (3, 'ESTUDIANTE');

-- ==========================================================
-- 2. USERS (1 admin + 10 docentes + 52 estudiantes = 63 users)
-- ==========================================================
-- Password hash for "123456"
SET @ph = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

-- Admin
INSERT INTO usuarios (nombres, apellidos, email, password, activo) VALUES
('Carlos', 'Mendoza López', 'admin@educacion.pe', @ph, 1);

-- Docentes
INSERT INTO usuarios (nombres, apellidos, email, password, activo) VALUES
('María', 'García Torres', 'maria.garcia@educacion.pe', @ph, 1),
('José', 'Rodríguez Silva', 'jose.rodriguez@educacion.pe', @ph, 1),
('Ana', 'Martínez Ruiz', 'ana.martinez@educacion.pe', @ph, 1),
('Luis', 'Sánchez Vargas', 'luis.sanchez@educacion.pe', @ph, 1),
('Carmen', 'López Castro', 'carmen.lopez@educacion.pe', @ph, 1),
('Pedro', 'Díaz Morales', 'pedro.diaz@educacion.pe', @ph, 1),
('Rosa', 'Fernández Soto', 'rosa.fernandez@educacion.pe', @ph, 1),
('Juan', 'Torres Ríos', 'juan.torres@educacion.pe', @ph, 1),
('Diana', 'Ramírez Paredes', 'diana.ramirez@educacion.pe', @ph, 1),
('Miguel', 'Ángeles Quispe', 'miguel.angeles@educacion.pe', @ph, 1);

-- Estudiantes (2 per salon × 25 salones = 50, plus 2 extras)
INSERT INTO usuarios (nombres, apellidos, email, password, activo) VALUES
('Diego', 'Huamán Condori', 'diego.huaman@est.abc', @ph, 1),
('Lucía', 'Quispe Mamani', 'lucia.quispe@est.abc', @ph, 1),
('Andrés', 'Puma Ticona', 'andres.puma@est.abc', @ph, 1),
('Valeria', 'Mamani Flores', 'valeria.mamani@est.abc', @ph, 1),
('Santiago', 'Cruz Vilca', 'santiago.cruz@est.abc', @ph, 1),
('Camila', 'Torres Peña', 'camila.torres@est.abc', @ph, 1),
('Mateo', 'Rojas Fernández', 'mateo.rojas@est.abc', @ph, 1),
('Sofía', 'Castillo Vargas', 'sofia.castillo@est.abc', @ph, 1),
('Sebastián', 'Morales Tito', 'sebastian.morales@est.abc', @ph, 1),
('Isabella', 'Vega Ramos', 'isabella.vega@est.abc', @ph, 1),
('Benjamín', 'Navarro Soto', 'benjamin.navarro@est.abc', @ph, 1),
('Mía', 'Ortega Pacheco', 'mia.ortega@est.abc', @ph, 1),
('Daniel', 'Delgado Rivas', 'daniel.delgado@est.abc', @ph, 1),
('Emma', 'Guerrero Medina', 'emma.guerrero@est.abc', @ph, 1),
('Joaquín', 'Herrera Campos', 'joaquin.herrera@est.abc', @ph, 1),
('Abril', 'Mendoza Salazar', 'abril.mendoza@est.abc', @ph, 1),
('Gabriel', 'Peña Aguilar', 'gabriel.pena@est.abc', @ph, 1),
('Luna', 'Ríos Huerta', 'luna.rios@est.abc', @ph, 1),
('Emiliano', 'Flores Paredes', 'emiliano.flores@est.abc', @ph, 1),
('Olivia', 'Cáceres Gutiérrez', 'olivia.caceres@est.abc', @ph, 1),
('Liam', 'Rivera Zevallos', 'liam.rivera@est.abc', @ph, 1),
('Aitana', 'Vilca Montes', 'aitana.vilca@est.abc', @ph, 1),
('Lucas', 'Ramos Córdova', 'lucas.ramos@est.abc', @ph, 1),
('Martina', 'Salas Ochoa', 'martina.salas@est.abc', @ph, 1),
('Thiago', 'Medina Lozano', 'thiago.medina@est.abc', @ph, 1),
('Renata', 'Figueroa Espejo', 'renata.figueroa@est.abc', @ph, 1),
('Julián', 'Cabrera Arce', 'julian.cabrera@est.abc', @ph, 1),
('Antonella', 'Moreno Pizarro', 'antonella.moreno@est.abc', @ph, 1),
('Lautaro', 'Álvarez Villanueva', 'lautaro.alvarez@est.abc', @ph, 1),
('Catalina', 'Romero Bustamante', 'catalina.romero@est.abc', @ph, 1),
('Nicolás', 'Contreras Salinas', 'nicolas.contreras@est.abc', @ph, 1),
('Amanda', 'Miranda Chávez', 'amanda.miranda@est.abc', @ph, 1),
('Maximiliano', 'Solís Gálvez', 'maximiliano.solis@est.abc', @ph, 1),
('Jazmín', 'Ortiz Béjar', 'jazmin.ortiz@est.abc', @ph, 1),
('Bruno', 'Tapia Huayta', 'bruno.tapia@est.abc', @ph, 1),
('Zoe', 'Córdova Nina', 'zoe.cordova@est.abc', @ph, 1),
('Facundo', 'Pacheco Yalta', 'facundo.pacheco@est.abc', @ph, 1),
('Emilia', 'Guzmán Uribe', 'emilia.guzman@est.abc', @ph, 1),
('Agustín', 'Carrillo Mori', 'agustin.carrillo@est.abc', @ph, 1),
('Victoria', 'Arias Quiroz', 'victoria.arias@est.abc', @ph, 1),
('Santino', 'Farfán Linares', 'santino.farfan@est.abc', @ph, 1),
('Gabriela', 'Peralta Rojas', 'gabriela.peralta@est.abc', @ph, 1),
('Alonso', 'Zambrano Osorio', 'alonso.zambrano@est.abc', @ph, 1),
('Rafaela', 'Chávez Tello', 'rafaela.chavez@est.abc', @ph, 1),
('Ignacio', 'Valenzuela Pino', 'ignacio.valenzuela@est.abc', @ph, 1),
('Julieta', 'Barrios Céspedes', 'julieta.barrios@est.abc', @ph, 1),
('Tomás', 'Céspedes Mayta', 'tomas.cespedes@est.abc', @ph, 1),
('Leonor', 'Guerra Beltrán', 'leonor.guerra@est.abc', @ph, 1),
('Pablo', 'Infante Padilla', 'pablo.infante@est.abc', @ph, 1),
('Helena', 'Zúñiga Armas', 'helena.zuniga@est.abc', @ph, 1),
('Esteban', 'Bustos Quinteros', 'esteban.bustos@est.abc', @ph, 1),
('Florencia', 'Lozada Aguirre', 'florencia.lozada@est.abc', @ph, 1);

-- ==========================================================
-- 3. ASIGNAR ROLES
-- ==========================================================
-- Admin → rol ADMIN (1)
INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (1, 1);

-- Docentes → rol DOCENTE (2): users 2–11
INSERT INTO usuario_roles (usuario_id, rol_id) SELECT id, 2 FROM usuarios WHERE email LIKE '%@educacion.pe';

-- Estudiantes → rol ESTUDIANTE (3): users 12–63
INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT id, 3 FROM usuarios WHERE email LIKE '%@est.abc';

-- ==========================================================
-- 4. DOCENTES (10)
-- ==========================================================
INSERT INTO docentes (especialidad, usuario_id) VALUES
('Matemática', 2),
('Comunicación', 3),
('Ciencia y Tecnología', 4),
('Historia y Geografía', 5),
('Inglés', 6),
('Arte y Cultura', 7),
('Educación Física', 8),
('Formación Ciudadana', 9),
('Educación Religiosa', 10),
('Tutoría', 11);

-- ==========================================================
-- 5. SALONES (25: 5 grados × 5 secciones)
-- ==========================================================
INSERT INTO salones (grado, seccion, activo) VALUES
('1ro', 'A', 1), ('1ro', 'B', 1), ('1ro', 'C', 1), ('1ro', 'D', 1), ('1ro', 'E', 1),
('2do', 'A', 1), ('2do', 'B', 1), ('2do', 'C', 1), ('2do', 'D', 1), ('2do', 'E', 1),
('3ro', 'A', 1), ('3ro', 'B', 1), ('3ro', 'C', 1), ('3ro', 'D', 1), ('3ro', 'E', 1),
('4to', 'A', 1), ('4to', 'B', 1), ('4to', 'C', 1), ('4to', 'D', 1), ('4to', 'E', 1),
('5to', 'A', 1), ('5to', 'B', 1), ('5to', 'C', 1), ('5to', 'D', 1), ('5to', 'E', 1);

-- ==========================================================
-- 6. CURSOS (50)
-- ==========================================================
INSERT INTO cursos (nombre, descripcion, creditos, estado) VALUES
('Matemática 1ro', 'Aritmética y álgebra básica', 4, 1),
('Comunicación 1ro', 'Lenguaje y redacción', 4, 1),
('Ciencia 1ro', 'Biología básica', 3, 1),
('Historia 1ro', 'Historia del Perú antiguo', 3, 1),
('Inglés 1ro', 'Inglés básico A1', 2, 1),
('Arte 1ro', 'Dibujo y pintura', 2, 1),
('Matemática 2do', 'Álgebra y geometría', 4, 1),
('Comunicación 2do', 'Literatura y gramática', 4, 1),
('Ciencia 2do', 'Química básica', 3, 1),
('Historia 2do', 'Historia del Perú virreinal', 3, 1),
('Inglés 2do', 'Inglés básico A2', 2, 1),
('Arte 2do', 'Escultura y modelado', 2, 1),
('Matemática 3ro', 'Geometría analítica', 4, 1),
('Comunicación 3ro', 'Análisis literario', 4, 1),
('Ciencia 3ro', 'Física básica', 3, 1),
('Historia 3ro', 'Historia del Perú republicano', 3, 1),
('Inglés 3do', 'Inglés intermedio B1', 2, 1),
('Arte 3ro', 'Arte digital', 2, 1),
('Matemática 4to', 'Funciones y estadística', 4, 1),
('Comunicación 4to', 'Argumentación y debate', 4, 1),
('Ciencia 4to', 'Biología molecular', 3, 1),
('Historia 4to', 'Historia universal moderna', 3, 1),
('Inglés 4to', 'Inglés intermedio B2', 2, 1),
('Arte 4to', 'Fotografía y video', 2, 1),
('Matemática 5to', 'Cálculo diferencial', 4, 1),
('Comunicación 5to', 'Comunicación corporativa', 4, 1),
('Ciencia 5to', 'Química orgánica', 3, 1),
('Historia 5to', 'Historia contemporánea', 3, 1),
('Inglés 5to', 'Inglés avanzado C1', 2, 1),
('Arte 5to', 'Gestión cultural', 2, 1),
('Educación Física 1ro', 'Fundamentos deportivos', 2, 1),
('Educación Física 2do', 'Deportes colectivos', 2, 1),
('Educación Física 3ro', 'Atletismo', 2, 1),
('Educación Física 4to', 'Gimnasia', 2, 1),
('Educación Física 5to', 'Liderazgo deportivo', 2, 1),
('Formación Ciudadana 1ro', 'Convivencia escolar', 2, 1),
('Formación Ciudadana 2do', 'Derechos humanos', 2, 1),
('Formación Ciudadana 3ro', 'Participación ciudadana', 2, 1),
('Formación Ciudadana 4to', 'Democracia', 2, 1),
('Formación Ciudadana 5to', 'Ética profesional', 2, 1),
('Religión 1ro', 'Formación espiritual', 1, 1),
('Religión 2do', 'Valores cristianos', 1, 1),
('Religión 3ro', 'Ética religiosa', 1, 1),
('Religión 4to', 'Doctrina social', 1, 1),
('Religión 5ro', 'Liderazgo espiritual', 1, 1),
('Tutoría 1ro', 'Orientación personal', 1, 1),
('Tutoría 2do', 'Orientación académica', 1, 1),
('Tutoría 3ro', 'Orientación vocacional', 1, 1),
('Tutoría 4to', 'Proyecto de vida', 1, 1),
('Tutoría 5to', 'Preparación universitaria', 1, 1);

-- ==========================================================
-- 7. CARGA HORARIA (50+ entries)
-- Each docente assigned to ~5 cursos across ~2 salones
-- ==========================================================
-- Docente 1 (María García — Matemática): salones 1roA, 2doA
INSERT INTO carga_horaria (docente_id, salon_id, curso_id, horas_semanales) VALUES
(1, 1, 1, 5), (1, 1, 31, 2), (1, 1, 36, 2),  -- 1roA: Mate1, EF1, FC1
(1, 6, 7, 5), (1, 6, 32, 2);                 -- 2doA: Mate2, EF2

-- Docente 2 (José Rodríguez — Comunicación): salones 1roB, 2doB
INSERT INTO carga_horaria (docente_id, salon_id, curso_id, horas_semanales) VALUES
(2, 2, 2, 5), (2, 2, 41, 1),            -- 1roB: Com1, Rel1
(2, 7, 8, 5), (2, 7, 42, 1),            -- 2doB: Com2, Rel2
(2, 2, 46, 1);                           -- 1roB: Tut1

-- Docente 3 (Ana Martínez — Ciencia): salones 1roC, 2doC
INSERT INTO carga_horaria (docente_id, salon_id, curso_id, horas_semanales) VALUES
(3, 3, 3, 4), (3, 3, 33, 2),            -- 1roC: Cien1, EF3
(3, 8, 9, 4), (3, 8, 34, 2),            -- 2doC: Cien2, EF4
(3, 3, 37, 2);                           -- 1roC: FC2

-- Docente 4 (Luis Sánchez — Historia): salones 1roD, 2doD
INSERT INTO carga_horaria (docente_id, salon_id, curso_id, horas_semanales) VALUES
(4, 4, 4, 4), (4, 4, 41, 1), (4, 4, 46, 1),
(4, 9, 10, 4), (4, 9, 47, 1);

-- Docente 5 (Carmen López — Inglés): salones 1roE, 2doE
INSERT INTO carga_horaria (docente_id, salon_id, curso_id, horas_semanales) VALUES
(5, 5, 5, 3), (5, 5, 42, 1),
(5, 10, 11, 3), (5, 10, 47, 1),
(5, 5, 6, 2);

-- Docente 6 (Pedro Díaz — Arte): salones 3roA, 3roB
INSERT INTO carga_horaria (docente_id, salon_id, curso_id, horas_semanales) VALUES
(6, 11, 13, 4), (6, 11, 18, 2), (6, 11, 33, 2),
(6, 12, 14, 4), (6, 12, 43, 1);

-- Docente 7 (Rosa Fernández — EF): salones 3roC, 3roD
INSERT INTO carga_horaria (docente_id, salon_id, curso_id, horas_semanales) VALUES
(7, 13, 15, 4), (7, 13, 33, 2), (7, 13, 38, 2),
(7, 14, 16, 4), (7, 14, 48, 1);

-- Docente 8 (Juan Torres — FC): salones 3roE, 4toA
INSERT INTO carga_horaria (docente_id, salon_id, curso_id, horas_semanales) VALUES
(8, 15, 17, 3), (8, 15, 43, 2), (8, 15, 48, 1),
(8, 16, 19, 4), (8, 16, 24, 2);

-- Docente 9 (Diana Ramírez — Religión): salones 4toB, 4toC
INSERT INTO carga_horaria (docente_id, salon_id, curso_id, horas_semanales) VALUES
(9, 17, 20, 4), (9, 17, 44, 1), (9, 17, 49, 1),
(9, 18, 21, 4), (9, 18, 34, 2);

-- Docente 10 (Miguel Ángeles — Tutoría): salones 4toD, 4toE
INSERT INTO carga_horaria (docente_id, salon_id, curso_id, horas_semanales) VALUES
(10, 19, 22, 4), (10, 19, 44, 1), (10, 19, 39, 2),
(10, 20, 23, 3), (10, 20, 49, 1);

-- ==========================================================
-- 8. ESTUDIANTES (50+)
-- 2 per salon across 25 salones
-- ==========================================================
INSERT INTO estudiantes (codigo, usuario_id, salon_id) VALUES
-- 1ro A: users 12,13
('EST001', 12, 1), ('EST002', 13, 1),
-- 1ro B: users 14,15
('EST003', 14, 2), ('EST004', 15, 2),
-- 1ro C: users 16,17
('EST005', 16, 3), ('EST006', 17, 3),
-- 1ro D: users 18,19
('EST007', 18, 4), ('EST008', 19, 4),
-- 1ro E: users 20,21
('EST009', 20, 5), ('EST010', 21, 5),
-- 2do A: users 22,23
('EST011', 22, 6), ('EST012', 23, 6),
-- 2do B: users 24,25
('EST013', 24, 7), ('EST014', 25, 7),
-- 2do C: users 26,27
('EST015', 26, 8), ('EST016', 27, 8),
-- 2do D: users 28,29
('EST017', 28, 9), ('EST018', 29, 9),
-- 2do E: users 30,31
('EST019', 30, 10), ('EST020', 31, 10),
-- 3ro A: users 32,33
('EST021', 32, 11), ('EST022', 33, 11),
-- 3ro B: users 34,35
('EST023', 34, 12), ('EST024', 35, 12),
-- 3ro C: users 36,37
('EST025', 36, 13), ('EST026', 37, 13),
-- 3ro D: users 38,39
('EST027', 38, 14), ('EST028', 39, 14),
-- 3ro E: users 40,41
('EST029', 40, 15), ('EST030', 41, 15),
-- 4to A: users 42,43
('EST031', 42, 16), ('EST032', 43, 16),
-- 4to B: users 44,45
('EST033', 44, 17), ('EST034', 45, 17),
-- 4to C: users 46,47
('EST035', 46, 18), ('EST036', 47, 18),
-- 4to D: users 48,49
('EST037', 48, 19), ('EST038', 49, 19),
-- 4to E: users 50,51
('EST039', 50, 20), ('EST040', 51, 20),
-- 5to A: users 52,53
('EST041', 52, 21), ('EST042', 53, 21),
-- 5to B: users 54,55
('EST043', 54, 22), ('EST044', 55, 22),
-- 5to C: users 56,57
('EST045', 56, 23), ('EST046', 57, 23),
-- 5to D: users 58,59
('EST047', 58, 24), ('EST048', 59, 24),
-- 5to E: users 60,61
('EST049', 60, 25), ('EST050', 61, 25);

-- 2 extra estudiantes without salon (for testing asignar)
INSERT INTO estudiantes (codigo, usuario_id) VALUES
('EST051', 62), ('EST052', 63);

-- ==========================================================
-- 9. EVALUACIONES (~50 — one per curso)
-- Spread across recent months
-- ==========================================================
INSERT INTO evaluaciones (titulo, porcentaje, fecha, curso_id) VALUES
('PC1 - Matemática 1ro', 20.0, '2026-04-10', 1),
('PC1 - Comunicación 1ro', 20.0, '2026-04-12', 2),
('PC1 - Ciencia 1ro', 20.0, '2026-04-14', 3),
('PC1 - Historia 1ro', 20.0, '2026-04-16', 4),
('PC1 - Inglés 1ro', 20.0, '2026-04-18', 5),
('PC1 - Arte 1ro', 20.0, '2026-04-20', 6),
('PC1 - Matemática 2do', 20.0, '2026-04-22', 7),
('PC1 - Comunicación 2do', 20.0, '2026-04-24', 8),
('PC1 - Ciencia 2do', 20.0, '2026-04-26', 9),
('PC1 - Historia 2do', 20.0, '2026-04-28', 10),
('PC1 - Inglés 2do', 20.0, '2026-05-02', 11),
('PC1 - Arte 2do', 20.0, '2026-05-04', 12),
('PC1 - Matemática 3ro', 25.0, '2026-05-06', 13),
('PC1 - Comunicación 3ro', 25.0, '2026-05-08', 14),
('PC1 - Ciencia 3ro', 25.0, '2026-05-10', 15),
('PC1 - Historia 3ro', 25.0, '2026-05-12', 16),
('PC1 - Inglés 3ro', 20.0, '2026-05-14', 17),
('PC1 - Arte 3ro', 20.0, '2026-05-16', 18),
('PC1 - Matemática 4to', 25.0, '2026-05-18', 19),
('PC1 - Comunicación 4to', 25.0, '2026-05-20', 20),
('PC1 - Ciencia 4to', 25.0, '2026-05-22', 21),
('PC1 - Historia 4to', 25.0, '2026-05-24', 22),
('PC1 - Inglés 4to', 20.0, '2026-05-26', 23),
('PC1 - Arte 4to', 20.0, '2026-05-28', 24),
('PC1 - Matemática 5to', 30.0, '2026-06-01', 25),
('PC1 - Comunicación 5to', 30.0, '2026-06-03', 26),
('PC1 - Ciencia 5to', 25.0, '2026-06-05', 27),
('PC1 - Historia 5to', 25.0, '2026-06-07', 28),
('PC1 - Inglés 5to', 20.0, '2026-06-09', 29),
('PC1 - Arte 5to', 20.0, '2026-06-11', 30),
('PC2 - Matemática 1ro', 30.0, '2026-06-14', 1),
('PC2 - Comunicación 1ro', 30.0, '2026-06-16', 2),
('PC2 - Matemática 2do', 30.0, '2026-06-18', 7),
('PC2 - Comunicación 2do', 30.0, '2026-06-20', 8),
('PC2 - Matemática 3ro', 30.0, '2026-06-22', 13),
('PC2 - Comunicación 3ro', 30.0, '2026-06-24', 14),
('PC2 - Matemática 4to', 30.0, '2026-06-26', 19),
('PC2 - Comunicación 4to', 30.0, '2026-06-28', 20),
('PC2 - Matemática 5to', 30.0, '2026-06-30', 25),
('PC2 - Comunicación 5to', 30.0, '2026-07-02', 26),
('EF1 - Educación Física 1ro', 15.0, '2026-04-08', 31),
('EF1 - Educación Física 2do', 15.0, '2026-04-09', 32),
('EF1 - Educación Física 3ro', 15.0, '2026-05-11', 33),
('EF1 - Educación Física 4to', 15.0, '2026-05-13', 34),
('EF1 - Educación Física 5to', 15.0, '2026-06-10', 35),
('PC1 - Formación Ciudadana 1ro', 20.0, '2026-04-11', 36),
('PC1 - Formación Ciudadana 2do', 20.0, '2026-04-25', 37),
('PC1 - Formación Ciudadana 3ro', 20.0, '2026-05-09', 38),
('PC1 - Formación Ciudadana 4to', 20.0, '2026-05-23', 39),
('PC1 - Formación Ciudadana 5to', 20.0, '2026-06-06', 40);

-- ==========================================================
-- 10. NOTAS (50+)
-- 1 nota per evaluation for a random estudiante in the relevant salon
-- ==========================================================
INSERT INTO notas (nota, observacion, evaluacion_id, estudiante_id) VALUES
(15, 'Buen trabajo', 1, 1),
(12, 'Puede mejorar', 2, 3),
(16, 'Excelente', 3, 5),
(11, 'Regular', 4, 7),
(14, 'Bien', 5, 9),
(18, 'Muy bueno', 6, 10),
(13, 'Aceptable', 7, 11),
(10, 'Necesita repaso', 8, 13),
(17, 'Sobresaliente', 9, 15),
(9, 'Debe esforzarse más', 10, 17),
(14, 'Bien', 11, 19),
(16, 'Muy bien', 12, 20),
(12, 'Regular', 13, 21),
(15, 'Bueno', 14, 23),
(8, 'Requiere apoyo', 15, 25),
(13, 'Aceptable', 16, 27),
(17, 'Excelente', 17, 29),
(11, 'Puede mejorar', 18, 30),
(14, 'Bien', 19, 31),
(10, 'Necesita práctica', 20, 33),
(16, 'Muy bueno', 21, 35),
(12, 'Regular', 22, 37),
(15, 'Bien', 23, 39),
(9, 'Debe mejorar', 24, 40),
(18, 'Sobresaliente', 25, 41),
(13, 'Aceptable', 26, 43),
(11, 'Puede mejorar', 27, 45),
(14, 'Bien', 28, 47),
(16, 'Muy bueno', 29, 49),
(12, 'Regular', 30, 50),
(15, 'Buen trabajo', 31, 1),
(10, 'Necesita mejorar', 32, 3),
(14, 'Bien', 33, 11),
(13, 'Aceptable', 34, 13),
(17, 'Excelente', 35, 21),
(12, 'Regular', 36, 23),
(16, 'Muy bueno', 37, 31),
(11, 'Puede mejorar', 38, 33),
(15, 'Bien', 39, 41),
(9, 'Requiere apoyo', 40, 43),
(18, 'Sobresaliente', 41, 2),
(14, 'Bien', 42, 12),
(12, 'Regular', 43, 22),
(16, 'Muy bueno', 44, 32),
(13, 'Aceptable', 45, 42),
(11, 'Puede mejorar', 46, 2),
(15, 'Bueno', 47, 12),
(10, 'Necesita refuerzo', 48, 22),
(14, 'Bien', 49, 32),
(17, 'Excelente', 50, 42);

-- ==========================================================
-- END OF SEED DATA
-- ==========================================================
