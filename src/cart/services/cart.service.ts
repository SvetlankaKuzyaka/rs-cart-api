import { Injectable } from '@nestjs/common';

import { Cart } from '../models';
import { invoke } from '../../db/utils';

type CartItemLocal = {
  product_id: string,
  count: number,
}

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string) {
    const cart = await invoke('select * from carts where user_id = $1', [userId])

    if (!cart.rowCount) {
      throw new Error(`Cart was not found for user: ${userId}`);
    }

    const cartId = cart.rows[0].id;
    const cartItems = await invoke('select * from cart_items where cart_id = $1', [cartId]);

    return {...cart.rows[0], items: cartItems.rows || [] }; 
  }

  async updateByUserId(userId: string, item: CartItemLocal) {
    const cart = await invoke('select * from carts where user_id = $1', [userId]);

    if (!cart.rowCount) {
      throw new Error(`Cart was not found for user: ${userId}`);
    }

    const cartId = cart.rows[0].id;
    const existingCartItem = await invoke('select * from cart_items where cart_id = $1 and product_id = $2 for update', [cartId, item.product_id]);

    if (existingCartItem.rowCount) {
      await invoke('update cart_items set count = $1 where cart_id = $2 and product_id = $3', [item.count, cartId, item.product_id]);
    } else {
      await invoke('insert into cart_items (cart_id, product_id, count) values ($1, $2, $3)', [cartId, item.product_id, item.count]);
    }

    return await this.findByUserId(userId);
  }

  async removeByUserId(userId: string): Promise<void> {
    const cart = await invoke('select * from carts where user_id = $1', [userId])

    if (!cart.rowCount) {
      throw new Error(`Cart was not found for user: ${userId}`);
    }

    const cartId = cart.rows[0].id;
    await invoke('delete from cart_items where cart_id = $1', [cartId]);


    return await this.findByUserId(userId);
  }
}
