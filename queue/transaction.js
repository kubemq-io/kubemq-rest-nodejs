const EventEmitter = require('events');
const WebSocket = require('ws');

const StreamRequestType = {
    'StreamRequestTypeUnknown': 0,
    'ReceiveMessage': 1,
    'AckMessage': 2,
    'RejectMessage': 3,
    'ModifyVisibility': 4,
    'ResendMessage': 5,
    'SendModifiedMessage': 6
}


/**
 * @param {string} kubeMQHost - The KubeMQ address.
 * @param {number} kubeMQRestPort - The KubeMQ Rest exposed port.
 * @param {string} client - The publisher ID, for tracing.
 * @param {string} queueName - The queue name.
 * @param {boolean} isSecure - Using TLS secure KubeMQ.
 */
class transaction extends EventEmitter {
    constructor(kubeMQHost, kubeMQRestPort, client, queueName, isSecure) {
        if (kubeMQRestPort === undefined || kubeMQRestPort === null){
            throw new Error('Please fill kubeMQRestPort');
        }

        super();
        this.socketOpen = false;
        this.socketOpening = false;
        this.kubeMQHost = kubeMQHost;
        this.kubeMQRestPort = isNaN(kubeMQRestPort) ? kubeMQPort.toString() : kubeMQRestPort;
        this.client = client;
        this.queueName = queueName;
        this.isSecure;
        this.ws = null;
        let url = isSecure ? 'wss://' : 'ws://';
        url = url.concat(this.kubeMQHost.concat(':', this.kubeMQRestPort));
        url = url.concat('/queue/stream');
        url = url.concat('?client_id=' + this.client);
        url = url.concat('&channel=' + this.queueName);

        if (this.group !== undefined) {
            url = url.concat('&group=' + Group);
        }
        this.url = url;
        this.TranMessage = undefined;
    }

    transactionReady(){
        if (this.TranMessage !== undefined || this.socketOpen === true || this.socketOpening === true) {
           return false;
        }else{
            return true;
        };
    };
    
    receiveMessage(visibilitySeconds, waitTimeSeconds) {
        if (this.TranMessage !== undefined || this.socketOpen === true || this.socketOpening === true) {
            this.emit('error', { Error: 'there is still a transaction open' });
            return;
        }
        this.socketOpening = true;
        let options = {        
            rejectUnauthorized: false
        };

        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.ReceiveMessage,
            Channel: this.queueName,
            VisibilitySeconds: visibilitySeconds,
            WaitTimeSeconds: waitTimeSeconds,
            RefSequence: this.TranMessage !== undefined ?  this.TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: null,
        }

        let json = JSON.stringify(StreamQueueMessageRequest);
        

        this.ws = new WebSocket(this.url, options);

        let self = this;

        self.ws.on('message', function incoming(data) {
            let msg = JSON.parse(data);
            if (msg.IsError) {
                self.TranMessage = undefined;
                self.emit('error', msg);
                return;
            }
            switch (msg.StreamRequestTypeData) {
                case StreamRequestType.ReceiveMessage:
                    self.TranMessage = msg;
                    self.emit('message', msg);
                    break;
                case StreamRequestType.AckMessage:
                    msg.by = 'AckMessage';
                    self.emit('end', msg);
                    this.close();
                    break;
                case StreamRequestType.RejectMessage:
                    msg.by = 'RejectMessage';
                    self.emit('end', msg)
                    this.close();
                    break;

                case StreamRequestType.ModifyVisibility:
                    self.emit('extended', msg)                   
                    break;
                case StreamRequestType.ResendMessage:
                    msg.by = 'ResendMessage';
                    self.emit('end', msg)
                    this.close();
                    break;
                case StreamRequestType.SendModifiedMessage:
                    msg.by = 'SendModifiedMessage';
                    self.emit('end', msg)
                    this.close();
                    break;

            }
        });

        self.ws.on('open', function open() {
            self.socketOpen = true;
            self.socketOpening = false;
            self.ws.send(json, err => {
                if (err !== undefined) {
                    self.emit('error', err);
                }
            });
        });
        self.ws.on('close', code => {
            self.TranMessage = undefined;
            self.socketOpen = false;
            self.socketOpening = false;
            self.emit('end', { by: 'socket close' })
        });
        self.ws.on('error', err => {
            self.emit('error', err);
        });



    };

    ackMessage() {

        if ( this.TranMessage === undefined || this.socketOpen === false) {
            this.emit('error', { Error: 'no message in tran' });
            return;
        }
        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.AckMessage,
            Channel: this.queueName,
            VisibilitySeconds: undefined,
            WaitTimeSeconds: undefined,
            RefSequence:  this.TranMessage !== undefined ?  this.TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: null,
        }



        let json = JSON.stringify(StreamQueueMessageRequest);
        let self = this;
        self.ws.send(json, err => {
            if (err !== undefined) {
                self.emit('error', err);
            }
        });
    };

    rejectedMessage() {
        if ( this.TranMessage === undefined || this.socketOpen === false) {
            this.emit('error', { Error: 'no message in tran' });
            return;
        }
        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.RejectMessage,
            Channel: this.queueName,
            VisibilitySeconds: undefined,
            WaitTimeSeconds: undefined,
            RefSequence:  this.TranMessage !== undefined ?  this.TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: null,
        }



        let json = JSON.stringify(StreamQueueMessageRequest);
        let self = this;
        self.ws.send(json, err => {
            if (err !== undefined) {
                self.emit('error', err);
            }
        });
    };

    extendVisibility(visibility_seconds) {
        if ( this.TranMessage === undefined || this.socketOpen === false) {
            this.emit('error', { Error: 'no message in tran' });
            return;
        }
        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.ModifyVisibility,
            Channel: this.queueName,
            VisibilitySeconds: visibility_seconds,
            WaitTimeSeconds: undefined,
            RefSequence:  this.TranMessage !== undefined ?  this.TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: null,
        }



        let json = JSON.stringify(StreamQueueMessageRequest);

        let self = this;
        self.ws.send(json, err => {
            if (err !== undefined) {
                self.emit('error', err);
            }
        });
    };

    resend(queueName) {
        if ( this.TranMessage === undefined || this.socketOpen === false) {
            this.emit('error', { Error: 'no message in tran' });
            return;
        }
        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.ResendMessage,
            Channel: queueName,
            VisibilitySeconds: undefined,
            WaitTimeSeconds: undefined,
            RefSequence:  this.TranMessage !== undefined ?  this.TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: null,
        }



        let json = JSON.stringify(StreamQueueMessageRequest);     
        let self = this;
        self.ws.send(json, err => {
            if (err !== undefined) {
                self.emit('error', err);
            }
        });
    };


    modify(message) {
        if ( this.TranMessage === undefined || this.socketOpen === false) {
            this.emit('error', { Error: 'no message in tran' });
            return;
        }
       if(!message.Channel){
        message.Channel=  this.queueName;
       } 
        if(!message.ClientID){
            message.ClientID  = this.client;
        } 

        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.SendModifiedMessage,
            Channel: this.queueName,
            VisibilitySeconds: undefined,
            WaitTimeSeconds: undefined,
            RefSequence:  this.TranMessage !== undefined ?  this.TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: message,
        }

        let json = JSON.stringify(StreamQueueMessageRequest);
        let self = this;
        self.ws.send(json, err => {
            if (err !== undefined) {
                self.emit('error', err);
            }
        });
    };
};


module.exports = transaction;
