/**
 * Dostępność: zamknięta szuflada mini-koszyka WooCommerce ma aria-hidden="true",
 * ale jej przyciski i linki nadal przyjmują fokus (WCAG 4.1.2, audyt aria-hidden-focus).
 * Synchronizujemy atrybut `inert` z `aria-hidden` – bez zmian w kodzie WooCommerce.
 */
(function () {
	'use strict';
	var sync = function (drawer) {
		if (drawer.getAttribute('aria-hidden') === 'true') {
			drawer.setAttribute('inert', '');
		} else {
			drawer.removeAttribute('inert');
		}
	};
	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (m) { sync(m.target); });
	});
	document.querySelectorAll('.wc-block-mini-cart__drawer').forEach(function (drawer) {
		sync(drawer);
		observer.observe(drawer, { attributes: true, attributeFilter: ['aria-hidden'] });
	});
})();
