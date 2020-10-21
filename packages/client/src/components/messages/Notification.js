
import React from 'react'


import styled from 'styled-components'

const NotificationWrapper = styled.div`
    padding: 7px;
    color: #aaa;
`

const Notification = props => {
  const {
    message = 'New Event Occured'
  } = props

  return (
    <NotificationWrapper>
      {message}
    </NotificationWrapper>
  )
}

export default Notification
