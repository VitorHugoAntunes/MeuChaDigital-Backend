"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inviteeRepository_1 = require("../repositories/inviteeRepository");
const createInviteeService = async (data) => {
    return (0, inviteeRepository_1.createInviteeInDatabase)(data);
};
const getAllInviteesWithPaginationByGiftListSlugService = async (slug, page, limit, search, status) => {
    return (0, inviteeRepository_1.getAllInviteesWithPaginationByGiftListSlugFromDatabase)(slug, page, limit, search, status);
};
const getAllInviteesByGiftListSlugService = async (slug) => {
    return (0, inviteeRepository_1.getAllInviteesByGiftListSlugFromDatabase)(slug);
};
const updateInviteeService = async (id, data) => {
    return (0, inviteeRepository_1.updateInviteeInDatabase)(id, data);
};
const deleteInviteeService = async (id) => {
    return (0, inviteeRepository_1.deleteInviteeInDatabase)(id);
};
exports.default = {
    createInviteeService,
    getAllInviteesByGiftListSlugService,
    getAllInviteesWithPaginationByGiftListSlugService,
    updateInviteeService,
    deleteInviteeService,
};
