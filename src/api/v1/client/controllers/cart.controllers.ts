import express, { Request, Response } from 'express';
import Cart from '../../../../models/cart.model';
import Product from '../../../../models/plant.model';
import { log } from 'console';

// src/types/express.d.ts
export interface RequestWithUser extends Request {
  user?: any; // Thay 'any' bằng kiểu dữ liệu của user nếu cần thiết
}

// GET /cart
// GET /cart
export const getCart = async (req: RequestWithUser, res: Response) => {
  // const UserId = req.query.UserId as string || req.user?.id;
  const UserId = req.body.params
  

  if (!UserId) {
    return res.status(400).json({ success: false, message: 'UserId is required' });
  }

  try {
    // Tìm giỏ hàng của người dùng và populate thông tin sản phẩm
    const cart = await Cart.findOne({ UserId })
      .populate('myCart.productId', 'title price images');  // Populate thông tin sản phẩm

    if (!cart) {
      // Nếu không có giỏ hàng, tạo giỏ hàng mới
      const newCart = await Cart.create({ UserId, myCart: [] });
      return res.status(200).json({ success: true, data: { myCart: newCart.myCart } });
    }

    // Nếu có giỏ hàng, trả về giỏ hàng
    res.status(200).json({ success: true, data: cart, message: 'Cart retrieved successfully' });
  } catch (error) {
    console.error(error); // In ra lỗi để dễ dàng debug
    res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
  }
};


// POST /cart/add
export const addToCart = async (req: Request, res: Response) => {
  const { UserId, productId, quantity } = req.body;
console.log(req.body)
  if (!UserId || !productId) {
    return res.status(400).json({ success: false, message: 'UserId and ProductId are required' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const totalPrice =  Number(product.price) * quantity;  // Tính toán totalPrice từ giá sản phẩm và số lượng

    const cart = await Cart.findOne({ UserId });

    if (!cart) {
      const newCart = await Cart.create({
        UserId,
        myCart: [{ productId, quantity, totalPrice }], // Thêm totalPrice vào đây
      });
      return res.status(200).json({ success: true, data: newCart });
    }

    const productIndex = cart.myCart.findIndex(item => item.productId.toString() === productId);
    if (productIndex > -1) {
      cart.myCart[productIndex].quantity += quantity;
      cart.myCart[productIndex].totalPrice = Number(product.price) * cart.myCart[productIndex].quantity;  // Cập nhật totalPrice
    } else {
      cart.myCart.push({ productId, quantity, totalPrice });
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding product to cart', error: error.message });
  }
};




// POST /cart/remove
export const removeFromCart = async (req: RequestWithUser, res: Response) => {
  const { UserId, productId } = req.body;

  if (!UserId || !productId) {
    return res.status(400).json({ success: false, message: 'Missing UserId or productId' });
  }

  try {
    const cart = await Cart.findOne({ UserId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const productIndex = cart.myCart.findIndex(item => item.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    cart.myCart.splice(productIndex, 1);

    if (cart.myCart.length === 0) {
      await cart.deleteOne();
    } else {
      await cart.save();
    }

    res.status(200).json({ success: true, message: 'Product removed from cart', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing product from cart', error: error.message });
  }
};


// POST /cart/update
export const updateCartQuantity = async (req: RequestWithUser, res: Response) => {
  const { UserId, productId, quantity } = req.body;

  if (!UserId || !productId || quantity === undefined) {
    return res.status(400).json({ success: false, message: 'Missing UserId, productId, or quantity' });
  }

  if (quantity <= 0) {
    return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
  }

  try {
    const cart = await Cart.findOne({ UserId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const productIndex = cart.myCart.findIndex((item) => item.productId.toString() === productId.toString());

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    const product = await Product.findById(productId);  // Tìm sản phẩm bằng _id

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const productPrice = Number(product.price);
    cart.myCart[productIndex].quantity = quantity;
    cart.myCart[productIndex].totalPrice = quantity * productPrice;

    await cart.save();

    res.status(200).json({ success: true, message: 'Product quantity updated', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product quantity', error: error.message });
  }
};
