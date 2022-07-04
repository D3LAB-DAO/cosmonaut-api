import { createClient, RedisClientType } from 'redis';

let client: RedisClientType;

export default {
    getClient: async (url?: string) => {
        if (client) {
            return client
        }
        if (!url) {
            client = createClient({
                url: 'redis://localhost:6379'
            })
        } else {
            client = createClient({url})
        }

        await client.connect();

        return client

    }
}