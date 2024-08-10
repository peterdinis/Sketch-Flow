declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            NODE_ENV: 'development' | 'production';
            NEXTAUTH_SECRET: string;
            LIVEBLOCKS_PUBLIC_KEY: string;
            LIVEBLOCKS_SECRET_KEY: string;
        }
    }
}

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
