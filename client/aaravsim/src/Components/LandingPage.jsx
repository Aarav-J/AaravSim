import React, {useEffect, useRef} from 'react';
import { ArrowRight, ChartLineUp, ShieldCheck, Wallet, UsersThree, LightbulbFilament } from '@phosphor-icons/react';
import useStore from '../store';
import '../styles/Landing.scss';

const LandingPage = () => {
  const setSelectedDashboard = useStore((state) => state.setSelectedDashboard);
  const resetAuthState = useStore((state) => state.resetAuthState);
  const featuresRef = useRef(null); 
  const comingSoonRef = useRef(null); 
  const howItWorksRef = useRef(null); 
  const finalCtaRef = useRef(null); 
  const handleGetStarted = () => {
    // console.log("Get Started clicked, navigating to auth dashboard");
    
    // Reset pending username state if it exists
    useStore.getState().setPendingUsername(false);
    
    // Clear any existing user/session first
    useStore.getState().setUser(null);
    useStore.getState().setSession(null);
    
    // Then navigate to auth
    useStore.getState().setSelectedDashboard('auth');
  };
  useEffect(() => { 
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto';
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach(element => {
      observer.observe(element);
    });
    
    return () => { 
        document.body.style.overflow = '';
    }
}, [])
  return (
    <div className="landing-page">
     
      <nav className="landing-nav">
        <div className="logo">
          <span className="logo-text">Aaravsim</span>
        </div>
        <button className="cta-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </nav>
      
      
      <section className="hero">
        <div className="hero-content">
          <h1>Master the Market<br /><span className="highlight">Without the Risk</span></h1>
          <p className="hero-subtitle">
            A powerful stock market simulator for learning, practice, and strategy testing. 
            Experience real-time trading with virtual money.
          </p>
          <button className="cta-button large" onClick={handleGetStarted}>
            Start Trading Now <ArrowRight weight="bold" />
          </button>
        </div>
        {/* <div className="hero-image">
          <div className="hero-mockup"></div>
        </div> */}
      </section>
      
      
      <section className="features" ref={featuresRef}>
        <h2 className='reveal'>Why Use <span className="highlight">Aaravsim</span>?</h2>
        
        <div className="feature-grid">
          <div className="feature-card reveal">
            <div className="feature-icon">
              <ChartLineUp size={32} weight="fill" />
            </div>
            <h3>Real-Time Data</h3>
            <p>Practice with actual market data and real-time stock prices just like the real stock market.</p>
          </div>
          
          <div className="feature-card reveal">
            <div className="feature-icon">
              <Wallet size={32} weight="fill" />
            </div>
            <h3>Risk-Free Learning</h3>
            <p>Start with virtual money and learn trading strategies without risking your actual savings.</p>
          </div>
          
          <div className="feature-card reveal">
            <div className="feature-icon">
              <LightbulbFilament size={32} weight="fill" />
            </div>
            <h3>Build Strategies</h3>
            <p>Test and refine your investment strategies in a realistic market environment.</p>
          </div>
          
          <div className="feature-card reveal">
            <div className="feature-icon">
              <ShieldCheck size={32} weight="fill" />
            </div>
            <h3>Track Performance</h3>
            <p>Monitor your portfolio performance with detailed analytics and transaction history.</p>
          </div>
        </div>
      </section>
      
     
      <section className="coming-soon" ref={comingSoonRef}>
        <div className="soon-content reveal">
          <h2>Coming Soon: <span className="highlight">Trading Groups</span></h2>
          <div className="soon-icon">
            <UsersThree size={48} weight="fill" />
          </div>
          <p>Compete with friends, join investment clubs, or start a friendly competition. Our upcoming groups feature will allow you to compare strategies and learn from each other.</p>
          <div className="notification">
            <input type="email" placeholder="Your email address" />
            <button className="notify-button">Notify Me</button>
          </div>
        </div>
      </section>
      
      
      <section className="how-it-works" ref={howItWorksRef}>
        <h2 className='reveal'>How <span className="highlight">Stocky</span> Works</h2>
        
        <div className="steps">
          <div className="step reveal">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Sign up in seconds and get immediate access to your virtual trading portfolio.</p>
          </div>
          
          <div className="step reveal">
            <div className="step-number">2</div>
            <h3>Browse Stocks</h3>
            <p>Research and analyze stocks with comprehensive data and visual charts.</p>
          </div>
          
          <div className="step reveal">
            <div className="step-number">3</div>
            <h3>Buy & Sell</h3>
            <p>Execute trades with your virtual cash and build your portfolio.</p>
          </div>
          
          <div className="step reveal">
            <div className="step-number">4</div>
            <h3>Track Results</h3>
            <p>Monitor your performance and refine your strategy over time.</p>
          </div>
        </div>
      </section>
      
{/*       
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>"This platform helped me understand market patterns without risking my savings. Now I'm confident enough to start real trading."</p>
            <div className="user">
              <div className="avatar">JD</div>
              <div className="user-info">
                <h4>John Doe</h4>
                <span>Beginner Investor</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <p>"I use Stocky to test new strategies before implementing them with real money. It's become an essential part of my investment process."</p>
            <div className="user">
              <div className="avatar">AS</div>
              <div className="user-info">
                <h4>Amy Smith</h4>
                <span>Experienced Trader</span>
              </div>
            </div>
          </div>
        </div>
      </section>
       */}
   
      <section className="final-cta" ref={finalCtaRef}>
        <h2 className='reveal'>Ready to Start Your Trading Journey?</h2>
        <p className='reveal'>Join thousands of users learning to invest with confidence.</p>
        <button className="cta-button large reveal" onClick={handleGetStarted}>
          Get Started for Free <ArrowRight weight="bold" />
        </button>
      </section>
      
    
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">AaravSim</span>
            <p>© {new Date().getFullYear()} Aaravsim. All rights reserved.</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <ul>
                <li>Features</li>
                <li>Pricing</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>Resources</h4>
              <ul>
                <li>Blog</li>
                <li>Help Center</li>
                <li>Contact</li>
              </ul>
            </div>
            
            <div className="link-group">
              <h4>Legal</h4>
              <ul>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;