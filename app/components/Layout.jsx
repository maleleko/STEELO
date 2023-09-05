import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';

export function Layout({cart, children = null, footer, header, isLoggedIn}) {
  return (
    <>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside menu={header.menu} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
      <main>{children}</main>
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
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className='searchBarDiv'>
        <div>
          <img src="/search.svg" alt="" />
        </div>

        <div className="predictive-search">
          <br />
          <PredictiveSearchForm>
            {({fetchResults, inputRef}) => (
              <div>
                <input className='searchBarThings font-sans text-sm text-black font-semibold text-transform: uppercase; w-full'
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="search"
                  ref={inputRef}
                  type="search"
                />
                &nbsp;
                {/* <button type="submit">Search</button> */}
              </div>
            )}
          </PredictiveSearchForm>
            </div>
          </div>
          <PredictiveSearchResults />
    </Aside>
  );
}

function MobileMenuAside({menu}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu menu={menu} viewport="mobile" />
    </Aside>
  );
}
