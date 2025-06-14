import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, Fingerprint, Smartphone } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { useToast } from '../../hooks/use-toast';
import { loginUser, clearError } from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

// Validation schemas
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

const otpEmailSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

interface LoginFormData {
  email: string;
  password: string;
}

interface OTPEmailData {
  email: string;
}

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpStep, setOtpStep] = useState<'email' | 'otp'>('email');
  const [otpValue, setOtpValue] = useState('');
  const [otpEmail, setOtpEmail] = useState('');

  // Password login form
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  // OTP email form
  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: otpErrors },
    reset: resetOTP,
  } = useForm<OTPEmailData>({
    resolver: yupResolver(otpEmailSchema),
    mode: 'onBlur',
  });

  const onPasswordSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(loginUser({ 
        email: data.email, 
        password: data.password 
      }));
      
      if (loginUser.fulfilled.match(result)) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.payload.user.name}!`,
        });
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is handled by the slice
    }
  };

  const onOTPEmailSubmit = (data: OTPEmailData) => {
    setOtpEmail(data.email);
    setOtpStep('otp');
    toast({
      title: "OTP Sent",
      description: `A 6-digit code has been sent to ${data.email}`,
    });
  };

  const handleOTPComplete = (value: string) => {
    setOtpValue(value);
    if (value.length === 6) {
      // Simulate OTP verification
      if (value === '123456') {
        toast({
          title: "Login Successful",
          description: "Welcome! You've been authenticated via OTP.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please enter the correct 6-digit code. Try 123456 for demo.",
          variant: "destructive",
        });
        setOtpValue('');
      }
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Login",
      description: "Google authentication would be implemented here.",
    });
  };

  const handleFingerprintLogin = () => {
    // Simulate fingerprint authentication with random success/failure
    const isSuccess = Math.random() > 0.3;
    
    setTimeout(() => {
      if (isSuccess) {
        toast({
          title: "Fingerprint Authentication Successful",
          description: "Welcome! You've been authenticated via fingerprint.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Fingerprint Authentication Failed",
          description: "Please try again or use a different login method.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const resetOTPFlow = () => {
    setOtpStep('email');
    setOtpValue('');
    setOtpEmail('');
    resetOTP();
  };

  // Clear error when typing
  React.useEffect(() => {
    if (error) {
      dispatch(clearError());
      clearErrors();
    }
  }, [error, dispatch, clearErrors]);

  const handleOTPLogin = () => {
    setShowOTPModal(true);
    setOtpStep('email');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/40 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Email/Password Login Form */}
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <Button variant="link" className="text-xs text-primary p-0 h-auto hover:underline">
              Forgot password?
            </Button>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Separator */}
        <div className="relative my-6">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card px-3 text-xs text-muted-foreground">
              Or login with
            </span>
          </div>
        </div>

        {/* Alternative Login Options */}
        <div className="space-y-3">
          {/* Google Login Button */}
          <Button 
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full py-2.5 transition-colors hover:bg-accent"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          {/* OTP Login Button */}
          <Button 
            onClick={handleOTPLogin}
            variant="outline"
            className="w-full py-2.5 transition-colors hover:bg-accent"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Login with OTP
          </Button>

          {/* Fingerprint Login Button */}
          <Button 
            onClick={handleFingerprintLogin}
            variant="outline"
            className="w-full py-2.5 transition-colors hover:bg-accent"
          >
            <Fingerprint className="w-4 h-4 mr-2" />
            Fingerprint Login
          </Button>
        </div>

        {/* OTP Modal/Section */}
        {showOTPModal && (
          <div className="mt-6 p-4 border border-border/50 rounded-lg bg-background/30">
            {otpStep === 'email' ? (
              <div className="space-y-4">
                <div className="text-center">
                  <Smartphone className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Login with OTP</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your email to receive a 6-digit code
                  </p>
                </div>
                
                <form onSubmit={handleSubmitOTP(onOTPEmailSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="otp-email"
                        type="email"
                        placeholder="Enter your email"
                        {...registerOTP('email')}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                      />
                    </div>
                    {otpErrors.email && (
                      <p className="text-sm text-destructive mt-1">{otpErrors.email.message}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      onClick={() => setShowOTPModal(false)}
                      variant="outline" 
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                    >
                      Send OTP
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <Smartphone className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Enter OTP</h3>
                  <p className="text-sm text-muted-foreground">
                    We sent a 6-digit code to {otpEmail}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Demo: Use 123456 to login
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-center block">
                    6-Digit Code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={handleOTPComplete}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={resetOTPFlow}
                    variant="outline" 
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => onOTPEmailSubmit({ email: otpEmail })}
                    variant="outline" 
                    className="flex-1"
                  >
                    Resend OTP
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" className="text-xs text-primary p-0 h-auto hover:underline">
              Sign up here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;