import * as _ from "lodash";
function identity<T>(arg: T): T {
    return arg;
  }

type obj={
    index:number;
    meta: meta1;
    call(arg: any);
    restore?(arg: any);

}
interface meta1{
    title:string;
    description:string;

}
function classDecorator<T extends { new (...args: any[]): {} }>(
    constructor: T
  ) {
    return class extends constructor {
        inOrder = [];
    };
  }

@classDecorator
export class Transaction{
    store:Number|Object;
    inOrder: Array<obj>;
    logs: Object[];
    array: Object[];
    constructor() {
        this.store = null;
        this.logs = [];
        
    }
    
    async dispatch(scenario:Array<obj>) {
        this.array = [];
        
        for ( let i of scenario) {
            if (Object.keys(i['meta']).length > 2) {
                throw new Error(`OBJECT INDEX:${i.index} We have excess properties in meta`);
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
            this.array.push(i['index']);

        }
        this.array.sort();

        for (let j:number = 1; j <= this.array.length; j++) {

            if (this.array[j - 1] !== j) {
                throw new Error(`Not in an ascending order. Object Index should be ${j+1}`);
            }


        }
       
        // K is a number that starts from 1
       
        this.inOrder = [];
        mainLoop: for (let k of this.array) {
            //m is an object
            
            for (let m of scenario) {
                if (m['index'] === k) {
                   
                    let strBefore:Number|Object;
                    let strAfter:Number|Object;
                    
                    try {
                       
                        this.inOrder.push(m);
                        
                        strBefore = identity(_.cloneDeep(this.store));
                        this.store = identity(await m.call(this.store));
                        
                        strAfter = identity(_.cloneDeep(this.store));
                        

                        this.logs.push({
                            index: m['index'],
                            meta: m['meta'],
                            storeBefore: identity(strBefore),
                            storeAfter: identity(strAfter),
                            error: null
                        });
                        if (k === this.array.length) {
                            this.store = null;
                            console.log('SUCCESS');

                        }
                    } catch (err) {
                        this.logs.push({
                            index: m['index'],
                            meta: m['meta'],
                            error: {
                                name:identity(err.name),
                                message: identity(err.message),
                                stack: identity(err.stack)
                            }
                        })
                        console.log(`On the index-${m['index']}! An error occured : ${err.message}!`);

                        // m is an object in scenarios array

                        for (var r:number = this.inOrder.indexOf(m); r >= 0; --r) {


                            if (this.inOrder[r].hasOwnProperty('restore')) {

                                try {
                                    enum valid{
                                        validate=1
                                    }
                                    let validate:number;
                                    let validate1:number;
                                    
                                    await this.inOrder[r].restore(this.store).then((res) => {
                                        this.store = identity(res);
                                        if (r === 0) {
                                            this.store = identity(null);
                                            console.log(this.store);
                                            console.log('FAILED');
                                            console.log('Restored without an error (all steps were successfully rollbacked)');
                                            validate = valid.validate;

                                        }
                                    }).catch((e => {
                                        this.store = identity(null);
                                        console.log('FAILED');
                                        console.log("Restored with an error (one of the step's rollback was unsuccessful)");
                                        console.log(`Error occured : ${e.stack}`);
                                        validate1 = valid.validate;
                                    }));
                                    if (validate1 === 1) {
                                        break mainLoop;
                                    }
                                    if (validate === 1) {
                                        break mainLoop;
                                    }

                                } catch (err) {
                                    throw new Error(`On the index:${this.inOrder[r]['index']}! An error occured: ${err}!`);

                                }

                            }

                        }
                        break;
                    }

                }

            }

        }
        }
}
