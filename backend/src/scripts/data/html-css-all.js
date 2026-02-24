const htmlLevel1 = require('./html-level1');
const cssLevel1 = require('./css-level1');
const formsTables = require('./forms-tables-level1');
const boxModel = require('./box-model-level1');

// ვაერთიანებთ Level 1-ის ყველა კურსს
const htmlCssLessons = [
    ...htmlLevel1,
    ...cssLevel1,
    ...formsTables,
    ...boxModel
];

module.exports = htmlCssLessons;
