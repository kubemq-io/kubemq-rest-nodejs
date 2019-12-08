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


/**
* Message to send to kubemq.queue
* @param {string} Metadata          -     General information about the message body.
* @param {string} Body              -     The information that you want to pass.
* @param {string} Tags              -     Key value pair that represent the message to help identify it.
* @param {string} MessageID         -     Unique identifier  to the message , if null will create a running one.
*/
class Message{
    constructor(body){

        //Represents The channel name to send to using the KubeMQ .
        this.MessageID      =    undefined;
        //Represents the sender ID that the events will be send under.
        this.ClientID       =    undefined;
        //Represents if the events should be send to persistence.
        this.Channel        =    undefined;
        //Represents a event identifier.
        this.Metadata       =    undefined;
        //Represents text as str.
        this.Body           =    body;
        //Represents the content of the event.
        this.Tags           =    undefined;
        //key value pair to help distinguish the event.
        this.Attributes     =    undefined;
        //key value pair to help distinguish the event.
        this.Policy         =    undefined;
    } 

    addExpiration(expiration){    
        if(!this.Policy){
            this.Policy = {};
        }
        this.Policy.expirationSeconds = expiration;    
    }

    addDelay(delay){  
        if(!this.Policy){
            this.Policy = {};
        }
       this.Policy.delaySeconds = delay;        
    }

    addMaxReceiveCount(maxReceive, maxReceiveQueueName){
        if(!this.Policy){
            this.Policy = {};
        }
        this.Policy.maxReceiveCount = maxReceive;
        this.Policy.maxReceiveQueue = maxReceiveQueueName;
    }
}


module.exports=Message;

