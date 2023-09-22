import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {useVariantUrl} from '~/utils';




export function CartMain({layout, cart}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  

  return (
    <div className='cartmaincontainer'>
      <div className={className}>
        <CartEmpty hidden={linesCount} layout={layout} />
        <CartDetails cart={cart} layout={layout} />
      </div>
      {cartHasItems && (
          <CartSummary cost={cart.cost} layout={layout}>
            <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
          </CartSummary>
        )}
    </div>
  );
}

function CartDetails({layout, cart}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="cart-details">
      <CartLines lines={cart?.lines} layout={layout} />
      {/* {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )} */}
    </div>
  );
}

// {cartHasItems && (
//   <CartSummary cost={cart.cost} layout={layout}>
//     {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
//     <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
//   </CartSummary>
// )}

function CartLines({lines, layout}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines" className='cart-list-container'>
      <ul className='cart-list'>
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <div className='cart-line-info'>

      <li key={id} className="cart-line" >
        {image && (
          <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
          />
          )}

        <div className='cartItemDetails'>
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                // close the drawer
                window.location.href = lineItemUrl;
              }
            }}
            >
            <p>
              <strong className='text-xs'>{product.title}</strong>
            </p>
          </Link>
          <ul className='cartOptions'>
            {selectedOptions.map((option) => (
              <li key={option.name}>
                <small className='capitalize'>
                  {option.name}: {option.value}
                </small>
              </li>
            ))}
            {/* undecided if i want to put this here */}
          <CartLinePrice line={line} />
          </ul>
          {/* <CartLinePrice line={line}  />
          <CartLineQuantity line={line} /> */}
        </div>
      </li>

      <div className='cart-line-qty'>
        <CartLineQuantity line={line} />
      </div>

      <div className='cart-line-price'>
          <CartLinePrice line={line} as="span" />
      </div>
    </div>
  );
}

export function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
      <a href={checkoutUrl} target="_self">
        <p className='checkoutBtn uppercase'>Checkout  &rarr;</p>
      </a>
  );
}

export function CartSummary({cost, layout, children = null}) {
  
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div className='cart-summary-cont'>
    <div aria-labelledby="cart-summary" className={className}>
      <dl className="cart-subtotals">
        <dt className='text-sm mb-2'>Subtotal:</dt>
        <dd className='text-sm'>
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
        <p className='text-xs mb-1 text-gray-400'>Shipping and taxes calculated at checkout.</p>
        <p className='text-xs mb-5 text-gray-400'>If you have a discount code, enter it at checkout.</p>
      {children}
      
    </div>
    </div>
  );
}

function CartLineRemoveButton({lineIds}) {
  return (
    // <div className='cart-item-delete-button'>
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      {/* <button type="submit">&#128465;</button> */}
      <button type="submit" className='ml-3 mt-1 removeBtn'><img src='/trash-2.svg' /></button>
    </CartForm>
    // </div>
  );
}

function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantiy">
      {/* <small>{quantity} &nbsp;&nbsp;</small> */}
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          className='qtyBtn'
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
        >
          <span className='text-base font-extrabold'>&#8722;</span>
        </button>
      </CartLineUpdateButton>

      <small className='qtyBtn'>{quantity}</small>

      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          className='qtyBtn'
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
        >
          <span className='font-extrabold'>&#43;</span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      <CartLineRemoveButton lineIds={[lineId]} />
    </div>
  );
}

function CartLinePrice({line, priceType = 'regular', ...passthroughProps}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className='itemPrice'>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

export function CartEmpty({hidden = false, layout = 'aside'}) {
  return (
    <div hidden={hidden}>
      <br />
      <p>
        
      </p>
      <br />
      <Link
        to="/collections"
        onClick={() => {
          if (layout === 'aside') {
            window.location.href = '/collections';
          }
        }}
      >
        <div>
          Looks like your Cart is empty.
          Search Our Collections →
        </div>
      </Link>
    </div>
  );
}

function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartLineUpdateButton({children, lines}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}