import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';


const CreatePage = () => {
  const history = useHistory();
  const { token } = useContext(AuthContext);
  const { request } = useHttp();
  const [link, setLink] = useState('');
  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      try {
        const data = await request('/api/link/generate', 'POST', { from: link }, {
          Authorization: `Bearer ${token}`,
        });
        history.push(`/detail/${data.link._id}`);
      } catch (e) {}
    }
  };
  useEffect(() => {
    window.M.updateTextFields();
  }, [])


  return (
    <div className="row">
      <div className="row s8 offset-s2">
        <div className="input-field">
          <input
            placeholder="Enter link"
            id="link"
            type="text"
            name="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <label htmlFor="link">Enter link</label>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
