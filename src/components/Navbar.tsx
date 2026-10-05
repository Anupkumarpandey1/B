import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, Sparkles, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleLogoutClick = async () => {
    await signOut();
    navigate('/');
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/', { state: { openQuizSection: true } });
    } else {
      navigate('/auth');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const userEmail = user?.email || '';
  const userName = user?.user_metadata?.full_name || userEmail.split('@')[0] || '';
  const userAvatar = user?.user_metadata?.avatar_url;
  const initials = userName ? userName.substring(0, 2).toUpperCase() : '';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'glass shadow-premium py-3' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="axion-container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate('/')}
              >
                <motion.div 
                  className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-glow"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-2xl font-bold gradient-text">LearnFlow</span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                link.name === 'Home' ? (
                  <motion.span
                    key={link.name}
                    className="nav-link text-sm font-medium cursor-pointer px-4 py-2 rounded-full hover:bg-violet-50"
                    onClick={() => navigate('/')}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    {link.name}
                  </motion.span>
                ) : (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="nav-link text-sm font-medium px-4 py-2 rounded-full hover:bg-violet-50"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    {link.name}
                  </motion.a>
                )
              ))}
              
              {user && (
                <motion.a
                  href="https://anupkumarpandey1.github.io/Extens/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-sm font-medium px-4 py-2 rounded-full hover:bg-violet-50 flex items-center gap-1"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <Zap className="w-4 h-4" />
                  Extensions
                </motion.a>
              )}
            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button 
                      onClick={handleLoginClick}
                      variant="ghost" 
                      className="rounded-full font-medium hover:bg-violet-50 hover:text-violet-600"
                    >
                      Login
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handleGetStarted}
                      className="premium-button text-sm"
                    >
                      Get Started
                      <Sparkles className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-violet-400 transition-all">
                          <Avatar className="h-10 w-10 ring-2 ring-violet-200">
                            <AvatarImage src={userAvatar} alt={userName} />
                            <AvatarFallback className="bg-gradient-to-br from-violet-600 to-pink-500 text-white font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-56 glass-premium rounded-2xl p-2" 
                        align="end" 
                        forceMount
                        sideOffset={8}
                      >
                        <DropdownMenuLabel className="font-normal p-3">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-semibold">{userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {userEmail}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-100" />
                        <DropdownMenuItem 
                          onClick={handleProfileClick}
                          className="rounded-xl p-3 cursor-pointer hover:bg-violet-50 focus:bg-violet-50"
                        >
                          <User className="mr-3 h-4 w-4 text-violet-600" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleLogoutClick}
                          className="rounded-xl p-3 cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handleGetStarted}
                      className="premium-button text-sm"
                    >
                      Create Quiz
                      <Sparkles className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden relative w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={20} className="text-gray-700" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 md:hidden shadow-premium-lg"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">LearnFlow</span>
                  </div>
                  <motion.button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} className="text-gray-600" />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2 flex-grow">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="text-lg font-medium text-gray-700 hover:text-violet-600 py-3 px-4 rounded-xl hover:bg-violet-50 transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                  
                  {user && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/', { state: { openQuizSection: true } });
                          }}
                          className="text-lg font-medium text-gray-700 hover:text-violet-600 py-3 px-4 rounded-xl hover:bg-violet-50 transition-colors block text-left w-full"
                        >
                          Assessment Generator
                        </button>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <Link
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-lg font-medium text-gray-700 hover:text-violet-600 py-3 px-4 rounded-xl hover:bg-violet-50 transition-colors block"
                        >
                          My Profile
                        </Link>
                      </motion.div>
                    </>
                  )}
                </nav>

                {/* Bottom Actions */}
                <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
                  {!user ? (
                    <>
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/auth');
                        }}
                        variant="outline"
                        className="w-full rounded-xl py-6 font-medium"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/auth');
                        }}
                        className="w-full premium-button py-6"
                      >
                        Get Started
                        <Sparkles className="ml-2 w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/', { state: { openQuizSection: true } });
                        }}
                        className="w-full premium-button py-6"
                      >
                        Create Quiz
                        <Sparkles className="ml-2 w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          signOut();
                        }}
                        variant="outline"
                        className="w-full rounded-xl py-6 font-medium"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
