# WebSocket Setup cho Real-time Registration Updates

## Cài đặt Dependencies

### Frontend (volunteer-management)
```bash
cd volunteer-management
npm install socket.io-client
```

### Backend (volunteer-management-BE)
Socket.io đã được cài đặt sẵn trong backend.

## Cấu trúc WebSocket

### Backend Changes

1. **Socket Functions** (`volunteer-management-BE/src/socket/index.js`):
   - `emitRegistrationStatusUpdate(userId, data)`: Gửi cập nhật trạng thái đăng ký
   - `emitNewRegistration(adminUserIds, data)`: Thông báo đăng ký mới cho admin

2. **Controller Updates** (`volunteer-management-BE/src/controllers/activityRegistration.controller.js`):
   - Tự động emit WebSocket khi admin cập nhật trạng thái
   - Thông báo cho admin khi có đăng ký mới với thông tin chi tiết

3. **Model Updates** (`volunteer-management-BE/src/models/activityRegistration.model.js`):
   - Trả về đầy đủ thông tin registration sau khi update

### Frontend Changes

1. **SocketContext** (`volunteer-management/src/contexts/SocketContext.jsx`):
   - Quản lý kết nối WebSocket
   - Lắng nghe các sự kiện real-time
   - Hiển thị thông báo toast (chỉ cho admin)

2. **SocketStatus Component** (`volunteer-management/src/components/SocketStatus.jsx`):
   - Hiển thị trạng thái kết nối real-time (chỉ cho admin)
   - Debug information trong development mode

3. **NotificationList Component** (`volunteer-management/src/pages/view/admin/dashboard/notifications/index.jsx`):
   - Hiển thị danh sách thông báo real-time
   - Tự động thêm thông báo đăng ký mới
   - Click để chuyển đến RegistrationManager

4. **NotificationBadge Component** (`volunteer-management/src/components/NotificationBadge.jsx`):
   - Hiển thị số lượng thông báo chưa đọc trên AppBar
   - Chỉ hiển thị cho admin

5. **ErrorBoundary Component** (`volunteer-management/src/components/ErrorBoundary.jsx`):
   - Bắt lỗi React và hiển thị UI thân thiện
   - Ngăn chặn crash toàn bộ ứng dụng

6. **Component Updates**:
   - `ActivityDetail`: Cập nhật trạng thái đăng ký real-time
   - `Activity`: Cập nhật danh sách hoạt động real-time
   - `RegistrationManager`: Cập nhật danh sách đăng ký real-time

## Cách hoạt động

### 1. Khi User đăng ký hoạt động:
1. User submit form đăng ký
2. Backend tạo đăng ký mới
3. Backend lấy thông tin hoạt động và user
4. Backend emit `newRegistration` event với thông tin chi tiết
5. Frontend nhận event và thêm vào danh sách thông báo
6. Admin nhận thông báo toast

### 2. Khi Admin xét duyệt đăng ký:
1. Admin thay đổi trạng thái trong RegistrationManager
2. Backend cập nhật database
3. Backend emit `registrationStatusUpdate` event
4. Frontend nhận event và cập nhật UI real-time
5. User nhận thông báo toast

### 3. Khi Admin click vào thông báo:
1. Admin click vào thông báo đăng ký mới
2. API được gọi để đánh dấu thông báo đã đọc
3. Tự động chuyển đến trang RegistrationManager
4. Badge cập nhật số lượng thông báo

## API Endpoints

### 1. Lấy thông báo đăng ký mới:
```
GET /v1/notifications/registrations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "registrationId": "123",
      "activityId": "456",
      "userId": "789",
      "title": "Đăng ký mới: Hiến máu nhân đạo",
      "message": "Nguyễn Văn A đã đăng ký tham gia \"Hiến máu nhân đạo\" (2024-01-15)",
      "type": "registration",
      "is_read": false,
      "created_at": "2024-01-01T00:00:00.000Z",
      "priority": "high",
      "userInfo": {
        "full_name": "Nguyễn Văn A",
        "email": "nguyenvana@email.com",
        "phone": "0123456789"
      },
      "activityInfo": {
        "title": "Hiến máu nhân đạo",
        "date": "2024-01-15",
        "location": "Bệnh viện Chợ Rẫy"
      }
    }
  ],
  "message": "Có 1 thông báo đăng ký mới"
}
```

### 2. Đánh dấu thông báo đã đọc:
```
PUT /v1/notifications/registrations/:notificationId/read
```

**Response:**
```json
{
  "success": true,
  "message": "Đã đánh dấu thông báo là đã đọc"
}
```

## Ưu điểm của hệ thống API + WebSocket

### 1. Dữ liệu đầy đủ:
- API cung cấp tất cả thông báo đăng ký pending
- WebSocket cung cấp cập nhật real-time
- Kết hợp cả hai để có trải nghiệm tốt nhất

### 2. Hiệu suất cao:
- API load dữ liệu ban đầu nhanh chóng
- WebSocket cập nhật real-time không cần refresh
- Cache dữ liệu ở frontend

### 3. Độ tin cậy:
- API đảm bảo dữ liệu không bị mất
- WebSocket cung cấp cập nhật ngay lập tức
- Fallback khi WebSocket không hoạt động

### 4. Quản lý trạng thái:
- API lưu trạng thái đã đọc
- Frontend cập nhật UI theo thời gian thực
- Đồng bộ giữa client và server

## Events

### Backend → Frontend
- `registrationStatusUpdate`: Cập nhật trạng thái đăng ký
- `newRegistration`: Thông báo đăng ký mới

### Data Format
```javascript
// registrationStatusUpdate
{
  registrationId: "123",
  activityId: "456", 
  status: "approved|rejected|pending",
  message: "Đơn đăng ký đã được duyệt",
  timestamp: "2024-01-01T00:00:00.000Z"
}

// newRegistration
{
  registrationId: "123",
  activityId: "456",
  userId: "789",
  status: "pending",
  message: "Có đăng ký mới cần xét duyệt",
  timestamp: "2024-01-01T00:00:00.000Z",
  userInfo: {
    full_name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123456789"
  },
  activityInfo: {
    title: "Hiến máu nhân đạo",
    date: "2024-01-15",
    location: "Bệnh viện Chợ Rẫy"
  }
}
```

## Testing

1. **Start Backend**:
   ```bash
   cd volunteer-management-BE
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd volunteer-management
   npm run dev
   ```

3. **Test Flow**:
   - User đăng ký hoạt động
   - Kiểm tra admin nhận thông báo real-time
   - Admin click vào thông báo để chuyển đến RegistrationManager
   - Admin xét duyệt đăng ký
   - Kiểm tra User nhận thông báo real-time

## Debug & Troubleshooting

### 1. Kiểm tra kết nối Socket
- Mở Developer Tools → Console
- Tìm các log có emoji: 🔌, ✅, ❌, 📨, 📤
- Kiểm tra SocketStatus component ở góc phải dưới (chỉ admin)

### 2. Socket không kết nối
**Nguyên nhân có thể:**
- Backend không chạy hoặc sai port
- CORS settings
- Token/userId không tồn tại trong localStorage

**Cách khắc phục:**
```bash
# Kiểm tra backend đang chạy
curl http://localhost:5000

# Kiểm tra localStorage
localStorage.getItem('token')
localStorage.getItem('id')
localStorage.getItem('role')
```

### 3. Không nhận được thông báo đăng ký mới
**Nguyên nhân có thể:**
- User chưa đăng nhập
- Role không đúng (cần admin)
- Socket không join đúng room

**Cách khắc phục:**
- Kiểm tra console logs
- Đảm bảo user có role admin
- Kiểm tra NotificationList component

### 4. Backend không emit events
**Nguyên nhân có thể:**
- Model không trả về đúng data
- Controller không nhận được user_id
- Socket io chưa được khởi tạo

**Cách khắc phục:**
- Kiểm tra console logs của backend
- Đảm bảo createRegistration trả về đầy đủ thông tin
- Kiểm tra server.js đã import và init socket

### 5. Lỗi "Maximum update depth exceeded"
**Nguyên nhân:**
- Infinite loop trong useEffect
- Function trong dependency array được tạo mới mỗi lần render
- Component re-render liên tục

**Cách khắc phục:**
```javascript
// ❌ Sai - function được tạo mới mỗi lần render
useEffect(() => {
  // logic
}, [someFunction]);

// ✅ Đúng - sử dụng useCallback
const someFunction = useCallback(() => {
  // logic
}, []);

useEffect(() => {
  // logic
}, [someFunction]);
```

**Đã sửa trong code:**
- Sử dụng `useCallback` cho `getStatusText`, `getStatusColor`, `clearUpdates`
- Loại bỏ function khỏi dependency array
- Thêm `useRef` để tránh gọi API quá nhiều lần
- Thêm ErrorBoundary để bắt lỗi

### 6. Performance Issues
- Socket connection được tự động cleanup
- Registration updates được giới hạn 10 items
- Toast notifications có auto-close
- Sử dụng `useRef` để tránh duplicate API calls

### 7. Common Error Messages
```
❌ Socket: No token or userId, skipping connection
→ User chưa đăng nhập

❌ Socket connection error
→ Backend không chạy hoặc sai port

❌ emitRegistrationStatusUpdate: io or userId not available
→ Socket chưa được khởi tạo hoặc thiếu user_id

📤 Emitting registrationStatusUpdate to user: 123
👥 Clients in room user:123: 0
→ User không online hoặc chưa join room

Maximum update depth exceeded
→ Infinite loop trong useEffect, cần sử dụng useCallback
```

## Development Tips

1. **Enable Debug Mode**: Mở Developer Tools để xem console logs
2. **SocketStatus Component**: Hiển thị trạng thái kết nối real-time (chỉ admin)
3. **Toast Notifications**: Hiển thị thông báo khi có updates
4. **Auto Reconnect**: Socket tự động kết nối lại khi mất kết nối
5. **ErrorBoundary**: Bắt lỗi React và hiển thị UI thân thiện
6. **useCallback**: Sử dụng cho functions trong dependency arrays
7. **useRef**: Tránh duplicate API calls và infinite loops
8. **Notification System**: Thông báo real-time cho admin khi có đăng ký mới
9. **Role-based UI**: Chỉ hiển thị thông báo và socket status cho admin 