<?php
// 启动会话
session_start();

// 检查用户是否已登录
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

// 数据库连接配置
$servername = "localhost";
$username = "root";  // 请根据你的MySQL配置修改
$password = "123qwe";      // 请根据你的MySQL配置修改
$dbname = "cookie_shop";

// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);

// 检查连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}
$conn->set_charset("utf8");

// 处理订单状态更新
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'update_status') {
        $orderId = $_POST['order_id'];
        $paymentStatus = $_POST['payment_status'];
        $deliveryStatus = $_POST['delivery_status'];
        
        $stmt = $conn->prepare("UPDATE orders SET payment_status = ?, delivery_status = ? WHERE order_id = ?");
        $stmt->bind_param("ssi", $paymentStatus, $deliveryStatus, $orderId);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            $message = "订单状态已更新";
        } else {
            $error = "更新订单状态失败";
        }
        $stmt->close();
    }
}

// 获取所有订单
$orders = [];
$sql = "SELECT * FROM order_details ORDER BY order_date DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}
?>

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>乔乐 - 订单管理系统</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        :root {
            --primary-color: #748c70;
            --accent-color: #d17a46;
            --light-bg: #f8f5f2;
            --text-color: #333;
            --light-text: #666;
            --border-color: #ddd;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: Arial, sans-serif;
            background-color: var(--light-bg);
            color: var(--text-color);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background-color: var(--primary-color);
            color: white;
            padding: 1rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        h1, h2, h3 {
            margin-bottom: 1rem;
        }
        
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logout-btn {
            background-color: transparent;
            border: 1px solid white;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
            background-color: white;
            color: var(--primary-color);
        }
        
        .orders-list {
            margin-top: 2rem;
        }
        
        .order-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        
        .order-header {
            background-color: var(--primary-color);
            color: white;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .order-id {
            font-weight: bold;
        }
        
        .order-date {
            font-size: 0.9rem;
        }
        
        .order-details {
            padding: 1.5rem;
        }
        
        .customer-info, .order-items, .payment-info, .delivery-info {
            margin-bottom: 1.5rem;
        }
        
        .section-title {
            font-size: 1.1rem;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.5rem;
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 0.5rem;
        }
        
        .detail-label {
            font-weight: bold;
            width: 150px;
            color: var(--light-text);
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.3rem 0.7rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-paid {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        
        .status-shipped {
            background-color: #cce5ff;
            color: #004085;
        }
        
        .status-processing {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .order-actions {
            padding: 1rem;
            background-color: #f9f9f9;
            border-top: 1px solid var(--border-color);
        }
        
        .order-actions form {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: center;
        }
        
        .form-group {
            display: flex;
            align-items: center;
        }
        
        .form-group label {
            margin-right: 0.5rem;
            font-weight: bold;
            color: var(--light-text);
        }
        
        select {
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
        }
        
        .update-btn {
            background-color: var(--accent-color);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-left: auto;
        }
        
        .update-btn:hover {
            background-color: #b56a3d;
        }
        
        .message {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }
        
        .success-message {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        @media (max-width: 768px) {
            .detail-row {
                flex-direction: column;
            }
            
            .detail-label {
                width: 100%;
                margin-bottom: 0.3rem;
            }
            
            .order-actions form {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .update-btn {
                margin-left: 0;
                margin-top: 1rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container admin-header">
            <h1>乔乐订单管理系统</h1>
            <a href="logout.php" class="logout-btn">退出登录</a>
        </div>
    </header>
    
    <div class="container">
        <?php if(isset($message)): ?>
            <div class="message success-message"><?php echo $message; ?></div>
        <?php endif; ?>
        
        <?php if(isset($error)): ?>
            <div class="message error-message"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <div class="orders-list">
            <h2>所有订单</h2>
            
            <?php if(empty($orders)): ?>
                <p>暂无订单</p>
            <?php else: ?>
                <?php foreach($orders as $order): ?>
                    <div class="order-card">
                        <div class="order-header">
                            <div class="order-id">订单 #<?php echo $order['order_id']; ?></div>
                            <div class="order-date"><?php echo date('Y-m-d H:i', strtotime($order['order_date'])); ?></div>
                        </div>
                        
                        <div class="order-details">
                            <div class="customer-info">
                                <div class="section-title">顾客信息</div>
                                <div class="detail-row">
                                    <div class="detail-label">姓名:</div>
                                    <div><?php echo htmlspecialchars($order['customer_name']); ?></div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">电话:</div>
                                    <div><?php echo htmlspecialchars($order['customer_phone']); ?></div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">邮箱:</div>
                                    <div><?php echo htmlspecialchars($order['customer_email']); ?></div>
                                </div>
                            </div>
                            
                            <div class="order-items">
                                <div class="section-title">订单商品</div>
                                <div class="detail-row">
                                    <div><?php echo htmlspecialchars($order['items']); ?></div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">总金额:</div>
                                    <div><strong>RM<?php echo number_format($order['total_amount'], 2); ?></strong></div>
                                </div>
                            </div>
                            
                            <div class="payment-info">
                                <div class="section-title">支付信息</div>
                                <div class="detail-row">
                                    <div class="detail-label">支付方式:</div>
                                    <div><?php echo htmlspecialchars($order['payment_method']); ?></div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">支付状态:</div>
                                    <div>
                                        <?php
                                        $paymentStatusClass = '';
                                        switch($order['payment_status']) {
                                            case '已支付':
                                                $paymentStatusClass = 'status-paid';
                                                break;
                                            case '待支付':
                                                $paymentStatusClass = 'status-pending';
                                                break;
                                            default:
                                                $paymentStatusClass = '';
                                        }
                                        ?>
                                        <span class="status-badge <?php echo $paymentStatusClass; ?>">
                                            <?php echo htmlspecialchars($order['payment_status']); ?>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="delivery-info">
                                <div class="section-title">配送信息</div>
                                <div class="detail-row">
                                    <div class="detail-label">配送地址:</div>
                                    <div><?php echo htmlspecialchars($order['delivery_address']); ?></div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">配送状态:</div>
                                    <div>
                                        <?php
                                        $deliveryStatusClass = '';
                                        switch($order['delivery_status']) {
                                            case '已发货':
                                                $deliveryStatusClass = 'status-shipped';
                                                break;
                                            case '处理中':
                                                $deliveryStatusClass = 'status-processing';
                                                break;
                                            case '待处理':
                                                $deliveryStatusClass = 'status-pending';
                                                break;
                                            default:
                                                $deliveryStatusClass = '';
                                        }
                                        ?>
                                        <span class="status-badge <?php echo $deliveryStatusClass; ?>">
                                            <?php echo htmlspecialchars($order['delivery_status']); ?>
                                        </span>
                                    </div>
                                </div>
                                
                                <?php if(!empty($order['notes'])): ?>
                                <div class="detail-row">
                                    <div class="detail-label">备注:</div>
                                    <div><?php echo htmlspecialchars($order['notes']); ?></div>
                                </div>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div class="order-actions">
                            <form method="post" action="">
                                <input type="hidden" name="action" value="update_status">
                                <input type="hidden" name="order_id" value="<?php echo $order['order_id']; ?>">
                                
                                <div class="form-group">
                                    <label for="payment_status_<?php echo $order['order_id']; ?>">支付状态:</label>
                                    <select name="payment_status" id="payment_status_<?php echo $order['order_id']; ?>">
                                        <option value="待支付" <?php echo $order['payment_status'] === '待支付' ? 'selected' : ''; ?>>待支付</option>
                                        <option value="已支付" <?php echo $order['payment_status'] === '已支付' ? 'selected' : ''; ?>>已支付</option>
                                        <option value="已取消" <?php echo $order['payment_status'] === '已取消' ? 'selected' : ''; ?>>已取消</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="delivery_status_<?php echo $order['order_id']; ?>">配送状态:</label>
                                    <select name="delivery_status" id="delivery_status_<?php echo $order['order_id']; ?>">
                                        <option value="待处理" <?php echo $order['delivery_status'] === '待处理' ? 'selected' : ''; ?>>待处理</option>
                                        <option value="处理中" <?php echo $order['delivery_status'] === '处理中' ? 'selected' : ''; ?>>处理中</option>
                                        <option value="已发货" <?php echo $order['delivery_status'] === '已发货' ? 'selected' : ''; ?>>已发货</option>
                                        <option value="已完成" <?php echo $order['delivery_status'] === '已完成' ? 'selected' : ''; ?>>已完成</option>
                                        <option value="已取消" <?php echo $order['delivery_status'] === '已取消' ? 'selected' : ''; ?>>已取消</option>
                                    </select>
                                </div>
                                
                                <button type="submit" class="update-btn">更新状态</button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>

<?php
// 关闭数据库连接
$conn->close();
?> 