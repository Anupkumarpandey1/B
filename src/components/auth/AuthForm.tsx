import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';

// Schema for login
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

// Schema for signup
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});


const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();

  const currentSchema = isLogin ? loginSchema : signupSchema;
  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(isLogin ? {} : { confirmPassword: "" }),
    },
  });

  useEffect(() => {
    form.reset();
  }, [isLogin, form]);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleAuth = async (values: z.infer<typeof currentSchema>) => {
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(values.email, values.password);
      } else {
        const signupValues = values as z.infer<typeof signupSchema>;
        await signUp(signupValues.email, signupValues.password);
      }
    } catch (error) {
       // Errors are handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const WelcomeIllustration = () => (
    <div className="hidden lg:flex lg:flex-col items-center justify-center p-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-l-2xl text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
          <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
          <circle cx="15" cy="9" r="1" />
        </svg>
      </motion.div>
      <h2 className="mt-8 text-3xl font-bold text-center">Unlock Your Potential</h2>
      <p className="mt-4 text-center text-green-100">Join our community and start your journey towards mastering new skills with AI.</p>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="relative w-full max-w-4xl h-[650px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <div className={`flex h-full rounded-2xl shadow-2xl overflow-hidden bg-white ${isLogin ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isLogin && <WelcomeIllustration />}
              <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                <div className="w-full">
                  <div className="text-left mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
                    <p className="text-gray-500 mt-2">{isLogin ? 'Sign in to access your dashboard.' : 'It\'s quick and easy to get started.'}</p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-4">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      {!isLogin && (
                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      )}
                      <Button type="submit" className={`w-full py-3 mt-4 font-semibold text-white transition-transform duration-200 ${isLogin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} active:scale-[0.98]`} disabled={loading}>
                        {loading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6 text-sm text-center">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-gray-500 hover:text-gray-800 font-medium transition-colors" type="button">
                      {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthForm; 