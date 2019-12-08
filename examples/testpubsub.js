

const stringToByte = require('../tools/stringToByte').stringToByte;
const byteToString = require('../tools/stringToByte').byteToString;
/**
 * event pubsub
 */

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'pubsubnnel';

const Subscriber = require('../pubSub/events/subscriber');
let subscriber = new Subscriber(kubeMQHost, kubeMQRestPort, clientID, channelName);

subscriber.subscribeToEvents(msg => {

    console.log('msg received:' + byteToString(msg.Body))
    subscriber.unsubscribe();
}
    , err => {
        console.log('error:' + err)
    }).then(msg => {
        console.log(msg);
    });




const Publisher = require('../pubSub/events/publisher');
let publisher = new Publisher(kubeMQHost, kubeMQRestPort, clientID + '1', channelName);

let event = new Publisher.Event(stringToByte('publish event test'));

publisher.send(event).then(
    res => {
        console.log(res);
    }).catch(
        err => {
            console.log('error sending' + err)
        });

