import RxDB, { RxDatabase, QueryChangeDetector } from 'rxdb';

import { category } from "./Schemas";

QueryChangeDetector.enableDebugging();

RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http'));

export default class Database {

    public static async create(dbName: string) {
        // Create DB
        const db: RxDatabase = await RxDB.create({
            name: dbName,
            adapter: 'idb', 
            password: '12345678'
        });

        // Create collections
        await db.collection({
            name: 'categories',
            schema: category
        });

        return db;
    }
}