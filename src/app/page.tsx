import styles from "./page.module.css";
// @ts-ignore
import Rcon from "rcon";

type PalworldPlayer = {
  name: string;
  playerUid: string;
}

const parseServerResponseToPlayers = (playerServerResponse: string) : PalworldPlayer[] => {
  if(!playerServerResponse) return [];

  const lines = playerServerResponse.split(/\r?\n/);

  const players = lines.map(line => {
    const playerDetails = line.split(',');
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
    var conn = new Rcon(process.env.PALWORLD_HOST, process.env.PALWORLD_PORT, process.env.PALWORLD_ADMIN_PASSWORD);
    conn.connect();

    conn.on('auth', function() {
      console.log("Authenticated");
      conn.send("ShowPlayers");
    }).on('response', function(str: any) {
      console.log("Response: " + str);
    }).on('error', function(err: any) {
      console.log("Error: " + err);
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


export default async function Home() {
  const data = await getPlayers();

  const playerData = data.map(player => (
    <tr key={player.name}>
    <th>{player.name}</th>
    <td>{player.playerUid}</td>
  </tr>
  ))

  return (
    <main className="container">
          <h1>Palstoria Server Players</h1>
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
    </main>
  );
}
