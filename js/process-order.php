<?php
// 数据库连接配置
$servername = "localhost";
$username = "root";  // 请根据你的MySQL配置修改
$password = "";      // 请根据你的MySQL配置修改
$dbname = "cookie_shop";

// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);

// 检查连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}
$conn->set_charset("utf8");

// 获取POST数据
$data = json_decode(file_get_contents('php://input'), true);

// 检查必要数据
if (!isset($data['customer']) || !isset($data['items']) || !isset($data['paymentMethod'])) {
    echo json_encode(['status' => 'error', 'message' => '数据不完整']);
    exit;
}

// 开始事务
$conn->begin_transaction();

try {
    // 1. 添加顾客信息
    $stmt = $conn->prepare("INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", 
        $data['customer']['name'], 
        $data['customer']['email'], 
        $data['customer']['phone'], 
        $data['customer']['address']
    );
    $stmt->execute();
    $customerId = $conn->insert_id;
    $stmt->close();
    
    // 2. 创建订单
    $stmt = $conn->prepare("INSERT INTO orders (customer_id, total_amount, payment_method, delivery_address, notes) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("idsss", 
        $customerId, 
        $data['totalAmount'], 
        $data['paymentMethod'], 
        $data['customer']['address'],
        $data['notes'] ?? ''
    );
    $stmt->execute();
    $orderId = $conn->insert_id;
    $stmt->close();
    
    // 3. 添加订单项目
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)");
    
    foreach ($data['items'] as $item) {
        $stmt->bind_param("iiid", 
            $orderId, 
            $item['id'], 
            $item['quantity'], 
            $item['price']
        );
        $stmt->execute();
    }
    $stmt->close();
    
    // 4. 更新库存（如果需要）
    $stmt = $conn->prepare("UPDATE products SET stock = stock - ? WHERE product_id = ?");
    
    foreach ($data['items'] as $item) {
        $stmt->bind_param("ii", 
            $item['quantity'], 
            $item['id']
        );
        $stmt->execute();
    }
    $stmt->close();
    
    // 提交事务
    $conn->commit();
    
    // 返回成功
    echo json_encode([
        'status' => 'success', 
        'message' => '订单已成功提交', 
        'orderId' => $orderId
    ]);
} catch (Exception $e) {
    // 回滚事务
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => '处理订单时出错: ' . $e->getMessage()]);
}

// 关闭连接
$conn->close();
?> 