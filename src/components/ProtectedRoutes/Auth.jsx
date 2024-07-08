import React, { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const Auth = (props) => {
  const navigate=useNavigate();
  const {authState}=useAuth();
  console.log(authState)
  async function isLogin(){
    if (!authState?.username) {
      navigate('/', { state: { message: 'You need to sign in Before Creating Room'} });
    }
  }
  useEffect(()=>{
    isLogin();
  },[authState.username,navigate])
  return (
    <div>
        <props.compo />
    </div>
  )
}

export default Auth