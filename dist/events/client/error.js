"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.name = void 0;
exports.name = 'error';
const run = async (client, error) => {
    client.logger(`An error has accured: \n${JSON.stringify(error)}`, 'error');
};
exports.run = run;
