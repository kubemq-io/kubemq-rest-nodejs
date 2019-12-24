

const kubeMQ = require('..')
/**
 * event pubsub
 */

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'StorePubSub';


// /**
//  * persistance store pubsub.
//  */


let storePublisher = new kubeMQ.EventStorePublisher(kubeMQHost, kubeMQRestPort, clientID+'1', channelName);

let eventStore = new kubeMQ.Event(kubeMQ.stringToByte('test '));
eventStore.Metadata = 'test store';

storePublisher.send(eventStore).then(res => {
    console.log('msg sent' + res);
}).catch(err => {
    console.log(err);
});


let storeSubscriber = new kubeMQ.EventStoreSubscriber(kubeMQHost, kubeMQRestPort, clientID, channelName);

storeSubscriber.subscribeToEvents(msg => {
    console.log('msg received:' + msg.Metadata)
}
    , err => {
        console.log('error:' + err)
    },
    kubeMQ.EventStoreSubscriber.EventStoreType.StartFromFirst, '1')