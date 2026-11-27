/**
 * Maison du Pain – subtelne interakcje.
 * - płynne pojawianie się zdjęć i sekcji (IntersectionObserver),
 * - nagłówek z tłem po przewinięciu,
 * - pętla paska z nazwami wypieków,
 * - zamykanie menu mobilnego po kliknięciu kotwicy.
 */
( function () {
	'use strict';

	var doc = document.documentElement;
	var reduceMotion = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	/* Nagłówek po przewinięciu */
	var header = document.querySelector( '.mdp-header' );
	if ( header ) {
		var onScroll = function () {
			header.classList.toggle( 'is-scrolled', window.scrollY > 24 );
		};
		onScroll();
		window.addEventListener( 'scroll', onScroll, { passive: true } );
	}

	/* Pojawianie się elementów */
	var selectors = [
		'.mdp-reveal',
		'.mdp-products .wp-block-image',
		'.mdp-products .mdp-product__meta',
		'.mdp-products .mdp-menu-row',
		'.mdp-about .wp-block-image',
		'.mdp-philosophy .mdp-step',
		'.mdp-philosophy .wp-block-image',
		'.mdp-ingredients .wp-block-image',
		'.mdp-ingredients .mdp-ingredient',
		'.mdp-mosaic .wp-block-image',
		'.mdp-archive .wp-block-post',
	];
	var targets = document.querySelectorAll( selectors.join( ',' ) );

	if ( reduceMotion || ! ( 'IntersectionObserver' in window ) ) {
		targets.forEach( function ( el ) {
			el.classList.add( 'is-revealed' );
		} );
	} else {
		var observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'is-revealed' );
						observer.unobserve( entry.target );
					}
				} );
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
		);

		targets.forEach( function ( el ) {
			el.classList.add( 'mdp-will-reveal' );
			// Delikatne opóźnienie dla elementów stojących obok siebie.
			var parent = el.closest( '.wp-block-column, .mdp-mosaic, .wp-block-post-template, .mdp-steps, .mdp-ingredient-list' );
			if ( parent ) {
				var siblings = parent.querySelectorAll( selectors.join( ',' ) );
				var index = Array.prototype.indexOf.call( siblings, el );
				if ( index > 0 ) {
					el.style.transitionDelay = Math.min( index, 5 ) * 90 + 'ms';
				}
			}
			observer.observe( el );
		} );
	}

	/* Pasek z nazwami wypieków – płynna pętla */
	document.querySelectorAll( '.mdp-marquee__track' ).forEach( function ( track ) {
		if ( reduceMotion || track.dataset.ready ) {
			return;
		}
		var clone = track.cloneNode( true );
		clone.setAttribute( 'aria-hidden', 'true' );
		clone.classList.add( 'is-clone' );
		track.parentNode.appendChild( clone );
		track.dataset.ready = '1';
		track.parentNode.classList.add( 'is-animated' );
	} );

	/* Menu mobilne: zamknij po wybraniu kotwicy */
	document.addEventListener( 'click', function ( event ) {
		var link = event.target.closest( '.wp-block-navigation__responsive-container.is-menu-open a[href*="#"]' );
		if ( ! link ) {
			return;
		}
		var container = link.closest( '.wp-block-navigation__responsive-container' );
		var close = container && container.querySelector( '.wp-block-navigation__responsive-container-close' );
		if ( close ) {
			close.click();
		}
	} );

	doc.classList.add( 'mdp-ready' );
} )();
