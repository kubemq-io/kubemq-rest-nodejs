# Nodejs

The **KubeMQ SDK for Nodejs** enables Nodejs developers to communicate with [KubeMQ](https://kubemq.io/) server.

## Table of Content
[[toc]]

## General SDK description
The SDK implements all communication patterns available through the KubeMQ server:
- Events
- EventStore
- Command
- Query
- Queue


### Installing

The recommended way to use the SDK for Nodejs in your project is to consume it from NPM
https://www.npmjs.com/package/kubemq-restnodejs



## Generating Documentation


## Running the examples.

The [examples](https://github.com/kubemq-io/kubemq-node/tree/master/examples)
are standalone projects that showcase the usage of the SDK.

To run the examples, you need to have a running instance of KubeMQ.


## Main Concepts.

- Metadata: The metadata allows us to pass additional information with the event. Can be in any form that can be presented as a string, i.e., struct, JSON, XML and many more.
- Body: The actual content of the event. Can be in any form that is serializable into a byte array, i.e., string, struct, JSON, XML, Collection, binary file and many more.
- ClientID: Displayed in logs, tracing, and KubeMQ dashboard(When using Events Store, it must be unique).
- Tags: Set of Key value pair that help categorize the message

### Event/EventStore/Command/Query.

- Channel: Represents the endpoint target. One-to-one or one-to-many. Real-Time Multicast.
- Group: Optional parameter when subscribing to a channel. A set of subscribers can define the same group so that only one of the subscribers within the group will receive a specific event. Used mainly for load balancing. Subscribing without the group parameter ensures receiving all the channel messages. (When using Grouping all the programs that are assigned to the group need to have to same channel name)
- Event Store: The Event Store represents a persistence store, should be used when need to store data on a volume. 
### Queue

- Queue: Represents a unique FIFO queue name, used in queue pattern.
- Transaction: Represents an Rpc stream for single message transaction.


### Event/EventStore/Command/Query SubscribeRequest Object:

A struct that is used to initialize SubscribeToEvents/SubscribeToRequest, the SubscribeRequest contains the following:

- SubscribeType - Mandatory - Enum that represents the subscription type.
- Events - if there is no need for Persistence.
- EventsStore - If you want to receive Events from persistence. See Main concepts.
- Command - Should be used when a response is not needed.
- Query - Should be used when a response is needed.
- ClientID - Mandatory - See Main concepts.
- Channel - Mandatory - See Main concepts.
- Group - Optional - See Main concepts.
- EventsStoreType - Mandatory - set the type event store to subscribe to Main concepts.

## Queue.

KubeMQ supports distributed durable FIFO based queues with the following core features:

- Exactly One Delivery - Only one message guarantee will deliver to the subscriber.
- Single and Batch Messages Send and Receive - Single and multiple messages in one call.
- RPC and Stream Flow - RPC flow allows an insert and pulls messages in one call. Stream flow allows single message consuming in a transactional way.
- Message Policy - Each message can be configured with expiration and delay timers. Also, each message can specify a dead-letter queue for un-processed messages attempts.
- Long Polling - Consumers can wait until a message available in the queue to consume.
- Peak Messages - Consumers can peak into a queue without removing them from the queue.
- Ack All Queue Messages - Any client can mark all the messages in a queue as discarded and will not be available anymore to consume.
- Visibility timers - Consumers can pull a message from the queue and set a timer which will cause the message not be visible to other consumers. This timer can be extended as needed.
- Resend Messages - Consumers can send back a message they pulled to a new queue or send a modified message to the same queue for further processing.

### Send Message to a Queue

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
  clientID = 'c1', queueName = 'testQueue';

let queue = new kubeMQ.Queue(kubeMQHost, kubeMQRestPort, clientID, queueName);

let msg =  new kubeMQ.QueueMessage(kubeMQ.ByteConverter('some-simple_queue-queue-message')))

queue.send(msg).then(sent => {
    console.log('sent message:' + sent);
}).catch(err => {
    console.log(err);
});

```    

 ### Send Message to a Queue with Expiration 

```Nodejs
    
let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
  clientID = 'c1', queueName = 'testQueue';

let queue = new kubeMQ.Queue(kubeMQHost, kubeMQRestPort, clientID,queueName);

let msg = new kubeMQ.QueueMessage(byteConverter('body'));
msg.addExpiration(100);
queue.send(msg).then(sent => {
    console.log('sent message:' + sent);
}).catch(err => {
    console.log(err);
});

```

### Send Message to a Queue with Delay

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
  clientID = 'c1', queueName = 'testQueue';

let queue = new kubeMQ.Queue(kubeMQHost, kubeMQRestPort, clientID,queueName);

let msg = new kubeMQ.QueueMessage(byteConverter('body'));
msg.addDelay(100);
queue.send(msg).then(sent => {
    console.log('sent message:' + sent);
}).catch(err => {
    console.log(err);
});

```

### Send Batch Messages

```Nodejs
 
let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';
let queue = new kubeMQ.Queue(kubeMQHost,kubeMQRestPort, clientID, queueName, undefined, 100, 1);

let messages = [];
for (let index = 0; index < 10; index++) {
   let msg = new kubeMQ.QueueMessage(kubeMQ.byteConverter('my buddy'));
   messages.push(msg);   
};

queue.sendBatch(messages).then(res => {
   console.log(res);
   console.log("batch messages were sent")
})
   .catch(err => {
      console.log(err)
   });

```

### Receive Messages from a Queue

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';

let queueDequeue = new kubeMQ.Queue(kubeMQHost, kubeMQRestPort, clientID+'2',queueName);

    queueDequeue.receive(10, 1).then(receivedMessages => {
        console.log('received message:' + JSON.stringify(receivedMessages));
    }).catch(err => {
        console.log('error' + err)});

```

### Peek Messages from a Queue

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';
    
let queueDequeue = new kubeMQ.Queue(kubeMQHost, kubeMQRestPort, clientID+'2',queueName);

    queueDequeue.peek(10, 1).then(receivedMessages => {
        console.log('received message:' + JSON.stringify(receivedMessages));
    }).catch(err => {
        console.log('error' + err)});
  
```
### Ack All Messages In a Queue

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';

 let queue = new kubeMQ.Queue(kubeMQHost, kubeMQRestPort, clientID, queueName);
queue.ackAllMessages().catch(err => {
    console.log(err)
});

```

### Transactional Queue - Ack and reject
```Nodejs

const Transaction = require('../queue/transaction');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';

let transactionQueue = new kubeMQ.QueueTransaction(kubeMQHost, kubeMQRestPort, clientID, queueName);

transactionQueue.receiveMessage(2, 10);

transactionQueue.on('error', err => {
  if (err.IsError) {
    console.log('Error ' + err.Error);
  } else {
    console.log('Error ' + err.message);
  }
});

transactionQueue.on('end', mod => {
  console.log('end transaction by: ' + mod.by);
});
transactionQueue.addListener('extended', ack => {
  console.log(ack);
});

transactionQueue.on('message', msg => {
  console.log(msg);
  if (msg.IsError) {
    console.log('error' + msg);
    return;
  }

  if (msg.Message.Attributes.Sequence !== 3) {
    transactionQueue.ackMessage();
  } else {
    transactionQueue.rejectedMessage();
  };
});

```


### Transactional Queue - Extend Visibility

```Nodejs

const Transaction = require('../queue/transaction');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';

let transactionQueue = new kubeMQ.QueueTransaction(kubeMQHost, kubeMQRestPort, clientID, queueName);

transactionQueue.receiveMessage(2, 10);

transactionQueue.on('error', err => {
  if (err.IsError) {
    console.log('Error ' + err.Error);
  } else {
    console.log('Error ' + err.message);
  }
});

transactionQueue.on('end', mod => {
  console.log('end transaction by: ' + mod.by);
});
transactionQueue.addListener('extended', ack => {
  console.log(ack);
});

transactionQueue.on('message', msg => {
  console.log(msg);
  if (msg.IsError) {
    console.log('error' + msg);
    return;
  }
   transaction.extendVisibility(40);
  if (msg.Message.Attributes.Sequence !== 3) {
    transactionQueue.ackMessage();
  } else {
    transactionQueue.rejectedMessage();
  };
});

```

### Transactional Queue - Resend to New Queue

```Nodejs

const Transaction = require('../queue/transaction');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';

let transactionQueue = new kubeMQ.QueueTransaction(kubeMQHost, kubeMQRestPort, clientID, queueName);

transactionQueue.receiveMessage(100, 10);

transactionQueue.on('error', err => {
  if (err.IsError) {
    console.log('Error ' + err.Error);
  } else {
    console.log('Error ' + err.message);
  }
});

transactionQueue.on('end', mod => {
  console.log('end transaction by: ' + mod.by);
});
transactionQueue.addListener('extended', ack => {
  console.log(ack);
});

transactionQueue.on('message', msg => {
  console.log(msg);
  if (msg.IsError) {
    console.log('error' + msg);
    return;
  }  
  transactionQueue.resend('newQueueName')
});

```

### Transactional Queue - Resend Modified Message
```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';

let transactionQueue = new kubeMQ.QueueTransaction(kubeMQHost, kubeMQRestPort, clientID, queueName);
transactionQueue.receiveMessage(100, 10);

transactionQueue.on('error', err => {
  if (err.IsError) {
    console.log('Error ' + err.Error);
  } else {
    console.log('Error ' + err.message);
  }
});

transactionQueue.on('end', mod => {
  console.log('end transaction by: ' + mod.by);
});
transactionQueue.addListener('extended', ack => {
  console.log(ack);
});

transactionQueue.on('message', msg => {
  console.log(msg);
  if (msg.IsError) {
    console.log('error' + msg);
    return;
  }  
    transactionQueue.modify(new Message('new body'));
});

```

## Event
### Sending Events


#### Single event
```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'pubsubnnel';

let pub = new kubeMQ.EventPublisher(kubeMQHost, kubeMQRestPort, clientID, channelName);

let event = new kubeMQ.Event(stringToByte('hello kubemq - sending single event'));

pub.send(event).then(
    res => {
        console.log(res);
    }).catch(
        err => {
            console.log('error sending' + err)
        });

```

#### Stream Events
```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'pubsubnnel';

let publisher = new kubeMQ.EventPublisher(kubeMQHost, kubeMQRestPort, clientID, channelName);
let event = new kubeMQ.Event(stringToByte('publish event test'));

publisher.openStream();
publisher.stream(event).then(
    res => {
        console.log(res);
    }).catch(
        err => {
            console.log('error sending' + err)
        });
publisher.closeStream();

```

### Receiving Events

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'pubsubnnel';

let sub = new kubeMQ.EventSubscriber(kubeMQHost, kubeMQRestPort, clientID, channelName);

sub.subscribeToEvents(msg => {
    console.log(msg);
}, err => {
    console.log('error:' + err)
});

```

## Event Store

### Subscription Options  

KubeMQ supports 6 types of subscriptions:  

- StartFromNewEvents - start event store subscription with only new events  

- StartFromFirstEvent - replay all the stored events from the first available sequence and continue stream new events from this point  

- StartFromLastEvent - replay the last event and continue stream new events from this point  

- StartFromSequence - replay events from specific event sequence number and continue stream new events from this point  

- StartFromTime - replay events from specific time continue stream new events from this point  

- StartFromTimeDelta - replay events from specific current time - delta duration in seconds, continue stream new events from this point  
### Sending Event Store

#### Single Event Store

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'StorePubSub';

let storePublisher = new kubeMQ.EventStorePublisher(kubeMQHost, kubeMQRestPort, clientID, channelName);

let eventStore = new kubeMQ.Event(stringToByte('test'));

storePublisher.send(eventStore).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});

```

### Receiving Events Store

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c2', channelName = 'StorePubSub';

let storeSubscriber = new kubeMQ.EventStoreSubscriber(kubeMQHost, kubeMQRestPort, clientID, channelName);

storeSubscriber.subscribeToEvents(msg => {
    console.log('msg:' + msg.Metadata)
}
    , err => {
        console.log('error:' + err)
    },
    StoreSubscriber.EventStoreType.StartFromLast, '1');
```

## Commands

### Concept

Commands implement synchronous messaging pattern which the sender send a request and wait for a specific amount of time to get a response.  
The response can be successful or not. This is the responsibility of the responder to return with the result of the command within the time the sender set in the request  

#### Receiving Commands Requests  
```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'cmd';

let receiver = new kubeMQ.CommandReceiver(kubeMQHost, kubeMQRestPort, clientID, channelName, 1000);

receiver.subscribe(cmd => {
    let response = new kubeMQ.CommandResponse(cmd, true);
    response.Timestamp = Math.floor(new Date() / 1000);
    receiver.sendResponse(response).then(snd => {
        console.log('sent:' + snd);
    }).catch(cht => console.log(cht));
}, err => {
    console.log(err);
});

```

### Sending Command Request

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'cmd';

let sender = new kubeMQ.CommandSender(kubeMQHost, kubeMQRestPort, clientID, channelName, 1000);

let request = new kubeMQ.CommandRequest(kubeMQ.stringToByte(' hello kubemq - sending a command, please reply'));

sender.send(request).then(
    res => {
        if (res.is_error) {
            console.log('Response error: ' + res.message);
            return;
        }
        console.log('Response Received:' + res.data.RequestID + ' ExecutedAt:' + res.data.Timestamp);
    }).catch(
        err => {
            console.log('command error: ' + err)
        });
```

## Queries

### Concept

Queries implement synchronous messaging pattern which the sender send a request and wait for a specific amount of time to get a response.  

The response must include metadata or body together with an indication of successful or not operation. This is the responsibility of the responder to return with the result of the query within the time the sender set in the request.

### Receiving Query Requests

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'qry';
    
let query = new kubeMQ.QueryReceiver(kubeMQHost, kubeMQRestPort, clientID, channelName);

query.subscribe(qry => {
    console.log(qry);
    let response = new kubeMQ.QueryResponse(qry, kubeMQ.stringToByte('no books'));
    response.Metadata = 'no books';
    query.sendResponse(response).then(snd => {
        console.log('sent:' + snd);
    }).catch(cht => console.log(cht));

}, err => {
    console.log(err);
});

```

### Sending Query Requests

```Nodejs

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'qry';

let qrySend = new kubeMQ.QuerySender((kubeMQHost, kubeMQRestPort, clientID, channelName, 10000);

let request = new kubeMQ.QueryRequest(kubeMQ.stringToByte('select books'));

querySender.send(request).then(res => {
     console.log('Query response: ' + JSON.stringify(res))
}).catch(err => {
     console.log('error query: ' + err);
});

```
