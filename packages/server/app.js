var express = require('express')
const http = require('http')
const cors = require('cors')
const socketio = require('socket.io')

const app = express()
const pino = require('pino')
const expressPino = require('express-pino-logger')
const logger = pino({ level: process.env.LOG_LEVEL || 'info' })
const expressLogger = expressPino({ logger })
app.use(expressLogger)

const { addUser, removeUser, getUser, getUsersForAChannel } = require('./services/userService')
const { addMessage, getMessagesForAChannel } = require('./services/messageService')

var corsOptions = {
  origin: ['https://5ea742dfbe844edd615074ea--chat-with-upen.netlify.app', 'https://chat-with-upen.netlify.app', 'http://localhost:3000'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.set('etag', false)

app.use(function (req, res, next) {
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Content-Type', 'text/plain; charset=UTF-8')
  next()
})

const server = http.createServer(app)
const io = socketio(server)

const router = require('./routes')
app.use(router)

io.on('connection', (socket) => {
  logger.info(`New socket created id ${socket.id}`)

  socket.on('join', ({ handle, channel }, callback) => {
    const { error, user } = addUser({ id: socket.id, handle, channel })
    if (error) {
      logger.error('Could not add user to the requested channel.', error)
      callback && callback(error, null)
    } else {
      logger.debug()
      socket.emit('server-message', { handle: 'admin', text: `Hi ${handle}, Welcome!` })
      socket.broadcast.to(channel).emit('server-message', { handle: 'admin', text: `${handle} has joined!` })
      socket.join(channel)
      callback && callback(null, { messages: getMessagesForAChannel(channel) })
    }
  })

  socket.on('send-message', ({ message }, callback) => {
    const { handle, channel } = getUser(socket.id) || {}
    // console.log('A message will be sent back to channel ' + channel)
    addMessage({ message, handle, channel })
    socket.emit('server-message', { handle: handle, text: message })
    socket.broadcast.to('hello').emit('server-message', { handle: handle, text: message })
    callback()
  })

  socket.on('remove-disconnet', () => {
    logger.debug(`Socket with id  ${socket.id} is disconnected.`)
    const user = removeUser(socket.id)
    if (user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` })
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersForAChannel(user.channel) })
    }
  })
})

// app.use(function (err, req, res, next) {
//   if (err) {
//     logger.error(err)
//     logger.error('Someting fatal occurred')
//   }
//   res.status(500).send('Opps! Someting went wrong')
// })

const PORT = process.env.PROT || 4000
server.listen(PORT, (error, data) => {
  logger.info('Server running on port %d', PORT)
  if (error) {
    logger.error('App could not start because %O', error)
  }
})
