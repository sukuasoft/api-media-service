import dotEnv from 'dotenv';
// Iniciar as variaveis de ambiente
dotEnv.config();
import { initServer } from './server';

// Iniciar o servidor
initServer();
