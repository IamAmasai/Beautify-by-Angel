import React, { useState, useEffect } from 'react';
import { useHashRoute } from './router';
import { useAuth } from './store';
import { api } from './api';

// Mock services for demo when API is not available
const MOCK_SERVICES = [
  { id: '1', name: 'Box Braids (Medium)', description: 'Classic medium box braids.', effectivePrice: 5000, durationMin: 180, category: 'hair' },
  { id: '2', name: 'Makeup — Soft Glam', description: 'Natural, elegant look.', effectivePrice: 4000, durationMin: 90, category: 'makeup' },
  { id: '3', name: 'Gel Manicure', description: 'Classic gel finish.', effectivePrice: 2400, durationMin: 60, category: 'nails' },
  { id: '4', name: 'Simple Henna', description: 'Elegant minimal designs.', effectivePrice: 1600, durationMin: 45, category: 'henna' }
];

// Simple components for the booking flow
function Header() {
  const { navigate } = useHashRoute();
  return (
    <div className="header">
      <div className="brand">
        <h1>Beautify by Angel</h1>
        <span className="brandline">Beauty Woven in Every Detail</span>
        <button className="cta" onClick={() => navigate('/')}>
          Book Now
        </button>
      </div>
    </div>
  );
}

function ServiceSelection({ onSelect }: { onSelect: (service: any) => void }) {
  const [services, setServices] = useState<any[]>([]);
  const [useMock, setUseMock] = useState(false);
  
  useEffect(() => {
    api.getServices()
      .then(setServices)
      .catch(() => {
        setServices(MOCK_SERVICES);
        setUseMock(true);
      });
  }, []);
  
  return (
    <div className="container">
      {useMock && (
        <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeaa7' }}>
          <strong>Demo Mode:</strong> Using mock data since server is not running. 
          In production, this would connect to your backend API.
        </div>
      )}
      <h2 className="section-title">Choose Your Service</h2>
      <div className="grid">
        {services.map(service => (
          <div key={service.id} className="service-item" onClick={() => onSelect(service)}>
            <div>
              <h3>{service.name}</h3>
              <p className="subtle">{service.description}</p>
              <span className="badge">{service.durationMin} min</span>
            </div>
            <div>
              <div className="total">KSh {service.effectivePrice.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DateTimeSelection({ service, onNext }: { service: any; onNext: (dateTime: string) => void }) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  useEffect(() => {
    if (selectedDate) {
      // Mock available slots for demo or try API
      api.getAvailableSlots(selectedDate)
        .then(setAvailableSlots)
        .catch(() => {
          // Fallback to mock data
          const mockSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => {
            const date = new Date(selectedDate + 'T' + time + ':00');
            return date.toISOString();
          });
          setAvailableSlots(mockSlots);
        });
    }
  }, [selectedDate]);
  
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });
  
  const handleNext = () => {
    if (selectedSlot) {
      onNext(selectedSlot);
    }
  };
  
  return (
    <div className="container">
      <h2 className="section-title">Select Date & Time</h2>
      <div className="card">
        <h3>{service.name} — KSh {service.effectivePrice.toLocaleString()}</h3>
        
        <label className="label">Date</label>
        <select className="input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          <option value="">Choose a date...</option>
          {dates.map(date => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </option>
          ))}
        </select>
        
        {selectedDate && (
          <>
            <label className="label">Available Times</label>
            <div className="grid grid-2">
              {availableSlots.map(slot => {
                const time = new Date(slot).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
                return (
                  <button
                    key={slot}
                    className={`button ${selectedSlot === slot ? '' : 'secondary'}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </>
        )}
        
        {selectedSlot && (
          <button className="button" onClick={handleNext}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function BookingDetails({ service, dateTime, onBook }: { service: any; dateTime: string; onBook: (details: any) => void }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    paymentOption: 'deposit' as 'deposit' | 'full',
    policyAgreed: false
  });
  
  const deposit = Math.round(service.effectivePrice * 0.3);
  const total = service.effectivePrice;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.policyAgreed) {
      alert('Please agree to the booking policy');
      return;
    }
    
    const bookingData = {
      serviceId: service.id,
      dateTimeISO: dateTime,
      ...form
    };
    onBook(bookingData);
  };
  
  return (
    <div className="container">
      <h2 className="section-title">Booking Details</h2>
      <div className="card">
        <h3>{service.name}</h3>
        <p>{new Date(dateTime).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</p>
        
        <form onSubmit={handleSubmit} className="grid">
          <div>
            <label className="label">Full Name *</label>
            <input 
              className="input" 
              type="text" 
              required 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="label">Phone Number *</label>
            <input 
              className="input" 
              type="tel" 
              required 
              placeholder="254..."
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
            />
          </div>
          
          <div>
            <label className="label">Email Address *</label>
            <input 
              className="input" 
              type="email" 
              required 
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="label">Special Notes</label>
            <textarea 
              className="input" 
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
            />
          </div>
          
          <div>
            <label className="label">Payment Option</label>
            <select 
              className="input"
              value={form.paymentOption}
              onChange={(e) => setForm({...form, paymentOption: e.target.value as 'deposit' | 'full'})}
            >
              <option value="deposit">Deposit (30%) — KSh {deposit.toLocaleString()}</option>
              <option value="full">Full Payment — KSh {total.toLocaleString()}</option>
            </select>
          </div>
          
          <div className="policy">
            <label>
              <input 
                type="checkbox"
                checked={form.policyAgreed}
                onChange={(e) => setForm({...form, policyAgreed: e.target.checked})}
              />
              {' '}I agree to the booking policy: Cancellations must be made 24 hours in advance. 
              Emergency bookings may incur a KSh 250 fee. Payment confirms acceptance of terms.
            </label>
          </div>
          
          <button type="submit" className="button">
            Proceed to Payment — KSh {form.paymentOption === 'deposit' ? deposit : total}
          </button>
        </form>
      </div>
    </div>
  );
}

function PaymentFlow({ bookingData }: { bookingData: any }) {
  const [loading, setLoading] = useState(true);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [useMock, setUseMock] = useState(false);
  
  useEffect(() => {
    async function createBooking() {
      try {
        const result = await api.createBooking(bookingData);
        setBookingResult(result);
        
        // Initiate M-Pesa payment
        await api.initiatePayment({
          bookingId: result.bookingId,
          phone: bookingData.phone,
          amount: result.chargeAmount
        });
      } catch (error) {
        console.error('Booking error:', error);
        // Fallback to mock for demo
        setUseMock(true);
        setBookingResult({
          bookingId: 'demo-' + Date.now(),
          chargeAmount: bookingData.paymentOption === 'deposit' ? Math.round(5000 * 0.3) : 5000,
          total: 5000,
          deposit: Math.round(5000 * 0.3)
        });
      } finally {
        setLoading(false);
      }
    }
    
    // Simulate booking creation delay
    setTimeout(createBooking, 1000);
  }, [bookingData]);
  
  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h2>Creating your booking...</h2>
          <p>Please wait while we process your request.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      <div className="card">
        <h2>Booking Created!</h2>
        {useMock && (
          <div style={{ background: '#d1ecf1', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #bee5eb' }}>
            <strong>Demo Mode:</strong> In production, this would initiate M-Pesa STK push payment.
          </div>
        )}
        {bookingResult && (
          <>
            <p>Your booking has been created. Please check your phone for the M-Pesa payment prompt.</p>
            <p><strong>Amount to pay:</strong> KSh {bookingResult.chargeAmount.toLocaleString()}</p>
            <p>Your booking will be confirmed once payment is completed.</p>
            <p className="subtle">
              You should receive email and SMS confirmations shortly. 
              Contact us at 0706805891 if you need assistance.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const { navigate } = useHashRoute();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.login(form);
      setToken(result.token);
      navigate('/admin');
    } catch (error) {
      // Demo fallback
      console.log('Login failed, using demo mode');
      setTimeout(() => {
        setLoading(false);
        navigate('/admin?demo=true');
      }, 1000);
      return;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <div className="card">
        <h2 className="section-title">Admin Login</h2>
        <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #ffeaa7' }}>
          <strong>Demo Mode:</strong> Server not running. Any email/password will work for demonstration.
        </div>
        <form onSubmit={handleSubmit} className="grid">
          <div>
            <label className="label">Email</label>
            <input 
              className="input" 
              type="email" 
              required 
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input 
              className="input" 
              type="password" 
              required 
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const { token, clear } = useAuth();
  const { navigate, route } = useHashRoute();
  const isDemo = route.includes('demo=true');
  
  useEffect(() => {
    if (token && !isDemo) {
      api.getBookings(token).then(setBookings);
    } else {
      // Mock bookings for demo
      const mockBookings = [
        {
          id: '1',
          name: 'Jane Doe',
          service: { name: 'Box Braids (Medium)' },
          date: new Date(Date.now() + 86400000).toISOString(),
          phone: '254712345678',
          status: 'CONFIRMED'
        },
        {
          id: '2', 
          name: 'Mary Smith',
          service: { name: 'Makeup — Soft Glam' },
          date: new Date(Date.now() + 172800000).toISOString(),
          phone: '254787654321',
          status: 'AWAITING_PAYMENT'
        }
      ];
      setBookings(mockBookings);
    }
  }, [token, isDemo]);
  
  const handleLogout = () => {
    clear();
    navigate('/');
  };
  
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="section-title">Admin Dashboard</h2>
        <button className="button secondary" onClick={handleLogout}>Logout</button>
      </div>
      
      {isDemo && (
        <div style={{ background: '#d1ecf1', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bee5eb' }}>
          <strong>Demo Mode:</strong> This shows mock booking data. In production, this would display real bookings from the database.
        </div>
      )}
      
      <div className="card">
        <h3>Recent Bookings</h3>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="grid">
            {bookings.map(booking => (
              <div key={booking.id} className="service-item">
                <div>
                  <strong>{booking.name}</strong> — {booking.service.name}<br/>
                  <span className="subtle">
                    {new Date(booking.date).toLocaleString('en-KE')} • {booking.phone}
                  </span>
                </div>
                <div>
                  <span className={`badge ${booking.status === 'CONFIRMED' ? '' : 'secondary'}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const { route } = useHashRoute();
  const { token } = useAuth();
  
  const [step, setStep] = useState<'service' | 'datetime' | 'details' | 'payment'>('service');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string>('');
  const [bookingData, setBookingData] = useState<any>(null);
  
  const resetBooking = () => {
    setStep('service');
    setSelectedService(null);
    setSelectedDateTime('');
    setBookingData(null);
  };
  
  if (route === '/admin/login') {
    return (
      <>
        <Header />
        <AdminLogin />
      </>
    );
  }
  
  if (route === '/admin' || route.startsWith('/admin?')) {
    if (!token && !route.includes('demo=true')) {
      window.location.hash = '/admin/login';
      return null;
    }
    return (
      <>
        <Header />
        <AdminDashboard />
      </>
    );
  }
  
  // Main booking flow
  return (
    <>
      <Header />
      {step === 'service' && (
        <ServiceSelection onSelect={(service) => {
          setSelectedService(service);
          setStep('datetime');
        }} />
      )}
      
      {step === 'datetime' && selectedService && (
        <DateTimeSelection 
          service={selectedService}
          onNext={(dateTime) => {
            setSelectedDateTime(dateTime);
            setStep('details');
          }}
        />
      )}
      
      {step === 'details' && selectedService && selectedDateTime && (
        <BookingDetails 
          service={selectedService}
          dateTime={selectedDateTime}
          onBook={(details) => {
            setBookingData(details);
            setStep('payment');
          }}
        />
      )}
      
      {step === 'payment' && bookingData && (
        <PaymentFlow bookingData={bookingData} />
      )}
      
      <div className="footer">
        <p>Beautify by Angel • Beauty Woven in Every Detail</p>
        <p>Contact: 0706805891 • cynthiamumo02@gmail.com</p>
        <p className="subtle">
          <a href="#/admin/login" className="link">Admin</a> • 
          {step !== 'service' && <button className="link" onClick={resetBooking} style={{border: 'none', background: 'none', cursor: 'pointer'}}>Start Over</button>}
        </p>
      </div>
    </>
  );
}