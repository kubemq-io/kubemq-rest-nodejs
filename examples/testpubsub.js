

const kubeMQ = require('..')
/**
 * event pubsub
 */

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'pubsubnnel';

let subscriber = new kubeMQ.EventSubscriber(kubeMQHost, kubeMQRestPort, clientID, channelName);

subscriber.subscribeToEvents(msg => {

    console.log('msg received:' + kubeMQ.byteToString(msg.Body))
    subscriber.unsubscribe();
}
    , err => {
        console.log('error:' + err)
    }).then(msg => {
        console.log(msg);
    });


let publisher = new kubeMQ.EventPublisher(kubeMQHost, kubeMQRestPort, clientID + '1', channelName);

let event = new kubeMQ.Event(kubeMQ.stringToByte('publish event test'));

publisher.send(event).then(
    res => {
        console.log(res);
    }).catch(
        err => {
            console.log('error sending' + err)
        });

