let config = require('@ucd-lib/cork-app-build').watch({
  root : __dirname,
  entry : 'entry.js',
  // folder where bundle.js will be written
  preview : '',
  // path your client (most likely installed via yarn) node_modules folder.
  // Due to the flat:true flag of yarn, it's normally best to separate 
  // client code/libraries from all other modules (ex: build tools such as this).
  clientModules : '../node_modules'
});
 
// optionaly you can run:
// require('@ucd-lib/cork-app-build').watch(config, true)
// Adding the second flag will generate a ie build as well as a modern
// build when in development.  Note this slows down the build process.
 
module.exports = config;