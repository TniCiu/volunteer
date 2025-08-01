# Time Utilities Library

Thư viện xử lý thời gian cho ứng dụng quản lý tình nguyện viên, sử dụng thư viện `dayjs` để xử lý ngày giờ.

## Cài đặt

```bash
npm install dayjs
# hoặc
yarn add dayjs
```

## Các hàm tiện ích

### 1. `formatDate(date, format)`
Định dạng ngày tháng
```javascript
import { formatDate } from './utils/timeUtils';

formatDate('2024-01-15'); // "15/01/2024"
formatDate('2024-01-15', 'YYYY-MM-DD'); // "2024-01-15"
```

### 2. `formatDateTime(date, format)`
Định dạng ngày giờ
```javascript
import { formatDateTime } from './utils/timeUtils';

formatDateTime('2024-01-15T10:30:00'); // "15/01/2024 10:30"
formatDateTime('2024-01-15T10:30:00', 'DD/MM/YYYY HH:mm:ss'); // "15/01/2024 10:30:00"
```

### 3. `getRelativeTime(date)`
Lấy thời gian tương đối
```javascript
import { getRelativeTime } from './utils/timeUtils';

getRelativeTime('2024-01-15T10:30:00'); // "2 giờ trước", "3 ngày trước"
```

### 4. `getTimeUntilEvent(eventDate)`
Lấy thời gian còn lại đến sự kiện
```javascript
import { getTimeUntilEvent } from './utils/timeUtils';

getTimeUntilEvent('2024-01-20T10:30:00'); // "5 ngày nữa", "2 giờ nữa"
```

### 5. `formatEventDuration(startDate, endDate)`
Định dạng thời gian diễn ra sự kiện
```javascript
import { formatEventDuration } from './utils/timeUtils';

formatEventDuration('2024-01-15T10:00:00', '2024-01-15T16:00:00');
// "15/01/2024 từ 10:00 - 16:00"

formatEventDuration('2024-01-15T10:00:00', '2024-01-16T16:00:00');
// "Từ 15/01/2024 10:00 đến 16/01/2024 16:00"
```

### 6. `isPast(date)`, `isFuture(date)`, `isToday(date)`
Kiểm tra trạng thái thời gian
```javascript
import { isPast, isFuture, isToday } from './utils/timeUtils';

isPast('2024-01-10'); // true
isFuture('2024-01-20'); // true
isToday('2024-01-15'); // true nếu hôm nay là 15/01/2024
```

## Ví dụ sử dụng trong component

```javascript
import React from 'react';
import { 
  formatDateTime, 
  getTimeUntilEvent, 
  isFuture 
} from '../utils/timeUtils';

const ActivityCard = ({ activity }) => {
  return (
    <div>
      <h3>{activity.title}</h3>
      <p>Thời gian: {formatDateTime(activity.startDate)}</p>
      <p>Còn lại: {getTimeUntilEvent(activity.startDate)}</p>
      {isFuture(activity.startDate) && (
        <button>Đăng ký tham gia</button>
      )}
    </div>
  );
};
```

## Tính năng

- ✅ Hỗ trợ tiếng Việt
- ✅ Định dạng ngày giờ linh hoạt
- ✅ Thời gian tương đối
- ✅ Kiểm tra trạng thái sự kiện
- ✅ Xử lý múi giờ
- ✅ Nhẹ và hiệu suất cao

## Lưu ý

- Tất cả các hàm đều hỗ trợ cả chuỗi ngày và đối tượng Date
- Mặc định sử dụng định dạng ngày Việt Nam (DD/MM/YYYY)
- Thời gian được hiển thị bằng tiếng Việt 