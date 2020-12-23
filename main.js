"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const _ = require("lodash");
function identity(arg) {
    return arg;
}
function classDecorator(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.inOrder = [];
        }
    };
}
function checker(target, propertyName, descriptor) {
    let val = descriptor.value;
    descriptor.value = function () {
        for (var i = 0; i < arguments.length; i++) {
            if ('restore' in arguments[0][i]) {
                if (Object.keys(arguments[0][i]).length > 4) {
                    throw new Error("Odd parameters");
                }
            }
            else if (Object.keys(arguments[0][i]).length > 3) {
                throw new Error("Odd parameters");
            }
        }
        return val.apply(this, arguments);
    };
}
let Transaction = class Transaction {
    constructor() {
        this.store = null;
        this.logs = [];
    }
    async dispatch(scenario) {
        this.array = [];
        for (let i of scenario) {
            if (Object.keys(i['meta']).length > 2) {
                throw new Error(`OBJECT INDEX:${i.index} We have excess properties in meta`);
            }
            if (i['call'][Symbol.toStringTag] !== 'AsyncFunction') {
                throw new Error(`OBJECT INDEX:${i.index} Property call is not a type of AsyncFunction`);
            }
            this.array.push(i['index']);
        }
        this.array.sort();
        for (let j = 1; j <= this.array.length; j++) {
            if (this.array[j - 1] !== j) {
                throw new Error(`Not in an ascending order. Object Index should be ${j + 1}`);
            }
        }
        // K is a number that starts from 1
        this.inOrder = [];
        mainLoop: for (let k of this.array) {
            //m is an object
            for (let m of scenario) {
                if (m['index'] === k) {
                    let strBefore;
                    let strAfter;
                    try {
                        this.inOrder.push(m);
                        strBefore = identity(_.cloneDeep(this.store));
                        this.store = identity(await m.call(this.store));
                        console.log(typeof this.store);
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
                    }
                    catch (err) {
                        this.logs.push({
                            index: m['index'],
                            meta: m['meta'],
                            error: {
                                name: identity(err.name),
                                message: identity(err.message),
                                stack: identity(err.stack)
                            }
                        });
                        console.log(`On the index-${m['index']}! An error occured : ${err.message}!`);
                        // m is an object in scenarios array
                        for (var r = this.inOrder.indexOf(m); r >= 0; --r) {
                            if (this.inOrder[r].hasOwnProperty('restore')) {
                                try {
                                    let valid;
                                    (function (valid) {
                                        valid[valid["validate"] = 1] = "validate";
                                    })(valid || (valid = {}));
                                    let validate;
                                    let validate1;
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
                                }
                                catch (err) {
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
};
__decorate([
    checker
], Transaction.prototype, "dispatch", null);
Transaction = __decorate([
    classDecorator
], Transaction);
exports.Transaction = Transaction;
