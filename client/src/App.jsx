import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import CallPage from './pages/CallPage.jsx';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios.js';


const App = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],

    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    },
    retry: false,
  })

  // console.log({data});

  return (
    <div className='h-screen' data-theme='dark'>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/onboard' element={<OnboardingPage/>}/>
        <Route path='/notifications' element={<NotificationsPage/>}/>
        <Route path='/chat' element={<ChatPage/>}/>
        <Route path='/call' element={<CallPage/>}/>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App