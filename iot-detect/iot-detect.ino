#include <WiFi.h>
#include <HTTPClient.h>

// ✅ กำหนดค่าการเชื่อมต่อ WiFi
const char* ssid = "Pleum";         
const char* password = "112233445566";  

// ✅ กำหนดค่า API ของ Strapi
const char* strapi_base_url = "http://35.186.145.183:1337/api/cars/1";  // URL หลัก
const char* strapi_checkpoint_url = "http://35.186.145.183:1337/api/cars/1/checkpoint";  // URL สำหรับ checkpoint

#define IR_SENSOR_PIN  33  // ขาเซ็นเซอร์ IR

bool lastState = false; // เก็บสถานะของเซนเซอร์ก่อนหน้า

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.println("🔄 กำลังเชื่อมต่อ WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\n✅ เชื่อมต่อ WiFi สำเร็จ!");
  Serial.print("📶 IP Address: ");
  Serial.println(WiFi.localIP());

  pinMode(IR_SENSOR_PIN, INPUT);

  // 🔹 รอจนกว่าเซ็นเซอร์ IR จะไม่ตรวจจับวัตถุ
  while (digitalRead(IR_SENSOR_PIN) == HIGH) {  // แก้ไขเงื่อนไขให้ถูกต้อง
    Serial.println("🛑 รอจนกว่าเซ็นเซอร์ IR จะไม่ตรวจจับวัตถุ...");
    delay(500);
  }

  // 🔹 ทดสอบการเชื่อมต่อ Strapi
  testStrapiConnection();
}

void loop() {
  bool currentState = digitalRead(IR_SENSOR_PIN);

  if (currentState == HIGH && lastState == LOW) {
    Serial.println("🚀 Object detected! Updating checkpoint1...");
    updateCheckpoint();
  }

  lastState = currentState;
  delay(500);
}

// ✅ ฟังก์ชันทดสอบการเชื่อมต่อ Strapi
void testStrapiConnection() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi ไม่ได้เชื่อมต่อ!");
    return;
  }

  HTTPClient http;
  http.begin(strapi_base_url);  // ใช้ URL หลักสำหรับทดสอบ

  int httpResponseCode = http.GET();
  if (httpResponseCode == 200) {
    String response = http.getString();
    Serial.println("✅ เชื่อมต่อ Strapi สำเร็จ!");
    Serial.println("📥 Response:");
    Serial.println(response);

    // แสดงเฉพาะข้อมูล checkpoint
    displayCheckpoints(response);
  } else {
    Serial.println("❌ ไม่สามารถเชื่อมต่อ Strapi (Error: " + String(httpResponseCode) + ")");
  }

  http.end();
}

// ✅ ฟังก์ชันอัปเดตค่า Checkpoint ใน Strapi
void updateCheckpoint() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi ไม่ได้เชื่อมต่อ!");
    return;
  }

  HTTPClient http;
  http.begin(strapi_checkpoint_url);  // ใช้ URL เฉพาะสำหรับ checkpoint
  http.addHeader("Content-Type", "application/json");  // เพิ่มเฉพาะ header นี้

  // ข้อมูล JSON ที่ต้องการส่งไป
  String jsonPayload = "{\"checkpoint1\": true}";  // ข้อมูลที่ส่งไปใน body

  // ส่งข้อมูลในรูปแบบ POST
  int httpResponseCode = http.POST(jsonPayload);
  if (httpResponseCode == 200) {
    Serial.println("✅ อัปเดต Checkpoint สำเร็จ! ");

    // แสดงข้อความที่ส่งกลับจาก Strapi หลังการอัปเดต
    String response = http.getString();
    Serial.println("📥 Response from Strapi after update:");
    Serial.println(response);

    // แสดงเฉพาะข้อมูล checkpoint
    displayCheckpoints(response);
  } else {
    Serial.println("❌ Error: " + String(httpResponseCode));
    Serial.println("🔍 กรุณาตรวจสอบ URL หรือการตั้งค่า Strapi");
  }

  http.end();
}

// ✅ ฟังก์ชันแสดงเฉพาะข้อมูล checkpoint
void displayCheckpoints(String jsonResponse) {
  // ค้นหาตำแหน่งของ checkpoint1
  int checkpoint1Index = jsonResponse.indexOf("\"checkpoint1\":");
  if (checkpoint1Index != -1) {
    int checkpoint1ValueIndex = checkpoint1Index + 13; // ขยับไปยังค่าของ checkpoint1
    String checkpoint1Value = jsonResponse.substring(checkpoint1ValueIndex, jsonResponse.indexOf(",", checkpoint1ValueIndex));
    Serial.println("🔹 checkpoint1: " + checkpoint1Value);
  }

  // ค้นหาตำแหน่งของ checkpoint2
  int checkpoint2Index = jsonResponse.indexOf("\"checkpoint2\":");
  if (checkpoint2Index != -1) {
    int checkpoint2ValueIndex = checkpoint2Index + 13; // ขยับไปยังค่าของ checkpoint2
    String checkpoint2Value = jsonResponse.substring(checkpoint2ValueIndex, jsonResponse.indexOf(",", checkpoint2ValueIndex));
    Serial.println("🔹 checkpoint2: " + checkpoint2Value);
  }

  // ค้นหาตำแหน่งของ checkpoint3
  int checkpoint3Index = jsonResponse.indexOf("\"checkpoint3\":");
  if (checkpoint3Index != -1) {
    int checkpoint3ValueIndex = checkpoint3Index + 13; // ขยับไปยังค่าของ checkpoint3
    String checkpoint3Value = jsonResponse.substring(checkpoint3ValueIndex, jsonResponse.indexOf(",", checkpoint3ValueIndex));
    Serial.println("🔹 checkpoint3: " + checkpoint3Value);
  }
}