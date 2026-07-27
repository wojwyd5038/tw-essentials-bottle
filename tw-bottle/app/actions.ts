'use server'

import { createCart } from '@/lib/shopify'

export type AddToCartResult =
  | { ok: true; checkoutUrl: string; totalQuantity: number }
  | { ok: false; error: string }

export async function addToCart(variantId: string, quantity: number): Promise<AddToCartResult> {
  try {
    const cart = await createCart(variantId, Math.max(1, quantity))
    if (!cart) {
      return { ok: false, error: 'Could not create a cart. Please try again.' }
    }
    // Bypass the storefront password screen when redirecting to checkout.
    const url = new URL(cart.checkoutUrl)
    url.searchParams.set('channel', 'online_store')
    return { ok: true, checkoutUrl: url.toString(), totalQuantity: cart.totalQuantity }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Something went wrong.' }
  }
}
