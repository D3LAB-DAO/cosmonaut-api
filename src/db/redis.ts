import { createClient, RedisClientType } from 'redis';
import conf from '../config'

let client: RedisClientType;

export default {
    getClient: async (url?: string) => {
        if (client) {
            return client
        }
        if (!url) {
            client = createClient({
                url: conf.redis.url
            })
        } else {
            client = createClient({url})
        }

        await client.connect();

        return client

    }
}