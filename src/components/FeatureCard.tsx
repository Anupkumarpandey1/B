import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  requiresAuth?: boolean;
  delay?: number;
}

const FeatureCard = ({
  icon,
  title,
  description,
  className,
  requiresAuth = false,
  delay = 0
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      className={cn("group relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <motion.div
        className="relative h-full glass-premium rounded-3xl p-8 overflow-hidden"
        whileHover={{ y: -8, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Animated Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))",
            padding: "2px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Background Gradient on Hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)",
          }}
        />

        {/* Auth Badge */}
        {requiresAuth && (
          <motion.div 
            className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold z-10 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Login Required
          </motion.div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Icon Container */}
          <motion.div 
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 flex items-center justify-center mb-6 group-hover:from-violet-500/20 group-hover:to-pink-500/20 transition-colors duration-500"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))",
                filter: "blur(8px)",
              }}
            />

            {/* Icon */}
            <motion.div 
              className="relative text-violet-600 group-hover:text-violet-700 transition-colors duration-300"
              animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>

            {/* Pulsing Ring */}
            {isHovered && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-violet-400"
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 1.3 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:gradient-text transition-all duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-4">
            {description}
          </p>

          {/* Learn More Link */}
          <motion.div
            className="flex items-center gap-2 text-violet-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
          >
            <span>Learn more</span>
            <motion.span
              animate={isHovered ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.div>
        </div>

        {/* Corner Decoration */}
        <motion.div
          className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ filter: "blur(20px)" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default FeatureCard;
