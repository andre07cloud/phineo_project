const moduleTypes = {
  VIDEO: 'video',
  // AUDIO: 'audio',
  QUIZ: 'quizz',
  PDF: 'pdf',
  TEXT: 'text',
  FICHIER: 'fichier',
  CORRECTION: 'correction',
  CORRECTIONURL: 'correction-url',
  EXTERNAL_LINK: 'link',
};

const conditionsTypes = {
  PERCENT: 'percent',
  VIEWING: 'viewing',
  DAYS_AFTER: 'days_after',
  MINUTES_ON_SCREEN: 'viewing',
  SECTION_VALIDATED: 'sectionValidated',
  MODULE_VALIDATED: 'moduleValidated',
  NO_CONDITION: 'noCondition',
};

const accessConditionsTypes = {
  NO_CONDITION: 'noCondition',
  VALID_MODULE: 'validModule',
  ACCESS_DATE: 'date',
};

module.exports = {
  moduleTypes,
  conditionsTypes,
  accessConditionsTypes,
};
