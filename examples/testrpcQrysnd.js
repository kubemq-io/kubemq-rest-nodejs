const kubeMQ = require('..')

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'qry';

let qrySend = new kubeMQ.QuerySender(kubeMQHost, kubeMQRestPort, clientID, channelName, 10000);


let request = new kubeMQ.QueryRequest(kubeMQ.stringToByte('select books'));

qrySend.send(request).then(res => {
     console.log('Query response: '+kubeMQ.byteToString(res.data.Body)) }
     ).catch(err=>{
          console.log('error query: '+err);
     });