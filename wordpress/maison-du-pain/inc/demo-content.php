<?php
/**
 * Import przykładowych wypieków (jednym kliknięciem, na żądanie administratora).
 * Wypieki → Przykładowe wypieki.
 *
 * @package MaisonDuPain
 */

defined( 'ABSPATH' ) || exit;

/**
 * Lista przykładowych wypieków.
 *
 * @return array
 */
function mdp_demo_products() {
	return array(
		array( 'Pain au levain', 'chleby', 'chleb-w-dloniach.jpg', '18 zł', '800 g', 'Pszenno-żytni chleb na naturalnym zakwasie, fermentowany 48 godzin. Chrupiąca, karmelowa skórka i wilgotny, sprężysty miąższ.' ),
		array( 'Żytni razowy z ziarnami', 'chleby', 'chleb-zytni.jpg', '16 zł', '700 g', 'Ciemny chleb z mąki żytniej typ 2000, ze słonecznikiem, siemieniem lnianym i nutą palonego słodu.' ),
		array( 'Baguette de tradition', 'chleby', 'bagietki.jpg', '9 zł', '280 g', 'Klasyczna bagietka z francuskiej mąki T65, wypiekana trzy razy dziennie – ostatnia partia o 15:00.' ),
		array( 'Croissant au beurre', 'viennoiserie', 'croissant-au-beurre.jpg', '8 zł', '1 szt.', 'Dwadzieścia siedem warstw normandzkiego masła. Laminowany ręcznie, wypiekany co rano od 5:30.' ),
		array( 'Pain au chocolat', 'viennoiserie', 'pain-au-chocolat.jpg', '9 zł', '1 szt.', 'Ciasto croissantowe z dwiema laskami gorzkiej czekolady 70%.' ),
		array( 'Cynamonka z kardamonem', 'viennoiserie', 'cynamonka.jpg', '10 zł', '1 szt.', 'Drożdżowe ślimaki z cynamonem, świeżo mielonym kardamonem i glazurą z brązowego masła.' ),
		array( 'Bułka orkiszowa', 'bulki', 'bulki-rzemieslnicze.jpg', '3,50 zł', '90 g', 'Na zakwasie orkiszowym, z chrupiącą skórką. Idealna do śniadaniowej kanapki.' ),
		array( 'Maślana brioszka', 'bulki', 'bulki-maslane.jpg', '4 zł', '70 g', 'Puszysta bułka na maśle i jajach z wolnego wybiegu, z delikatnie słodką skórką.' ),
		array( 'Tarte au citron', 'ciasta-i-desery', 'tarta-cytrynowa.jpg', '16 zł', 'kawałek', 'Kruchy spód z masłem, aksamitny krem cytrynowy i suszone plastry cytrusów.' ),
		array( 'Gâteau fraisier', 'ciasta-i-desery', 'tort-biszkoptowy.jpg', '15 zł', 'kawałek', 'Puszysty biszkopt, krem z wanilii Bourbon i warstwa konfitury truskawkowej.' ),
		array( 'Tarta jabłkowa w kratkę', 'ciasta-i-desery', 'tarta-kratka.jpg', '14 zł', 'kawałek', 'Jabłka z lokalnego sadu, cynamon i kruche ciasto na maśle – jak u babci, tylko odrobinę lepiej.' ),
	);
}

/**
 * Kategorie przykładowych wypieków.
 *
 * @return array
 */
function mdp_demo_categories() {
	return array(
		'chleby'          => __( 'Chleby', 'maison-du-pain' ),
		'viennoiserie'    => __( 'Viennoiserie', 'maison-du-pain' ),
		'bulki'           => __( 'Bułki', 'maison-du-pain' ),
		'ciasta-i-desery' => __( 'Ciasta i desery', 'maison-du-pain' ),
	);
}

/**
 * Podstrona w menu „Wypieki”.
 */
function mdp_demo_menu() {
	add_submenu_page(
		'edit.php?post_type=mdp_wypiek',
		__( 'Przykładowe wypieki', 'maison-du-pain' ),
		__( 'Przykładowe wypieki', 'maison-du-pain' ),
		'manage_options',
		'mdp-demo',
		'mdp_demo_page'
	);
}
add_action( 'admin_menu', 'mdp_demo_menu' );

/**
 * Widok podstrony importu.
 */
function mdp_demo_page() {
	$done = isset( $_GET['zaimportowano'] ) ? absint( $_GET['zaimportowano'] ) : null; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Przykładowe wypieki', 'maison-du-pain' ); ?></h1>
		<?php if ( null !== $done ) : ?>
			<div class="notice notice-success"><p>
				<?php
				/* translators: %d: number of products */
				printf( esc_html__( 'Dodano wypieków: %d. Zobacz je na stronie /oferta/.', 'maison-du-pain' ), (int) $done );
				?>
			</p></div>
		<?php endif; ?>
		<p><?php esc_html_e( 'Dodaje 11 przykładowych wypieków (z kategoriami, cenami i zdjęciami) – możesz je potem dowolnie edytować lub usunąć. Wypieki o tej samej nazwie nie są dublowane.', 'maison-du-pain' ); ?></p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="mdp_import_demo">
			<?php wp_nonce_field( 'mdp_import_demo' ); ?>
			<?php submit_button( __( 'Importuj przykładowe wypieki', 'maison-du-pain' ) ); ?>
		</form>
	</div>
	<?php
}

/**
 * Import – tworzy kategorie, wpisy i załączniki.
 *
 * @return int Liczba utworzonych wypieków.
 */
function mdp_import_demo_products() {
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	$terms = array();
	foreach ( mdp_demo_categories() as $slug => $name ) {
		$term = get_term_by( 'slug', $slug, 'mdp_kategoria' );
		if ( ! $term ) {
			$result = wp_insert_term( $name, 'mdp_kategoria', array( 'slug' => $slug ) );
			$terms[ $slug ] = is_wp_error( $result ) ? 0 : (int) $result['term_id'];
		} else {
			$terms[ $slug ] = (int) $term->term_id;
		}
	}

	$created = 0;
	foreach ( mdp_demo_products() as $order => $p ) {
		list( $title, $cat, $image, $price, $weight, $excerpt ) = $p;

		$existing = get_posts(
			array(
				'post_type'      => 'mdp_wypiek',
				'title'          => $title,
				'post_status'    => 'any',
				'posts_per_page' => 1,
				'fields'         => 'ids',
			)
		);
		if ( $existing ) {
			continue;
		}

		$post_id = wp_insert_post(
			array(
				'post_type'    => 'mdp_wypiek',
				'post_status'  => 'publish',
				'post_title'   => $title,
				'post_excerpt' => $excerpt,
				'post_content' => '<!-- wp:paragraph -->' . "\n" . '<p>' . esc_html( $excerpt ) . ' ' . esc_html__( 'Skład i alergeny podajemy w piekarni – zapytaj nas przy ladzie.', 'maison-du-pain' ) . '</p>' . "\n" . '<!-- /wp:paragraph -->',
				'menu_order'   => $order,
				'meta_input'   => array(
					'mdp_cena'      => $price,
					'mdp_gramatura' => $weight,
				),
			),
			true
		);
		if ( is_wp_error( $post_id ) ) {
			continue;
		}
		if ( ! empty( $terms[ $cat ] ) ) {
			wp_set_object_terms( $post_id, array( $terms[ $cat ] ), 'mdp_kategoria' );
		}

		$source = MDP_DIR . '/assets/images/' . $image;
		if ( file_exists( $source ) ) {
			$tmp = wp_tempnam( $image );
			if ( $tmp && copy( $source, $tmp ) ) {
				$attachment_id = media_handle_sideload(
					array(
						'name'     => $image,
						'tmp_name' => $tmp,
					),
					$post_id,
					$title
				);
				if ( ! is_wp_error( $attachment_id ) ) {
					update_post_meta( $attachment_id, '_wp_attachment_image_alt', $title );
					set_post_thumbnail( $post_id, $attachment_id );
				} else {
					wp_delete_file( $tmp );
				}
			}
		}
		++$created;
	}

	flush_rewrite_rules();
	return $created;
}

/**
 * Obsługa przycisku importu.
 */
function mdp_handle_import_demo() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Brak uprawnień.', 'maison-du-pain' ) );
	}
	check_admin_referer( 'mdp_import_demo' );
	$created = mdp_import_demo_products();
	wp_safe_redirect( admin_url( 'edit.php?post_type=mdp_wypiek&page=mdp-demo&zaimportowano=' . $created ) );
	exit;
}
add_action( 'admin_post_mdp_import_demo', 'mdp_handle_import_demo' );

/**
 * Komunikat po aktywacji motywu, dopóki nie ma żadnych wypieków.
 */
function mdp_demo_notice() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$screen = get_current_screen();
	if ( $screen && 'mdp_wypiek_page_mdp-demo' === $screen->id ) {
		return;
	}
	$count = wp_count_posts( 'mdp_wypiek' );
	if ( $count && ( (int) $count->publish + (int) $count->draft ) > 0 ) {
		return;
	}
	printf(
		'<div class="notice notice-info"><p><strong>Maison du Pain:</strong> %s <a href="%s">%s</a></p></div>',
		esc_html__( 'Strona główna jest gotowa. Chcesz też wypełnić katalog /oferta/ przykładowymi wypiekami?', 'maison-du-pain' ),
		esc_url( admin_url( 'edit.php?post_type=mdp_wypiek&page=mdp-demo' ) ),
		esc_html__( 'Importuj przykładowe wypieki', 'maison-du-pain' )
	);
}
add_action( 'admin_notices', 'mdp_demo_notice' );
