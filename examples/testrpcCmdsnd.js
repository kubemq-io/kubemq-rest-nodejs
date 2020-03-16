const CommandSender = require('../rpc/command/commandSender');
const CommandRequest = require('../rpc/lowLevel/commandRequest');
const Converter = require('../tools/stringToByte');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'cmd';

let sender = new CommandSender(kubeMQHost, kubeMQRestPort, clientID, channelName, 50000);

let request = new CommandRequest(Converter.stringToByte('do the command'));

sender.send(request).then(

    res => {
        console.log('command execution: ' + JSON.stringify(res))
    }).catch(
        err => {
            console.log('command error: ' + err);
        });