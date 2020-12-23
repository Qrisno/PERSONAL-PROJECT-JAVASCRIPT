"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const rollbackFail_1 = require("./rollbackFail");
const transaction = new main_1.Transaction();
(async () => {
    try {
        await transaction.dispatch(rollbackFail_1.scn.scenario);
        const store = transaction.store; // {} | null
        const logs = transaction.logs; // []
        console.log(logs);
        console.log(store);
    }
    catch (err) {
        console.log(`Error name: ${err.name}`);
        console.log(`Error message: ${err.message}`);
        console.log(`Error stack: ${err.stack}`);
        // log detailed error
    }
})();
