CREATE DATABASE plataforma_educativa;
USE plataforma_educativa;

-- =========================
-- TABLA ROLES
-- =========================
CREATE TABLE roles(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE usuarios(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- USUARIO_ROL
-- =========================
CREATE TABLE usuario_roles(
    usuario_id BIGINT,
    rol_id BIGINT,
    PRIMARY KEY(usuario_id, rol_id),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(rol_id) REFERENCES roles(id)
);

-- =========================
-- DOCENTES
-- =========================
CREATE TABLE docentes(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT UNIQUE,
    especialidad VARCHAR(100),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

-- =========================
-- ESTUDIANTES
-- ========================
CREATE TABLE estudiantes(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT UNIQUE,
    codigo VARCHAR(20) UNIQUE,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

-- =========================
-- COORDINADORES
-- =========================
CREATE TABLE coordinadores(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT UNIQUE,
    area VARCHAR(100),
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

-- =========================
-- PERIODOS
-- =========================
CREATE TABLE periodos(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT TRUE
);

-- =========================
CREATE TABLE cursos(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creditos INT,
    estado BOOLEAN DEFAULT TRUE
);

-- =========================
-- SALONES
-- =========================
CREATE TABLE salones(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    capacidad INT,
    ubicacion VARCHAR(100)
);

-- =========================
-- ASIGNACIONES DOCENTES
-- =========================
CREATE TABLE asignaciones_docentes(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    docente_id BIGINT,
    curso_id BIGINT,
    salon_id BIGINT,
    periodo_id BIGINT,
    FOREIGN KEY(docente_id) REFERENCES docentes(id),
    FOREIGN KEY(curso_id) REFERENCES cursos(id),
    FOREIGN KEY(salon_id) REFERENCES salones(id),
    FOREIGN KEY(periodo_id) REFERENCES periodos(id)
);
CREATE TABLE matriculas(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id BIGINT,
    curso_id BIGINT,
    periodo_id BIGINT,
    fecha_matricula DATE,
    FOREIGN KEY(estudiante_id) REFERENCES estudiantes(id),
    FOREIGN KEY(curso_id) REFERENCES cursos(id),
    FOREIGN KEY(periodo_id) REFERENCES periodos(id)
);

-- =========================
-- EVALUACIONES
-- =========================
CREATE TABLE evaluaciones(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    curso_id BIGINT,
    titulo VARCHAR(100),
    porcentaje DECIMAL(5,2),
    fecha DATE,
    FOREIGN KEY(curso_id) REFERENCES cursos(id)
);

-- =========================
-- NOTAS
-- =========================
CREATE TABLE notas(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    evaluacion_id BIGINT,
    estudiante_id BIGINT,
    nota DECIMAL(5,2),
    observacion VARCHAR(255),
    FOREIGN KEY(evaluacion_id) REFERENCES evaluaciones(id),
    FOREIGN KEY(estudiante_id) REFERENCES estudiantes(id)
);
CREATE TABLE asistencias(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    estudiante_id BIGINT,
    curso_id BIGINT,
    fecha DATE,
    presente BOOLEAN,
    FOREIGN KEY(estudiante_id) REFERENCES estudiantes(id),
    FOREIGN KEY(curso_id) REFERENCES cursos(id)
);
SELECT * FROM USUARIOS