import 'dotenv/config';
import express from 'express';
import { pool, testConnection } from './db/context.js';
import agendamentoRouter from './routes/agendamentos.js';

const app = express ();
app.use(express.json());

app.get('/health', async (request, response) => {
    const teste = await (testConnection());
    console.log(teste)
    response
        .status(200)
        .json({status: 'OK', banco: 'CONECTADO'})
})

app.get('/api/medicos', async (request, response) => {
    const [linhas] = await pool.execute('SELECT id, nome FROM medicos');
    response.json(linhas);
});

app.use('/api/agendamentos', agendamentoRouter);

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
    console.log(`API ouvindo em http://localhost:${PORT}`);
});
