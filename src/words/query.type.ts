import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
} from 'graphql/type';
import { Language, LanguageType, LanguageModel } from './language.type';
import { Word, WordType, WordModel } from './word.type';

export class Query {
    static TYPE = new GraphQLObjectType({
        name: 'query',
        description: 'API to query words.',
        fields: {
            wordById: {
                type: WordType,
                description: 'Returns one word for the given word-ID.',
                args: {
                    wordId: {
                        type: new GraphQLNonNull(GraphQLID),
                        description: 'the Id of the searched word.'
                    }
                }
            },
            wordsByLanguageIdAndToken: {
                type: new GraphQLList(WordType),
                description: 'Returns a list of words, which match to the argument.',
                args: {
                    languageId: {
                        type: GraphQLID,
                        description: 'Id of a language.'
                    },
                    token: {
                        type: GraphQLString,
                        description: 'A part of word, which is being looked for.'
                    }
                }
            },
            languages: {
                type: new GraphQLList(LanguageType),
                description: 'Returns all the defined languages.'
            }
        },
    });

    wordById(args: { wordId: string }): Promise<Word> {
        return WordModel.findById(args.wordId).exec();
    }

    wordsByLanguageIdAndToken(args: { languageId: string, token: string }): Promise<Word[]> {
        return WordModel.find({
            name: new RegExp(args.token, 'i'),
            languageId: args.languageId
        }).exec();
    }

    languages(): Promise<Language[]> {
        return LanguageModel.find().exec();
    }
}