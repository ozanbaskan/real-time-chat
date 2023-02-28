
const connectAndReturnSocket = async () => {
    let socket;
    const socketF = () => {
        return new Promise((resolve, reject) => {
            const innerF = () => {
                socket = new WebSocket('ws://localhost:3000');
                socket.onmessage = async (event) => {
                    const theirBox = document.querySelector('.their-box');
                    const data = event.data;
                    const json = JSON.parse(data);
                    const message = json.message;
                    const userId = json.id;
                    const className = `user-${userId}`;
                    let currentTextBox = document.querySelector(`.${className}`);
                    if (!currentTextBox) {
                        currentTextBox = document.createElement('span');
                        const breakLine = document.createElement('br');
                        currentTextBox.classList.add(className);
                        theirBox.append(currentTextBox);
                        theirBox.append(breakLine);
                    }
                    if (json.setMessage) {
                        currentTextBox.innerText = message;
                    } else if (message === '\b') {
                        currentTextBox.innerText = currentTextBox.innerText.slice(0, -1);
                        return;
                    } else if (message === '\n') {
                        currentTextBox.classList.remove(className);
                    } else {
                        currentTextBox.innerText += message;
                    }
                };

                socket.onopen = () => {
                    const myBox = document.querySelector('.my-box');
                    let myBoxValue = myBox.value;
                    myBox.addEventListener('keydown', (event) => {
                        if (event.ctrlKey || event.altKey || event.shiftKey) return;
                        if (event.key.length === 1) {
                            socket.send(event.key);
                        }
                        else if ('Enter' === event.key) {
                            const theirBox = document.querySelector('.their-box');
                            theirBox.innerHTML += `<span style="color:red;">${myBox.value}</span><br>`
                            myBox.value = '';
                            socket.send('\n');
                        }
                        setTimeout(() => {
                            if (Math.abs(myBoxValue.length - myBox.value.length) > 0) {
                                socket.send('###$$$' + myBox.value)
                            }
                            myBoxValue = myBox.value;
                        }, 0)
                    })
                    resolve();
                };

                socket.onerror = (event) => {
                    socket.close();
                };

                socket.onclose = (event) => {
                    setTimeout(innerF, 5000);
                };
            }
            innerF();
        });
    };
    console.log('trying to connect');

    await socketF();
    console.log('connected');
    return socket;
};

document.addEventListener('mousedown', (event) => {
    const myBox = document.querySelector('.my-box');
    setTimeout(() => {
        myBox.focus();
    }, 0)
})

const socket = connectAndReturnSocket();