import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
const References: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [profession, setProfession] = useState<string>('');
  const [referenceText, setReferenceText] = useState<string>('');
  const redirectToExperience = () => {
    navigate('/experience');
  };
  const redirectToCard = () => {
    navigate('/showStudent');
  };
  const submitHandler = (e: any) => {
    e.preventDefault();
    fetch(`${config.apiBaseUrl}/references`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
        userId: sessionStorage.getItem('userId') || '',
      },
      body: JSON.stringify({ name, profession, referenceText }),
    })
      .then((response) => {
        if (response.status === 200) {
          M.toast({
            html: 'Reference added successfully',
            classes: 'green toast',
          });
        } else if (response.status === 401) {
          M.toast({
            html: 'Unauthorized: No/Invalid token',
            classes: 'red toast',
          });
        }
      })
      .catch((err) => {
        if (err.message.includes('duplicate key error')) {
          M.toast({ html: 'Reference already exists', classes: 'red toast' });
        } else {
          console.error('Error adding reference:', err);
          M.toast({ html: 'Error adding reference', classes: 'red toast' });
        }
      });
  };
  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='box1'>
          {' '}
          <i
            onClick={redirectToExperience}
            className='fa-solid fa-arrow-left arrow-right'
          ></i>
        </div>
        <div className='box2 signupCard'>
          <div className='signupForm'>
            <h1 className='signupTitle'>Work Reference</h1>
            <form className='signupForm'>
              <input
                className='signupInput'
                type='text'
                placeholder='Full Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className='signupInput'
                type='text'
                placeholder='Profession'
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
              <textarea
                className='signupInput referenceText'
                typeof='text'
                placeholder='Referentie Text'
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
              ></textarea>

              <input
                onClick={submitHandler}
                className='signupSubmit'
                type='submit'
                value='Submit'
              />
            </form>
          </div>
        </div>
        <div className='box3'>
          {' '}
          <i
            onClick={redirectToCard}
            className='fa-solid fa-arrow-right arrow-right'
          ></i>
        </div>
      </div>
    </Fragment>
  );
};

export default References;
