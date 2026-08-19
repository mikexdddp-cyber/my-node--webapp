// 1. นำเข้า Framework และโมดูลที่จำเป็น
const express = require("express");
require("dotenv").config();

// 2. สร้างตัวแปร app เพื่อแทนตัวแอปพลิเคชัน
const app = express();

// 3. กำหนดพอร์ตจากไฟล์ .env (ถ้าไม่มีให้ใช้พอร์ต 8080)
const port = process.env.PORT || 8080;

// 4. การตั้งค่า (Configuration) ให้ Framework รู้จักโฟลเดอร์ปัจจุบัน
app.use(express.static("public")); // อนุญาตให้อ่านไฟล์จากโฟลเดอร์ public
app.set("views", "./views"); // บอกตำแหน่งไฟล์ต่างๆ
app.set("view engine", "ejs"); // กำหนด Template Engine ที่ชื่อ

app.get("/", (req, res) => {
  res.render("index", {
    title: "หน้าเเรก- เว็บเเอปพลิเคชั่น",
    username: "นักศึกษา ปวส.",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "เกี่ยวกับเรา",
  });
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const userRoutes = require("./routes/users");

app.get("/register", (req, res) => {
  res.render("register", {
    title: "./?/./>> ",
    message: null,
  });
});

app.post("/register", async (req, res) => {
  // ดึงข้อมูลจาก req.body
  const { username, email, password } = req.body;

  // 1. ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
  if (!username || !email || !password) {
    return res.render("register", {
      title: "สมัครสมาชิก",
      message: "กรุณากรอกข้อมูลให้ครบทุกช่องก่อน!",
      messageType: "danger", // Bootstrap สีแดง
    });
  }

  // 2. ตรวจสอบความยาวของรหัสผ่าน
  if (password.length < 6) {
    return res.render("register", {
      title: "สมัครสมาชิก",
      message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
      messageType: "warning", // สีเหลือง
    });
  }

  try {
    // 3. ใช้ Parameterized Query ป้องกัน SQL Injection
    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const values = [username, email, password];

    // 4. สั่ง Execute คำสั่ง SQL
    await db.query(sql, values);

    // 5. เมื่อบันทึกสำเร็จ ให้ Redirect ไปยังหน้ารายชื่อผู้ใช้งาน
    res.redirect("/users");
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);

    // จัดการกรณีอีเมลซ้ำ (ตามที่ตั้งค่า UNIQUE ไว้ในฐานข้อมูล)
    if (error.code === "ER_DUP_ENTRY") {
      return res.render("register", {
        title: "สมัครสมาชิก",
        message: "อีเมลนี้มีในระบบแล้ว กรุณาใช้อีเมลอื่น",
        messageType: "warning",
      });
    }

    res.status(500).send("เกิดข้อผิดพลาดที่เซิร์ฟเวอร์");
  }
});
// เชื่อมต่อฐานข้อมูล
const db = require("./config/db");

// สร้าง Route /users
app.get("/users", async (req, res) => {
  try {
    // คำสั่ง SQL ดึงข้อมูลผู้ใช้ เรียงจาก ID ล่าสุดลงไป
    const [rows] = await db.query(
      "SELECT id, username, email, created_at FROM users ORDER BY id DESC",
    );

    // ส่งข้อมูลไปยัง users.ejs
    res.render("users", {
      title: "รายชื่อผู้ใช้งาน",
      users_data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูล");
  }
});

// สร้าง Route /products เพื่อแสดงรายการสินค้า
app.get("/products", async (req, res) => {
  try {
    // คำสั่ง SQL ดึงข้อมูลสินค้าทั้งหมดจากตาราง product
    // หมายเหตุ: เนื่องจากชื่อคอลัมน์ price(baht) มีวงเล็บ เลยต้องครอบด้วยเครื่องหมาย ` ` (Backtick)
    const [rows] = await db.query(
      "SELECT product_id, product_name, category, `price(baht)`, stock, note FROM product"
    );

    // ส่งข้อมูลไปยังไฟล์ products.ejs
    res.render("products", {
      title: "รายการสินค้า Roblox",
      products_data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");
  }
});
app.listen(port, () => {
  console.log(`Server is running strongly on http://localhost:${port}`);
});
