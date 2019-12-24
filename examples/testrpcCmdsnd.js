const kubeMQ = require('..')


let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'cmd';

let sender = new kubeMQ.CommandSender(kubeMQHost, kubeMQRestPort, clientID, channelName, 50000);

let request = new kubeMQ.CommandRequest(kubeMQ.stringToByte('do the command'));

sender.send(request).then(

    res => {
        console.log('command execution: ' + JSON.stringify(res))
    }).catch(
        err => {
            console.log('command error: ' + err)
        });