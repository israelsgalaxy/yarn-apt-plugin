"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aptResolve_1 = __importDefault(require("./commands/aptResolve"));
const aptInstall_1 = __importDefault(require("./commands/aptInstall"));
const aptCopy_1 = __importDefault(require("./commands/aptCopy"));
const plugin = {
    commands: [
        aptResolve_1.default,
        aptInstall_1.default,
        aptCopy_1.default
    ],
};
exports.default = plugin;
