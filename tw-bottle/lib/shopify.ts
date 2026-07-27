const API_VERSION = '2025-07'

const domain = process.env.SHOPIFY_STORE_DOMAIN
const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

const PRODUCT_HANDLE = 'tw-essentials-smart-display-water-bottle'

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: { amount: string; currencyCode: string }
  image: { url: string; altText: string | null } | null
  selectedOptions: { name: string; value: string }[]
}

export type Product = {
  id: string
  title: string
  handle: string
  descriptionHtml: string
  availableForSale: boolean
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  featuredImage: { url: string; altText: string | null } | null
  images: { url: string; altText: string | null }[]
  variants: ProductVariant[]
}

type ShopifyFetchArgs = {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  tags?: string[]
}

async function shopifyFetch<T>({ query, variables, cache = 'no-store', tags }: ShopifyFetchArgs): Promise<T> {
  if (!domain || !storefrontToken) {
    throw new Error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.')
  }

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags ? { next: { tags } } : {}),
  })

  if (!res.ok) {
    throw new Error(`Shopify request failed: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as { data: T; errors?: { message: string }[] }

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(', '))
  }

  return json.data
}

const PRODUCT_QUERY = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`

export async function getProduct(): Promise<Product | null> {
  const data = await shopifyFetch<{
    product: {
      id: string
      title: string
      handle: string
      descriptionHtml: string
      availableForSale: boolean
      priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
      featuredImage: { url: string; altText: string | null } | null
      images: { edges: { node: { url: string; altText: string | null } }[] }
      variants: { edges: { node: ProductVariant }[] }
    } | null
  }>({
    query: PRODUCT_QUERY,
    variables: { handle: PRODUCT_HANDLE },
    cache: 'no-store',
  })

  if (!data.product) return null

  return {
    id: data.product.id,
    title: data.product.title,
    handle: data.product.handle,
    descriptionHtml: data.product.descriptionHtml,
    availableForSale: data.product.availableForSale,
    priceRange: data.product.priceRange,
    featuredImage: data.product.featuredImage,
    images: data.product.images.edges.map((e) => e.node),
    variants: data.product.variants.edges.map((e) => e.node),
  }
}

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation cartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`

export async function createCart(merchandiseId: string, quantity: number) {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null
      userErrors: { field: string[]; message: string }[]
    }
  }>({
    query: CART_CREATE_MUTATION,
    variables: { lines: [{ merchandiseId, quantity }] },
  })

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(', '))
  }

  return data.cartCreate.cart
}
