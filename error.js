const notifier   = require('node-notifier');

// gestion erreur
function errorLog(error) {
  // console.log(error.toString());
  notifier.notify({
    'title': 'Gulp Error !!!',
    'message': "1-Show Console Error to debug" 
    +"\n 2-Kill gulp process ctrl+c"
    +"\n 3-debug error"
  });
  console.log(error.toString());
}