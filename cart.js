// Chạy hàm cập nhật số lượng ngay khi vừa mở trang
document.addEventListener('DOMContentLoaded', updateCartBadge);

function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cartData')) || [];
    
    // Tìm xem sản phẩm này đã có trong giỏ chưa
    const foundIndex = cart.findIndex(item => item.name === name);

    if (foundIndex !== -1) {
        cart[foundIndex].quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    // Lưu vào localStorage
    localStorage.setItem('cartData', JSON.stringify(cart));
    
    // Cập nhật con số trên icon ngay lập tức
    updateCartBadge(); 

    // Hiệu ứng thông báo nhỏ (thay vì alert gây khó chịu)
    alert('Đã thêm sản phẩm vào giỏ hàng!');
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cartData')) || [];
    const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    
    if (badge) {
        badge.textContent = totalQty;
        
        // Chỉ hiện màu đỏ khi có hàng (số lượng > 0)
        if (totalQty > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}
function renderCart() {
    // Đảm bảo tên trong getItem phải là 'cartData' (khớp với lúc lưu)
    const cart = JSON.parse(localStorage.getItem('cartData')) || []; 
    const container = document.getElementById('cart-items-list');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountText = document.getElementById('cart-items');

    // Nếu không có container (không phải trang cart.html) thì thoát
    if (!container) return; 

    // Xóa trắng danh sách cũ trước khi vẽ mới
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-msg">Giỏ hàng đang trống!</div>';
        if (totalPriceElement) totalPriceElement.textContent = '0đ';
        if (cartCountText) cartCountText.textContent = '0';
        return;
    }

    let totalMoney = 0;
    let totalQty = 0;

    cart.forEach((item) => {
        const subtotal = item.price * item.quantity;
        totalMoney += subtotal;
        totalQty += item.quantity;

        // Vẽ từng dòng sản phẩm
        container.innerHTML += `
        <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #333; padding: 10px 0;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${item.image}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">
                <h4 style="margin: 0; color: #fff;">${item.name}</h4>
            </div>
            <div style="color: #fff;">x${item.quantity}</div>
            <div style="color: #22d3ee; font-weight: bold;">${subtotal.toLocaleString()}đ</div>
        </div>`;
    });

    // Cập nhật các con số tổng
    if (totalPriceElement) totalPriceElement.textContent = totalMoney.toLocaleString() + 'đ';
    if (cartCountText) cartCountText.textContent = totalQty;
}

function clearCart() {
    localStorage.removeItem('cartData');
    renderCart();
    updateCartBadge();
}
// Gọi hàm này ngay khi trang web vừa tải xong để hiện số cũ (nếu có)
// SỬA ĐOẠN CUỐI FILE THÀNH THẾ NÀY:
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge(); // Hiện số đỏ trên icon
    renderCart();      // Vẽ danh sách sản phẩm và tính tiền trong trang cart.html
});