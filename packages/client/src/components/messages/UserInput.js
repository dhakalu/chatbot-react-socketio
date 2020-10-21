import React, { useState } from 'react'
import styled from 'styled-components'

const UserInputWrapper = styled.div`
    display: flex;
    flex-direction: 'row';
    bottom: 30px;
`

const InputWrapper = styled.div`
    flex: 1;
    input {
        display: block;
        border: none;
        width: calc(100% - 34px);
        padding: 17px;
    }
`
const ButtonWrapper = styled.div`
    button {
        padding: 10px;
    }
`
const UserInput = (props) => {

  const {
    onSendMessage = () => false
  } = props

  const [message, setMessage] = useState('')

  const handleInputChange = (event) => {
    const value = event.target.value || ''
    setMessage(value)
  }

  const handleSend = () => {
    if (!message) return 
    onSendMessage(message, () => setMessage(''))
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && message) {
      onSendMessage(message, () => setMessage(''))
    }
  }

  return (
    <UserInputWrapper>
      <InputWrapper>
        <input
          value={message}
          onKeyPress={handleKeyPress}
          placeholder='Type your message to send here...'
          onChange={handleInputChange}
        />
      </InputWrapper>
      {/* <ButtonWrapper>
        <button onClick={handleSend}>send</button>
      </ButtonWrapper> */}
    </UserInputWrapper>
  )
}

export default UserInput
