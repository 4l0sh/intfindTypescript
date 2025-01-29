import { Fragment, useState } from 'react';
import config from '../../config';
import './experience.css';
const ExperienceForm = () => {
  const [inputs, setInputs] = useState<{ id: number; value: string }[]>([]);

  const handleInputChange = (id: number, value: string) => {
    const newInputs = inputs.map((input) =>
      input.id === id ? { ...input, value: value } : input
    );
    setInputs(newInputs);
  };

  const toggleInputField = () => {
    const newId = Date.now();
    setInputs((prevInputs) => [...prevInputs, { id: newId, value: '' }]);
  };
  const submitHandler = () => {
    fetch(`${config.apiBaseUrl}/experience`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
        userId: sessionStorage.getItem('userId') || '',
      },
      body: JSON.stringify({ inputs }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === 401) {
          M.toast({ html: 'Unauthorized ', classes: 'red toast' });
        } else {
          M.toast({ html: 'Experience added', classes: 'green toast' });
        }
      })
      .catch((error) => {
        console.log(error);
        M.toast({ html: 'Failed to add experience', classes: 'red toast' });
      });
  };

  return (
    <Fragment>
      <div className='experienceForm'>
        <div className='btnContainer'>
          <button
            className='signupSubmit experienceBtn '
            onClick={toggleInputField}
          >
            Add Field
          </button>
          <button
            className='signupSubmit experienceBtn '
            onClick={submitHandler}
          >
            Submit
          </button>
        </div>

        {inputs.map((input) => (
          <div key={input.id}>
            <input
              className='signupInput'
              type='text'
              value={input.value}
              onChange={(e) => handleInputChange(input.id, e.target.value)}
              placeholder={`Input ${input.id}`}
            />
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default ExperienceForm;
