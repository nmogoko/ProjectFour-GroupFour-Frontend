const isTokenExpired = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedToken = JSON.parse(atob(base64));
  const currentTime = Math.floor(Date.now() / 1000);

  return decodedToken.exp < currentTime;
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const response = await fetch(
    "https://projectfour-groupfour-api.onrender.com//refresh-token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("access_token", data.access_token);
  } else {
    // Handle refresh failure, e.g., redirect to login
    localStorage.removeItem("access_token");
    window.location.href = "/signin";
  }
};

export const fetchWithAuth = async (url, options) => {
  let token = localStorage.getItem("access_token");

  console.log(token);
  console.log(isTokenExpired(token));

  if (isTokenExpired(token)) {
    await refreshAccessToken();
    token = localStorage.getItem("access_token");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
