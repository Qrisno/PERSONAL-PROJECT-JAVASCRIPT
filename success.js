"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scn = void 0;
var scn;
(function (scn) {
    scn.scenario = [{
            index: 1,
            meta: {
                title: 'Read popular customers',
                description: 'This action is responsible for reading the most popular customers',
            },
            // callback for main execution
            call: async (store) => {
                store++;
                return store;
            },
            // callback for rollback
            restore: async (store) => {
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
            call: async (store) => {
                store++;
                return store;
            },
            restore: async (store) => {
                return --store;
            }
            // callback for rollback
        },
        {
            index: 3,
            meta: {
                title: 'Read popular customers',
                description: 'This action is responsible for reading the most popular customers',
            },
            // callback for main execution
            call: async (store) => {
                store++;
                return store;
            },
            // callback for rollback
            restore: async (store) => {
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
            call: async (store) => {
                store++;
                return store;
            },
            restore: async (store) => {
                return --store;
            },
        }
    ];
})(scn = exports.scn || (exports.scn = {}));
