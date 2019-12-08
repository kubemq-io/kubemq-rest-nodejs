/* MIT License

Copyright (c) 2018 KubeMQ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */


const httpExec = require('../rest/httpExecuter');
const stream = require('../rest/stream');
const Event = require('../pubSub/lowLevel/event')


let wsStream;
let wsReceive;
class PubSub {
    constructor(kubeMQHost, kubeMQRestPort, client, channelName,  useStorage, group, isSecure) {

        this.kubeMQHost = kubeMQHost;
        this.kubeMQPort = isNaN(kubeMQRestPort) ? kubeMQPort.toString() : kubeMQRestPort;
        this.channelName = channelName;
        this.client = client;
        this.store = useStorage;
        this.isSecure = isSecure;
        this.group = group;
    }

    send(event) {

        let options;
        options = {
            'host': this.kubeMQHost,
            'port': this.kubeMQPort,
            'headers': {
                'Content-Type': 'application/json' }           
        };

        event.Channel = this.channelName;
        event.ClientID = this.client;

        options.method = 'POST';

        options.path = '/send/event';

        event.store = this.store;

        if (this.isSecure) {
            return httpExec.getHttpsRequest(event, options);

        } else {

            return httpExec.getRequest(event, options);
        }

    };

    openStream() {
        let options = {
            headers: {
                'Content-Type': 'application/json'},
            rejectUnauthorized: false
        };

        let url = this.isSecure ? 'wss://' : 'ws://';
        url = url.concat(this.kubeMQHost.concat(':', this.kubeMQPort));
        url = url.concat('/send/stream');
        url = url.concat('?client_id=' + this.client);
        url = url.concat('&channel=' + this.channelName);

        if (this.group !== undefined) {
            url = url.concat('&group=' + Group);
        }

        if (!this.store) {
            url = url.concat('&subscribe_type=events');
        }
        else {
            url = url.concat('&subscribe_type=events_store');
            url = url.concat('&events_store_type_data=' + storeProperties.Type);
            url = url.concat('&events_store_type_value=' + storeProperties.Value);
        }

        wsStream = new stream(url, options);
        wsStream.openStream();
        return wsStream;
    }

    stream(event) {
        event.Channel = this.channelName;
        event.ClientId = this.client;
        event.store = this.store;
        return wsStream.stream(event);
    }


    closeStream() {
        if (wsStream !== undefined) {
            wsStream.stopStream();
        }
    }


    subscribe(subscriberToEvents, errorHandler, storeProperties) {
        if (wsReceive === undefined) {

            let options = { rejectUnauthorized: false };
           
            let url = this.isSecure ? 'wss://' : 'ws://';
            url = url.concat(this.kubeMQHost.concat(':', this.kubeMQPort));
            url = url.concat('/subscribe/events');
            url = url.concat('?client_id=' + this.client);
            url = url.concat('&channel=' + this.channelName);

            if (this.group) {
                url = url.concat('&group=' + Group);
            }

            if (!this.store) {
                url = url.concat('&subscribe_type=events');
            }
            else {
                url = url.concat('&subscribe_type=events_store');
                url = url.concat('&events_store_type_data=' + storeProperties.Type);
                url = url.concat('&events_store_type_value=' + storeProperties.Value);
            }
            wsReceive = new stream(url, options);
            wsReceive.openStream();
        };
        wsReceive.on('message', function incoming(data) {
            subscriberToEvents(data);
        });
        wsReceive.on('close', function incoming(code,number,reason) {
            errorHandler('closed socket on code:' + code + ', number:'+ number +', reason:'+reason);
        });
        return new Promise((resolve, reject) => {
            wsReceive.on('open', function open() {
                console.log('subscriber open');
                return resolve('socket open');
            });

            wsReceive.on('error', err => {
                if (errorHandler) {
                    errorHandler(err);
                }
                return reject(err);
            });
        });

    }

    unsubscribe() {
        if (wsReceive !== undefined) {
            wsReceive.stopStream();
        }
    }
};

module.exports = PubSub;
module.exports.Event = Event;
module.exports.EventStoreType = {
    StartNewOnly: 1,
    StartFromFirst: 2,
    StartFromLast: 3,
    StartAtSequence: 4,
    StartAtTime: 5,
    StartAtTimeDelta: 6
};
module.exports.EventStoreType = {
    StartNewOnly: 1,
    StartFromFirst: 2,
    StartFromLast: 3,
    StartAtSequence: 4,
    StartAtTime: 5,
    StartAtTimeDelta: 6
};
