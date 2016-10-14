import { Word, WordModel } from './words/word.type';
import { Application } from './application';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { MongoError } from 'mongodb';
import { LanguageModel, Language } from './words/language.type';

const MONGO_DB = 'mongodb://sharedwords_db:27017/data';

export class Db {

    static init() {
        new Db().connectAndInitDb();
    }

    private connectAndInitDb() {
        console.log('connecting to ' + MONGO_DB);

        mongoose.connect(MONGO_DB, (err: MongoError) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('connected to ' + MONGO_DB);

                this.initDataForTest();
            }
        });
    }

    private initDataForTest() {
        if (Application.isTest()) {
            this.createLanguage('Magyar').then((magyar: Language) => {
                this.createLanguage('English', 'British').then((english: Language) => {
                    console.log('adding some words, too...');
                    this.addWords('Szia!', magyar, 'Hello!', english);
                    this.addWords('Viszontlátásra!', magyar, 'Goodbye!', english);
                    this.addWords('én', magyar, 'I', english);
                    this.addWords('te', magyar, 'you', english);
                });
            })
            this.createLanguage('English', 'American');
            this.createLanguage('Deutsch', 'Hochdeutsch');
            this.createLanguage('Deutsch', 'Bayrisch');
        }
    }

    private addWords(wordAString: string, languageA: Language, wordBString: string, languageB: Language) {
        console.log('adding the word ' + wordAString + ' with translation ' + wordBString + '...');
        this.createWord(wordAString, languageA).then((wordA: Word) => {
            this.createWord(wordBString, languageB).then((wordB: Word) => {
                wordA.translationIds.push(wordB._id);
                this.save(wordA);
                wordB.translationIds.push(wordA._id);
                this.save(wordB);
            });
        })
    }

    private createWord(name: string, language: Language): Promise<Word> {
        let word = new WordModel();
        word.name = name;
        word.languageId = language._id;

        return this.save(word);
    }

    private createLanguage(name: string, dialect?: string): Promise<Language> {
        let language = new LanguageModel();
        language.name = name;
        if (dialect) {
            language.dialect = dialect;
        }

        return this.save(language);
    }

    private save<T extends Document>(model: T): Promise<T> {
        console.log('saving ' + model.toString());

        return new Promise<T>((resolve, reject) => {
            model.save().then((model: T) => {
                console.log('model saved: ' + model.toString());
                resolve(model);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
