/* eslint-disable import/no-extraneous-dependencies */
import {useState} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const LoginPage = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const onChangeHandler = event => {
    const {id, value} = event.target
    if (id === 'username') {
      setUsername(value)
    } else {
      setPassword(value)
    }
  }

  const onSuccessfulLogin = jwtToken => {
    const {history} = props
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    history.replace('/')
  }

  const onFailedLogin = errorMessage => {
    setErrorMsg(errorMessage)
  }

  const onSubmitLogin = async event => {
    event.preventDefault()
    const userDetails = {username, password}
    const api = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(api, options)
    const data = await response.json()
    if (response.ok) {
      onSuccessfulLogin(data.jwt_token)
    } else {
      onFailedLogin(data.error_msg)
    }
  }

  if (Cookies.get('jwt_token')) {
    return <Redirect to="/" />
  }

  return (
    <div className="login-bg-container">
      <form onSubmit={onSubmitLogin} className="login-form">
        <h1 className="login-heading">Login</h1>
        <label htmlFor="username">USERNAME</label>
        <input
          id="username"
          type="text"
          onChange={onChangeHandler}
          value={username}
        />
        <label htmlFor="password">PASSWORD</label>
        <input
          id="password"
          type="password"
          onChange={onChangeHandler}
          value={password}
        />
        <button type="submit" className="login-button">
          Login
        </button>
        {errorMsg !== '' && <p className="error-msg">{errorMsg}</p>}
      </form>
    </div>
  )
}

export default LoginPage
