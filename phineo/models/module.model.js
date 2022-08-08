const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { moduleTypes, conditionsTypes, accessConditionsTypes } = require('../config/sectionModule');

const moduleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: [
        moduleTypes.VIDEO,
        moduleTypes.QUIZ,
        moduleTypes.PDF,
        moduleTypes.FICHIER,
        moduleTypes.CORRECTION,
        moduleTypes.CORRECTIONURL,
        moduleTypes.TEXT,
        moduleTypes.EXTERNAL_LINK,
      ], // moduleTypes.VIDEO,
      required: true,
    },
    filePath: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
    quizContent: {
      type: {
        quizTitle: { type: String },
        quizSynopsis: { type: String },
        nrOfQuestions: { type: String },
        questions: [
          {
            question: { type: String },
            questionType: { type: String },
            questionPic: { type: String },
            answerSelectionType: { type: String },
            answers: { type: [String] },
            correctAnswer: { type: Array },
            messageForCorrectAnswer: { type: String },
            messageForIncorrectAnswer: { type: String },
            explanation: { type: String },
            point: { type: Number },
          },
        ],
      },
      required: false,
    },
    conditions: {
      type: {
        conditionType: {
          type: String,
          enum: [
            conditionsTypes.PERCENT,
            conditionsTypes.VIEWING,
            conditionsTypes.NO_CONDITION,
            conditionsTypes.DAYS_AFTER,
            conditionsTypes.MINUTES_ON_SCREEN,
            conditionsTypes.MODULE_VALIDATED,
            conditionsTypes.SECTION_VALIDATED,
          ],
          default: conditionsTypes.NO_CONDITION,
        },
        conditionValue: { type: String },
      },
      default: { conditionType: conditionsTypes.NO_CONDITION, conditionValue: '0' },
      required: true,
    },
    accessConditions: {
      type: {
        conditionType: {
          type: String,
          enum: [accessConditionsTypes.ACCESS_DATE, accessConditionsTypes.NO_CONDITION, accessConditionsTypes.VALID_MODULE],
        },
        conditionValue: { type: String },
      },
      default: { conditionType: accessConditionsTypes.NO_CONDITION, conditionValue: '0' },
      required: true,
    },
    comments: {
      type: [
        {
          validated: {type: String, default: 'pending'},
          userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
          comment: { type: String },
          responses: [
            {
              userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
              comment: { type: String },
              time: { type: Date, default: Date.now },
            },
          ],
          time: { type: Date, default: Date.now },
        },
      ],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
moduleSchema.plugin(toJSON);

/**
 * @typedef CourseModule
 */
const CourseModule = mongoose.model('Module', moduleSchema);

module.exports = CourseModule;
