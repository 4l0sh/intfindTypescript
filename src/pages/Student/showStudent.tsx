import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './manageStudents.css';

interface Experience {
  id: string;
  value: string;
}
interface skill {
  name: string;
  value: string;
}
const ShowStudents: React.FC = () => {
  const [avatar, setAvatar] = useState(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL2FQ72FWEtzxniuTGYHMNDjFiJ0p2ULQELg&s'
  );
  const [name, setName] = useState<string>('Name');
  const [email, setEmail] = useState<string>('email');
  const [course, setCourse] = useState<string>('course');
  const [startDate, setStartDate] = useState<string>('yyyy-mm-dd');
  const [finishDate, setFinishDate] = useState<string>('yyyy-mm-dd');
  const [skills, setSkills] = useState<skill[]>([
    { name: 'skill 1', value: 'value' },
    { name: 'skill 2', value: 'value' },
    { name: 'skill 3', value: 'value' },
    { name: 'skill 4', value: 'value' },
  ]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [referenceName, setReferenceName] = useState<string>('name');
  const [referenceProfession, setReferenceProfession] =
    useState<string>('profession');
  const [referenceText, setReferenceText] = useState<string>('reference');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const logOut = () => {
    sessionStorage.clear();
    navigate('/loginMail');
  };

  const userId = sessionStorage.getItem('userId') || '';

  const getStudentInfo = () => {
    fetch(`http://localhost:4000/studentInfo/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAvatar(
          data.user.avatar ||
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL2FQ72FWEtzxniuTGYHMNDjFiJ0p2ULQELg&s'
        );
        setName(data.user.name || 'Name');
        setEmail(data.user.email || 'Email');
        setCourse(data.Course.study.course || 'Course');
        setStartDate(data.Course.study.startDate || 'yyyy-mm-dd');
        setFinishDate(data.Course.study.finishDate || 'yyyy-mm-dd');
        setSkills([
          {
            name: data.skills.skills[0].skill,
            value: data.skills.skills[0].value,
          },
          {
            name: data.skills.skills[1].skill,
            value: data.skills.skills[1].value,
          },
          {
            name: data.skills.skills[2].skill,
            value: data.skills.skills[2].value,
          },
          {
            name: data.skills.skills[3].skill,
            value: data.skills.skills[3].value,
          },
        ]);
        setExperience(
          Array.isArray(data.experience.experience)
            ? data.experience.experience
            : Object.values(data.experience.experience || [])
        );
        setReferenceName(data.reference.reference.name || 'Name');
        setReferenceProfession(
          data.reference.reference.profession || 'Profession'
        );
        setReferenceText(data.reference.reference.referenceText || 'Reference');
      })
      .catch((err) => {
        if (err.message === 'Incomplete data') {
          setMessage('Incomplete information');
        }
        setMessage('Error getting student info');
        console.error(err);
      });
  };

  return (
    <Fragment>
      <div className='MainContainer'>
        <div className='HeaderContainer'>
          <div className='headerButton'>
            <button onClick={logOut} className='logOutBtn'>
              <p className='btnTxt'>Log Out</p>{' '}
              <i className='fa-solid fa-right-from-bracket logout'></i>
            </button>
          </div>
          <h1 className='headerTitle'>View Info</h1>
          <div className='headerDiv3 GetInfo'>
            <button className='logOutBtn' onClick={getStudentInfo}>
              <p className='btnTxt'>Get Info</p>{' '}
              <i className='fa-solid fa-download logout'></i>
            </button>
          </div>
        </div>
        <div className='CardsContainer'>
          <div className='Card Card1'>
            <div className='personalInfo'>
              <h2>Student Info</h2>
              <img className='avatarImg' src={avatar} />
              <p className='infotxt'>
                <strong>Name:</strong> <span className='infoTxt'>{name}</span>
              </p>
              <p className='infotxt'>
                <strong>Email:</strong> <span className='infoTxt'>{email}</span>
              </p>
              <p className='infotxt'>
                <strong>Course:</strong>{' '}
                <span className='infoTxt'>{course}</span>
              </p>
              <p className='infotxt'>
                <strong>Start Date:</strong>{' '}
                <span className='infoTxt'>{startDate}</span>
              </p>
              <p className='infotxt'>
                <strong>Finish Date:</strong>{' '}
                <span className='infoTxt'>{finishDate}</span>
              </p>
            </div>
          </div>

          <div className='Card Card2'>
            <p className='errmsg'>{message}</p>
            <div className='skillsInfo'>
              <h2>Skills</h2>
              {skills.map((skill, index) => (
                <div key={index} className='skillBox'>
                  <p className='skillTxt'>{skill.name}: </p>
                  <p className='skillTxt'>{skill.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='Card Card3'>
            <div className='experienceCard'>
              <h2>Experience</h2>
              <div className='experienceInfo'>
                {experience.length > 0 ? (
                  experience.map((exp, index) => (
                    <div key={exp.id || index} className='work'>
                      {exp.value}
                    </div>
                  ))
                ) : (
                  <p>No work experience available</p>
                )}
              </div>
            </div>
            <hr />
            <div className='referenceCard'>
              <h2>Reference</h2>
              <div className='referencebox'>
                <p className='referenceName'>Name: </p>
                <p className='referencevalue'>{referenceName}</p>
              </div>
              <div className='referencebox'>
                <p className='referenceName'>Profession: </p>
                <p className='referencevalue'>{referenceProfession}</p>
              </div>
              <div className='referencebox referencebox3'>
                <p className='referenceName'>Reference: </p>
                <p className='referencevalue'>{referenceText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ShowStudents;
