const Converter = require('../tools/stringToByte');
const QuerySender = require('../rpc/query/querySender');
const QueryRequest = require('../rpc/lowLevel/queryRequest');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'qry';

let qrySend = new QuerySender(kubeMQHost, kubeMQRestPort, clientID, channelName, 10000);


let request = new QueryRequest(Converter.stringToByte('select books'));

qrySend.send(request).then(res => {
     console.log('Query response: ' + Converter.byteToString(res.data.Body)) }
     ).catch(err=>{
          console.log('error query: ' + err);
     });