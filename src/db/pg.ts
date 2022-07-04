import { Pool, QueryResult } from "pg";

// Number of default client instances that the pool has => 10
const pool = new Pool({
    max: 10,
});

export default {
    query: async (
        text: string,
        params: any,
        callback: (err: Error, result: QueryResult) => void
    ) => {
        const start = Date.now();
        return pool.query(text, params, (err, res) => {
            const duration = Math.floor((Date.now() - start) / 1000);
            console.log(
                `Exectued pg query: ${text} => ${duration} secs, rows: ${res.rowCount}`
            );
            callback(err, res);
        });
    },
    getClient: async () => {
        const client = await pool.connect();
        const release = client.release;

        // set a timeout of 5 seconds
        const timeout = setTimeout(() => {
            console.error(
                "A client has been checked out for more than 5 seconds!"
            );
        }, 5000);


        client.release = () => {
            // clear our timeout
            clearTimeout(timeout);
            // set the methods back to their old un-monkey-patched version
            client.release = release;
            return release.apply(client);
        };
        return client;
    },
};
