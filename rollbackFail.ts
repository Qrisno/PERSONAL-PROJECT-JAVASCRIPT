import {obj} from './main'
 export namespace scn{
    export const scenario:obj[] = [{
        index: 1,
        meta: {
            title: 'Read popular customers',
            description: 'This action is responsible for reading the most popular customers',
        },
        // callback for main execution
        call:async (store) => {
            store++;
            return store;
        },
        // callback for rollback
        restore: async(store) => {
            throw new Error('sd');
            return --store;
        }
    },
    {
        index: 2,
        meta: {
            title: 'Read popular customers',
            description: 'This action is responsible for reading the most popular customers'
        },
        // callback for main execution
        call: async(store) => {
            store++;
            return store;
        },
        restore: async(store) => {

                return --store;
            }
            // callback for rollback

    },
    {
        index: 3,
        meta: {
            title: 'Read popular customers',
            description: 'This action is responsible for reading the most popular customers'
        },
        // callback for main execution
        call: async(store) => {
            store++;
            return store;

        },
        // callback for rollback
        restore: async(store) => {

            return --store;
        },
    },
    {
        index: 4,
        meta: {
            title: 'Read popular customers',
            description: 'This action is responsible for reading the most popular customers'
        },
        // callback for main execution
        call: async(store) => {
            throw new Error('Error');
            return store;

        },
        restore: async(store) => {
            return --store;
        },
        // callback for rollback

    }
];
}