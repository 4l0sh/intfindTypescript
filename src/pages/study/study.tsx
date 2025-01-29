import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './study.css';

const Study: React.FC = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState<string>('');
  const [school, setSchool] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [finishDate, setFinishDate] = useState<string>('');
  const opleiding = {
    course: course,
    school: school,
    startDate: startDate,
    finishDate: finishDate,
  };
  const submitHandler = (e: any) => {
    e.preventDefault();
    fetch('http://localhost:4000/study', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
        userId: sessionStorage.getItem('userId') || '',
      },
      body: JSON.stringify({ study: opleiding }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === 'Study added') {
          M.toast({ html: 'Study added', classes: 'green toast' });
        } else if (result.status === 401) {
          M.toast({ html: 'Unauthorized', classes: 'red toast' });
        }
      })
      .catch((err) => {
        if (err.message.includes('duplicate key error')) {
          M.toast({ html: 'Study already added', classes: 'red toast' });
        }
        console.log(err);
        M.toast({ html: 'Failed to add study', classes: 'red toast' });
      });
  };

  const redirectToExperience = () => {
    navigate('/experience');
  };
  const redirectToSkills = () => {
    navigate('/skills');
  };
  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='box1'>
          {' '}
          <i
            onClick={redirectToSkills}
            className='fa-solid fa-arrow-left arrow-right'
          ></i>
        </div>
        <div className='box2 signupCard'>
          <div className='signupForm'>
            <h1 className='signupTitle'>Current Study</h1>
            <form className='signupForm'>
              <div className='opleiding'>
                <input
                  type='text'
                  className='signupInput'
                  id='course'
                  placeholder='Course name'
                  onChange={(e) => setCourse(e.target.value)}
                />
                <input
                  type='text'
                  className='signupInput'
                  id='school'
                  placeholder='school'
                  onChange={(e) => setSchool(e.target.value)}
                />
              </div>
              <div className='date'>
                <p>Started on : </p>
                <input
                  type='date'
                  className='selectDate'
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className='date'>
                <p>Finish date : </p>
                <input
                  type='date'
                  className='selectDate'
                  onChange={(e) => setFinishDate(e.target.value)}
                />
              </div>
              <input
                type='submit'
                onClick={submitHandler}
                className='signupSubmit'
                value='Submit'
              />
            </form>
          </div>
        </div>
        <div className='box3'>
          {' '}
          <i
            onClick={redirectToExperience}
            className='fa-solid fa-arrow-right arrow-right'
          ></i>
        </div>
      </div>
    </Fragment>
  );
};

export default Study;
