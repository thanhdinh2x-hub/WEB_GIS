/**
 * Gửi yêu cầu từ Frontend đến Express Backend.
 *
 * Frontend → Express.js → OneHousing API
 */

export async function fetchParcel(lat, lng, signal) {

  // 1. Tạo tham số tọa độ
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng)
  });

  // 2. Gửi HTTP GET request đến Express
  const response = await fetch(`/api/parcel?${params}`, {
    method: 'GET',
    cache: 'no-store',
    signal
  });

  // 3. Đọc JSON mà Express trả về
  const body = await response.json();

  // 4. Kiểm tra lỗi
  if (!response.ok || !body.ok) {
    throw new Error(body.error || `HTTP ${response.status}`);
  }

  // 5. Trả dữ liệu cho main.js
  return body.result || {};
}