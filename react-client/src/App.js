import React, { useState } from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getIdToken, logOut, signInWithEmailPassword, subscribeToUserUpdate } from './services/auth-service';
import axios from 'axios';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [rendering, setRendering] = useState(true);

  async function callService() {
    const token = await getIdToken();

    try {
      const response = await axios.get('http://localhost:5000/test', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error making API call:', error);
    }
  }

  useEffect(() => {
    subscribeToUserUpdate(async (user) => {
      console.log('user changed')
      console.log(user);
      try {
        if (!user) {
          setAuthenticated(false);
          return;
        }

        setAuthenticated(true);
      } finally {
        setRendering(false);
      }
    });
  }, [authenticated]);

  if (rendering) {
    return (<>Loading...</>)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            {authenticated ? (
              <button onClick={logOut}>log out</button>
            ) : (
              <button onClick={async () => {
                await signInWithEmailPassword();
                window.location.href = '/main';
              }}>log in</button>
            )}
          </>
        } />

        <Route path="/main" element={
          <>
            {!authenticated ?
              <>
              not authed
              <button onClick={() => window.location.href = '/'}>go to '/'</button>
              </> :
              <>
                <button onClick={callService}>call service</button>
                <button onClick={logOut}>log out</button>
              </>}
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
