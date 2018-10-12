import RxDB, { RxDatabase, QueryChangeDetector } from 'rxdb';

import { category } from "./Schemas";

QueryChangeDetector.enableDebugging();

RxDB.plugin(require('pouchdb-adapter-idb'));
RxDB.plugin(require('pouchdb-adapter-http'));

export default class Database {

    public static async create(dbName: string) {
        // Clean previous Base if needed
        await RxDB.removeDatabase(dbName, 'idb');

        // Create DB
        const db: RxDatabase = await RxDB.create({
            name: dbName,
            adapter: 'idb', 
            password: '12345678',
            multiInstance: false
        });

        // Create collections
        await db.collection({
            name: 'categories',
            schema: category
        });

        return db;
    }
}