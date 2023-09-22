import {Await, useHref} from '@remix-run/react';
import React, {Suspense, useEffect} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import { CartDrawer, CartMainDrawer } from './CartDrawer';
import '../styles/app.css';

export function Layout({cart, children = null, footer, header, isLoggedIn}) {
  return (
    <>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside menu={header.menu} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
      <PredictiveSearchResults className='hideForMobile'/>
      <main className='mainContent'>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer.menu} />}
        </Await>
      </Suspense>
    </>
  );
}

function CartAside({cart}) {
  return (
    <CartDrawer id="cart-drawer" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMainDrawer cart={cart} />;
          }}
        </Await>
      </Suspense>
    </CartDrawer>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        {/* <br /> */}
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="SEARCH"
                ref={inputRef}
                type="search"
                className='focus:border-black'
              />
              &nbsp;
              {/* <button type="submit"><img src="/search.svg" alt="" /></button> */}
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

function MobileMenuAside({menu}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu menu={menu} viewport="mobile"/>
    </Aside>
  );
}