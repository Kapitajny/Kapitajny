<?php
/**
 * Zmienia tytuł i adres (slug) strony bez ponownej walidacji przypisanego szablonu.
 * WooCommerce przypisuje stronom koszyka i zamówienia szablony blokowe; wp_update_post()
 * odrzuca je przy zapisie w motywach, które ich nie mają, choć sam tytuł można zmienić.
 * Użycie: wp eval-file tools/rename-page.php <id> "<tytuł>" <slug>
 */
[ $id, $title, $slug ] = array_map( 'strval', array_slice( $args, 0, 3 ) );
$id = (int) $id;
if ( ! $id || ! get_post( $id ) ) {
	WP_CLI::error( "Brak strony o ID $id" );
}
global $wpdb;
$wpdb->update(
	$wpdb->posts,
	[
		'post_title'  => sanitize_text_field( $title ),
		'post_name'   => wp_unique_post_slug( sanitize_title( $slug ), $id, 'publish', 'page', 0 ),
		'post_status' => 'publish',
	],
	[ 'ID' => $id ]
);
clean_post_cache( $id );
WP_CLI::success( "Strona $id: $title" );
