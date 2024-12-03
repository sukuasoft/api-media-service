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


## 5. Exemplos de uso

#### 1. Rota Inicial da API
**Método:** `GET`  
**URL:** `/api/v1`

#### Resposta Exemplo
```json
{
  "sucess": true,
  "message": "API Server running..."
}
```

#### 2. Carregar Mídia
**Método:** `POST`  
**URL:** `/api/v1/upload`

#### Corpo da Requisição
```plaintext
Content-Type: multipart/form-data

{
  "file": [file-to-upload]
}
```
```json
{
  "sucess": true,
  "message": "File Uploaded",
  "data": {
    "id": "4353534-353435-3432jsd",
    "createdAt": "2022-12-02"
  }
}
```


#### 3. Pegar Todos Ficheiros Carregados
**Método:** `GET`  
**URL:** `/api/v1/files`

#### Resposta Exemplo
```json
{
  "sucess": true,
  "data": [
    {
      "id": "a8ab667c-149d-4970-887e-ce83056aabfd",
      "name": "Oruam – Rolé na Favela de Nave (feat. Didi,Dj Lc da Roça,MC K9,MC Smith).mp3",
      "type": "audio",
      "size": 5858200,
      "duration": 193.044898,
      "mimetype": "audio/mpeg",
      "createdAt": "2024-12-02T19:27:09.374Z",
      "download_url": "http://localhost:5533/api/v1/files/a8ab667c-149d-4970-887e-ce83056aabfd/download",
      "short_file": "http://localhost:5533/api/v1/files/a8ab667c-149d-4970-887e-ce83056aabfd/short_file",
      "file_converted": "http://localhost:5533/api/v1/files/a8ab667c-149d-4970-887e-ce83056aabfd/converted"
    },
    {
      "id": "86ea1333-bc62-4995-9c24-79b5788b01d5",
      "name": "Cópia de Nome.mp4",
      "type": "video",
      "size": 553683,
      "duration": 5,
      "mimetype": "video/mp4",
      "createdAt": "2024-12-02T19:28:15.440Z",
      "download_url": "http://localhost:5533/api/v1/files/86ea1333-bc62-4995-9c24-79b5788b01d5/download",
      "short_file": "http://localhost:5533/api/v1/files/86ea1333-bc62-4995-9c24-79b5788b01d5/short_file",
      "thumbnail": "http://localhost:5533/api/v1/files/86ea1333-bc62-4995-9c24-79b5788b01d5/thumbnail"
    }
  ]
}
```


#### 4. Pegar Ficheiro Carregado
**Método:** `GET`  
**URL:** `/api/v1/files/{id}`

#### Parâmetros
- `id` (requerido): **ID do arquivo**.

#### Resposta Exemplo
```json
{
  "sucess": true,
  "data": {
    "id": "a8ab667c-149d-4970-887e-ce83056aabfd",
    "name": "Oruam – Rolé na Favela de Nave (feat. Didi,Dj Lc da Roça,MC K9,MC Smith).mp3",
    "type": "audio",
    "size": 5858200,
    "duration": 193.044898,
    "mimetype": "audio/mpeg",
    "createdAt": "2024-12-02T19:27:09.374Z",
    "download_url": "http://localhost:5533/api/v1/files/a8ab667c-149d-4970-887e-ce83056aabfd/download",
    "short_file": "http://localhost:5533/api/v1/files/a8ab667c-149d-4970-887e-ce83056aabfd/short_file",
    "file_converted": "http://localhost:5533/api/v1/files/a8ab667c-149d-4970-887e-ce83056aabfd/converted"
  }
}
```

#### 5. Pegar Thumbnail do Ficheiro Carregado
**Método:** `GET`  
**URL:** `/api/v1/files/{id}/thumbnail`

#### Parâmetros
- `id` (requerido): **ID do arquivo**.

#### Resposta Exemplo
- Binary File

#### 6. Baixar Ficheiro Carregado
**Método:** `GET`  
**URL:** `/api/v1/files/{id}/download`

#### Parâmetros
- `id` (requerido): **ID do arquivo**.

#### Resposta Exemplo
- Binary File

#### 7. Baixar Ficheiro Convertido
**Método:** `GET`  
**URL:** `/api/v1/files/{id}/converted`

#### Parâmetros
- `id` (requerido): **ID do arquivo**.

#### Resposta Exemplo
- Binary File

#### 8. Baixar Ficheiro Curto
**Método:** `GET`  
**URL:** `/api/v1/files/{id}/short_file`

#### Parâmetros
- `id` (requerido): **ID do arquivo**.

#### Resposta Exemplo
- Binary File