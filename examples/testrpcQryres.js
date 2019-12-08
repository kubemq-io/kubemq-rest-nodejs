const QueryReceiver = require('../rpc/query/queryReceiver');

const stringToByte = require('../tools/stringToByte').stringToByte;


let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'qry';

let query = new QueryReceiver(kubeMQHost, kubeMQRestPort, clientID, channelName);
query.subscribe(qry => {
    console.log(qry);
    

    let response = new QueryReceiver.QueryResponse(qry, stringToByte('no books'));
    response.Metadata = 'no books';
    query.sendResponse(response).then(snd => {
        console.log('sent:' +snd);
    }).catch(cht => console.log(cht));

}, err => {
    console.log(err);
}
)

