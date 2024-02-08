import styles from "./page.module.css";
// @ts-ignore
import Rcon from "rcon";

type PalworldPlayer = {
  name: string;
  playerUid: string;
}

const getRconConnection = () => new Rcon(process.env.PALWORLD_HOST, process.env.PALWORLD_PORT, process.env.PALWORLD_ADMIN_PASSWORD);

const parseServerResponseToPlayers = (playerServerResponse: string) : PalworldPlayer[] => {
  if(!playerServerResponse) return [];

  const lines = playerServerResponse.split(/\r?\n/);

  const players = lines.map(line => {
    const playerDetails = line.split(',');
    if(!playerDetails || playerDetails.length < 2) {
      return {
        name: '',
        playerUid: ''
      }
    }

    return {
      name: playerDetails[0],
      playerUid: playerDetails[1]
    }
  });


  if(players.length <= 1) {
    return [];
  }

  return players.splice(1);
};


const getPlayers = (): Promise<PalworldPlayer[]> => {
  return new Promise((resolve, reject) => {
    const conn = getRconConnection();
    
    conn.connect();

    conn.on('auth', function() {
      console.log("Authenticated");
      conn.send("ShowPlayers");
    }).on('response', function(str: any) {
      console.log("Response: " + str);
    }).on('error', function(err: any) {
      console.log("Something went wrong: " + err);
      reject(err);
    }).on('server', function(str: any) {
      console.log('server response:\n' + str);
      conn.disconnect();
      resolve(parseServerResponseToPlayers(str));
    }).on('end', function() {
      console.log("Connection closed");
    });
  });
}

const parseVersion = (versionString: string) => {
  if(!versionString) return versionString;

  const start = versionString.indexOf('[');
  const end = versionString.indexOf(']');

  if(start < 0 || end < 0) return 'N/A';

  return versionString.substring(start + 1, end);
}

const getVersion = (): Promise<String> => {
  return new Promise((resolve, reject) => {
    const conn = getRconConnection();
    conn.connect();

    conn.on('auth', function() {
      console.log("Authenticated");
      conn.send("Info");
    }).on('response', function(str: any) {
      console.log("Response: " + str);
    }).on('error', function(err: any) {
      console.log("Something went wrong: " + err);
      reject(err);
    }).on('server', function(str: any) {
      console.log('server response:\n' + str);
      conn.disconnect();
      resolve(parseVersion(str));
    }).on('end', function() {
      console.log("Connection closed");
    });

  });
}

const getServerDataPage = async () => {
  const data = await getPlayers();
  const version = await getVersion();

  const playerData = data.map(player => (
    <tr key={player.name}>
    <th>{player.name}</th>
    <td>{player.playerUid}</td>
  </tr>
  ))

  return (
    <div className="container">
          <h1>Palstoria Server Players [{version}]</h1>
          <table className="table table-primary">
            <thead>
                <tr>
                  <th scope="col">Player Name</th>
                  <th scope="col">Player UID</th>
                </tr>
            </thead>
            <tbody>
              {playerData}
            </tbody>
          </table>
    </div>
  )
}

const getErrorPage = () => (
  <div className="container">
    <h1 className="text-center text-danger">Something went wrong</h1>
  </div>
)

export default async function Home() {
  let page;

  try {
    page = await getServerDataPage();
  } catch(err) {
    console.log('Rendering error');
    page = getErrorPage();
  }

  

  return (
    <main className="container">
      {page}
    </main>
  );
}
