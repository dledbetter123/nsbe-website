import React, { useEffect, useState } from 'react';

const UsersPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('https://your-aws-api-endpoint/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      {users.map(user => (
        <div key={user.id} className="user-panel">
          <h2>{user.name}</h2>
          {/* Render other user fields here */}
        </div>
      ))}
    </div>
  );
};

export default UsersPanel;
