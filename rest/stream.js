
const WebSocket = require('ws');
const EventEmitter = require('events');


class stream extends EventEmitter {
    constructor(address, options) {
        super();
        this.address = address;
        this.options = options;
        this.socket = undefined;
    }
    openStream() {
        if (this.socket !== undefined) {
            return reject('there is already a stream, please close it first.' + wsStream);
        };

        this.socket = new WebSocket(this.address, this.options);
        let self = this;
        this.socket.on('open', (_ => {
            self.emit('open');
        }));
        this.socket.on('close',
            (code,number,reason) => {
                self.emit('close',code,number,reason);
            });
        this.socket.on('error', err => {
            self.emit('error', err);
        });

        this.socket.on('message', msg =>
            self.emit('message', JSON.parse(msg)));
    };

    stream(event) {

        return new Promise((resolve, reject) => {
            if (this.socket.readyState !== this.socket.OPEN) {
                return reject('socket is not ready' + socket.readyState);
            }
            this.socket.send(JSON.stringify(event), err => {
                if (err === undefined) {
                    return resolve('sent');
                } else {
                    return reject(err);
                };
            });
        });
    };

    stopStream() {
        if (this.socket !== undefined) {
            this.socket.close();
        }
    }


}
module.exports = stream;