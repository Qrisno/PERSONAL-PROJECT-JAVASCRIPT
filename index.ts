import { Transaction } from "./main";
import { scn } from "./rollbackFail";

const transaction = new Transaction();

(async() => {
    try {
        await transaction.dispatch(scn.scenario);
        const store:number|Object = transaction.store; // {} | null
        const logs:Array<Object> = transaction.logs; // []
        console.log(logs);
        console.log(store);
    } catch (err) {
        console.log(`Error name: ${err.name}`);
        console.log(`Error message: ${err.message}`);
        console.log(`Error stack: ${err.stack}`);
        // log detailed error
    }
})();