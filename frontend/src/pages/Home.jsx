import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('teachers');

  useEffect(() => {
    setIsVisible(true);
    
    // Add scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Mathematics Professor",
      image: "/api/placeholder/64/64",
      content: "AGS has revolutionized how I grade mathematical assessments. The accuracy is remarkable."
    },
    {
      name: "Prof. Michael Chen",
      role: "Computer Science Head",
      image: "/api/placeholder/64/64",
      content: "The automated code grading feature saves hours of manual review time."
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Biology Department",
      image: "/api/placeholder/64/64",
      content: "The analytics provided help identify areas where students need additional support."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar - Enhanced with smooth hover effects */}
      <nav className="fixed top-0 w-full bg-gray-800/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-heading font-bold">
              <motion.span 
                className="bg-clip-text  bg-gradient-to-r from-primary to-secondary"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Auto Learn
              </motion.span>
            </Link>
            <div className="space-x-8">
              <Link to="/about" className="hover:text-primary transition-all duration-300 hover:-translate-y-1 inline-block">
                About
              </Link>
              <Link to="/features" className="hover:text-primary transition-all duration-300 hover:-translate-y-1 inline-block">
                Features
              </Link>
              <Link to="/contact" className="hover:text-primary transition-all duration-300 hover:-translate-y-1 inline-block">
                Contact
              </Link>
              <Link to="/login" className="btn btn-primary hover:scale-105 transition-transform">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      
      <section className=" w-full relative h-screen flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-60 scale-105"
          style={{ filter: 'brightness(0.9)' }}
        >
          <source src="/demo.mp4" type="video/mp4" />
        </video>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-7xl font-heading font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Assessment Grading System
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your grading process with our intelligent automated system. 
            Save time, ensure consistency, and focus on what matters most - teaching.
          </p>
          <div className="space-x-4">
            <motion.div className="inline-block" whileHover={{ scale: 1.05 }}>
              <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
            </motion.div>
            <motion.div className="inline-block" whileHover={{ scale: 1.05 }}>
              <Link to="/demo" className="btn bg-gray-800 text-white hover:bg-gray-700 text-lg px-8 py-3">
                Watch Demo
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section - New */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Upload', desc: 'Submit your assessments digitally' },
              { step: '2', title: 'Process', desc: 'AI analyzes and grades submissions' },
              { step: '3', title: 'Review', desc: 'Verify and adjust results if needed' },
              { step: '4', title: 'Report', desc: 'Generate detailed feedback reports' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative scroll-animate"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary font-bold">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{item.title}</h3>
                <p className="text-gray-400 text-center">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced with animations */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Automated Grading',
                description: 'AI-powered assessment evaluation for quick and accurate results',
                icon: '🤖'
              },
              {
                title: 'Real-time Analytics',
                description: 'Comprehensive insights into student performance and progress',
                icon: '📊'
              },
              {
                title: 'Smart Feedback',
                description: 'Detailed and constructive feedback for every submission',
                icon: '💡'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card bg-gray-800 p-8 scroll-animate"
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-heading font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-16">What Educators Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 p-6 rounded-lg scroll-animate"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Toggle Section - New */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-center mb-8">Choose Your Plan</h2>
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800 p-1 rounded-lg inline-flex">
              <button
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === 'teachers' ? 'bg-primary text-white' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('teachers')}
              >
                For Teachers
              </button>
              <button
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === 'institutions' ? 'bg-primary text-white' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('institutions')}
              >
                For Institutions
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Basic',
                price: activeTab === 'teachers' ? '$29' : '$99',
                period: '/month',
                features: [
                  '100 assessments/month',
                  'Basic analytics',
                  'Email support',
                  'API access'
                ]
              },
              {
                name: 'Pro',
                price: activeTab === 'teachers' ? '$49' : '$199',
                period: '/month',
                features: [
                  'Unlimited assessments',
                  'Advanced analytics',
                  'Priority support',
                  'Custom integrations'
                ]
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                features: [
                  'Custom solutions',
                  'Dedicated support',
                  'SLA guarantee',
                  'White-labeling'
                ]
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-lg p-8 text-center scroll-animate"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="text-gray-300">✓ {feature}</li>
                  ))}
                </ul>
                <button className="btn btn-primary w-full">Get Started</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section - Enhanced with animations */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '99%', label: 'Accuracy Rate' },
              { value: '75%', label: 'Time Saved' },
              { value: '10k+', label: 'Assessments Graded' },
              { value: '1000+', label: 'Happy Teachers' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="scroll-animate"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-5xl font-bold text-primary mb-3">{stat.value}</div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced with gradient and animation */}
      <section className="py-24 bg-gradient-to-r from-primary/20 to-secondary/20">
        <motion.div 
          className="max-w-4xl mx-auto text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />
          <h2 className="text-5xl font-heading font-bold mb-6">
            Ready to Transform Your Grading Process?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"></p>
      </section>
    </div>
  );
}