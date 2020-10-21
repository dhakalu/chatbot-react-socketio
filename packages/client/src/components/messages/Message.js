import React, { useContext } from 'react'
import styled from 'styled-components'
import { UserDataContext } from '../../App'

export const Colors = {
  gray30: '#ccc',
  gray70: '#aaa',
  slefMessageBackgroundColor: '#b8d6f4',
  messageBackgroundColor: '#fff'
}

const MessageBox = styled.div`
    padding: 10px;
    background: ${props => props.isSelf ? Colors.slefMessageBackgroundColor : Colors.messageBackgroundColor};
    max-width: 70%;
    margin-bottom: 7px;
    display: flex;
    .hanlde {
        font-size: 0.8em;
        color: ${Colors.gray70}
    }
`

const Message = (props) => {
  const {
    handle = '',
    text = ''
  } = props

  const { selfHandle } = useContext(UserDataContext)

  const isSelf = handle === selfHandle

  return (
    <div style={{ display: 'flex', justifyContent: isSelf ? 'flex-end' : 'flex-start' }}>
      <MessageBox isSelf={isSelf}>
        <div>
          <div />
          <div>
            {
              !isSelf && (
                <div className='hanlde'>
                  {handle}
                </div>
              )
            }
            <div>
              {text}
            </div>
          </div>
        </div>
      </MessageBox>
    </div>
  )
}

export default Message
