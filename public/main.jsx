function MyApp() {
  const [ficheiros, setFicheiros] = React.useState([]);
  const [selectedFilename, setSelectedFilename] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [isFetchFicheiros, setIsFetchFicheiros] = React.useState(false);
  const inputFile = React.useRef(null);

  function changeFile() {
    if (inputFile.current) {
      const files = inputFile.current.files;

      if (files.length == 0) {
        return;
      }

      setSelectedFilename(files[0].name);
    }
  }

  async function uploadFile() {
    if (isUploading) return;

    if (inputFile.current) {
      const files = inputFile.current.files;

      if (files.length == 0) {
        alert('Precisas selecionar um ficheiro antes');

        return;
      }
      setIsUploading(true);

      const file = files[0];

      const data = new FormData();
      data.append('file', file);

      const response = await fetch('/api/v1/upload', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          fetchFicheiros();
        }
      }

      setIsUploading(false);
    }
  }

  React.useEffect(() => {
    fetchFicheiros();
  }, []);
  async function fetchFicheiros() {
    if (isFetchFicheiros) return;
    setIsFetchFicheiros(true);
    const response = await fetch('/api/v1/files');
    if (response.ok) {
      const data = await response.json();

      if (data.success) {
        setFicheiros(data.data);
      }
    }

    setIsFetchFicheiros(false);
  }
  return (
    <div
      className="px-8 py-12 bg-zinc-900
text-white min-h-screen w-full"
    >
      <div className="flex">
        <h1 className="text-2xl font-bold mb-4">Media Service</h1>
        <a
          className="text-zinc-400 ml-auto  hover:opacity-70 duration-200"
          href="/docs"
        >
          API Docs
        </a>
      </div>
      <div
        className="flex flex-col gap-4 mb-12 items-center
    w-fit px-6 py-4 mx-auto"
      >
        <p className="text-sm font-bold">Carregar ficheiro</p>
        <div className="flex gap-4">
          {selectedFilename == '' ? 'Selecione um ficheiro' : selectedFilename}
          <label
            htmlFor="file"
            className="bg-zinc-500 text-xs rounded-3xl py-2 px-4"
          >
            Escolher ficheiro
            <input
              onChange={changeFile}
              ref={inputFile}
              type="file"
              accept="video/mp4, video/x-msvideo, audio/mpeg, audio/wav"
              className="hidden"
              id="file"
            />
          </label>
        </div>
        <button onClick={uploadFile} className="bg-blue-500 px-8 py-2">
          {isUploading ? (
            <img src="/assets/load.gif" width={30} className="invert" />
          ) : (
            'Enviar'
          )}
        </button>
      </div>

      <div className="w-[550px] mx-auto max-w-full">
        <p className="font-bold text-xl mb-2">Ficheiros carregados</p>
        <hr />
        <div className="flex gap-4 flex-col mt-4">
          {isFetchFicheiros ? (
            <img src="/assets/load.gif" width={30} className="invert" />
          ) : (
            ficheiros.map((ficheiro) => {
              return <Ficheiro key={ficheiro.id} ficheiro={ficheiro} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}

function Ficheiro({ ficheiro }) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div>
      <div
        onClick={() => {
          setShowDetails(!showDetails);
        }}
        className="bg-zinc-800 px-6 py-4
    text-sm select-none flex gap-2 items-center"
      >
        <p>{ficheiro.name}</p>
        <img
          src="/assets/arrow-down.png"
          width={24}
          className={
            `ml-auto invert
          opacity-70  duration-200 ` + (showDetails ? ` rotate-180` : '')
          }
          alt=""
        />
      </div>
      {showDetails && (
        <div
          className="bg-zinc-850 px-6 py-4
      text-sm"
        >
          <p>Dados e Metadados</p>
          <div className="text-zinc-400">
            <p>ID: {ficheiro.id}</p>
            <p>Nome: {ficheiro.name}</p>
            <p>Duração: {ficheiro.duration} s</p>
            <p>Tamanho: {ficheiro.size} bytes</p>
            <p>
              Tipo de mídia:{' '}
              {ficheiro.type == 'audio'
                ? 'Áudio'
                : ficheiro.type == 'video'
                  ? 'Vídeo'
                  : ''}
            </p>
            <p>Mime Type: {ficheiro.mimetype}</p>
          </div>

          <p className="mt-4">Processamento</p>
          <div className="text-zinc-400">
            <p>
              Baixar mídia:
              <a
                className="text-blue-400 hover:opacity-70 duration-200"
                href={ficheiro.download_url}
              >
                {ficheiro.download_url}
              </a>
            </p>

            <p>
              Mídia curta:
              <a
                className="text-blue-400  hover:opacity-70 duration-200"
                href={ficheiro.short_file}
              >
                {ficheiro.short_file}
              </a>
            </p>

            {ficheiro.type == 'audio' && (
              <p>
                Áudio convertido:
                <a
                  className="text-blue-400  hover:opacity-70 duration-200"
                  href={ficheiro.file_converted}
                >
                  {ficheiro.file_converted}
                </a>
              </p>
            )}

            {ficheiro.type == 'video' && (
              <p>
                Thumbnail:
                <a
                  className="text-blue-400  hover:opacity-70 duration-200"
                  href={ficheiro.thumbnail}
                >
                  {ficheiro.thumbnail}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<MyApp />);
