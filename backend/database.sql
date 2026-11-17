CREATE DATABASE IF NOT EXISTS clinica;
USE clinica;

CREATE TABLE IF NOT EXISTS medicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    medico_id INT NOT NULL,
    paciente_nome VARCHAR(100) NOT NULL,
    data_hora DATETIME NOT NULL,
    observacao VARCHAR(255),
    FOREIGN KEY (medico_id) REFERENCES medicos(id)
);

INSERT INTO medicos (nome, especialidade) VALUES
    ('Dra. Ana Souza', 'Cardiologia'),
    ('Dr. Carlos Lima', 'Ortopedia'),
    ('Dra. Beatriz Rocha', 'Pediatria');

INSERT INTO agendamentos (medico_id, paciente_nome, data_hora, observacao) VALUES
    (1, 'João Pereira', '2026-11-20 09:00:00', 'Retorno de exame'),
    (2, 'Maria Silva', '2026-11-20 14:30:00', NULL),
    (3, 'Pedro Santos', '2026-11-21 10:15:00', 'Primeira consulta');
