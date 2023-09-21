// import { CartMain } from "./Cart"
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {useVariantUrl} from '~/utils';


// the only solution i could come up with for /cart url..
// not dry at all.
// plus this is inside the cartdrawer smh
export function CartMainDrawer({layout, cart}) {
    const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
    const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
    const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

    return (
    <div className={className}>
        <CartEmpty hidden={linesCount} layout={layout} />
        <CartDetailsDrawer cart={cart} layout={layout} />
    </div>
    );
    }

    function CartDetailsDrawer({layout, cart}) {
    const cartHasItems = !!cart && cart.totalQuantity > 0;

    return (
    <div className="cart-details">
        <CartLinesDrawer lines={cart?.lines} layout={layout} />
        {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
            {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
            <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
        )}
    </div>
    );
    }

    function CartLinesDrawer({lines, layout}) {
    if (!lines) return null;

    return (
    <div aria-labelledby="cart-lines" className='cart-list-container'>
        <ul className='cart-list'>
        {lines.nodes.map((line) => (
            <CartLineItemDrawer key={line.id} line={line} layout={layout} />
        ))}
        </ul>
    </div>
    );
    }

    function CartLineItemDrawer({layout, line}) {
    const {id, merchandise} = line;
    const {product, title, image, selectedOptions} = merchandise;
    const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

    return (
    <div className='cart-line-info'>

        <li key={id} className="cart-line">
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
            </ul>

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

    function CartCheckoutActions({checkoutUrl}) {
    if (!checkoutUrl) return null;

    return (
    <div className='p-6'>
        <a href={checkoutUrl} target="_self">
        <p className='checkoutBtn uppercase'>Checkout  &rarr;</p>
        </a>
        <br />

        <a href="/cart">
        <p className='viewCart'>VIEW CART</p>
        </a>
    </div>
    );
    }

    export function CartSummary({cost, layout, children = null}) {
    const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

    return (
    <div aria-labelledby="cart-summary" className={className}>
        <dl className="cart-subtotal">
        <dt className='text-sm'>Subtotal:</dt>
        <dd className='text-sm'>
            {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
            ) : (
            '-'
            )}
        </dd>
        </dl>
        <p className='text-sm'>Shipping and taxes calculated at checkout.</p>
        {children}
    </div>
    );
    }

    function CartLineRemoveButton({lineIds}) {
    return (
    <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesRemove}
        inputs={{lineIds}}
    >
        {/* <button type="submit">&#128465;</button> */}
        <button type="submit" className='ml-3 mt-1 removeBtn'><img src='/trash-2.svg' /></button>
    </CartForm>
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

export function CartDrawer({children, id = 'drawer', cart}) {
        return (
            <div aria-modal className='cartDrawer' id={id}>
                <div className="cartDrawer-container">
                {/* <CartMainDrawer cart={cart} /> */}
                <main>{children}</main>
                </div>
            </div>
        )
    }