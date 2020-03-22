const kubeMQ = require('../kubeMQ');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'pubsubnnel';

let publisher = new kubeMQ.EventPublisher(kubeMQHost, kubeMQRestPort, clientID, channelName);
let event = new kubeMQ.Event(kubeMQ.stringToByte('publish event test'));

function sleep(millis) {
  return new Promise(function (resolve, reject) {
      setTimeout(function () { resolve(); }, millis);
  });
}
publisher.openStream();
sleep(100).then(() => {
  publisher.stream(event).then(
    res => {
        console.log(res);
    }).catch(
        err => {
            console.log('error sending' + err)
        });
publisher.closeStream();
});


