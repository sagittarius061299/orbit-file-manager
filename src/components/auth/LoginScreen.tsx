import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Fingerprint, ArrowLeft, CheckCircle, XCircle, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../ui/use-toast';
import { useTheme } from 'next-themes';

type AuthMethod = 'credentials' | 'google' | 'email-otp' | 'fingerprint';
type OtpStep = 'email' | 'verification';

const LoginScreen: React.FC = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [activeMethod, setActiveMethod] = useState<AuthMethod>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Credentials state
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
  // OTP state
  const [otpStep, setOtpStep] = useState<OtpStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Fingerprint state
  const [fingerprintStatus, setFingerprintStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  // OTP timer effect
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendTimer]);

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Login Successful",
      description: `Welcome back, ${credentials.username}!`,
    });
    
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Google Login Successful",
      description: "You've been authenticated with Google.",
    });
    
    setIsLoading(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setOtpStep('verification');
    setOtpResendTimer(60);
    setIsLoading(false);
    
    toast({
      title: "Verification Code Sent",
      description: `A 6-digit code has been sent to ${email}`,
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      handleOtpVerification(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpVerification = async (otpCode: string) => {
    setIsLoading(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otpCode === '123456') {
      toast({
        title: "Login Successful",
        description: "You've been authenticated via email verification.",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please check your code and try again.",
        variant: "destructive",
      });
      setOtp(['', '', '', '', '', '']);
    }
    
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpResendTimer(60);
    setIsLoading(false);
    
    toast({
      title: "Code Resent",
      description: "A new verification code has been sent.",
    });
  };

  const handleFingerprintAuth = async () => {
    setFingerprintStatus('scanning');
    
    // Simulate fingerprint scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Random success/failure for demo
    const success = Math.random() > 0.3;
    
    if (success) {
      setFingerprintStatus('success');
      setTimeout(() => {
        toast({
          title: "Biometric Login Successful",
          description: "You've been authenticated via fingerprint.",
        });
        setFingerprintStatus('idle');
      }, 1500);
    } else {
      setFingerprintStatus('failed');
      setTimeout(() => {
        setFingerprintStatus('idle');
        toast({
          title: "Biometric Authentication Failed",
          description: "Please try again or use another method.",
          variant: "destructive",
        });
      }, 1500);
    }
  };

  const resetOtpFlow = () => {
    setOtpStep('email');
    setOtp(['', '', '', '', '', '']);
    setEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="absolute top-4 right-4 h-10 w-10 p-0 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:scale-110 z-10"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/15 via-primary/20 to-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="glass-card p-8 rounded-2xl border border-border/40 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-display text-gradient-primary mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Choose your preferred login method
            </p>
          </div>

          <Tabs value={activeMethod} onValueChange={(value) => setActiveMethod(value as AuthMethod)} className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-6 bg-muted/30 p-1 rounded-xl">
              <TabsTrigger value="credentials" className="rounded-lg text-xs">Password</TabsTrigger>
              <TabsTrigger value="google" className="rounded-lg text-xs">Google</TabsTrigger>
              <TabsTrigger value="email-otp" className="rounded-lg text-xs">Email</TabsTrigger>
              <TabsTrigger value="fingerprint" className="rounded-lg text-xs">Bio</TabsTrigger>
            </TabsList>

            {/* Username + Password Login */}
            <TabsContent value="credentials" className="space-y-4">
              <form onSubmit={handleCredentialLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="bg-background/50 border-border/50 focus:border-primary/50 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <Button variant="link" className="text-xs text-primary p-0 h-auto">
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full gradient-primary text-white font-semibold py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Google Login */}
            <TabsContent value="google" className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <p className="text-muted-foreground mb-6">
                  Sign in with your Google account for quick access
                </p>
                <Button 
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full border-border/50 hover:bg-accent/50 py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                      Connecting...
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Email + OTP */}
            <TabsContent value="email-otp" className="space-y-4">
              {otpStep === 'email' ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="text-center mb-6">
                    <Mail className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <p className="text-muted-foreground text-sm">
                      Enter your email to receive a login link and verification code
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary/50"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-secondary text-white font-semibold py-2.5"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      'Send Verification Code'
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetOtpFlow}
                      className="p-1 h-auto"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                      <h3 className="font-semibold">Enter Verification Code</h3>
                      <p className="text-xs text-muted-foreground">Sent to {email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-lg font-semibold bg-background/50 border-border/50 focus:border-primary/50"
                        />
                      ))}
                    </div>

                    <div className="text-center">
                      {otpResendTimer > 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Resend code in {otpResendTimer}s
                        </p>
                      ) : (
                        <Button
                          variant="link"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="text-sm text-primary p-0 h-auto"
                        >
                          Resend verification code
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Fingerprint */}
            <TabsContent value="fingerprint" className="space-y-4">
              <div className="text-center py-8">
                <div className="relative">
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    fingerprintStatus === 'scanning' 
                      ? 'bg-primary/20 animate-pulse' 
                      : fingerprintStatus === 'success'
                      ? 'bg-green-500/20'
                      : fingerprintStatus === 'failed'
                      ? 'bg-red-500/20'
                      : 'bg-muted/30 hover:bg-primary/10'
                  }`}>
                    {fingerprintStatus === 'success' ? (
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    ) : fingerprintStatus === 'failed' ? (
                      <XCircle className="w-12 h-12 text-red-500" />
                    ) : (
                      <Fingerprint className={`w-12 h-12 transition-colors duration-300 ${
                        fingerprintStatus === 'scanning' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    )}
                  </div>
                  
                  {fingerprintStatus === 'scanning' && (
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-primary/30 animate-ping" />
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <h3 className="font-semibold">
                    {fingerprintStatus === 'scanning' 
                      ? 'Scanning...' 
                      : fingerprintStatus === 'success'
                      ? 'Authentication Successful'
                      : fingerprintStatus === 'failed'
                      ? 'Authentication Failed'
                      : 'Biometric Authentication'
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {fingerprintStatus === 'scanning' 
                      ? 'Keep your finger on the sensor' 
                      : fingerprintStatus === 'success'
                      ? 'Welcome back!'
                      : fingerprintStatus === 'failed'
                      ? 'Please try again'
                      : 'Touch the fingerprint sensor to authenticate'
                    }
                  </p>
                </div>

                {fingerprintStatus === 'idle' && (
                  <Button 
                    onClick={handleFingerprintAuth}
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary/10"
                  >
                    <Fingerprint className="w-4 h-4 mr-2" />
                    Authenticate with Fingerprint
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" className="text-xs text-primary p-0 h-auto">
                Sign up here
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;