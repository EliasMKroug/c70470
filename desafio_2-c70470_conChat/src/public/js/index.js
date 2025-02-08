
const socket = io()

const user = {
    username: ''
}

const chatbox = document.querySelector('#send-chat')
const buttonChatBox = document.querySelector('#send-button-chat')
const contenedorChat = document.querySelector('#contenedor-chat')

Swal.fire({
    input: 'text',
    title: 'logueate',
    text: 'Ingresa tu nombre',
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
                return 'Debes ingresar un nombre!'
        }
    },
}).then((result) => {
    user.username = result.value
    socket.emit('new-user', user.username)
})

chatbox.addEventListener('keyup', (event) => {
    const { value } = event.target  
    if(event.key === 'Enter') {
        socket.emit('message', {username: user.username, message: value})
        console.log(value)
        event.target.value = ''
    } 
})

buttonChatBox.addEventListener('click', () => {
    if(chatbox.value){
        socket.emit('message', {username: user.username, message: chatbox.value})
        console.log(chatbox.value)
        chatbox.value = ''
    }
})

socket.on('logs', data => {
    console.log(data)
    contenedorChat.innerHTML = ''
    data.forEach(chat => {
        const div = document.createElement('div')
        div.innerHTML = `
        <p>${chat.username}: </p> <span> <b>${chat.message}</b> </span>
        <hr>
        `
        contenedorChat.appendChild(div)
    })
 })

socket.on('new-user', username => {
    Toastify({
        text: `${username} se ha unido al chat`,
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
})

