"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLectureStore = exports.liveChats = exports.liveQnA = exports.livePolls = void 0;
exports.livePolls = new Map();
exports.liveQnA = new Map();
exports.liveChats = new Map();
const clearLectureStore = (lectureId) => {
    exports.livePolls.delete(lectureId);
    exports.liveQnA.delete(lectureId);
    exports.liveChats.delete(lectureId);
    console.log(`[store] cleared lecture ${lectureId}`);
};
exports.clearLectureStore = clearLectureStore;
