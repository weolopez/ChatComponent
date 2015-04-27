/**
 *  This file contains all of the user settings for the gulp build process
 */
module.exports = {

  srcJs: ['components/**/*.module.js', 'components/**/*.js', '!components/**/*_test.js'],
  tests: 'components/**/*_test.js',
  buildFolder: 'dist',
  buildJsFilename: 'chat.js',
  banner: '/*!\n' +
    ' * See LICENSE in this repository for license information\n' +
    ' */\n',
  closureStart: '(function(){\n',
  closureEnd: '\n})();'

};