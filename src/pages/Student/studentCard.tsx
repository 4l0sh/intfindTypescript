import { Fragment, useState, useEffect } from 'react';
import config from '../../config';
import './manageStudents.css';

type User = {
  avatar: string;
  _id: string;
  name: string;
  email: string;
};

const StudentCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState('') || '';
  const [newRole, setNewRole] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('jwt') || '',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message && data.message.includes('Unauthorized')) {
          location.href = '/';
        } else {
          setUsers(data);
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          setMessage('You are not authorized to view this page');
        }
        console.log(err);
      });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const deleteUser = (id: string) => {
    fetch(`${config.apiBaseUrl}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message.includes('Invalid token')) {
          M.toast({ html: 'Unauthorized invalid token ', classes: 'red' });
        } else if (data.message.includes('not an admin')) {
          M.toast({ html: 'Unauthorized not an admin ', classes: 'red' });
        }
        if (data.status === 200) {
          window.location.reload();
          M.toast({ html: 'User deleted', classes: 'green' });
        }
      })
      .catch((err) => {
        console.log(err);
        M.toast({ html: 'Error deleting user', classes: 'red' });
      });
  };

  const updateHandler = (id: string) => {
    if (!newRole) {
      setMessage('Please select a role before updating');
      return;
    }
    fetch(`${config.apiBaseUrl}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('jwt'),
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => {
        if (res.status === 200) {
          console.log('Role successfully updated');
          M.toast({ html: 'Role successfully updated', classes: 'green' });
        } else if (res.status === 401) {
          setMessage('Unauthorized to update user');
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage('error updating user');
      });
  };

  const zoomHandler = (userId: string) => {
    const avatar = document.querySelector(
      `.userAvatar-${userId}`
    ) as HTMLImageElement;
    avatar.classList.toggle('openUserAvatar');
  };

  return (
    <Fragment>
      <div className='searchContainer'>
        <input
          type='text'
          className='searchBard'
          placeholder='Search For Users'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className='usersList'>
          <div className='usersCard'>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user._id} className='user'>
                  <div className='userDetail'>
                    <img
                      onClick={() => zoomHandler(user._id)}
                      className={`userAvatar userAvatar-${user._id}`}
                      src={user.avatar}
                      alt=''
                    />
                    <p>
                      <strong> {user.name}</strong>
                    </p>
                  </div>

                  <p>
                    <strong>{user.email}</strong>
                  </p>
                  <div className='edit'>
                    <i
                      onClick={() => {
                        setIsEditing(!isEditing);
                        setSelectedUser(user._id);
                      }}
                      className='fa-solid fa-edit icon'
                    ></i>
                    <i
                      onClick={() => deleteUser(user._id)}
                      className='fa-solid fa-trash icon'
                    ></i>
                  </div>
                </div>
              ))
            ) : (
              <p className='noUsers'>No users found {message} </p>
            )}
          </div>{' '}
          {isEditing ? (
            <div className='editCard'>
              <h2 className='editTxt'>Edit User</h2>
              <p className='message'> {message}</p>
              <form className='editForm'>
                <select
                  className='menu'
                  id='newRole'
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value='' disabled>
                    Select Role
                  </option>
                  <option value='admin'>Admin</option>
                  <option value='student'>Student</option>
                </select>
                <div className='actions'>
                  <button
                    type='submit'
                    onClick={(e) => {
                      e.preventDefault();
                      updateHandler(selectedUser);
                    }}
                    className='editBtn'
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className='editBtn'
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
};

export default StudentCard;
