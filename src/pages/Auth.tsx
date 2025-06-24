import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus } from 'lucide-react';

// Schema for login
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Schema for signup, extending login and adding password confirmation
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path to show the error
});


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();

  // Define form based on whether it's login or signup
  const form = useForm<z.infer<typeof loginSchema> | z.infer<typeof signupSchema>>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(isLogin ? {} : { confirmPassword: "" }),
    },
  });

  // Reset form when switching between login/signup
  useEffect(() => {
    form.reset();
  }, [isLogin, form]);

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAuth = async (values: z.infer<typeof loginSchema> | z.infer<typeof signupSchema>) => {
    setLoading(true);
    try {
      if (isLogin) {
        // Login
        await signIn(values.email, values.password);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        // Sign up
        const signupValues = values as z.infer<typeof signupSchema>;
        const { user, session } = await signUp(signupValues.email, signupValues.password);
        
        if (!session) {
          toast({
            title: "Signup successful",
            description: "Please check your email for verification.",
          });
        } else {
          toast({
            title: "Signup successful",
            description: "You are now logged in!",
          });
        }
      }
    } catch (error: any) {
      // Error handling is now in the AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isLogin ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : 'bg-gradient-to-br from-green-50 via-white to-teal-50'}`}>
      <motion.div
        className={`w-full max-w-md bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${!isLogin ? 'border-2 border-green-400' : 'border border-gray-200'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!isLogin && (
          <div className="flex flex-col items-center pt-6 pb-2 bg-green-50 border-b border-green-200">
            <div className="p-3 bg-green-100 rounded-full">
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mt-3">Create Your Account</h2>
            <p className="text-green-700 text-sm mt-1">Join LearnFlow to unlock your learning journey!</p>
          </div>
        )}
        
        <div className="p-8">
          {isLogin && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold axion-text-gradient">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to continue to LearnFlow AI</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your.email@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isLogin && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className={`w-full py-3 font-semibold transition-colors duration-300 ${isLogin ? 'axion-button' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create My Account'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline transition-colors"
              type="button"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
