import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface Skill {
  skill: string;
  value: number;
}

const Test: React.FC = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([
    { skill: '', value: 1 },
    { skill: '', value: 1 },
    { skill: '', value: 1 },
    { skill: '', value: 1 },
  ]);

  const redirectToSignup = () => navigate('/');
  const redirectToStudy = () => navigate('/study');

  const submitHandler = (e: any) => {
    e.preventDefault();

    fetch('http://localhost:4000/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        _id: sessionStorage.getItem('userId') || '',
        Authorization: 'Bearer ' + (sessionStorage.getItem('jwt') || ''),
      },
      body: JSON.stringify({ skills }),
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

  const handleSkillChange = (index: number, value: string) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill, i) =>
        i === index ? { ...skill, skill: value } : skill
      )
    );
  };

  const handleValueChange = (index: number, value: number) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill, i) => (i === index ? { ...skill, value } : skill))
    );
  };

  return (
    <div>
      <div className='mainContainer'>
        <div className='box1'>
          <i
            onClick={redirectToSignup}
            className='fa-solid fa-arrow-left arrow-right'
          ></i>
        </div>
        <div className='box2 signupCard'>
          <div className='signupForm'>
            <h1 className='signupTitle'>Skills</h1>
            <form className='signupForm'>
              {skills.map((skill, index) => (
                <div key={index} className='skillInput'>
                  <input
                    className='signupInput'
                    type='text'
                    placeholder={`Skill ${index + 1}`}
                    value={skill.skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                  />
                  <input
                    type='range'
                    className='range'
                    max='5'
                    min='1'
                    value={skill.value}
                    onChange={(e) =>
                      handleValueChange(index, Number(e.target.value))
                    }
                  />
                </div>
              ))}
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
          <i
            onClick={redirectToStudy}
            className='fa-solid fa-arrow-right arrow-right'
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Test;
