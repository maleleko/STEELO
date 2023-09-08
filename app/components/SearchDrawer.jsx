export function SearchDrawer({children, id = 'drawer'}) {
  return (
    <div aria-modal className="searchDrawer" id={id} role='dialog'>
      <button className="close-outside" 
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
      }}/>
      <aside>
        <CloseDrawer/>
        <main className="w-full">{children}</main>
      </aside>
    </div>
  );
}

function CloseDrawer() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a className="close" href="#" onChange={() => history.go(-1)}>
      &times;
    </a>
  );
}