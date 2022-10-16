import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Error from './components/Error';
import Posts from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import {store} from './app/store';
import {Provider} from 'react-redux';
import GlobalStyle from './utils/style/GlobalStyle';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <GlobalStyle/>
      <Header/>
        <Routes>
            <Route exact path="/" element={<Posts />}/>
            <Route path="/connexion" element={<Login />}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="*" element={<Error/>}/>
        </Routes>
    </Provider>
  </BrowserRouter>
)
