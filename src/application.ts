import { Service } from './service';
import { Db } from './db';

export class Application {
    static start() {
        console.log('starting application for ' + (Application.isTest() ? 'test' : 'production'));

        Db.init();
        Service.start();
    }
    
    static isTest(): boolean {
        return process.env.PROD !== "true";
    }
}