<?php
/**
 * Motyw computerit – ustawienia.
 *
 * @package computerit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Podstawowe funkcje motywu i miejsce na menu.
 */
function computerit_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );

	register_nav_menus(
		array(
			'primary' => 'Menu główne',
		)
	);
}
add_action( 'after_setup_theme', 'computerit_setup' );

/**
 * Arkusz stylów motywu.
 */
function computerit_assets() {
	wp_enqueue_style( 'computerit', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', 'computerit_assets' );

/**
 * Klasa CSS dla linków w menu głównym.
 * (WordPress sam dodaje aria-current="page" do linku aktualnej podstrony.)
 *
 * @param array    $atts Atrybuty linku.
 * @param WP_Post  $item Pozycja menu.
 * @param stdClass $args Argumenty wp_nav_menu().
 * @return array
 */
function computerit_menu_link_class( $atts, $item, $args ) {
	if ( isset( $args->theme_location ) && 'primary' === $args->theme_location ) {
		$atts['class'] = trim( ( isset( $atts['class'] ) ? $atts['class'] : '' ) . ' site-nav__link' );
	}
	return $atts;
}
add_filter( 'nav_menu_link_attributes', 'computerit_menu_link_class', 10, 3 );

/**
 * Menu zastępcze – pokazuje się, dopóki w Wygląd → Menu nie przypiszesz
 * menu do „Menu główne”. Zawiera Stronę główną i istniejące strony:
 * O mnie, Cennik, Portfolio, Kontakt.
 */
function computerit_menu_fallback() {
	$links = array(
		array(
			'label'   => 'Strona główna',
			'url'     => home_url( '/' ),
			'current' => is_front_page(),
		),
	);

	$pages = array(
		'o-mnie'    => 'O mnie',
		'cennik'    => 'Cennik',
		'portfolio' => 'Portfolio',
		'kontakt'   => 'Kontakt',
	);

	foreach ( $pages as $slug => $label ) {
		$page = get_page_by_path( $slug );
		if ( ! $page || 'publish' !== $page->post_status ) {
			continue;
		}
		$links[] = array(
			'label'   => $label,
			'url'     => get_permalink( $page ),
			'current' => is_page( $page->ID ) && ! is_front_page(),
		);
	}

	echo '<ul class="site-nav__list">';
	foreach ( $links as $link ) {
		printf(
			'<li><a class="site-nav__link" href="%1$s"%2$s>%3$s</a></li>',
			esc_url( $link['url'] ),
			$link['current'] ? ' aria-current="page"' : '',
			esc_html( $link['label'] )
		);
	}
	echo '</ul>';
}
