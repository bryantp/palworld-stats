'use server';
import { sql, QueryResultRow } from '@vercel/postgres';
 
export type PlayerPlayHistory = {
    userName: string,
    timePlayedMinutes: number
}
 
const convertFromDb = (dbResults: QueryResultRow[]): PlayerPlayHistory [] => {
    return dbResults.map(row => ({userName: row.user_name, timePlayedMinutes: row.time_played_minutes}));
}

export type PlayerPlayHistoryLookback = {
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
}

export const getPlayersPlayHistory = (lookback: PlayerPlayHistoryLookback): Promise<PlayerPlayHistory[]>  => {
    try {
        const data = sql`
            select user_name, floor(extract(epoch from sum(logout_timestamp - login_timestamp))/60) as time_played_minutes from palworld_login_logout_events
            where 
                logout_timestamp is not null
                and login_timestamp >=  now() -  make_interval(${lookback.years},${lookback.months},${lookback.weeks},${lookback.days},${lookback.hours})
            group by user_name order by time_played_minutes desc
        `;
        const a = data
            .then(result => result.rows)
            .then(result  => convertFromDb(result));
        return a;
    } catch(error) {
        console.error(`Unable to retrieve player play time ${error}`);
        return new Promise((_, reject) => {
            reject(error);
        });
    }
}
