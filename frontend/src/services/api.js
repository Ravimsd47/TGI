const API_BASE = "http://127.0.0.1:8080/api";

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const api = {
  // Rooms
  getRooms: async () => {
    const res = await fetch(`${API_BASE}/rooms/`);
    return handleResponse(res);
  },
  searchRooms: async (checkIn, checkOut, occupancy) => {
    let url = `${API_BASE}/rooms/search/`;
    const params = [];
    if (checkIn) params.push(`check_in=${checkIn}`);
    if (checkOut) params.push(`check_out=${checkOut}`);
    if (occupancy) params.push(`occupancy=${occupancy}`);
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    const res = await fetch(url);
    return handleResponse(res);
  },
  createRoom: async (roomData) => {
    const res = await fetch(`${API_BASE}/rooms/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData)
    });
    return handleResponse(res);
  },
  updateRoom: async (id, roomData) => {
    const res = await fetch(`${API_BASE}/rooms/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData)
    });
    return handleResponse(res);
  },
  deleteRoom: async (id) => {
    const res = await fetch(`${API_BASE}/rooms/${id}/`, {
      method: "DELETE"
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return true;
  },

  // Coupons
  getCoupons: async () => {
    const res = await fetch(`${API_BASE}/coupons/`);
    return handleResponse(res);
  },
  validateCoupon: async (code) => {
    const res = await fetch(`${API_BASE}/coupons/validate/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    return handleResponse(res);
  },
  createCoupon: async (couponData) => {
    const res = await fetch(`${API_BASE}/coupons/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(couponData)
    });
    return handleResponse(res);
  },
  deleteCoupon: async (id) => {
    const res = await fetch(`${API_BASE}/coupons/${id}/`, {
      method: "DELETE"
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return true;
  },

  // Bookings
  getBookings: async () => {
    const res = await fetch(`${API_BASE}/bookings/`);
    return handleResponse(res);
  },
  createBooking: async (bookingData) => {
    const res = await fetch(`${API_BASE}/bookings/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData)
    });
    return handleResponse(res);
  },
  updateBookingStatus: async (id, statusVal) => {
    const res = await fetch(`${API_BASE}/bookings/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusVal })
    });
    return handleResponse(res);
  },

  // Payments
  createPayment: async (paymentData) => {
    const res = await fetch(`${API_BASE}/payments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData)
    });
    return handleResponse(res);
  },

  // Admin Dashboard Statistics
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard/`);
    return handleResponse(res);
  },

  // Reports
  getReportsData: async () => {
    const res = await fetch(`${API_BASE}/admin/reports/`);
    return handleResponse(res);
  }
};
