export interface DbConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
}

export interface Config {
    port: number;
    sessionSecret: string;
    db: DbConfig;
}

export const CONFIG: Config = {
    port: 3000,
    sessionSecret: 'oimasterkafuu',
    db: {
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'rootroot',
        name: 'note'
    }
}
