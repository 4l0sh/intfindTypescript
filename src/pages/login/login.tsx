import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
const Login = () => {
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const login = (e: any) => {
    e.preventDefault();
    fetch(`${config.apiBaseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === 'User not found') {
          setMessage('Invalid email or password');
        } else {
          sessionStorage.setItem('jwt', result.token);
          sessionStorage.setItem('userId', result.userId);
          sessionStorage.setItem('role', result.role);
          M.toast({ html: 'Logged in successfully', classes: 'green auth' });
          if (result.role === 'admin') {
            navigate('/manageStudents');
          } else {
            navigate('/skills');
          }
        }
      });
  };

  return (
    <Fragment>
      <body>
        <div className='mainContainer'>
          <div className='box1'></div>
          <div className='box2 signupCard'>
            <div className='signupForm'>
              <h1 className='signupTitle'>Log In</h1>
              <p className='message'>{message}</p>
              <form className='signupForm'>
                <input
                  id='email'
                  className='signupInput'
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  id='password'
                  className='signupInput'
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <input
                  className='signupSubmit'
                  type='submit'
                  onClick={login}
                  value='Log In'
                />
              </form>
            </div>
          </div>
          <div className='box3'></div>
        </div>
      </body>
    </Fragment>
  );
};

export default Login;
