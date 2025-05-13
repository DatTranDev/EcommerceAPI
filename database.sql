drop database if exists EcommerceDB;
create database EcommerceDB;
use EcommerceDB;

-- User table
create table User (
    id int auto_increment primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(100) not null,
    isAdmin boolean not null default false,
    phone varchar(20),
    createdAt datetime default current_timestamp
);

-- Address table
create table Address (
    id int auto_increment primary key,
    phone varchar(20),
    street varchar(255) not null,
    commune varchar(100) not null,
    district varchar(100) not null,
    province varchar(100) not null,
    note varchar(100),
    country varchar(100) default 'Việt Nam'
);

-- UserAddress table
create table UserAddress (
    userId int not null,
    addressId int not null,
    isDefault boolean default false,
    housingType ENUM('Nhà riêng', 'Công ty') default 'Nhà riêng',
    primary key (userId, addressId),
    foreign key (userId) references User(id) on delete cascade,
    foreign key (addressId) references Address(id) on delete cascade
);

-- Store table
create table Store (
    id int auto_increment primary key,
    name varchar(100),
    description text,
    isDeleted boolean default false
);

-- StoreAddress table
create table StoreAddress (
    storeId int not null,
    addressId int not null,
    isMain boolean default false,
    primary key (storeId, addressId),
    foreign key (storeId) references Store(id),
    foreign key (addressId) references Address(id) on delete cascade
);

-- Category table
create table Category (
    id int auto_increment primary key,
    name varchar(100) not null,
    parentId int null,
    foreign key (parentId) references Category(id) on delete cascade
);
-- Product table
create table Product (
    id int auto_increment primary key,
    name varchar(100) not null,
    describes varchar(1000),
    model varchar(100),
    original varchar(100),
    isDeleted boolean default false
);

-- ProductCategory table (product has multiple categories)
create table ProductCategory (
    productId int not null,
    categoryId int not null,
    primary key (productId, categoryId),
    foreign key (productId) references Product(id),
    foreign key (categoryId) references Category(id) on delete cascade
);


-- ProductItem table
create table ProductItem (
    id int auto_increment primary key,
    productId int not null,
    sku varchar(50) unique not null,
    price decimal(10,2) not null,
    imageUrl varchar(255),
    discountType enum('FIXED', 'PERCENT') default null,
    discountValue decimal(10, 2) default 0,
    isDeleted boolean default false,
    foreign key (productId) references Product(id),
    check (
        (discountType = 'PERCENT' and discountValue <= 100)
        or (discountType = 'FIXED' and discountValue <= price)
        or (discountType is null)
    )
);

-- Variation table
create table Variation (
    id int auto_increment primary key,
    productId int not null,
    name varchar(50) not null,
    isDeleted boolean default false,
    foreign key (productId) references Product(id)
);

-- VariationOption table
create table VariationOption (
    id int auto_increment primary key,
    variationId int not null,
    value varchar(50) not null,
    isDeleted boolean default false,
    foreign key (variationId) references Variation(id)
);

-- ProductConfig table
create table ProductConfig (
    productItemId int not null,
    variationOptionId int not null,
    primary key (productItemId, variationOptionId),
    foreign key (productItemId) references ProductItem(id),
    foreign key (variationOptionId) references VariationOption(id)
);

-- Inventory table
create table Inventory (
    storeId int not null,
    productItemId int not null,
    quantity int default 0,
    status ENUM('in_stock', 'out_of_stock', 'discontinued') DEFAULT 'out_of_stock',
    primary key (storeId, productItemId),
    foreign key (storeId) references Store(id),
    foreign key (productItemId) references ProductItem(id)
);

-- OrderStatus table
create table OrderStatus (
    id int auto_increment primary key,
    name varchar(50) not null
);

-- ShippingMethod table
create table ShippingMethod (
    id int auto_increment primary key,
    name varchar(100) not null,
    cost decimal(10,2)
);

-- PaymentMethod table
create table PaymentMethod (
    id int auto_increment primary key,
    name varchar(100) not null
);

-- Payment table
create table Payment (
    id int auto_increment primary key,
    methodId int not null,
    paidAt datetime,
    amount decimal(10,2) not null,
    foreign key (methodId) references PaymentMethod(id)
);

-- ShopOrder table
create table ShopOrder (
    id int auto_increment primary key,
    userId int not null,
    orderDate datetime default current_timestamp,
    statusId int not null,
    shippingMethodId int not null,
    paymentId int not null,
    shippingAddressId int not null,
    total decimal(10,2) not null,
    foreign key (userId) references User(id),
    foreign key (statusId) references OrderStatus(id),
    foreign key (shippingMethodId) references ShippingMethod(id),
    foreign key (paymentId) references Payment(id),
    foreign key (shippingAddressId) references Address(id)
);

-- OrderItem table
create table OrderItem (
    orderId int not null,
    productItemId int not null,
    quantity int not null,
    storeId int not null,
    price decimal(10,2) not null,
    primary key (orderId, productItemId),
    foreign key (orderId) references ShopOrder(id) on delete cascade,
    foreign key (productItemId) references ProductItem(id),
    foreign key (storeId) references Store(id)
);

-- Voucher table
create table Voucher (
    id int auto_increment primary key,
    code varchar(50) unique not null,
    discountType enum('PERCENT', 'FIXED') not null,
    discountValue decimal(5,2) not null,
    minOrderValue decimal(10,2) default 0,
    maxDiscountValue decimal(10, 2), -- chỉ áp dụng với PERCENT
    startDate date not null,
    endDate date not null,
    quantity int default 1,
    isDeleted boolean default false,
    check (
		(discountType = 'PERCENT' and discountValue <= 100) or
		(discountType = 'FIXED') 
	)
);

-- ApplyVoucher table
create table ApplyVoucher (
    orderId int,
    voucherId int,
    primary key (orderId, voucherId),
    foreign key (orderId) references ShopOrder(id),
    foreign key (voucherId) references Voucher(id)
);

-- Cart table
create table Cart (
    id int auto_increment primary key,
    userId int unique not null,
    foreign key (userId) references User(id)
);

-- CartItem table
create table CartItem (
    cartId int not null,
    productItemId int not null,
    quantity int default 1 not null,
    primary key (cartId, productItemId),
    foreign key (cartId) references Cart(id) on delete cascade,
    foreign key (productItemId) references ProductItem(id)
);

-- Trigger
DELIMITER //

CREATE TRIGGER trg_create_cart_after_user
AFTER INSERT ON User
FOR EACH ROW
BEGIN
    INSERT INTO Cart (userId) VALUES (NEW.id);
END;
//

DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_update_inventory_status
BEFORE INSERT ON Inventory
FOR EACH ROW
BEGIN
  IF NEW.quantity > 0 THEN
    SET NEW.status = 'in_stock';
  ELSE
    SET NEW.status = 'out_of_stock';
  END IF;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_update_inventory_after_order
AFTER INSERT ON OrderItem
FOR EACH ROW
BEGIN
  UPDATE Inventory
  SET quantity = quantity - NEW.quantity
  WHERE storeId = NEW.storeId AND productItemId = NEW.productItemId;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_check_voucher_quantity
BEFORE INSERT ON ApplyVoucher
FOR EACH ROW
BEGIN
  DECLARE v_quantity INT;
  SELECT quantity INTO v_quantity FROM Voucher WHERE id = NEW.voucherId;

  IF v_quantity <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Voucher has been used up.';
  END IF;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_decrease_voucher_quantity
AFTER INSERT ON ApplyVoucher
FOR EACH ROW
BEGIN
  UPDATE Voucher
  SET quantity = quantity - 1
  WHERE id = NEW.voucherId;
END;
//
DELIMITER ;

-- Query tạo một số dữ liệu
-- User
INSERT INTO User (name, email, phone, password)
VALUES ('assessment', 'gu@gmail.com', '328355333', 'abc123');

-- Address
INSERT INTO Address (phone, street, commune, district, province)
VALUES ('328355333', '73 tân hoà 2', 'Phúc Lộc', 'Ba Bể', 'Bắc Kạn');
INSERT INTO Address (phone, street, commune, district, province)
VALUES ('328355666', '151 tân hoà 2', 'Phúc Lộc', 'Ba Bể', 'Bắc Kạn');

-- Gán địa chỉ cho user
INSERT INTO UserAddress (userId, addressId, isDefault, housingType)
VALUES (
  (SELECT id FROM User WHERE email = 'gu@gmail.com'),
  (SELECT id FROM Address WHERE street = '73 tân hoà 2' and phone = '328355333'),
  true, 'Nhà riêng'
);

-- Store
INSERT INTO Store (name, description)
VALUES ('Sneaker Store', 'Giày chính hãng');

-- Gán địa chỉ store
INSERT INTO StoreAddress (storeId, addressId, isMain)
VALUES (
  (SELECT id FROM Store WHERE name = 'Sneaker Store'),
  (SELECT id FROM Address WHERE street = '151 tân hoà 2' and phone = '328355666'),
  true
);

-- Product
INSERT INTO Product (name)
VALUES ('KAPPA Women''s Sneakers');

-- Variation: Color
INSERT INTO Variation (productId, name)
VALUES (
  (SELECT id FROM Product WHERE name = 'KAPPA Women''s Sneakers'),
  'Color'
);

-- Variation: Size
INSERT INTO Variation (productId, name)
VALUES (
  (SELECT id FROM Product WHERE name = 'KAPPA Women''s Sneakers'),
  'Size'
);

-- VariationOption: yellow + 36
INSERT INTO VariationOption (variationId, value)
VALUES
(
  (SELECT id FROM Variation WHERE name = 'Color' AND productId = (SELECT id FROM Product WHERE name = 'KAPPA Women''s Sneakers')),
  'yellow'
),
(
  (SELECT id FROM Variation WHERE name = 'Size' AND productId = (SELECT id FROM Product WHERE name = 'KAPPA Women''s Sneakers')),
  '36'
);

-- ProductItem
INSERT INTO ProductItem (productId, sku, price)
VALUES (
  (SELECT id FROM Product WHERE name = 'KAPPA Women''s Sneakers'),
  'KAPPA-36-yellow',
  980000
);

-- ProductConfig: Gán variation option vào product item
INSERT INTO ProductConfig (productItemId, variationOptionId)
VALUES
(
  (SELECT id FROM ProductItem WHERE sku = 'KAPPA-36-yellow'),
  (SELECT id FROM VariationOption WHERE value = 'yellow')
),
(
  (SELECT id FROM ProductItem WHERE sku = 'KAPPA-36-yellow'),
  (SELECT id FROM VariationOption WHERE value = '36')
);

-- Inventory
INSERT INTO Inventory (storeId, productItemId, quantity, status)
VALUES (
  (SELECT id FROM Store WHERE name = 'Sneaker Store'),
  (SELECT id FROM ProductItem WHERE sku = 'KAPPA-36-yellow'),
  5,
  'in_stock'
);

-- ShippingMethod
INSERT INTO ShippingMethod (name, cost)
VALUES ('Giao hàng nhanh', 30000);

-- PaymentMethod
INSERT INTO PaymentMethod (name)
VALUES ('Ví điện tử');
INSERT INTO PaymentMethod (name)
VALUES ('COD');

-- OrderStatus
INSERT INTO OrderStatus (name)
VALUES ('Đã thanh toán');
INSERT INTO OrderStatus (name)
VALUES ('Chưa thanh toán');
INSERT INTO OrderStatus (name)
VALUES ('Giao hàng thành công');

-- CÂU B
-- Payment
INSERT INTO Payment (methodId, paidAt, amount)
VALUES (
  (SELECT id FROM PaymentMethod WHERE name = 'Ví điện tử'),
  NOW(),
  1010000
);

-- ShopOrder
INSERT INTO ShopOrder (userId, statusId, shippingMethodId, paymentId, shippingAddressId, total)
VALUES (
  (SELECT id FROM User WHERE email = 'gu@gmail.com'),
  (SELECT id FROM OrderStatus WHERE name = 'Đã thanh toán'),
  (SELECT id FROM ShippingMethod WHERE name = 'Giao hàng nhanh'),
  (SELECT MAX(id) FROM Payment),
  (SELECT id FROM Address WHERE street = '73 tân hoà 2' and phone = '328355333'),
  1010000
);

-- OrderItem
INSERT INTO OrderItem (orderId, productItemId, quantity, storeId, price)
VALUES (
  (SELECT MAX(id) FROM ShopOrder),
  (SELECT id FROM ProductItem WHERE sku = 'KAPPA-36-yellow'),
  1,
  (SELECT id FROM Store WHERE name = 'Sneaker Store'),
  980000
);
-- CÂU C
-- Nếu không tính ship
SELECT
  DATE_FORMAT(o.orderDate, '%m - %Y') AS month,
  COUNT(o.id) AS total_orders,
  ROUND(AVG(oi_total.total_price), 2) AS average_order_value
FROM ShopOrder o
JOIN (
  SELECT
    orderId,
    SUM(price * quantity) AS total_price
  FROM OrderItem
  GROUP BY orderId
) AS oi_total ON o.id = oi_total.orderId
WHERE YEAR(o.orderDate) = YEAR(CURDATE())
GROUP BY month
ORDER BY month;
-- Tính cả phí ship
SELECT 
    DATE_FORMAT(orderDate, '%m - %Y') AS month,
    COUNT(*) AS total_orders,
    ROUND(AVG(total), 2) AS average_order_value
FROM ShopOrder
WHERE YEAR(orderDate) = YEAR(CURDATE())
GROUP BY month
ORDER BY MIN(orderDate);
-- CÂU D
WITH active_customers AS (
  SELECT DISTINCT userId
  FROM ShopOrder
  WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    AND orderDate < DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
),
recent_customers AS (
  SELECT DISTINCT userId
  FROM ShopOrder
  WHERE orderDate >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
),
churned_customers AS (
  SELECT userId
  FROM active_customers
  WHERE userId NOT IN (SELECT userId FROM recent_customers)
)

SELECT
  COUNT(*) AS churned_customers,
  (SELECT COUNT(*) FROM active_customers) AS total_active_customers,
  ROUND(
    COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM active_customers), 0),
    2
  ) AS churn_rate_percent
FROM churned_customers;
