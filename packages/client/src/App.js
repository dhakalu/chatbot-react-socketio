import React, { useEffect, useState, createContext } from 'react'
import './App.css'
import io from 'socket.io-client'
import Messages from './components/messages/Messages'
import UserInput from './components/messages/UserInput'
import queryString from 'query-string'
import styled from 'styled-components'

const MessagesListWrapper = styled.div`
  width: 800px;
  margin: auto;
  margin-top: 100px;
`

let socket

const initialContext = {
  handle: '',
  channel: ''
}

export const UserDataContext = createContext(initialContext)

const App = () => {
  const ENDPOINT = 'http://localhost:4000'

  const [messages, setMessages] = useState([])
  const [selfHandle, setSelfHandle] = useState('')
  const [channel, setSelfChannel] = useState('')

  useEffect(() => {
    socket = io(ENDPOINT, { reconnection: false, forceNew: true })
    console.log(socket)
    const parsed = queryString.parse(window.location.search)
    const { handle, channel } = parsed
    setSelfHandle(handle)
    setSelfChannel(channel)
    console.log(parsed)
    /*
    * When page loads create the socket connection
    */
    socket.emit('join', { handle, channel }, (error, { messages }) => {
      // alert('Jpined' + messages.legth)
      if (error) {
        console.error(error)
      }
      setMessages(messages)
    })
    /*
    * When page unloads disconnect the socket connection
    * and turn the socket off
    */
    return () => {
      // socket.emit('remove-disconnet', {})
      // socket.disconnect()
      // socket.off()
    }
  }, [ENDPOINT])

  useEffect(() => {
    socket.on('server-message', (message) => {
      setMessages([...(messages || []), message])
    })
  }, [messages])

  const sendMessage = (message, callback) => {
    socket.emit('send-message', { message }, callback)
  }

  return (
    <UserDataContext.Provider value={{ selfHandle, channel }}>
      <MessagesListWrapper>
        <Messages messages={messages} />
        <UserInput onSendMessage={sendMessage} />
      </MessagesListWrapper>
    </UserDataContext.Provider>
  )
}

export default App
