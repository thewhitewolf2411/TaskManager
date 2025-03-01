import dotenv from 'dotenv';

dotenv.config();

const config = {
    jwtSecret: process.env.PRIV_KEY || '',
    jwtIssuer: 'taskmanagerappbe',
    jwtAudience: process.env.JWT_AUDIENCE || 'localhost:5000',
    port: 5000,
    dbMigrationPath: 'src/migrations',
    dbConfig: {
        user: process.env.DB_USER || '',
        host: process.env.DB_HOST || '',
        database: process.env.DB_DATABASE || '',
        password: process.env.DB_PASSWORD || '',
        port: Number(process.env.DB_PORT),
    }

}

export default config