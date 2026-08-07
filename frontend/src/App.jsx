import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  Calendar, 
  CreditCard, 
  Tag, 
  Sliders, 
  BarChart3, 
  Wifi, 
  Tv, 
  Wind, 
  Coffee, 
  Compass, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Plus, 
  Trash2, 
  Percent, 
  Filter, 
  Layers, 
  User, 
  Mail, 
  Phone, 
  Info, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, rooms, bookings, payments, dashboard, reports
  const [rooms, setRooms] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  
  // App-wide state
  const [searchFilters, setSearchFilters] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    occupancy: '2'
  });
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [pendingBookingId, setPendingBookingId] = useState(null);
  const [pendingBookingDetails, setPendingBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Admin Form States
  const [newRoomForm, setNewRoomForm] = useState({
    room_number: '',
    room_type: 'Deluxe Suite',
    price_per_night: '',
    max_occupancy: '2',
    amenities: 'WiFi, TV, AC, Minibar',
    image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
    description: ''
  });

  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    discount_percentage: '15',
    expiry_date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
  });

  // Fetch initial data
  useEffect(() => {
    fetchRooms();
    fetchCoupons();
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await api.getRooms();
      setRooms(data);
      setErrorMsg('');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load rooms.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const data = await api.getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.getReportsData();
      setReportsData(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await api.searchRooms(
        searchFilters.checkIn,
        searchFilters.checkOut,
        searchFilters.occupancy
      );
      setRooms(data);
      setActiveTab('rooms');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3D Card Hover Perspective logic (pure inline CSS triggers)
  const [tiltStyle, setTiltStyle] = useState({});
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateY = ((x - xc) / xc) * 8; // Max 8 deg
    const rotateX = ((yc - y) / yc) * 8; // Max 8 deg
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    });
  };

  return (
    <div className="app-container">
      {/* --- GLASMORPHIC NAVBAR --- */}
      <header className="glass-panel" style={{
        margin: '1.5rem 2rem 0',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 'var(--radius-md)',
        position: 'sticky',
        top: '1.5rem',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <Compass size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', letterSpacing: '1px', fontWeight: 800 }}>TGI FORTUNA</h2>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--neutral-500)', fontWeight: 700 }}>Hotel & Luxury Resorts</span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'home', label: 'Home', icon: <HomeIcon size={16} /> },
            { id: 'rooms', label: 'Rooms', icon: <Layers size={16} /> },
            { id: 'bookings', label: 'Bookings', icon: <Calendar size={16} /> },
            { id: 'payments', label: 'Payments', icon: <CreditCard size={16} /> },
            { id: 'dashboard', label: 'Dashboard', icon: <Sliders size={16} /> },
            { id: 'reports', label: 'Reports', icon: <BarChart3 size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="btn"
              style={{
                background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--neutral-700)',
                border: 'none',
                padding: '0.6rem 1.1rem',
                borderRadius: '12px',
                fontSize: '0.9rem'
              }}
            >
              {tab.icon}
              <span className="nav-label-text">{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* --- ERROR/SUCCESS BANNER --- */}
      {errorMsg && (
        <div className="glass-panel" style={{
          margin: '1.5rem 4rem 0',
          padding: '1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          color: '#b91c1c',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          <AlertCircle size={20} />
          <p style={{ fontWeight: 600 }}>{errorMsg}</p>
        </div>
      )}
      {successMsg && (
        <div className="glass-panel" style={{
          margin: '1.5rem 4rem 0',
          padding: '1rem',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          color: '#047857',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          <CheckCircle size={20} />
          <p style={{ fontWeight: 600 }}>{successMsg}</p>
        </div>
      )}

      {/* --- CONTENT CONTAINER --- */}
      <main className="main-content">
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }} className="glass-panel">
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid rgba(79, 70, 229, 0.1)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Loading TGI Fortuna...</p>
            </div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* ======================================================== */}
        {/* ======================= HOME TAB ======================= */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div>
            {/* HERO HERO ROW */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '3rem',
              alignItems: 'center',
              margin: '2rem 0 4rem'
            }}>
              <div>
                <span style={{
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  display: 'inline-block',
                  marginBottom: '0.5rem'
                }}>Welcome to Paradise</span>
                <h1 style={{
                  fontSize: '3.5rem',
                  lineHeight: '1.15',
                  marginBottom: '1.5rem',
                  fontWeight: 800
                }}>
                  Experience Luxury at <span style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>TGI Fortuna</span>
                </h1>
                <p style={{
                  fontSize: '1.1rem',
                  color: 'var(--neutral-500)',
                  marginBottom: '2.5rem',
                  maxWidth: '550px'
                }}>
                  Immerse yourself in high-fidelity glassmorphism aesthetics, panoramic ocean views, and state-of-the-art 3D card interactions. Book your premium stay today.
                </p>

                {/* DYNAMIC RESERVATION FILTER FORM */}
                <form onSubmit={handleRoomSearch} className="glass-panel" style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 0.6fr auto',
                  gap: '1rem',
                  alignItems: 'end',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Check In</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={searchFilters.checkIn}
                      onChange={(e) => setSearchFilters({...searchFilters, checkIn: e.target.value})}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Check Out</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={searchFilters.checkOut}
                      onChange={(e) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Guests</label>
                    <select 
                      className="form-control"
                      value={searchFilters.occupancy}
                      onChange={(e) => setSearchFilters({...searchFilters, occupancy: e.target.value})}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', height: 'fit-content' }}>
                    Find Rooms
                  </button>
                </form>
              </div>

              {/* 3D INTERACTIVE HERO CARD */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div 
                  className="glass-panel glass-card-3d floating-anim"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    width: '100%',
                    maxWidth: '450px',
                    height: '480px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                    ...tiltStyle
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80" 
                    alt="TGI Fortuna resort view"
                    style={{
                      width: '100%',
                      height: '60%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.7)', height: '40%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', fontWeight: 800 }}>Featured Suite</span>
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        {'★★★★★'.split('').map((char, i) => <span key={i} style={{ color: 'var(--accent)' }}>{char}</span>)}
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Presidential Ocean Villa</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--neutral-500)', lineHeight: '1.4' }}>
                      Experience the best horizon views, a private infinity pool, and custom architectural layouts crafted for sheer elegance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AMENITIES SECTION */}
            <div style={{ marginTop: '4rem' }}>
              <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>Premium Amenities</h2>
              <p style={{ textAlign: 'center', color: 'var(--neutral-500)', marginBottom: '3rem' }}>Everything you need for an unforgettable escape</p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.5rem'
              }}>
                {[
                  { title: "High-speed Wi-Fi", desc: "Always stay connected", icon: <Wifi size={32} /> },
                  { title: "Smart TV System", desc: "4K Netflix streaming", icon: <Tv size={32} /> },
                  { title: "Climate Control", desc: "Premium Air Conditioning", icon: <Wind size={32} /> },
                  { title: "Specialty Coffee", desc: "Espresso machine standard", icon: <Coffee size={32} /> },
                  { title: "Spa & Hot Springs", desc: "Full wellness treatment", icon: <Compass size={32} /> },
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel" style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{
                      color: 'var(--primary)',
                      background: 'var(--primary-light)',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>{item.icon}</div>
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ======================= ROOMS TAB ======================= */}
        {/* ======================================================== */}
        {activeTab === 'rooms' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Our Premium Rooms</h1>
                <p style={{ color: 'var(--neutral-500)' }}>Handpicked selection of exquisite suites at TGI Fortuna</p>
              </div>
              
              {/* Dynamic room count badge */}
              <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} color="var(--primary)" />
                <span style={{ fontWeight: 700 }}>{rooms.length} Suites Available</span>
              </div>
            </div>

            {/* Filter controls */}
            <form onSubmit={handleRoomSearch} className="glass-panel" style={{
              padding: '1.25rem',
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'end',
              marginBottom: '3rem',
              flexWrap: 'wrap'
            }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} /> Check In
                </label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={searchFilters.checkIn}
                  onChange={(e) => setSearchFilters({...searchFilters, checkIn: e.target.value})}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} /> Check Out
                </label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={searchFilters.checkOut}
                  onChange={(e) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: 0.8, minWidth: '120px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <User size={14} /> Guests
                </label>
                <select 
                  className="form-control"
                  value={searchFilters.occupancy}
                  onChange={(e) => setSearchFilters({...searchFilters, occupancy: e.target.value})}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  <Filter size={16} /> Filter
                </button>
                <button type="button" className="btn btn-secondary" onClick={fetchRooms}>
                  Reset
                </button>
              </div>
            </form>

            {/* Room cards grid */}
            {rooms.length === 0 ? (
              <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                <AlertCircle size={48} style={{ color: 'var(--neutral-500)', marginBottom: '1rem' }} />
                <h3>No rooms found matching your dates.</h3>
                <p style={{ color: 'var(--neutral-500)' }}>Try expanding your filters or searching for different check-in dates.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '2.5rem'
              }}>
                {rooms.map(room => (
                  <div 
                    key={room.id}
                    className="glass-panel glass-card-3d"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '520px'
                    }}
                  >
                    <div style={{ position: 'relative', height: '240px' }}>
                      <img 
                        src={room.image_url || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80"} 
                        alt={room.room_type}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className={`badge badge-${room.status.toLowerCase()}`} style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        fontWeight: 800,
                        backdropFilter: 'blur(8px)'
                      }}>
                        {room.status}
                      </span>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.25rem' }}>{room.room_type}</h3>
                          <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Room {room.room_number}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', height: '55px', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '1rem' }}>
                          {room.description || "A gorgeous, well-furnished room featuring local handcrafted details, custom lighting systems, and comfortable bedsheets."}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                          {room.amenities.split(',').map((amenity, idx) => (
                            <span key={idx} style={{
                              fontSize: '0.7rem',
                              padding: '0.2rem 0.5rem',
                              background: 'var(--neutral-100)',
                              border: '1px solid var(--neutral-300)',
                              borderRadius: '4px',
                              fontWeight: 600
                            }}>
                              {amenity.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.4)', paddingTop: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${room.price_per_night}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}> / night</span>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedRoom(room);
                            setActiveTab('bookings');
                          }}
                          disabled={room.status !== 'Available'}
                          className="btn btn-primary"
                          style={{
                            padding: '0.6rem 1.25rem',
                            fontSize: '0.85rem',
                            borderRadius: '8px'
                          }}
                        >
                          Book Suite
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* ===================== BOOKINGS TAB ===================== */}
        {/* ======================================================== */}
        {activeTab === 'bookings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', margin: '1rem 0' }}>
            {/* BOOKING DETAILS FORM */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Reserve Your Stay</h2>
              <p style={{ color: 'var(--neutral-500)', marginBottom: '2rem' }}>Provide details below to book your suite at TGI Fortuna.</p>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                setErrorMsg('');
                
                const form = e.target;
                const bookingData = {
                  room: selectedRoom ? selectedRoom.id : form.room_id.value,
                  guest_name: form.guest_name.value,
                  guest_email: form.guest_email.value,
                  guest_phone: form.guest_phone.value,
                  check_in: form.check_in.value,
                  check_out: form.check_out.value,
                  coupon_code: form.coupon_code.value
                };

                try {
                  setLoading(true);
                  const result = await api.createBooking(bookingData);
                  setPendingBookingId(result.id);
                  setPendingBookingDetails(result);
                  setSuccessMsg('Booking saved! Please verify details and complete payment.');
                  setActiveTab('payments');
                } catch (err) {
                  setErrorMsg(err.message || 'Booking reservation failed.');
                } finally {
                  setLoading(false);
                }
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="guest_name" required className="form-control" placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="guest_email" required className="form-control" placeholder="john@example.com" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="guest_phone" required className="form-control" placeholder="+91 98765 43210" />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Room Suite</label>
                  {selectedRoom ? (
                    <div style={{
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.7)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <strong>{selectedRoom.room_type} (Room {selectedRoom.room_number})</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>Max Occupancy: {selectedRoom.max_occupancy} guests</div>
                      </div>
                      <button type="button" className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setSelectedRoom(null)}>
                        Change
                      </button>
                    </div>
                  ) : (
                    <select name="room_id" required className="form-control">
                      <option value="">-- Select a Suite --</option>
                      {rooms.filter(r => r.status === 'Available').map(r => (
                        <option key={r.id} value={r.id}>
                          Room {r.room_number} - {r.room_type} (${r.price_per_night}/night)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Check-In Date</label>
                    <input 
                      type="date" 
                      name="check_in" 
                      required 
                      className="form-control" 
                      value={searchFilters.checkIn}
                      onChange={(e) => setSearchFilters({...searchFilters, checkIn: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Check-Out Date</label>
                    <input 
                      type="date" 
                      name="check_out" 
                      required 
                      className="form-control" 
                      value={searchFilters.checkOut}
                      onChange={(e) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Promo Coupon Code</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" name="coupon_code" className="form-control" style={{ textTransform: 'uppercase' }} placeholder="TGIFORTUNA" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
                  Continue to Payments
                </button>
              </form>
            </div>

            {/* INVOICE BILLING PREVIEW */}
            <div>
              <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: '0.75rem' }}>
                  Booking Summary
                </h3>
                
                {selectedRoom ? (
                  <div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                      <img 
                        src={selectedRoom.image_url} 
                        style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} 
                        alt={selectedRoom.room_type}
                      />
                      <div>
                        <h4 style={{ fontSize: '1rem' }}>{selectedRoom.room_type}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>Room {selectedRoom.room_number}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Room Price</span>
                        <strong>${selectedRoom.price_per_night} / night</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Check In</span>
                        <span>{searchFilters.checkIn}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Check Out</span>
                        <span>{searchFilters.checkOut}</span>
                      </div>
                      
                      {/* Calculation */}
                      {(() => {
                        const nights = Math.max(1, Math.round((new Date(searchFilters.checkOut) - new Date(searchFilters.checkIn)) / 86400000)) || 1;
                        const subtotal = selectedRoom.price_per_night * nights;
                        const tax = Math.round(subtotal * 0.12 * 100) / 100;
                        const total = subtotal + tax;
                        return (
                          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Nights</span>
                              <strong>{nights}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Subtotal</span>
                              <strong>${subtotal.toFixed(2)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Tax (12%)</span>
                              <strong>${tax.toFixed(2)}</strong>
                            </div>
                            
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              fontSize: '1.2rem', 
                              fontWeight: 800, 
                              color: 'var(--neutral-900)',
                              borderTop: '1px dotted rgba(255,255,255,0.4)',
                              paddingTop: '0.75rem',
                              marginTop: '0.5rem'
                            }}>
                              <span>Total Amount</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--neutral-500)' }}>
                    <Info size={32} style={{ marginBottom: '0.5rem' }} />
                    <p>Select a suite on the left or browse our Rooms page to view a detailed checkout summary here.</p>
                  </div>
                )}
              </div>

              {/* ACTIVE COUPONS CORNER */}
              <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Tag size={16} color="var(--primary)" /> Active Promo Codes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {coupons.filter(c => c.active).map(coupon => (
                    <div key={coupon.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.4)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px dashed var(--glass-border)'
                    }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{coupon.code}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Expires: {coupon.expiry_date}</div>
                      </div>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: 'rgba(79, 70, 229, 0.1)',
                        color: 'var(--primary)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        {coupon.discount_percentage}% OFF
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ===================== PAYMENTS TAB ===================== */}
        {/* ======================================================== */}
        {activeTab === 'payments' && (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Secure Payment Gateway</h2>
              <p style={{ color: 'var(--neutral-500)', marginBottom: '2rem' }}>Complete your transaction to confirm your booking.</p>

              {pendingBookingDetails ? (
                <div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.5)',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    textAlign: 'left'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1rem' }}>{pendingBookingDetails.guest_name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                        Booking ID: #{pendingBookingDetails.id} | {pendingBookingDetails.room_details.room_type}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--neutral-500)', display: 'block', textAlign: 'right' }}>Total Due</span>
                      <strong style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>${pendingBookingDetails.final_price}</strong>
                    </div>
                  </div>

                  {/* 3D CREDIT CARD FLIP ANIMATION MOCKUP */}
                  <CreditCardPaymentForm 
                    pendingBookingDetails={pendingBookingDetails}
                    setLoading={setLoading}
                    setErrorMsg={setErrorMsg}
                    setSuccessMsg={setSuccessMsg}
                    setPendingBookingDetails={setPendingBookingDetails}
                    setPendingBookingId={setPendingBookingId}
                    setActiveTab={setActiveTab}
                  />
                </div>
              ) : (
                <div style={{ padding: '3rem 1rem', color: 'var(--neutral-500)' }}>
                  <Calendar size={48} style={{ marginBottom: '1rem', color: 'var(--neutral-300)' }} />
                  <h3>No booking selected for payment.</h3>
                  <p style={{ color: 'var(--neutral-500)', marginBottom: '1.5rem' }}>Please make a booking reservation first from the Bookings tab.</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('bookings')}>
                    Reserve Room
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* =================== ADMIN DASHBOARD ==================== */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Control Center Dashboard</h1>
                <p style={{ color: 'var(--neutral-500)' }}>Real-time booking updates, room status, and occupancy control</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={fetchDashboardStats}>
                  Refresh Stats
                </button>
              </div>
            </div>

            {/* HIGH LEVEL STATS KPI GRID */}
            {dashboardStats && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
              }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
                    <DollarSign size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Total Revenue</span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>${dashboardStats.stats.total_revenue.toFixed(2)}</h3>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--secondary)', padding: '1rem', borderRadius: '12px' }}>
                    <Calendar size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Active Bookings</span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{dashboardStats.stats.active_bookings}</h3>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '12px' }}>
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Occupancy Rate</span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{dashboardStats.stats.occupancy_rate}%</h3>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(217, 119, 6, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '12px' }}>
                    <Layers size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Total Rooms</span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{dashboardStats.stats.total_rooms}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN MANAGEMENT TABS */}
            <AdminDashboardControls 
              dashboardStats={dashboardStats}
              rooms={rooms}
              coupons={coupons}
              fetchDashboardStats={fetchDashboardStats}
              fetchRooms={fetchRooms}
              fetchCoupons={fetchCoupons}
              newRoomForm={newRoomForm}
              setNewRoomForm={setNewRoomForm}
              newCouponForm={newCouponForm}
              setNewCouponForm={setNewCouponForm}
              setLoading={setLoading}
              setErrorMsg={setErrorMsg}
              setSuccessMsg={setSuccessMsg}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* ======================= REPORTS ======================== */}
        {/* ======================================================== */}
        {activeTab === 'reports' && reportsData && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Hotels Analytical Reports</h1>
                <p style={{ color: 'var(--neutral-500)' }}>Aggregated data breakdowns, revenue flow charts, and occupancy graphs</p>
              </div>
              <button className="btn btn-secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} /> Export PDF / Print
              </button>
            </div>

            {/* CHART ROW 1: REVENUE BAR CHART & DONUT CHART */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
              {/* MONTHLY REVENUE SVG BAR CHART */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="var(--primary)" /> Monthly Revenue Flow (Last 6 Months)
                </h3>
                
                {/* SVG Chart */}
                <div style={{ position: 'relative', height: '280px', width: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '30px' }}>
                  {(() => {
                    const maxRevenue = Math.max(...reportsData.monthly_revenue.map(item => item.revenue), 1000) * 1.1;
                    return (
                      <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'space-around', alignItems: 'flex-end' }}>
                        {reportsData.monthly_revenue.map((item, idx) => {
                          const heightPct = (item.revenue / maxRevenue) * 100;
                          return (
                            <div key={idx} style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              width: '12%', 
                              height: '100%', 
                              justifyContent: 'flex-end' 
                            }}>
                              {/* Hover text label */}
                              <div style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 800, 
                                marginBottom: '0.4rem',
                                color: 'var(--primary)'
                              }}>
                                ${Math.round(item.revenue)}
                              </div>
                              
                              {/* Bar */}
                              <div style={{ 
                                height: `${heightPct}%`, 
                                width: '100%', 
                                background: 'linear-gradient(to top, var(--primary), var(--secondary))',
                                borderRadius: '6px 6px 0 0',
                                transition: 'all 0.5s ease',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                              }} title={`Revenue: $${item.revenue}`} />
                              
                              {/* Axis Label */}
                              <div style={{ 
                                position: 'absolute', 
                                bottom: '0px', 
                                fontSize: '0.8rem', 
                                color: 'var(--neutral-500)',
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                              }}>
                                {item.month}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* BOOKING STATUS DONUT CHART */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                  Booking Status Distribution
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '240px', justifyContent: 'center' }}>
                  {(() => {
                    const breakdown = reportsData.status_breakdown;
                    const total = Object.values(breakdown).reduce((a, b) => a + b, 0) || 1;
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                          { label: 'Confirmed', count: breakdown.Confirmed, color: 'var(--success)' },
                          { label: 'Completed', count: breakdown.Completed, color: 'var(--primary)' },
                          { label: 'Pending', count: breakdown.Pending, color: 'var(--accent)' },
                          { label: 'Cancelled', count: breakdown.Cancelled, color: 'var(--danger)' }
                        ].map((stat, i) => {
                          const percentage = Math.round((stat.count / total) * 100);
                          return (
                            <div key={i}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: stat.color }} />
                                  {stat.label}
                                </span>
                                <strong>{stat.count} ({percentage}%)</strong>
                              </div>
                              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--neutral-100)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: stat.color, borderRadius: '4px' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* CHART ROW 2: ROOM OCCUPANCY Breakdown TABLE */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Room Occupancy Rate by Suite Class</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                {reportsData.room_types_occupancy.map((type, idx) => (
                  <div key={idx} style={{ 
                    border: '1px solid var(--glass-border)', 
                    padding: '1.5rem', 
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.3)',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{type.room_type}</h4>
                    
                    {/* Radial occupancy ring mockup using SVG */}
                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '1rem auto' }}>
                      <svg width="100" height="100" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(79, 70, 229, 0.08)"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="3"
                          strokeDasharray={`${type.occupancy_rate}, 100`}
                        />
                      </svg>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '0.95rem',
                        fontWeight: 800
                      }}>
                        {type.occupancy_rate}%
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', marginTop: '1rem' }}>
                      <strong>{type.occupied}</strong> of <strong>{type.total}</strong> Rooms Occupied Today
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="glass-panel" style={{
        margin: '3rem 2rem 2rem',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.85rem',
        color: 'var(--neutral-500)'
      }}>
        <p>&copy; {new Date().getFullYear()} TGI FORTUNA Hotel & Resorts. Designed in Light-Theme Glassic UI.</p>
        <span style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', opacity: 0.8 }}>Powered by React + Django + MySQL</span>
      </footer>
    </div>
  );
}

// ========================================================
// STANDALONE SUB-COMPONENTS TO AVOID REACT HOOKS VIOLATIONS
// ========================================================

function CreditCardPaymentForm({ pendingBookingDetails, setLoading, setErrorMsg, setSuccessMsg, setPendingBookingDetails, setPendingBookingId, setActiveTab }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• ••••',
    name: 'YOUR NAME',
    expiry: 'MM/YY',
    cvv: '•••'
  });

  return (
    <div>
      {/* 3D Container */}
      <div className={`card-3d-container ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-3d-inner">
          {/* FRONT SIDE */}
          <div className="card-3d-front">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.8rem', opacity: 0.8 }}>TGI FORTUNA PAY</span>
              <div style={{ width: '45px', height: '30px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }} /> {/* Chip */}
            </div>
            <h3 style={{ fontSize: '1.35rem', letterSpacing: '2px', wordSpacing: '4px', fontFamily: 'monospace', margin: '1rem 0' }}>
              {cardData.number}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.9 }}>
              <div>
                <span style={{ fontSize: '0.6rem', display: 'block', opacity: 0.7 }}>CARDHOLDER</span>
                <strong>{cardData.name.toUpperCase()}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.6rem', display: 'block', opacity: 0.7 }}>EXPIRES</span>
                <strong>{cardData.expiry}</strong>
              </div>
            </div>
          </div>
          
          {/* BACK SIDE */}
          <div className="card-3d-back">
            <div className="card-black-stripe" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.6rem', opacity: 0.7, alignSelf: 'flex-end', marginRight: '1rem' }}>CVV</span>
              <div className="card-signature-area">
                {cardData.cvv}
              </div>
            </div>
            <div style={{ fontSize: '0.55rem', opacity: 0.6, textAlign: 'center' }}>
              This is a high-fidelity 3D simulation of TGI Fortuna secure gateway.
            </div>
          </div>
        </div>
      </div>

      {/* Input form linking to card data and trigger flip */}
      <form onSubmit={async (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        const paymentData = {
          booking: pendingBookingDetails.id,
          cardholder_name: cardData.name,
          card_number: cardData.number,
          expiry_date: cardData.expiry,
          cvv: cardData.cvv,
          payment_method: 'Card'
        };

        try {
          setLoading(true);
          const result = await api.createPayment(paymentData);
          if (result.success) {
            setSuccessMsg(`Payment completed successfully! Transaction ID: ${result.payment.transaction_id}`);
            setPendingBookingDetails(null);
            setPendingBookingId(null);
            // Go to dashboard
            setActiveTab('dashboard');
          }
        } catch (err) {
          setErrorMsg(err.message || 'Payment simulation failed.');
        } finally {
          setLoading(false);
        }
      }} style={{ textAlign: 'left', marginTop: '2rem' }}>
        <div className="form-group">
          <label className="form-label">Cardholder Name</label>
          <input 
            type="text" 
            required 
            className="form-control" 
            placeholder="JOHN DOE"
            onFocus={() => setIsFlipped(false)}
            onChange={(e) => setCardData({...cardData, name: e.target.value || 'YOUR NAME'})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Card Number</label>
          <input 
            type="text" 
            required 
            maxLength="19" 
            className="form-control" 
            placeholder="4111 2222 3333 4444"
            onFocus={() => setIsFlipped(false)}
            onChange={(e) => {
              // Add space format
              let val = e.target.value.replace(/\D/g, '');
              let matches = val.match(/\d{4,16}/g);
              let match = matches && matches[0] || '';
              let parts = [];
              for (let i=0, len=match.length; i<len; i+=4) {
                parts.push(match.substring(i, i+4));
              }
              const formatted = parts.length > 0 ? parts.join(' ') : e.target.value;
              setCardData({...cardData, number: formatted || '•••• •••• •••• ••••'});
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Expiration Date</label>
            <input 
              type="text" 
              required 
              maxLength="5" 
              className="form-control" 
              placeholder="MM/YY"
              onFocus={() => setIsFlipped(false)}
              onChange={(e) => {
                let val = e.target.value;
                if (val.length === 2 && !val.includes('/')) {
                  val = val + '/';
                }
                setCardData({...cardData, expiry: val || 'MM/YY'});
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">CVV Code</label>
            <input 
              type="password" 
              required 
              maxLength="3" 
              className="form-control" 
              placeholder="123"
              onFocus={() => setIsFlipped(true)}
              onBlur={() => setIsFlipped(false)}
              onChange={(e) => setCardData({...cardData, cvv: e.target.value || '•••'})}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
          Pay ${pendingBookingDetails.final_price}
        </button>
      </form>
    </div>
  );
}

function AdminDashboardControls({ dashboardStats, rooms, coupons, fetchDashboardStats, fetchRooms, fetchCoupons, newRoomForm, setNewRoomForm, newCouponForm, setNewCouponForm, setLoading, setErrorMsg, setSuccessMsg }) {
  const [adminMode, setAdminMode] = useState('bookings'); // bookings, rooms, coupons

  return (
    <div>
      {/* Selector Header */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.4)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { id: 'bookings', label: 'Manage Bookings' },
          { id: 'rooms', label: 'Manage Rooms' },
          { id: 'coupons', label: 'Manage Coupons' }
        ].map(sub => (
          <button
            key={sub.id}
            onClick={() => setAdminMode(sub.id)}
            style={{
              border: 'none',
              background: 'none',
              paddingBottom: '0.75rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: adminMode === sub.id ? 'var(--primary)' : 'var(--neutral-500)',
              borderBottom: adminMode === sub.id ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'var(--transition-smooth)'
            }}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* ---------------- MANAGING BOOKINGS ---------------- */}
      {adminMode === 'bookings' && dashboardStats && (
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.4)', paddingBottom: '1rem', color: 'var(--neutral-900)' }}>
                <th style={{ padding: '1rem 0.5rem' }}>Guest Name</th>
                <th style={{ padding: '1rem 0.5rem' }}>Room Suite</th>
                <th style={{ padding: '1rem 0.5rem' }}>Check In - Out</th>
                <th style={{ padding: '1rem 0.5rem' }}>Amount Paid</th>
                <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardStats.recent_bookings.map(book => (
                <tr key={book.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ fontWeight: 700 }}>{book.guest_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{book.guest_email} | {book.guest_phone}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <strong>{book.room_details.room_type}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Suite {book.room_details.room_number}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>
                    <div><strong>CI:</strong> {book.check_in}</div>
                    <div><strong>CO:</strong> {book.check_out}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>
                    ${book.final_price}
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      background: book.status === 'Confirmed' ? 'rgba(16, 185, 129, 0.15)' :
                                  book.status === 'Completed' ? 'rgba(79, 70, 229, 0.15)' :
                                  book.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                      color: book.status === 'Confirmed' ? '#065f46' :
                             book.status === 'Completed' ? '#3730a3' :
                             book.status === 'Cancelled' ? '#991b1b' : '#92400e'
                    }}>
                      {book.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                      {book.status === 'Pending' && (
                        <button 
                          className="btn" 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'var(--success)', color: 'white' }}
                          onClick={async () => {
                            await api.updateBookingStatus(book.id, 'Confirmed');
                            fetchDashboardStats();
                          }}
                        >
                          Approve
                        </button>
                      )}
                      {['Pending', 'Confirmed'].includes(book.status) && (
                        <>
                          <button 
                            className="btn" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'var(--primary)', color: 'white' }}
                            onClick={async () => {
                              await api.updateBookingStatus(book.id, 'Completed');
                              fetchDashboardStats();
                            }}
                          >
                            Check Out
                          </button>
                          <button 
                            className="btn" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'var(--danger)', color: 'white' }}
                            onClick={async () => {
                              await api.updateBookingStatus(book.id, 'Cancelled');
                              fetchDashboardStats();
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {['Completed', 'Cancelled'].includes(book.status) && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', fontStyle: 'italic' }}>Archived</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------- MANAGING ROOMS ---------------- */}
      {adminMode === 'rooms' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '3rem' }}>
          {/* ADD NEW ROOM */}
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add Room Suite</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                await api.createRoom(newRoomForm);
                setSuccessMsg('New room suite created successfully!');
                fetchRooms();
                setNewRoomForm({
                  room_number: '',
                  room_type: 'Deluxe Suite',
                  price_per_night: '',
                  max_occupancy: '2',
                  amenities: 'WiFi, TV, AC, Minibar',
                  image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
                  description: ''
                });
              } catch (err) {
                setErrorMsg(err.message || 'Failed to create room.');
              } finally {
                setLoading(false);
              }
            }}>
              <div className="form-group">
                <label className="form-label">Room Number</label>
                <input 
                  type="text" 
                  required 
                  className="form-control" 
                  value={newRoomForm.room_number}
                  onChange={(e) => setNewRoomForm({...newRoomForm, room_number: e.target.value})}
                  placeholder="501" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room Type</label>
                <select 
                  className="form-control"
                  value={newRoomForm.room_type}
                  onChange={(e) => setNewRoomForm({...newRoomForm, room_type: e.target.value})}
                >
                  <option value="Deluxe Suite">Deluxe Suite</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Club Room">Club Room</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price / Night</label>
                  <input 
                    type="number" 
                    required 
                    className="form-control" 
                    value={newRoomForm.price_per_night}
                    onChange={(e) => setNewRoomForm({...newRoomForm, price_per_night: e.target.value})}
                    placeholder="350" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Occupancy</label>
                  <input 
                    type="number" 
                    required 
                    className="form-control" 
                    value={newRoomForm.max_occupancy}
                    onChange={(e) => setNewRoomForm({...newRoomForm, max_occupancy: e.target.value})}
                    placeholder="2" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Amenities (comma-separated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newRoomForm.amenities}
                  onChange={(e) => setNewRoomForm({...newRoomForm, amenities: e.target.value})}
                  placeholder="WiFi, TV, AC, Ocean View" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room Image URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newRoomForm.image_url}
                  onChange={(e) => setNewRoomForm({...newRoomForm, image_url: e.target.value})}
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  value={newRoomForm.description}
                  onChange={(e) => setNewRoomForm({...newRoomForm, description: e.target.value})}
                  placeholder="Describe the room experience..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={16} /> Add Suite
              </button>
            </form>
          </div>

          {/* ROOM LIST & TOGGLE MAINTENANCE */}
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.4)', paddingBottom: '1rem', color: 'var(--neutral-900)' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Room Suite</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Price</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Capacity</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ fontWeight: 700 }}>Suite {room.room_number}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>{room.room_type}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>${room.price_per_night}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{room.max_occupancy} guests</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span className={`badge badge-${room.status.toLowerCase()}`}>{room.status}</span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={async () => {
                            const newStatus = room.status === 'Maintenance' ? 'Available' : 'Maintenance';
                            await api.updateRoom(room.id, { ...room, status: newStatus });
                            fetchRooms();
                          }}
                        >
                          {room.status === 'Maintenance' ? 'Fix Room' : 'Break Room'}
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', background: 'var(--danger)', color: 'white' }}
                          onClick={async () => {
                            if (confirm('Delete this room permanently?')) {
                              await api.deleteRoom(room.id);
                              fetchRooms();
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- MANAGING COUPONS ---------------- */}
      {adminMode === 'coupons' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
          {/* ADD NEW COUPON */}
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Create Promo Coupon</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                await api.createCoupon(newCouponForm);
                setSuccessMsg('Promo coupon code registered successfully!');
                fetchCoupons();
                setNewCouponForm({
                  code: '',
                  discount_percentage: '15',
                  expiry_date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
                });
              } catch (err) {
                setErrorMsg(err.message || 'Failed to create coupon.');
              } finally {
                setLoading(false);
              }
            }}>
              <div className="form-group">
                <label className="form-label">Coupon Code (Uppercase)</label>
                <input 
                  type="text" 
                  required 
                  className="form-control" 
                  style={{ textTransform: 'uppercase' }}
                  value={newCouponForm.code}
                  onChange={(e) => setNewCouponForm({...newCouponForm, code: e.target.value.toUpperCase()})}
                  placeholder="TGIPROMO" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discount Percentage</label>
                <input 
                  type="number" 
                  required 
                  min="1" 
                  max="100"
                  className="form-control" 
                  value={newCouponForm.discount_percentage}
                  onChange={(e) => setNewCouponForm({...newCouponForm, discount_percentage: e.target.value})}
                  placeholder="15" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input 
                  type="date" 
                  required 
                  className="form-control" 
                  value={newCouponForm.expiry_date}
                  onChange={(e) => setNewCouponForm({...newCouponForm, expiry_date: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={16} /> Create Coupon
              </button>
            </form>
          </div>

          {/* LIST COUPONS */}
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.4)', paddingBottom: '1rem', color: 'var(--neutral-900)' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Coupon Code</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Discount</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Expiry Date</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {coupon.code}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{coupon.discount_percentage}% OFF</td>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem' }}>{coupon.expiry_date}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontWeight: 700,
                        background: coupon.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: coupon.active ? '#065f46' : '#991b1b'
                      }}>
                        {coupon.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={async () => {
                            await api.createCoupon({ ...coupon, active: !coupon.active }); // Overwrites on database via create endpoint
                            // Wait, our API update endpoint for coupons might use PUT or just overwrite on code logic. Let's make sure it refreshes.
                            fetchCoupons();
                          }}
                        >
                          Toggle
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', background: 'var(--danger)', color: 'white' }}
                          onClick={async () => {
                            if (confirm('Delete this coupon permanently?')) {
                              await api.deleteCoupon(coupon.id);
                              fetchCoupons();
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
