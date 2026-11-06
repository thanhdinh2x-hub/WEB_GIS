# WebGIS OneHousing — Express.js + Leaflet

Đây là bản **chuyển đổi từ file Python duy nhất** sang project Express.js, tách backend và frontend. Chức năng chính vẫn là chọn điểm trên bản đồ, tra cứu thửa đất qua OneHousing API, hiển thị thông tin và vẽ polygon nếu API cung cấp hình học.

## 1. Cấu trúc thư mục

```text
webgis-onehousing-express/
├── package.json                 # Thư viện và lệnh npm
├── .env.example                 # Mẫu cấu hình (không chứa token)
├── .gitignore                   # Ngăn commit .env và node_modules
├── README.md
├── src/                         # BACKEND EXPRESS
│   ├── server.js                # Mở cổng HTTP 127.0.0.1:8765
│   ├── app.js                   # Cấu hình Express, static, API
│   ├── config/
│   │   └── env.js               # Đọc PORT, Bearer token
│   ├── routes/
│   │   └── parcel.routes.js     # Định tuyến GET /api/parcel
│   ├── middleware/
│   │   └── validate-coordinates.js # Kiểm tra lat/lng
│   ├── controllers/
│   │   └── parcel.controller.js # Xử lý request/response
│   └── services/
│       └── onehousing.service.js # Gửi HTTP request đến OneHousing
└── public/                      # FRONTEND (trình duyệt)
    ├── index.html               # Bố cục giao diện
    ├── css/
    │   └── style.css            # Màu sắc, layout, mobile
    └── js/
        ├── main.js              # Click, nhập tọa độ, nối các module
        ├── api.js               # fetch() đến Express
        ├── map.js               # Leaflet, marker, polygon
        ├── ui.js                # Đổ thông tin vào sidebar
        └── geometry.js          # Kiểm tra điểm thuộc polygon