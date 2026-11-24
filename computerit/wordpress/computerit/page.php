<?php
/**
 * Strony: Strona główna, O mnie, Cennik, Portfolio, Kontakt itd.
 *
 * Na stronie głównej nagłówkiem jest motto witryny
 * (Ustawienia → Ogólne → Motto), np. „Technologia z nowej perspektywy”.
 *
 * @package computerit
 */

get_header();

while ( have_posts() ) :
	the_post();
	$computerit_title = is_front_page() && get_bloginfo( 'description' ) ? get_bloginfo( 'description' ) : get_the_title();
	?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?>>
		<h1 class="entry__title"><?php echo esc_html( $computerit_title ); ?></h1>
		<div class="entry__content">
			<?php the_content(); ?>
		</div>
	</article>
	<?php
endwhile;

get_footer();
