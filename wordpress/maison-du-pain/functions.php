<?php
/**
 * Maison du Pain – funkcje motywu.
 *
 * @package MaisonDuPain
 */

defined( 'ABSPATH' ) || exit;

define( 'MDP_VERSION', wp_get_theme( get_template() )->get( 'Version' ) );
define( 'MDP_DIR', get_template_directory() );
define( 'MDP_URI', get_template_directory_uri() );

require_once MDP_DIR . '/inc/helpers.php';
require_once MDP_DIR . '/inc/products.php';
require_once MDP_DIR . '/inc/contact.php';
require_once MDP_DIR . '/inc/demo-content.php';

/**
 * Podstawowa konfiguracja motywu.
 */
function mdp_setup() {
	load_theme_textdomain( 'maison-du-pain', MDP_DIR . '/languages' );

	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );

	add_editor_style( 'assets/css/theme.css' );

	add_image_size( 'mdp-portrait', 1000, 1250, true );
	add_image_size( 'mdp-landscape', 1600, 1067, true );
}
add_action( 'after_setup_theme', 'mdp_setup' );

/**
 * Style i skrypty na froncie.
 */
function mdp_enqueue_assets() {
	wp_enqueue_style( 'maison-du-pain', MDP_URI . '/assets/css/theme.css', array(), MDP_VERSION );

	wp_enqueue_script(
		'maison-du-pain',
		MDP_URI . '/assets/js/theme.js',
		array(),
		MDP_VERSION,
		array(
			'in_footer' => true,
			'strategy'  => 'defer',
		)
	);
}
add_action( 'wp_enqueue_scripts', 'mdp_enqueue_assets' );

/**
 * Klasa "js" ustawiana jak najwcześniej – animacje pojawiania się działają
 * wyłącznie przy włączonym JavaScript (bez JS treść jest od razu widoczna).
 */
function mdp_js_class() {
	echo "<script>document.documentElement.classList.add('js');</script>\n";
}
add_action( 'wp_head', 'mdp_js_class', 0 );

/**
 * Wczesne ładowanie fontów nagłówków i zdjęcia hero.
 */
function mdp_preload() {
	printf(
		'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
		esc_url( MDP_URI . '/assets/fonts/cormorant-garamond-latin.woff2' )
	);
	if ( is_front_page() ) {
		printf(
			'<link rel="preload" href="%s" as="image" fetchpriority="high">' . "\n",
			esc_url( mdp_asset( 'hero-chleb-regaly.jpg' ) )
		);
	}
}
add_action( 'wp_head', 'mdp_preload', 1 );

/**
 * Kategorie wzorców (sekcje wielokrotnego użytku).
 */
function mdp_register_pattern_categories() {
	register_block_pattern_category(
		'maison-du-pain',
		array(
			'label'       => __( 'Maison du Pain – sekcje', 'maison-du-pain' ),
			'description' => __( 'Gotowe sekcje strony piekarni.', 'maison-du-pain' ),
		)
	);
	register_block_pattern_category(
		'maison-du-pain-products',
		array(
			'label'       => __( 'Maison du Pain – prezentacje wypieków', 'maison-du-pain' ),
			'description' => __( 'Edytorialne układy produktów.', 'maison-du-pain' ),
		)
	);
}
add_action( 'init', 'mdp_register_pattern_categories', 9 );

/**
 * Style bloków do wyboru w edytorze.
 */
function mdp_register_block_styles() {
	$styles = array(
		'core/button'    => array(
			'outline-light' => __( 'Kontur jasny', 'maison-du-pain' ),
			'outline-dark'  => __( 'Kontur ciemny', 'maison-du-pain' ),
			'text-arrow'    => __( 'Link ze strzałką', 'maison-du-pain' ),
		),
		'core/image'     => array(
			'arch'  => __( 'Łuk', 'maison-du-pain' ),
			'frame' => __( 'Passe-partout', 'maison-du-pain' ),
		),
		'core/separator' => array(
			'ornament' => __( 'Ornament', 'maison-du-pain' ),
		),
		'core/paragraph' => array(
			'eyebrow' => __( 'Nadtytuł', 'maison-du-pain' ),
		),
		'core/heading'   => array(
			'eyebrow' => __( 'Nadtytuł', 'maison-du-pain' ),
		),
	);

	foreach ( $styles as $block => $variations ) {
		foreach ( $variations as $name => $label ) {
			register_block_style(
				$block,
				array(
					'name'  => $name,
					'label' => $label,
				)
			);
		}
	}
}
add_action( 'init', 'mdp_register_block_styles' );
