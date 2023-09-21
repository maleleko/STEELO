import {Await, NavLink, useMatches, Form} from '@remix-run/react';
import React, {Suspense, useState, useEffect} from 'react';
import {
  PredictiveSearchForm, PredictiveSearchResults,
} from '~/components/Search';
import {SearchToggle} from '~/components/SearchToggle';
import '../styles/reset.css';
import { CartDrawer } from './CartDrawer';



export function Header({header, isLoggedIn, cart}) {
  const {shop, menu} = header;
  return (
    <header className="header">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <img  className='w-14 h-14' src='/steelo-logo.svg' alt="steelo-logo" />
      </NavLink>
      <HeaderMenu menu={menu} viewport="desktop" />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

export function HeaderMenu({menu, viewport}) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  const className = `header-menu-${viewport}`;

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className}  role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          <p className='text-transform: uppercase font-bold text-sm'>Home</p>
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item text-transform: uppercase font-bold text-sm"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}



function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas text-transform: uppercase font-bold text-sm" role="navigation">
      <div className='searchContainer'>
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div className='srchStuff'>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="SEARCH"
                ref={inputRef}
                className='focus:border-black'
              />
              &nbsp;
              {/* <button type="submit"><img src="/search.svg" alt="" /></button> */}
            </div>
          )}
        </PredictiveSearchForm>
        </div>
        <SearchToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink>
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const [href, setHref] = useState('/')

  const toggleHref = () => {
    if (href === '/' && '#') {
      setHref('#mobile-menu-aside')
    } else if (href === '#mobile-menu-aside') {
      setHref('#')
    }
    else {
      setHref('#mobile-menu-aside')
    }

  }

  return (
    <a className="header-menu-mobile-toggle text-transform: upperrcase text-2xl" href={href} onClick={toggleHref}>
      <h3 className='mobileBtn'>☰</h3>
    </a>
  );
}

function CartBadge({count}) {

    // implement actual state manipulation for cartDrawer.jsx
    // cause this href method stinks.
  // const [showCartDrawer, setShowCartDrawer] = useState(false);

  // const toggleDrawer = () => {
  //   setShowCartDrawer(!showCartDrawer);
  //   console.log('toggling', showCartDrawer)
  // }


  const [cartHref, setCartHref] = useState('/')

  const toggleCartDrawer = () => {

    if (cartHref === '#') {
      setCartHref('#cart-drawer')
      console.log('refreshed')
    } else if (cartHref === '#cart-drawer') {
      setCartHref('#')
    }
    else {
      setCartHref('#cart-drawer')
    }
  }

  const [openDrawer, setOpenDrawer] = useState(false)
  const toggleThis = () => {
    setOpenDrawer(!openDrawer)
    console.log('rendering')
  }

  // return <div className='cartTesting' onClick={toggleDrawer} >
  //   <button><img src='/shopping-cart.svg' alt='Cart Icon'/></button>
  //   <p>{count}</p>
  //   {showCartDrawer && <CartDrawer />}
  // </div>

  return <a href={cartHref} onClick={toggleCartDrawer}><div className='cartTesting'>
    <img src="/shopping-cart.svg" alt=""/>
    <p className='text-xs'>{count}</p>
    </div></a>
}

function CartToggle({cart}) {
  
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : '#000',
  };
}
