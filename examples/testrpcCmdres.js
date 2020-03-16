const CommandReceiver = require('../rpc/command/commandReceiver');
const CommandResponse = require('../rpc/lowLevel/commandResponse');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'cmd';

let cmdRes = new CommandReceiver(kubeMQHost, kubeMQRestPort,clientID,channelName);
cmdRes.subscribe(cmd => {
    console.log(cmd);

    let respond = new CommandResponse(cmd);
    respond.Executed = true;
    cmdRes.sendResponse(respond).then(snd => {
        'sent:' + snd;
    }).catch(
        err => console.log(err));

    }, err => {
        console.log(err);
    }
)