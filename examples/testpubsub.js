
const EventSubscriber = require('../pubSub/events/subscriber');
const EventPublisher = require('../pubSub/events/publisher');
const Event = require('../pubSub/lowLevel/event');
const Converter = require('../tools/stringToByte');
/**
 * event pubsub
 */

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'pubsubnnel';

let subscriber = new EventSubscriber(kubeMQHost, kubeMQRestPort, clientID, channelName);

subscriber.subscribeToEvents(msg => {

    console.log('msg received:' + Converter.byteToString(msg.Body));
    subscriber.unsubscribe();
}
    , err => {
        console.log('error:' + err);
    }).then(msg => {
        console.log(msg);
    });


let publisher = new EventPublisher(kubeMQHost, kubeMQRestPort, clientID + '1', channelName);

let event = new Event(Converter.stringToByte('publish event test'));

publisher.send(event).then(
    res => {
        console.log(res);
    }).catch(
    err => {
        console.log('error sending' + err);
    });

