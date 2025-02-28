"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSlug = void 0;
const formatSlug = (slug) => {
    return slug.toLowerCase().replace(/ /g, "-");
};
exports.formatSlug = formatSlug;
