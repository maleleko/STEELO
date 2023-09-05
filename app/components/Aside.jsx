/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```ts
 * <Aside id="search-aside" heading="SEARCH">`
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
import imageSrc from '../../public/images/steelo-logo.png'

export function Aside({children, heading, id = 'aside'}) {
  return (
    <div aria-modal className="overlay text-slate-950 font-sans text-transform: uppercase" id={id} role="dialog">
      <button
        className="close-outside "
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside>
        <header>
        <img  className='w-14 h-14' src={imageSrc} alt="steelo-logo" />
          {/* <h3>{heading}</h3> */}
          <CloseAside />
        </header>
        <main className='pl-4 w-full'>{children}</main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a className="close" href="#" onChange={() => history.go(-1)}>
      &times;
    </a>
  );
}
