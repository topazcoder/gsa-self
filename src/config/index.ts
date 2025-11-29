interface Config {
    port: number;
    nodeEnv: string;
    MONGODB_URI?: string;
}

export const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI
}