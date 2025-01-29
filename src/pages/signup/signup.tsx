import { Fragment, useState } from 'react';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import './signup.css';
const Signup = () => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL2FQ72FWEtzxniuTGYHMNDjFiJ0p2ULQELg&s'
  );

  const navigateToSkills = () => {
    navigate('/skills');
  };

  const submitHandler = (e: any) => {
    e.preventDefault();
    const role: string = 'student';

    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const confirmPassword = (
      document.getElementById('confirmPassword') as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      M.toast({ html: 'Passwords do not match', classes: 'red toast' });
      return;
    }

    fetch(`${config.apiBaseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role, selectedAvatar }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'User already exists') {
          M.toast({ html: 'User already exists', classes: 'red toast err' });
          return;
        }
        M.toast({ html: 'Signup Successful', classes: 'green toast' });
        sessionStorage.setItem('jwt', data.token);
        sessionStorage.setItem('userId', data._id);
        navigateToSkills();
      })
      .catch((err) => {
        M.toast({ html: 'Signup Failed', classes: 'red toast' });
        console.log(err);
      });
  };
  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='box1'></div>
        <div className='box2 signupCard'>
          <div className='signupForm'>
            <h1 className='signupTitle'>Signup</h1>
            <form className='signupForm'>
              <div className='avatar'>
                <img
                  className='avatarImg'
                  src='https://img.freepik.com/free-photo/portrait-young-businessman-with-mustache-glasses-3d-rendering_1142-51509.jpg?t=st=1737707122~exp=1737710722~hmac=1af88769b8b4d0969e8a35a3c9b8b9a402348fa5a46116fdb1c0ae3face24e53&w=740'
                  alt='avatar-man'
                  onClick={() => {
                    setSelectedAvatar(
                      'https://img.freepik.com/free-photo/portrait-young-businessman-with-mustache-glasses-3d-rendering_1142-51509.jpg?t=st=1737707122~exp=1737710722~hmac=1af88769b8b4d0969e8a35a3c9b8b9a402348fa5a46116fdb1c0ae3face24e53&w=740'
                    );
                    M.toast({
                      html: 'Avatar selected',
                      classes: 'green toast avatarToast',
                    });
                  }}
                />
                <img
                  className='avatarImg'
                  src='https://img.freepik.com/free-photo/portrait-beautiful-young-woman-with-curly-hair-brown-hat_1142-42780.jpg?t=st=1737707865~exp=1737711465~hmac=a655998eec291299f93c7d0ba3b7b966e7ffb24081aadd214ba53ea5f2c2f584&w=826'
                  alt='avatar-woman'
                  onClick={() => {
                    setSelectedAvatar(
                      'https://img.freepik.com/free-photo/portrait-beautiful-young-woman-with-curly-hair-brown-hat_1142-42780.jpg?t=st=1737707865~exp=1737711465~hmac=a655998eec291299f93c7d0ba3b7b966e7ffb24081aadd214ba53ea5f2c2f584&w=826'
                    );
                    M.toast({
                      html: 'Avatar selected',
                      classes: 'green toast avatarToast',
                    });
                  }}
                />
                <img
                  className='avatarImg'
                  src='https://img.freepik.com/premium-photo/business-woman-3d-cartoon-avatar-portrait_839035-196331.jpg?w=360'
                  alt='avatar-man'
                  onClick={() => {
                    setSelectedAvatar(
                      'https://img.freepik.com/premium-photo/business-woman-3d-cartoon-avatar-portrait_839035-196331.jpg?w=360'
                    );
                    M.toast({
                      html: 'Avatar selected',
                      classes: 'green toast avatarToast',
                    });
                  }}
                />
                <img
                  className='avatarImg'
                  src='https://cdn.prod.website-files.com/6471ebc32c5012b32f0e45ba/66bb5eb7ad03ee7df2221a1f_JoDBRDfRn_QR6OTRO2HZTkDW9MHe84amL9rikLrejCI.png'
                  alt=''
                  onClick={() => {
                    setSelectedAvatar(
                      'https://img.freepik.com/premium-photo/business-woman-3d-cartoon-avatar-portrait_839035-196331.jpg?w=360'
                    );
                    M.toast({
                      html: 'Avatar selected',
                      classes: 'green toast avatarToast',
                    });
                  }}
                />
              </div>
              <input
                id='name'
                className='signupInput'
                type='text'
                placeholder='Full Name'
              />
              <input
                id='email'
                className='signupInput'
                type='email'
                placeholder='Email'
              />
              <input
                id='password'
                className='signupInput'
                type='password'
                placeholder='Password'
              />
              <input
                id='confirmPassword'
                className='signupInput'
                type='password'
                placeholder='Confirm Password'
              />
              <input
                className='signupSubmit'
                onClick={submitHandler}
                type='submit'
                value='Sign Up'
              />{' '}
              <p>
                Already have an account? <a href='/loginMail'> Log in </a>
              </p>
            </form>
          </div>
        </div>
        <div className='box3'>
          {' '}
          <i
            onClick={navigateToSkills}
            className='fa-solid fa-arrow-right arrow-right'
          ></i>
        </div>
      </div>
    </Fragment>
  );
};

export default Signup;
