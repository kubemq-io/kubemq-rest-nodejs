

const stringToByte = require('../tools/stringToByte').stringToByte;

const CommandSender = require('../rpc/command/commandSender');


let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'cmd';

let sender = new CommandSender(kubeMQHost, kubeMQRestPort, clientID, channelName, 1000);

let request = new CommandSender.CommandRequest(stringToByte('do the command'));

sender.send(request).then(

    res => {
        console.log('command execution: ' + JSON.stringify(res))
    }).catch(
        err => {
            console.log('command error: ' + err)
        });