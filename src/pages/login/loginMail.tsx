import { Fragment, useState } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [role, setRole] = useState<'admin' | 'student' | ''>('');
  const navigate = useNavigate();
  const generateCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  const sendEmail = (e: any) => {
    e.preventDefault();
    fetch(`${config.apiBaseUrl}/loginmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === 'User not found') {
          M.toast({ html: 'User not found', classes: 'red toast' });
          setMessage('User not found');
        } else {
          M.toast({ html: 'User Found', classes: 'green toast' });
          const code = generateCode();
          setGeneratedCode(code);
          setUserId(result._id);
          setToken(result.token);
          setRole(result.role);
          const templateParams = {
            to_email: email,
            code: code,
          };
          emailjs
            .send(
              'service_74cz9qy',
              'template_l5mg53n',
              templateParams,
              'KB7p7JbxPCkcrn0xq'
            )
            .then(
              (result) => {
                console.log('Email sent successfully:', result.text);
                setMessage('Verification code sent!');
              },
              (error) => {
                console.error('Error sending email:', error.text);
                setMessage('Failed to send email');
              }
            );
        }
      });
  };
  const verifyCode = (e: any) => {
    e.preventDefault();

    if (verificationCode === generatedCode) {
      console.log('code verified');
      M.toast({ html: 'Code verified', classes: 'green auth' });
      sessionStorage.setItem('jwt', token);
      sessionStorage.setItem('userId', userId);
      if (role === 'student') {
        navigate('/');
      } else if (role === 'admin') {
        navigate('/manageStudents');
      }
    } else {
      console.log('code not verified');
      M.toast({ html: 'Code not verified', classes: 'red auth' });
    }
  };
  const navigateToLogin = () => {
    navigate('/login');
  };
  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='box1'></div>
        <div className='box2 signupCard'>
          <div className='signupForm'>
            <h1 className='signupTitle'>Log in by email</h1>
            <form className='signupForm'>
              <input
                className='signupInput'
                id='email'
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                onClick={sendEmail}
                className='signupSubmit'
                type='submit'
                value='Send Code'
              />
              <p>
                Don't have an account?{' '}
                <a href='/' className='link'>
                  Register
                </a>
              </p>
            </form>
            <p className='message'>{message}</p>
            <div className='verification'>
              <form className='signupForm'>
                <input
                  className='signupInput'
                  placeholder='Verification Code'
                  type='text'
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <input
                  className='signupSubmit '
                  type='submit'
                  value='Verify'
                  onClick={verifyCode}
                />
              </form>
              <p>
                Log in using your Password{' '}
                <p onClick={navigateToLogin} className='loginLink'>
                  Here
                </p>
              </p>
            </div>
          </div>
        </div>
        <div className='box3'></div>
      </div>
    </Fragment>
  );
};

export default Login;
