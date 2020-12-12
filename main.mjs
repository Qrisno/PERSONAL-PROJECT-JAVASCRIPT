import lodash from 'lodash';
import { scenario } from './success.mjs'

export class Transaction {
    constructor() {
        this.store = null;
        this.logs = [];
    }

    async dispatch(scenario) {
        this.array = [];
        if (!Array.isArray(scenario)) {
            throw new Error('Scenario must be an array');
        }
        for (let i of scenario) {

            if (typeof i !== 'object') {
                throw new Error('Must be an object!');
            }
            if (!i.hasOwnProperty('index')) {
                throw new Error(`OBJECT INDEX:${i.index} Property index does not exist`);

            }
            if (typeof i['index'] !== 'number') {
                throw new Error(`OBJECT INDEX:${i.index} Index is not type of number`);

            }
            if (!i.hasOwnProperty('meta')) {
                throw new Error(`OBJECT INDEX:${i.index} Property meta does not exist`);
            }
            if (!i['meta'].hasOwnProperty('description')) {
                throw new Error(`OBJECT INDEX:${i.index} Property description does not exist in meta`);
            } else if (typeof i['meta']['description'] !== 'string') {
                throw new Error(`OBJECT INDEX:${i.index} Description is not type of string`);
            }
            if (!i['meta'].hasOwnProperty('title')) {
                throw new Error(`OBJECT INDEX:${i.index} Property title does not exist`);
            } else if (typeof i['meta']['title'] !== 'string') {
                throw new Error(`OBJECT INDEX:${i.index} Title is not type of string`);
            }

            if (Object.keys(i['meta']).length > 2) {
                throw new Error(`OBJECT INDEX:${i.index} We have excess properties in meta`);
            }

            if (!i.hasOwnProperty('call')) {
                throw new Error(`OBJECT INDEX:${i.index} Property call does not exist`);
            }
            if (i['call'][Symbol.toStringTag] !== 'AsyncFunction') {
                throw new Error(`OBJECT INDEX:${i.index} Property call is not a type of AsyncFunction`);
            }

            if (i.hasOwnProperty('restore')) {
                if (i['restore'][Symbol.toStringTag] !== 'AsyncFunction') {
                    throw new Error(`OBJECT INDEX:${i.index} Property restore is not a type of AsyncFunction`);
                }
                if (Object.keys(i).length > 4) {
                    throw new Error(`OBJECT INDEX:${i.index} Additional property (restore included)`);
                }
            } else {
                if (Object.keys(i).length > 3) {
                    throw new Error(`OBJECT INDEX:${i.index} Odd property (restore not included)`);
                }
            }
            this.array.push(i.index);

        }
        this.array.sort();

        for (let j = 1; j <= this.array.length; j++) {

            if (this.array[j - 1] !== j) {
                throw new Error(`Not in an ascending order. Object Index should be ${j+1}`);
            }


        }
        // K is a number that starts from 1
        this.inOrder = [];
        mainLoop: for (let k of this.array) {
            //m is an object

            for (let m of scenario) {
                if (m.index === k) {
                    let strBefore;
                    let strAfter;
                    try {
                        this.inOrder.push(m);
                        strBefore = lodash.cloneDeep(this.store);
                        this.store = await m.call(this.store);
                        strAfter = lodash.cloneDeep(this.store);

                        this.logs.push({
                            index: m.index,
                            meta: m.meta,
                            storeBefore: strBefore,
                            storeAfter: strAfter,
                            error: null
                        });
                        if (k === this.array.length) {
                            this.store = null;
                            console.log('SUCCESS');

                        }
                    } catch (err) {
                        this.logs.push({
                            index: m.index,
                            meta: m.meta,
                            storeBefore: strBefore,
                            storeAfter: strAfter,
                            error: {
                                name: err.name,
                                message: err.message,
                                stack: err.stack
                            }
                        })
                        console.log(`On the index-${m.index}! An error occured : ${err.message}!`);

                        // m is an object in scenarios array

                        for (var r = this.inOrder.indexOf(m); r > 0; --r) {


                            if (this.inOrder[r].hasOwnProperty('restore')) {
                                try {
                                    try {

                                        this.store = await this.inOrder[r].restore(this.store);


                                    } catch (e) {
                                        throw new Error(`On the index:${this.inOrder[r].index}! An error occured: ${e}!`);

                                    }
                                } catch (er) {
                                    this.store = null;
                                    console.log('FAILED');
                                    console.log("Restored with an error (one of the step's rollback was unsuccessful)");
                                    console.log(er.message);
                                    break;
                                }
                            } else {
                                continue;
                            }

                        }
                        if (r === 0) {
                            this.store = null;

                            console.log('FAILED');
                            console.log('Restored without an error (all steps were successfully rollbacked)');

                            break mainLoop;
                        }
                        break;
                    }

                }

            }

        }
    }
}