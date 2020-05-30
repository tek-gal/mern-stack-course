import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((jwtToken, userId) => {
    setToken(jwtToken);
    setUserId(userId);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId,
        token: jwtToken,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userId);
    }
    setReady(true);
    // т.к. логин в зависимости его нужно было завернуть в useCallback
  }, [login]);  // в зависимости логин - потому ччто он внетри используется

  return { login, logout, token, userId, ready };
};
