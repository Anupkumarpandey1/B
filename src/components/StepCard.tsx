import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  className?: string;
}

const StepCard = ({ number, title, description, className }: StepCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: number * 0.15 }}
      className={cn("relative group", className)}
    >
      <motion.div
        className="relative flex flex-col items-center text-center p-8"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Number Badge */}
        <motion.div 
          className="relative mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
          />
          
          {/* Number Circle */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-glow">
            <motion.span
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: number * 0.15 + 0.3, type: "spring" }}
            >
              {number}
            </motion.span>
          </div>

          {/* Animated Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-violet-400"
            initial={{ opacity: 0, scale: 1 }}
            whileInView={{ opacity: [0, 0.5, 0], scale: [1, 1.2, 1.3] }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: number * 0.15, repeat: Infinity }}
          />
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:gradient-text transition-all duration-300">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed max-w-xs">
          {description}
        </p>

        {/* Arrow to Next (for non-last cards) */}
        {number < 3 && (
          <motion.div
            className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: number * 0.15 + 0.5 }}
          >
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6 text-violet-400" />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StepCard;
