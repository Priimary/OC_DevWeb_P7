import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {store} from './app/store';
import {Provider} from 'react-redux';
import GlobalStyle from './utils/style/GlobalStyle';
import Error from './components/Error';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FullPost from './pages/FullPost'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <GlobalStyle/>
      <Header/>
        <Routes>
            <Route exact path="/" element={<Home />}/>
            <Route exact path="/post/:id" element={<FullPost />}/>
            <Route path="/connexion" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="*" element={<Error />}/>
        </Routes>
    </Provider>
  </BrowserRouter>
)
