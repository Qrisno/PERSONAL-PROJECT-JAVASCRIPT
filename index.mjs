import { Transaction } from "./main.mjs";
import { scenario } from "./callFail.mjs";

const transaction = new Transaction();

(async() => {
    try {
        await transaction.dispatch(scenario);
        const store = transaction.store; // {} | null
        const logs = transaction.logs; // []
        console.log(logs);
        console.log(store);
    } catch (err) {
        console.log(`Error name: ${err.name}`);
        console.log(`Error message: ${err.message}`);
        console.log(`Error stack: ${err.stack}`);
        // log detailed error
    }
})();