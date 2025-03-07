"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSlug = void 0;
const formatSlug = (slug) => {
    return slug
        .toLowerCase()
        .normalize("NFD") // Normaliza caracteres Unicode
        .replace(/[\u0300-\u036f]/g, "") // Remove (acentos)
        .replace(/[^\w\s-]/g, "") // Remove caracteres especiais (exceto espaços e hifens)
        .replace(/\s+/g, "-") // Substitui espaços por hifens
        .replace(/-+/g, "-") // Remove múltiplos hifens consecutivos
        .replace(/^-+|-+$/g, ""); // Remove hifens do início e do fim
};
exports.formatSlug = formatSlug;
