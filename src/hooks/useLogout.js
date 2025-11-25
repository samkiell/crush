import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // Dispatch logout action to clear Redux state and remove cookie
    dispatch(logout());
    
    // Redirect to login page
    router.push('/auth/login');
  };

  return { handleLogout };
};
