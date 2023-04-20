// Cài đặt các module cần thiết
const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

// Tạo một ứng dụng Express
const app = express();

// Kết nối tới cơ sở dữ liệu MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'my_database'
});
connection.connect();

// Đăng ký các middleware để xử lý dữ liệu từ client
app.use(express.json()); // Xử lý dữ liệu dạng JSONapiu

// Tạo một API để đăng nhập và tạo session
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra xem tên đăng nhập và mật khẩu có hợp lệ không
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  connection.query(query, (error, results, fields) => {
    if (error) throw error;

    if (results.length > 0) {
      // Tạo một access token và một refresh token
      const accessToken = jwt.sign({ userId: results[0].id }, 'my_secret_key', { expiresIn: '15m' });
      const refreshToken = jwt.sign({ userId: results[0].id }, 'my_secret_key_refresh');

      // Lưu refresh token vào cơ sở dữ liệu để sử dụng cho việc cập nhật access token
      const insertQuery = `INSERT INTO refresh_tokens (user_id, token) VALUES (${results[0].id}, '${refreshToken}')`;
      connection.query(insertQuery, (error, results, fields) => {
        if (error) throw error;

        // Lưu access token vào cookie để client gửi lại trong mỗi yêu cầu
        res.cookie('token', accessToken);

        // Gửi thông tin người dùng về cho client
        res.json({
          success: true,
          message: 'Đăng nhập thành công',
          user: {
            id: results[0].id,
            username: results[0].username,
            email: results[0].email
          }
        });
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
      });
    }
  });
});

// Tạo một API để lấy thông tin người dùng từ access token
app.get('/user', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy token'
    });
  }

  // Giải mã token để lấy thông tin người dùng
  jwt.verify(token, 'my_secret_key', (error, decoded) => {
    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    const query = `SELECT * FROM users WHERE id = ${decoded.userId}`;
    connection.query(query, (error, results, fields) => {
      if (error) throw error;

      if (results.length > 0) {
        res.json({
          success: true,
          user: {
            id: results[0].id,
            username: results[0].username,
            email: results[0].email
          }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Người dùng không tồn tại'
        });
      }
    });
  });
});

// Tạo một API để cập nhật access token từ refresh token
app.post('/refresh-token', (req, res) => {
  const refreshToken = req.body.refreshToken;

  // Kiểm tra xem refresh token có hợp lệ không
  const query = `SELECT * FROM refresh_tokens WHERE token = '${refreshToken}'`;
  connection.query(query, (error, results, fields) => {
    if (error) throw error;

    if (results.length > 0) {
      // Tạo một access token mới và trả về cho client
      const accessToken = jwt.sign({ userId: results[0].user_id }, 'my_secret_key', { expiresIn: '15m' });
      res.json({
        success: true,
        accessToken: accessToken
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Refresh token không hợp lệ'
      });
    }
  });
});

// Khởi động server
app.listen(3000, () => {
  console.log('Server đang chạy trên cổng 3000');
});