import React, { useState } from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { logOut, signInWithEmailPassword, subscribeToUserUpdate } from './services/auth-service';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [rendering, setRendering] = useState(true);

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
             <button onClick={async () => {
              await logOut();
              //window.location.href = '/main';
            }}>log out</button>
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
              <>not auth</> :
              <> <button onClick={}>
                </button></>}
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
