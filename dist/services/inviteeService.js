"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inviteeRepository_1 = require("../repositories/inviteeRepository");
const createInviteeService = async (data) => {
    return (0, inviteeRepository_1.createInviteeInDatabase)(data);
};
exports.default = {
    createInviteeService,
};
