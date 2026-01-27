"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.model = model;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.model.find();
            res.json(items);
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.model.findById(req.params.id);
            res.json(item);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newItem = yield this.model.create(req.body);
            res.json(newItem);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findByIdAndDelete(req.params.id);
            res.json({ message: "Item deleted" });
        });
    }
}
exports.BaseController = BaseController;
