const QueryReceiver = require('../rpc/query/queryReceiver');
const QueryResponse = require('../rpc/lowLevel/queryResponse');
const Converter = require('../tools/stringToByte');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'qry';

let query = new QueryReceiver(kubeMQHost, kubeMQRestPort, clientID, channelName);
    query.subscribe(qry => {
        console.log(qry);
        

        let response = new QueryResponse(qry, Converter.stringToByte('no books'));
        response.Metadata = 'no books';
        query.sendResponse(response).then(snd => {
            console.log('sent:' + snd);
        }).catch(cht => console.log(cht));

        }, err => {
            console.log(err);
        }
    )

