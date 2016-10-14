import { Language, LanguageType, LanguageModel } from './language.type';
import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} from 'graphql/type';

import { Schema, Model, model, Document } from 'mongoose';

export interface Word extends Document {
    _id: string;
    name: string;
    languageId: string;
    translationIds: string[];
    language(): Promise<Language>;
    translations({languageId: string}): Promise<Word[]>;
}

export const WordType: GraphQLObjectType = new GraphQLObjectType({
    name: 'word',
    description: 'This entity represents a word in a particular language.',
    fields: () => ({
        _id: {
            description: 'Unique id of one word.',
            type: new GraphQLNonNull(GraphQLID)
        },
        name: {
            desciption: 'The word itself.',
            type: new GraphQLNonNull(GraphQLString)
        },
        language: {
            description: 'The represented language.',
            type: new GraphQLNonNull(LanguageType)
        },
        translations: {
            type: new GraphQLList(WordType),
            description: 'Translations of the word in a given language.',
            args: {
                languageId: {
                    description: 'ID of a language, for which translations should be returned.',
                    type: new GraphQLNonNull(GraphQLID)
                }
            }
        }
    })
});

export const WordSchema: Schema = new Schema({
    name: Schema.Types.String,
    languageId: { 
        type: Schema.Types.ObjectId,
        ref: 'Language'
    },
    translationIds: [Schema.Types.ObjectId]
});

WordSchema.methods.language = function(): Promise<Language> {
    return LanguageModel.findById(this.languageId).exec();
};

WordSchema.methods.translations = function(args: {languageId: string}) {
    return WordModel.find({
        _id: { $in: this.translationIds }, 
        languageId: args.languageId
    }).exec();
}

export const WordModel: Model<Word> = model<Word>('Word', WordSchema);