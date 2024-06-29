import React from 'react'
import Avatar from 'react-avatar';
export const ClientLogo = ({username}) => {
  return (
    <div>
        <Avatar name={username} size={50} round="14px" />
        <p>{username}</p>

    </div>
  )
}
