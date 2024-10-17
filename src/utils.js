const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await fetch('https://projectfour-groupfour-api.onrender.com//refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('access_token', data.access_token);
    } else {
      // Handle refresh failure, e.g., redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/signin';
    }
};

const fetchWithAuth = async (url, options) => {
    let token = localStorage.getItem('access_token');
  
    console.log(token);
    // Example check for expiration (you can decode the JWT to get expiration time)
    const isExpired = false; // Replace this with your expiration check
  
    if (isExpired) {
      await refreshAccessToken();
      token = localStorage.getItem('access_token');
    }
  
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
};