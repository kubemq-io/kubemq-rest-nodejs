

const stringToByte = require('../tools/stringToByte').stringToByte;
/**
 * event pubsub
 */

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'StorePubSub';


// /**
//  * persistance store pubsub.
//  */

const StorePublisher = require('../pubSub/eventsStore/storePublisher');
let storePublisher = new StorePublisher(kubeMQHost, kubeMQRestPort, clientID+'1', channelName);

let eventStore = new StorePublisher.Event(stringToByte('test '));
eventStore.Metadata = 'test store';

storePublisher.send(eventStore).then(res => {
    console.log('msg sent' + res);
}).catch(err => {
    console.log(err);
});

const StoreSubscriber = require('../pubSub/eventsStore/storeSubscriber');
let storeSubscriber = new StoreSubscriber(kubeMQHost, kubeMQRestPort, clientID, channelName);

storeSubscriber.subscribeToEvents(msg => {
    console.log('msg received:' + msg.Metadata)
}
    , err => {
        console.log('error:' + err)
    },
    StoreSubscriber.EventStoreType.StartFromFirst, '1')