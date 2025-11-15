
  import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPenNib, FaUsers, FaPalette, FaArrowRight } from 'react-icons/fa';


// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};
export default function Home() {

  return (
    <div className="min-h-screen bg-gray-900 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)] animate-[pulse_6s_ease-in-out_infinite">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    

    </div>
  );
};

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden">
    {/* Abs background shapes */}
    <div className="absolute top-0 left-0 w-72 h-72 bg-gray-700/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
    <div className="absolute top-0 right-0 w-72 h-72 bg-gray-700/30 rounded-full filter blur-3xl opacity-50 animate-blob [animation-delay:-2s]"></div>
    <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gray-700/10 rounded-full filter blur-3xl opacity-50 animate-blob [animation-delay:-4s]"></div>

    <motion.div
    
      className="z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      
    >
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-white tracking-tight"
        variants={itemVariants}
      >
        Unleash Your Voice.
        <br />
        <span className="text-gray-400">Connect with the World.</span>
      </motion.h1>
      <motion.p
        className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-400"
        variants={itemVariants}
      >
        Welcome to SpaceThreads, a seamless and modern platform for writers, thinkers, and storytellers. Start your blog, grow your audience, and join a vibrant community.
      </motion.p>
      <motion.div
        className="mt-10 flex justify-center gap-4"
        variants={itemVariants}
      >
        <Link
          to="/register"
          className="bg-white text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-200 transition-all transform hover:scale-105"
        >
          Get Started
        </Link>
        <Link
          to="/explore"
          className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-700 transition-all transform hover:scale-105 border border-gray-700"
        >
          Explore Blogs
        </Link>
      </motion.div>
    </motion.div>
  </section>
);

const FeatureCard = ({ icon, title, children }) => (
  <motion.div
    className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700"
    variants={itemVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
  >
    <div className="text-4xl text-white mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{children}</p>
  </motion.div>
);

const FeaturesSection = () => (
  <section className="py-20 px-4">
    <div className="container mx-auto">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-white">Everything You Need to Shine</h2>
        <p className="text-gray-400 mt-2">Powerful features to make your content stand out.</p>
      </motion.div>
      <motion.div
        className="grid md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <FeatureCard icon={<FaPenNib />} title="Effortless Publishing">
          Our intuitive editor makes it easy to write, format, and publish your posts. Focus on your words, we'll handle the rest.
        </FeatureCard>
        <FeatureCard icon={<FaUsers />} title="Engage Your Audience">
          Connect with your readers through comments, likes, and shares. Build a community around your passion.
        </FeatureCard>
        <FeatureCard icon={<FaPalette />} title="Customize Your Space">
          Personalize your blog's appearance to match your style. Choose from a variety of themes and layouts.
        </FeatureCard>
      </motion.div>
    </div>
  </section>
);

const HowItWorksSection = () => (
    <section className="py-20 px-4 bg-gray-900">
      <div className="container mx-auto text-center">
        <motion.h2 
          className="text-4xl font-bold text-white mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Start Blogging in 3 Simple Steps
        </motion.h2>
        <div className="relative">
          {/* Dotted line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gray-700 border-t border-dashed border-gray-700 -translate-y-1/2"></div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-12 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Step number="1" title="Create Account">
              Sign up for free in minutes and set up your personal blog profile.
            </Step>
            <Step number="2" title="Write Your Post">
              Use our clean, distraction-free editor to bring your ideas to life.
            </Step>
            <Step number="3" title="Publish & Share">
              Hit publish and share your story with a global audience.
            </Step>
          </motion.div>
        </div>
      </div>
    </section>
  );
  
  const Step = ({ number, title, children }) => (
    <motion.div 
      className="flex flex-col items-center"
      variants={itemVariants}
    >
      <div className="bg-gray-800 border-2 border-gray-700 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 z-10">
        {number}
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-xs">{children}</p>
    </motion.div>
  );

const CtaSection = () => (
  <section className="py-20 px-4">
    <div className="container mx-auto text-center bg-gray-800/50 border border-gray-700 rounded-2xl p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-white">Ready to Share Your Story?</h2>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto">Join thousands of creators on SpaceThreads and start your blogging journey today. It's free to get started.</p>
        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 bg-white text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-200 transition-all transform hover:scale-105"
        >
          Sign Up Now <FaArrowRight />
        </Link>
        
      </motion.div>
      
    </div>
  </section>
  

 
);


