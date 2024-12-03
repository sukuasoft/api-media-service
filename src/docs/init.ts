import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import path from 'path';

// Gerar a documentação
export async function initDoc(server: Express) {
  const swaggerDocument = JSON.parse(
    await readFile(path.resolve(__dirname, 'docs.json'), {
      encoding: 'utf-8',
    }),
  );

  server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
