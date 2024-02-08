import styles from "./page.module.css";
import getServerData from './lib/data';
export const dynamic = 'force-dynamic'

const getServerDataPage = async () => {
  const data = await getServerData();

  const playerData = data?.players?.map(player => (
    <tr key={player.name}>
    <th>{player.name}</th>
    <td>{player.playerUid}</td>
  </tr>
  ))

  return (
    <div className="container">
          <h1>Palstoria Server Players [{data?.version}]</h1>
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
