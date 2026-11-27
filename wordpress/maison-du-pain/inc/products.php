<?php
/**
 * Typ treści „Wypieki” – produkty piekarni edytowane w Gutenbergu.
 *
 * Wypieki mają zdjęcie wyróżniające, zajawkę (krótki opis), kategorię
 * oraz pola „Cena” i „Gramatura” (panel w prawym pasku edytora).
 * Lista wypieków jest dostępna pod adresem /oferta/.
 *
 * @package MaisonDuPain
 */

defined( 'ABSPATH' ) || exit;

/**
 * Rejestracja typu treści, taksonomii i pól.
 */
function mdp_register_products() {
	register_post_type(
		'mdp_wypiek',
		array(
			'labels'        => array(
				'name'               => __( 'Wypieki', 'maison-du-pain' ),
				'singular_name'      => __( 'Wypiek', 'maison-du-pain' ),
				'add_new'            => __( 'Dodaj wypiek', 'maison-du-pain' ),
				'add_new_item'       => __( 'Dodaj nowy wypiek', 'maison-du-pain' ),
				'edit_item'          => __( 'Edytuj wypiek', 'maison-du-pain' ),
				'new_item'           => __( 'Nowy wypiek', 'maison-du-pain' ),
				'view_item'          => __( 'Zobacz wypiek', 'maison-du-pain' ),
				'search_items'       => __( 'Szukaj wypieków', 'maison-du-pain' ),
				'not_found'          => __( 'Nie znaleziono wypieków.', 'maison-du-pain' ),
				'not_found_in_trash' => __( 'Brak wypieków w koszu.', 'maison-du-pain' ),
				'all_items'          => __( 'Wszystkie wypieki', 'maison-du-pain' ),
				'menu_name'          => __( 'Wypieki', 'maison-du-pain' ),
			),
			'public'        => true,
			'show_in_rest'  => true,
			'has_archive'   => 'oferta',
			'rewrite'       => array(
				'slug'       => 'oferta',
				'with_front' => false,
			),
			'menu_icon'     => 'dashicons-carrot',
			'menu_position' => 20,
			'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes', 'custom-fields', 'revisions' ),
			'template'      => array(
				array(
					'core/paragraph',
					array( 'placeholder' => __( 'Pełny opis wypieku: skład, sposób wypieku, alergeny…', 'maison-du-pain' ) ),
				),
			),
		)
	);

	register_taxonomy(
		'mdp_kategoria',
		'mdp_wypiek',
		array(
			'labels'            => array(
				'name'          => __( 'Kategorie wypieków', 'maison-du-pain' ),
				'singular_name' => __( 'Kategoria wypieku', 'maison-du-pain' ),
				'menu_name'     => __( 'Kategorie', 'maison-du-pain' ),
				'add_new_item'  => __( 'Dodaj kategorię', 'maison-du-pain' ),
				'edit_item'     => __( 'Edytuj kategorię', 'maison-du-pain' ),
			),
			'hierarchical'      => true,
			'show_in_rest'      => true,
			'show_admin_column' => true,
			'rewrite'           => array(
				'slug'       => 'oferta/kategoria',
				'with_front' => false,
			),
		)
	);

	$meta = array(
		'mdp_cena'      => __( 'Cena, np. „18 zł”', 'maison-du-pain' ),
		'mdp_gramatura' => __( 'Gramatura / porcja, np. „800 g”', 'maison-du-pain' ),
	);
	foreach ( $meta as $key => $description ) {
		register_post_meta(
			'mdp_wypiek',
			$key,
			array(
				'type'              => 'string',
				'description'       => $description,
				'single'            => true,
				'default'           => '',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'mdp_register_products' );

/**
 * Panel „Cena i gramatura” w edytorze wypieku.
 */
function mdp_product_editor_assets() {
	$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
	if ( ! $screen || 'mdp_wypiek' !== $screen->post_type ) {
		return;
	}
	wp_enqueue_script(
		'mdp-product-panel',
		MDP_URI . '/assets/js/product-panel.js',
		array( 'wp-plugins', 'wp-editor', 'wp-element', 'wp-components', 'wp-data', 'wp-core-data', 'wp-i18n' ),
		MDP_VERSION,
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'mdp_product_editor_assets' );

/**
 * Kolejność wypieków w archiwum: wg pola „Kolejność”, potem alfabetycznie.
 *
 * @param WP_Query $query Zapytanie.
 */
function mdp_products_order( $query ) {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}
	if ( $query->is_post_type_archive( 'mdp_wypiek' ) || $query->is_tax( 'mdp_kategoria' ) ) {
		$query->set( 'orderby', array( 'menu_order' => 'ASC', 'title' => 'ASC' ) );
		$query->set( 'posts_per_page', 24 );
	}
}
add_action( 'pre_get_posts', 'mdp_products_order' );

/**
 * Blok „Cena” wewnątrz pętli zapytań – źródło powiązań bloków (Block Bindings)
 * zwracające sformatowaną cenę i gramaturę wypieku.
 */
function mdp_register_binding_source() {
	if ( ! function_exists( 'register_block_bindings_source' ) ) {
		return;
	}
	register_block_bindings_source(
		'maison-du-pain/product-price',
		array(
			'label'              => __( 'Cena wypieku', 'maison-du-pain' ),
			'get_value_callback' => function ( $source_args, $block_instance ) {
				$post_id = isset( $block_instance->context['postId'] ) ? (int) $block_instance->context['postId'] : get_the_ID();
				if ( ! $post_id ) {
					return null;
				}
				$price  = get_post_meta( $post_id, 'mdp_cena', true );
				$weight = get_post_meta( $post_id, 'mdp_gramatura', true );
				$field = isset( $source_args['key'] ) ? $source_args['key'] : 'both';
				if ( 'mdp_cena' === $field ) {
					return $price;
				}
				if ( 'mdp_gramatura' === $field ) {
					return $weight;
				}
				return implode( ' · ', array_filter( array( $price, $weight ) ) );
			},
			'uses_context'       => array( 'postId', 'postType' ),
		)
	);
}
add_action( 'init', 'mdp_register_binding_source' );

/**
 * Po przełączeniu motywu odśwież reguły adresów (archiwum /oferta/).
 */
function mdp_flush_rewrites() {
	mdp_register_products();
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'mdp_flush_rewrites' );
