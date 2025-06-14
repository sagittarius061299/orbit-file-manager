import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { authApi } from '../../services/authApi';
import { loginUser } from '../../store/authSlice';
import Cookies from 'js-cookie';

interface SessionManagerProps {
  children: React.ReactNode;
}

const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeSession = async () => {
      const accessToken = Cookies.get('access_token');
      
      if (accessToken && !isAuthenticated && !user) {
        try {
          // Try to get user profile to verify token is still valid
          const userProfile = await authApi.getProfile(accessToken);
          
          // If successful, update Redux state
          dispatch({
            type: 'auth/loginUser/fulfilled',
            payload: {
              tokens: {
                access_token: accessToken,
                refresh_token: Cookies.get('refresh_token') || '',
              },
              user: userProfile,
            },
          });
        } catch (error) {
          // If token is invalid, clear cookies
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
        }
      }
    };

    initializeSession();
  }, [dispatch, isAuthenticated, user]);

  return <>{children}</>;
};

export default SessionManager;