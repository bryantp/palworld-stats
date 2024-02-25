'use server';
import { Pool, QueryResult } from 'pg'

 
type PlayerPlayHistoryDb = {
    user_name: string,
    time_played_minutes: number
}


export type PlayerPlayHistory = {
    userName: string,
    timePlayedMinutes: number
}

export type PlayerPlayHistoryLookback = {
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
}
 
const convertFromDb = (dbResults: QueryResult<PlayerPlayHistoryDb>): PlayerPlayHistory [] => {
    return dbResults.rows.map(row => ({userName: row.user_name, timePlayedMinutes: row.time_played_minutes}));
}

let instance: Pool;

const getInstance = () => {
    if(!instance) {
        const config = {
            connectionString: process.env.POSTGRES_URL,
            connectionTimeoutMillis: 2000,
            query_timeout: 1000,
            statement_timeout: 1000,
            application_name: "palworld-stats",
            ssl: {
                rejectUnauthorized: false,
                ca: process.env.CA_CERT
            }
        };

        instance = new Pool(config);
    }

    return instance;
}

export const getPlayersPlayHistory = (lookback: PlayerPlayHistoryLookback): Promise<PlayerPlayHistory[]>  => {
    const pool = getInstance();
    return pool.connect().then(client => {
        try {
            const data = client.query(`
                select user_name, floor(extract(epoch from sum(COALESCE(logout_timestamp, now()) - login_timestamp))/60) as time_played_minutes from palworld_login_logout_events
                where 
                    login_timestamp >=  now() -  make_interval($1,$2,$3,$4,$5)
                group by user_name order by time_played_minutes desc
            `, [lookback.years,lookback.months,lookback.weeks,lookback.days,lookback.hours]);
            return data
                .then(result  => convertFromDb(result));
        } catch(error) {
            console.error(`Unable to retrieve player play time ${error}`);
            return new Promise((_, reject) => {
                reject(error);
            });
        } finally {
            client.release();
        }
    });
}
