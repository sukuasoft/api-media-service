# API Media Service

API backend que permite o upload de arquivos de vídeo e áudio,realiza o processamento básico desses arquivos e fornece uma interface para acessar os resultados do processamento.

## 1. Configuração

### Variavéis de ambiente

Deve primeiramente copiar o ficheiro `.env.example` e renomear o arquivo copiado para `.env`. Todas variaveis padrão que vem do arquivo copiado é suficiente para API funcionar correctamente. Observe a seguintes descrições:

- **PORT**: A porta que servidor local vai rodar. Padrão 5533
- **MAX_LENGHT_VIDEO** Limite do tamanho de arquivos de vídeo para upload. Padrão 100 MB. Obs: Medido em bytes
- **MAX_LENGHT_AUDIO** Limite do tamanho de arquivos de áudio para upload. Padrão 30 MB. Obs: Medido em bytes
- **DATABASE_URL** URL do banco de dados do projecto manipulado pelo Prisma.
- **HOST** URL do servidor local

### Banco de dados

Este projecto é aberta a vários tipos de SGBDs para armazenamento dos dados e metadados dos ficheiros, porque conta com o uso do Prisma, que é uma ferramenta de ORM (Object-Relational Mapping) para Node.js e TypeScript que simplifica a interação com bancos de dados.
Normalmente nós manipulamos qual SGBDs utilizar com variavel de ambiente
**DATABASE_URL**. Caso deseja utilizar uma SGBDs diferente do padrão que atualmente é SQLite, consulte as [URLS de Conexão](https://www.prisma.io/docs/orm/reference/connection-urls) do prisma.

Após isto existem algumas etapas para base de dados estar configurada:

1. `npx prisma migrate dev` - Rode este comando para pode migrar toda estrutura do schema para base de dados. Será solicitado nome da migração é existe nenhuma regra sobre isso, mas sugerimos que nomeia a suas migrações de forma sequencial ou por data, Ex: `migration_1` ou `migration_03_12_2024`

2. `npx prisma generate` - Rode este comando para permite que o projecto posso gerar os arquivos necessário para interagir com base de dados

### Processamento de mídia

Este projecto utiliza a biblioteca [Fluent-FFMPEG](https://www.npmjs.com/package/fluent-ffmpeg) para o processamento das mídias carregadas na API. E para seu funcionamento correcto, devemos configurar algumas coisas. Primeiramnete baixar `ffmpeg` e o `ffprobe`.

- ffmpeg é uma ferramenta de código aberto para processamento de áudio e vídeo.
- ffprobe é uma ferramenta complementar ao FFmpeg, usada para inspecionar informações detalhadas sobre arquivos de mídia.

Baixa [aqui](https://ffmpeg.org/download.html) os binários do `ffmpeg` e `ffprobe` e define na variável PATH do sistema.

## 2. Execução

Após toda este configuração o projecto pode rodar em modo de produção ou desenvolvimento.

### Modo de desenvolvimento

É um modo desenhado para rodar em ambiente de desenvolvimento que oferece recursos que inclui o auto-reload que oferece uma experiência de desenvolvimento que permite desenvolver este projecto com mais rapidez e facilidade. Para rodar no `Modo de desenvolvimento` deves apenas:

- Rodar o script `npm run dev`

### Modo de produção

Permite rodar o projecto totalmente otimizado para ambiente de produção com todos os ficheiros compilados e otimizados. Para rodar no `Modo de produção` deves fazer o seguinte:

1. Compilar no projecto `npm run build`
2. Rodar o projecto compilado `npm start`

## 3. Formatação

O projecto utiliza o prettier para formatação do código podes facilmente antes de todo commit rodar o comando `npm run format` para poder formatar o projecto para configuraçōes do prettier.

## 4. Documentação

A documentação da API pode ser acessada por meio do endereço localhost e porta defina na variável de ambiente. Ex: [http://localhost:5533](http://localhost:5533)
