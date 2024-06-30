import React from 'react'
import Avatar from 'react-avatar';
export const ClientLogo = ({username}) => {
  const user=username.split("@")[0];
  // console.log(user)
  return (
    <div>
        <Avatar name={user} size={50} round="14px" />
        <p>{user}</p>

    </div>
  )
}
