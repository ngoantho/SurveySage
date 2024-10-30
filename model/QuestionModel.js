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
exports.QuestionModel = void 0;
const mongoose_1 = require("mongoose");
const CommonModel_1 = require("../utils/CommonModel");
class QuestionModel extends CommonModel_1.CommonModel {
    createSchema() {
        return new mongoose_1.Schema({
            surveyId: Number,
            questions: [
                {
                    questionId: Number,
                    type: String,
                    text: String,
                    isRequired: {
                        type: Boolean,
                        default: true
                    },
                    options: {
                        type: [String],
                        default: []
                    }
                }
            ]
        }, { collection: 'questions' });
    }
    createModel() {
        (0, mongoose_1.connect)(this.dbConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            return (0, mongoose_1.model)("Questions", this.schema);
        });
        return null;
    }
    getSurveyQuestions(response, surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = this.model.find({ surveyId });
            try {
                let questions = yield query.exec();
                response.json(questions);
            }
            catch (e) {
                response.send(e);
            }
        });
    }
}
exports.QuestionModel = QuestionModel;
//# sourceMappingURL=QuestionModel.js.map