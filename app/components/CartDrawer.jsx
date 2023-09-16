export function CartDrawer({children, id = 'drawer'}) {
    return (
        <div aria-modal className='cartDrawer' id={id}>
            <div className="cartDrawer-container">
            <main>{children}</main>
            </div>
        </div>
    )
}