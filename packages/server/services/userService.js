const _ = require('lodash')

const pino = require('pino')
const logger = pino({ level: process.env.LOG_LEVEL || 'debug' })

const users = []

const addUser = ({ id, handle, channel }) => {
  const user = { id, handle, channel }
  if (!handle || !id || !channel) {
    logger.error('One of hndle, id or channel is missing. Request recieved was %O', user)
    throw new Error('One of hanlde, id or channel is missging')
  }
  logger.debug('Adding new user with id %s, handle %s to channel %s', id, handle, channel)
  handle = handle.trim()
  channel = channel.trim()

  const existingUser = _.find(users, { id: id, channel: channel })

  if (existingUser) {
    return {
      error: `${handle} has already joined ${channel}`
    }
  }

  users.push(user)

  return { user }
}

const removeUser = (id) => {
  if (!id) return
  const user = getUser(id)
  _.remove(users, { id: id })
  return user
}

const getUser = (id) => {
  return _.find(users, { id: id })
}

const getUsersForAChannel = (channel) => {
  _.filter(users, {})
}

module.exports = { addUser, removeUser, getUser, getUsersForAChannel }