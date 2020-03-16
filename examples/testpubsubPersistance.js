const EventStoreSubscriber = require('../pubSub/eventsStore/StoreSubscriber');
const Event = require('../pubSub/lowLevel/event');
const EventStorePublisher = require('../pubSub/eventsStore/StorePublisher');
const Converter = require('../tools/stringToByte');
/**
 * event pubsub
 */

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'StorePubSub';


// /**
//  * persistance store pubsub.
//  */


let storePublisher = new EventStorePublisher(kubeMQHost, kubeMQRestPort, clientID+'1', channelName);

let eventStore = new Event(Converter.stringToByte('test'));
eventStore.Metadata = 'test store';

storePublisher.send(eventStore).then(res => {
    console.log('msg sent' + res);
}).catch(err => {
    console.log(err);
});


let storeSubscriber = new EventStoreSubscriber(kubeMQHost, kubeMQRestPort, clientID, channelName);

storeSubscriber.subscribeToEvents(msg => {
    console.log('msg received:' + msg.Metadata)
}
    , err => {
        console.log('error:' + err)
    },
    EventStoreSubscriber.EventStoreType.StartFromFirst, '1')