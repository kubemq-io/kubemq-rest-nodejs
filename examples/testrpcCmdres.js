

const CommandReceiver = require('../rpc/command/commandReceiver');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'cmd';

let cmdRes = new CommandReceiver(kubeMQHost, kubeMQRestPort,clientID,channelName);
cmdRes.subscribe(cmd => {
    console.log(cmd);

    let respond = new CommandReceiver.Response(cmd);
    respond.Executed = true;
    cmdRes.sendResponse(respond).then(snd => {
        'sent:' + snd;
    }).catch(
        err => console.log(err));

}, err => {
    console.log(err);
}
)