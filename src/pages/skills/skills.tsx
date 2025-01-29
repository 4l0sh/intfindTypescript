import { useNavigate } from 'react-router-dom';

const Skills: React.FC = () => {
  const navigate = useNavigate();

  const redirectToSignup = () => {
    navigate('/');
  };
  const redirectToStudy = () => {
    navigate('/study');
  };
  const submitHandler = (e: any) => {
    e.preventDefault();
    const skill1 = (document.getElementById('skill1') as HTMLInputElement)
      .value;
    const skill1value = (
      document.getElementById('skill1value') as HTMLInputElement
    ).value;
    const skill2 = (document.getElementById('skill2') as HTMLInputElement)
      .value;
    const skill2value = (
      document.getElementById('skill2value') as HTMLInputElement
    ).value;
    const skill3 = (document.getElementById('skill3') as HTMLInputElement)
      .value;
    const skill3value = (
      document.getElementById('skill3value') as HTMLInputElement
    ).value;
    const skill4 = (document.getElementById('skill4') as HTMLInputElement)
      .value;
    const skill4value = (
      document.getElementById('skill4value') as HTMLInputElement
    ).value;
    const skills = {
      skill1,
      skill1value,
      skill2,
      skill2value,
      skill3,
      skill3value,
      skill4,
      skill4value,
    };
    fetch('http://localhost:4000/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        _id: sessionStorage.getItem('userId') || '',
        Authorization: 'Bearer ' + sessionStorage.getItem('jwt') || '',
      },
      body: JSON.stringify({
        skills,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          M.toast({ html: 'Skills Added', classes: 'green toast' });
        } else if (res.status === 401) {
          M.toast({ html: 'Unauthorized', classes: 'red toast' });
          res.json().then((data) => console.log(data));
        }
      })
      .catch((err) => {
        if (err.message.includes('duplicate key error')) {
          M.toast({ html: 'Skills Already Exists', classes: 'red toast' });
        }
        M.toast({ html: 'Skills Failed', classes: 'red toast' });
      });
  };
  return (
    <div>
      <div className='mainContainer'>
        <div className='box1'>
          {' '}
          <i
            onClick={redirectToSignup}
            className='fa-solid fa-arrow-left arrow-right'
          ></i>
        </div>
        <div className='box2 signupCard'>
          <div className='signupForm'>
            <h1 className='signupTitle'>Skills</h1>
            <form className='signupForm'>
              <div className='skillInput'>
                {' '}
                <input
                  id='skill1'
                  className='signupInput'
                  type='text'
                  placeholder='Skill 1'
                />
                <input
                  type='range'
                  className='range'
                  max='5'
                  min='1'
                  id='skill1value'
                />
              </div>
              <div className='skillInput'>
                {' '}
                <input
                  id='skill2'
                  className='signupInput'
                  type='email'
                  placeholder='Skill 2'
                />
                <input
                  type='range'
                  className='range'
                  max='5'
                  min='1'
                  id='skill2value'
                />
              </div>
              <div className='skillInput'>
                {' '}
                <input
                  id='skill3'
                  className='signupInput'
                  type='text'
                  placeholder='Skill 3'
                />
                <input
                  type='range'
                  className='range'
                  max='5'
                  min='1'
                  id='skill3value'
                />
              </div>
              <div className='skillInput'>
                <input
                  id='skill4'
                  className='signupInput'
                  type='text'
                  placeholder='Skill 4'
                />
                <input
                  type='range'
                  className='range'
                  max='5'
                  min='1'
                  name=''
                  id='skill4value'
                />
              </div>

              <input
                className='signupSubmit'
                type='submit'
                onClick={submitHandler}
                value='Submit'
              />
            </form>
          </div>
        </div>
        <div className='box3'>
          {' '}
          <i
            onClick={redirectToStudy}
            className='fa-solid fa-arrow-right arrow-right'
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Skills;
