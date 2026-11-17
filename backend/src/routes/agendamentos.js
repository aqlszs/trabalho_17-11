import { Router } from 'express';
import { pool } from '../db/context.js';

const agendamentoRouter = Router();

agendamentoRouter.get('/', async (request, response) => {
    const { medico_id, data } = request.query;

    let sql = `SELECT a.id, a.paciente_nome, a.data_hora, m.nome AS medico, m.especialidade
               FROM agendamentos a
               INNER JOIN medicos m ON m.id = a.medico_id
               WHERE 1 = 1`;
    const parametros = [];

    if (medico_id) {
        sql += ' AND a.medico_id = ?';
        parametros.push(medico_id);
    }
    if (data) {
        sql += ' AND DATE(a.data_hora) = ?';
        parametros.push(data);
    }

    const [linhas] = await pool.execute(sql, parametros);
    response.json(linhas);
});

agendamentoRouter.post('/', async (request, response) => {
    const { medico_id, paciente_nome, data_hora, observacao } = request.body;

    if (!medico_id || !paciente_nome || !data_hora) {
        return response.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const [resultado] = await pool.execute(
        'INSERT INTO agendamentos (medico_id, paciente_nome, data_hora, observacao) VALUES (?, ?, ?, ?)',
        [medico_id, paciente_nome, data_hora, observacao || null]
    );

    response.status(201).json({ id: resultado.insertId });
});

agendamentoRouter.delete('/:id', async (request, response) => {
    const [resultado] = await pool.execute(
        'DELETE FROM agendamentos WHERE id = ?',
        [request.params.id]
    );

    if (resultado.affectedRows > 0) {
        return response.status(200).json({ mensagem: 'Removido' });
    }
    response.status(404).json({ erro: 'Não encontrado' });
});

export default agendamentoRouter;
