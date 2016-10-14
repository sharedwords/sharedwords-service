import { Application } from './application';
import { Express } from 'express';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import { OptionsObj } from 'express-graphql';
import { GraphQLSchema } from 'graphql/type';
import { Query } from './words/query.type';
import { Db } from './db';

const PORT = process.env.PORT | 8080;

export class Service {
    static start() {
        new Service().startService();
    }

    private startService() {
        let app: Express = express();

        this.initGraphQlApi(app);
        this.startListening(app);
    }

    private initGraphQlApi(app: Express) {
        let options: OptionsObj = {
            schema: new GraphQLSchema({
                query: Query.TYPE
            }),
            rootValue: new Query(),
            graphiql: Application.isTest()
        };

        app.use('/graphql', graphqlHTTP(options));
    }

    private startListening(app: Express) {
        app.listen(PORT, () => {
            console.log('listening on port ' + PORT);
        });
    }
}