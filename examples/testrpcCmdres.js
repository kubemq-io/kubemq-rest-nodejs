const kubeMQ = require('..')

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'cmd';

let cmdRes = new kubeMQ.CommandReceiver(kubeMQHost, kubeMQRestPort,clientID,channelName);
cmdRes.subscribe(cmd => {
    console.log(cmd);

    let respond = new kubeMQ.CommandResponse(cmd);
    respond.Executed = true;
    cmdRes.sendResponse(respond).then(snd => {
        'sent:' + snd;
    }).catch(
        err => console.log(err));

}, err => {
    console.log(err);
}
)