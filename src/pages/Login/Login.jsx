import './login.scss'

const Login = () => {
  return (
    <div className='login'>

      <form>
        <div>
          <label htmlFor="roomid">Room Id</label>
          <input type="text" name="roomid" id="roomid" />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" />
        </div>
        <div>
          <input type="submit" value="Enter Room" />
        </div>
        <div>
          <p>Create a new Room </p>
        </div>
      </form>


    </div>
  )
}

export default Login