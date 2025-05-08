-- 创建数据库
CREATE DATABASE IF NOT EXISTS cookie_shop;
USE cookie_shop;

-- 创建顾客表
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT '待支付',
    delivery_address TEXT,
    delivery_status VARCHAR(20) DEFAULT '待处理',
    notes TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 创建订单项目表
CREATE TABLE IF NOT EXISTS order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 初始化产品数据
INSERT INTO products (name, description, price, stock) VALUES
('原味曲奇', '经典原味，香脆可口', 25.00, 100),
('巧克力曲奇', '浓郁的巧克力口味，松软可口', 25.00, 100),
('抹茶曲奇', '清新抹茶风味，回味无穷', 25.00, 100),
('茉莉柠檬曲奇', '茉莉花香与柠檬的完美结合', 25.00, 100),
('奥利奥曲奇', '经典奥利奥风味，浓郁香甜', 25.00, 100),
('咖啡曲奇', '醇厚咖啡香气，提神醒脑', 25.00, 100),
('威芝士曲奇', '浓郁芝士风味，咸香可口', 25.00, 100),
('伯爵红茶曲奇', '伯爵红茶香气，优雅醇厚', 25.00, 100);

-- 创建用于查看订单的视图
CREATE VIEW order_details AS
SELECT 
    o.order_id,
    c.name AS customer_name,
    c.phone AS customer_phone,
    c.email AS customer_email,
    o.order_date,
    o.total_amount,
    o.payment_method,
    o.payment_status,
    o.delivery_address,
    o.delivery_status,
    o.notes,
    GROUP_CONCAT(CONCAT(p.name, ' x', oi.quantity) SEPARATOR ', ') AS items
FROM 
    orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
GROUP BY 
    o.order_id, c.name, c.phone, c.email, o.order_date, o.total_amount, 
    o.payment_method, o.payment_status, o.delivery_address, o.delivery_status, o.notes; 