import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInputObjectType
} from 'graphql/type';

import { Model, Schema, model, Document } from 'mongoose';

export interface Language extends Document {
    _id: string;
    name: string;
    dialect: string;
}

export const LanguageType = new GraphQLObjectType({
    name: 'language',
    description: 'This entity represents a word in a particular language.',
    fields: {
        _id: {
            description: 'Unique id of one language.',
            type: new GraphQLNonNull(GraphQLID)
        },
        name: {
            desciption: 'The name of the language, e.g. \'English\'',
            type: new GraphQLNonNull(GraphQLString)
        },
        dialect: {
            description: 'The dialect of the language, e.g. \'British\'',
            type: GraphQLString
        }
    }
});

export const LanguageSchema: Schema = new Schema({
    name: Schema.Types.String,
    dialect: Schema.Types.String
});


export const LanguageModel: Model<Language> = model<Language>('Language', LanguageSchema);
