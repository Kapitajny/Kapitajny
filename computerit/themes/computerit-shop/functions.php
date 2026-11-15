<?php
/**
 * ComputerIT Shop – funkcje motywu.
 *
 * Zasada: nie modyfikujemy rdzenia WordPressa ani WooCommerce. Wszystko przez haki, theme.json i szablony motywu.
 *
 * @package ComputerIT_Shop
 */

defined( 'ABSPATH' ) || exit;

/**
 * Wsparcie motywu: WooCommerce i galeria produktu (powiększenie, lightbox, slider).
 */
function computerit_shop_setup(): void {
	load_theme_textdomain( 'computerit-shop', get_template_directory() . '/languages' );
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/theme.css' );
}
add_action( 'after_setup_theme', 'computerit_shop_setup' );

/**
 * Drobne style uzupełniające theme.json (stany fokusu, tabele w koszyku na telefonach).
 */
function computerit_shop_styles(): void {
	$version = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'computerit-shop', get_theme_file_uri( 'assets/css/theme.css' ), array(), $version );

	if ( class_exists( 'WooCommerce' ) ) {
		wp_enqueue_script(
			'computerit-shop-mini-cart-inert',
			get_theme_file_uri( 'assets/js/mini-cart-inert.js' ),
			array(),
			$version,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
	}
}
add_action( 'wp_enqueue_scripts', 'computerit_shop_styles' );

/**
 * Kategorie wzorców motywu.
 */
function computerit_shop_pattern_categories(): void {
	register_block_pattern_category( 'computerit-shop', array( 'label' => __( 'ComputerIT – sklep', 'computerit-shop' ) ) );
}
add_action( 'init', 'computerit_shop_pattern_categories' );
