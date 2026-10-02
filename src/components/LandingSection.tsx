import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Brain, CheckCircle2, Sparkles, Lightbulb, Zap, ArrowRight, Star, Flag, Play, ChevronRight, Rocket, Target, Award } from 'lucide-react';
import FeatureCard from './FeatureCard';
import StepCard from './StepCard';
import ThreeDModel from './ThreeDModel';
import { Button } from './ui/button';

interface LandingSectionProps {
  onGetStarted: () => void;
}

const LandingSection = ({ onGetStarted }: LandingSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const testimonials = [
    {
      text: "LearnFlow AI completely transformed how I study. The quizzes are incredibly tailored to my learning style!",
      author: "Sarah Johnson",
      role: "Medical Student",
      avatar: "SJ"
    },
    {
      text: "I've tried many learning platforms, but nothing compares to the personalized experience that LearnFlow AI provides.",
      author: "Michael Chen",
      role: "Software Engineer",
      avatar: "MC"
    },
    {
      text: "The AI-powered chat feature feels like having a personal tutor available 24/7. Simply incredible.",
      author: "Emma Rodriguez",
      role: "PhD Candidate",
      avatar: "ER"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for casual learners",
      features: [
        "5 AI-generated quizzes per month",
        "Basic chat assistance",
        "Standard quiz customization",
        "Email support"
      ],
      buttonText: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Ideal for serious students",
      features: [
        "Unlimited AI-generated quizzes",
        "Advanced AI tutor assistance",
        "Full quiz customization options",
        "Priority email & chat support",
        "Progress tracking & analytics"
      ],
      buttonText: "Get Started",
      popular: true
    },
    {
      name: "Team",
      price: "$49",
      period: "/month",
      description: "Perfect for study groups",
      features: [
        "Everything in Pro plan",
        "Up to 5 team members",
        "Collaborative learning tools",
        "Team analytics dashboard",
        "Dedicated account manager"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  return (
    <div ref={containerRef}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-400/40 to-pink-400/40 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/40 to-cyan-400/40 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/40 to-indigo-400/40 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid opacity-50" />
          
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <motion.div 
          style={{ y, opacity }}
          className="axion-container relative z-10"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-violet-600" />
                </motion.div>
                <span className="text-sm font-semibold gradient-text">AI-Powered Learning Revolution</span>
              </motion.div>

              {/* Heading */}
              <motion.h1 
                variants={fadeInUp}
                className="responsive-heading mb-6"
              >
                Master Any Topic with{' '}
                <span className="relative inline-block">
                  <span className="gradient-text">AI-Powered</span>
                  <motion.span
                    className="absolute -inset-2 bg-gradient-to-r from-violet-200 to-pink-200 rounded-lg -z-10 blur-xl opacity-50"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </span>{' '}
                Assessments
              </motion.h1>

              {/* Subheading */}
              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0"
              >
                Transform videos, documents, or any topic into interactive quizzes. Boost your learning with our AI-powered quiz generator and chat with our Master Teacher for personalized help.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  onClick={onGetStarted}
                  className="premium-button text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.span>
                </motion.button>

                <motion.a
                  href="https://a-rust-tau.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Barrack
                  <Flag className="ml-2 h-5 w-5" />
                </motion.a>
              </motion.div>

              {/* Social Proof */}
              <motion.div 
                variants={fadeInUp}
                className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      {i}
                    </motion.div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-sm font-semibold ml-1">4.9/5</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">2,500+</span> students learning today
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - 3D Model */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-3xl blur-3xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* 3D Model Container */}
                <div className="relative glass-premium rounded-3xl p-8 shadow-premium-lg">
                  <ThreeDModel />
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow"
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Rocket className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-glow"
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  <Target className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-violet-400 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-3 bg-violet-400 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white" />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="axion-container relative z-10"
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Zap className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold gradient-text">Powerful Features</span>
            </div>
            
            <h2 className="responsive-subheading mb-6">
              Unlock Your <span className="gradient-text">Learning Potential</span>
            </h2>
            
            <p className="text-lg text-gray-600">
              Our platform combines AI technology with proven learning methods to help you master any subject more effectively than traditional studying.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="AI-Generated Questions"
              description="Our advanced AI creates tailored questions based on your chosen topic or content"
              delay={0}
            />
            <FeatureCard
              icon={<Lightbulb className="w-8 h-8" />}
              title="Master Teacher AI"
              description="Chat with our AI teacher to get personalized explanations and insights on any topic"
              delay={1}
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-8 h-8" />}
              title="Detailed Explanations"
              description="Get comprehensive explanations for correct answers to enhance learning"
              delay={2}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="PDF & Image Analysis"
              description="Upload documents and images to generate quizzes from your study materials"
              delay={3}
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Adaptive Learning"
              description="Our quizzes adapt to your knowledge level, focusing on areas where you need improvement"
              delay={4}
            />
            <FeatureCard
              icon={<Award className="w-8 h-8" />}
              title="Progress Tracking"
              description="Monitor your performance over time with detailed analytics and improvement suggestions"
              delay={5}
            />
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-pink-50" />
        
        <div className="axion-container relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold gradient-text">Simple Process</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="responsive-subheading mb-6">
              How It <span className="gradient-text">Works</span>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-lg text-gray-600">
              Getting started with LearnFlow AI is quick and easy. Follow these simple steps to begin your enhanced learning journey.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-violet-200 via-pink-200 to-violet-200" />
            
            <StepCard number={1} title="Choose Your Input" description="Enter a topic, paste a YouTube URL, or upload a document" />
            <StepCard number={2} title="Customize" description="Set the number of questions and options to match your learning goals" />
            <StepCard number={3} title="Generate & Learn" description="Get your personalized quiz instantly and start learning" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        
        <div className="axion-container relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Star className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold gradient-text">Testimonials</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="responsive-subheading mb-6">
              What Our <span className="gradient-text">Users Say</span>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-lg text-gray-600">
              Discover how LearnFlow AI has transformed the learning experience for students worldwide.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group"
              >
                <div className="glass-premium rounded-3xl p-8 h-full hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">"{testimonial.text}"</p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-pink-50" />
        
        <div className="axion-container relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Zap className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold gradient-text">Pricing Plans</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="responsive-subheading mb-6">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-lg text-gray-600">
              Choose the plan that's right for you and start transforming your learning experience today.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`relative ${plan.popular ? 'md:-translate-y-4' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-glow">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`glass-premium rounded-3xl p-8 h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-premium-lg ${
                  plan.popular ? 'border-2 border-violet-400' : ''
                }`}>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button
                    onClick={onGetStarted}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular 
                        ? 'premium-button' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.buttonText}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="axion-container relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Transform Your Learning?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-white/80 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join thousands of students who are accelerating their learning with our AI-powered quiz platform.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={onGetStarted}
                className="px-10 py-5 bg-white text-violet-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
                <ArrowRight className="ml-2 inline w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingSection;
