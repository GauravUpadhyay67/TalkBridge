import { Bell, LogOut, ShipWheel } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import useLogout from '../hooks/useLogout';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith('/chat');

  const { logoutMutation } = useLogout();

  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-end w-full'>
          {/* Logo only in chat page */}
          {isChatPage && (
            <div className='pl-5'>
              <Link to='/' className='flex items-center gap-2.5'>
                <ShipWheel className='size-9 text-primary'/>
                <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                    TalkBridge
                </span>
              </Link>
            </div>
          )}

          <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
            <Link to='/notifications'>
              <button className='btn btn-ghost btn-circle'>
                <Bell className='h-6 w-6 text-base-content opacity-70'/>
              </button>
            </Link>
          </div>

          <ThemeSelector/>

          <Link to='/profile' className='avatar hover:opacity-80 transition-opacity'>
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic || "/avatar.png"} alt="User Avatar" />
            </div>
          </Link>

          <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
            <LogOut className='h-6 w-6 text-base-content opacity-70'/>
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar