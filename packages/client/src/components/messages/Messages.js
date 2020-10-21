
import React, { useRef, useEffect } from 'react'
import Message from './Message'
import Notification from './Notification'

import styled from 'styled-components'

const MessagesListWrapper = styled.div`
  height: 500px;
  overflow-x: hidden;
  overflow-y: scroll;
`

const Messages = props => {
  const {
    messages = []
  } = props

  const dummyScroolToBottomRef = useRef()

  useEffect(() => {
    dummyScroolToBottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div>
      <h1>Messages</h1>
      <MessagesListWrapper>
        {
          messages.map((message, index) => {
            switch (message.handle) {
              case 'admin':
                return <Notification key={index} message={message.text} />
              default:
                return <Message key={index} {...message} />
            }
          })
        }
        <div
        style={{ float: 'left', clear: 'both' }}
        ref={dummyScroolToBottomRef}
      />
      </MessagesListWrapper>
    </div>
  )
}

export default Messages
