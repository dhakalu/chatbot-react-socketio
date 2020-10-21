
const _ = require('lodash')
const pino = require('pino')
const logger = pino({ level: process.env.LOG_LEVEL || 'debug' })

const messages = []

const addMessage = ({ message, handle, channel }) => {
  logger.debug(`${handle} posted a message in channel: ${channel}`)
  messages.push({
    text: message,
    handle,
    channel
  })
}

const getMessagesForAChannel = (channel) => {
  const messageOfChannel = _.filter(messages, { channel: channel }) || []
  return messageOfChannel
}

module.exports = { addMessage, getMessagesForAChannel }
