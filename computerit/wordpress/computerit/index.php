<?php
/**
 * Szablon domyślny: wpisy, archiwa, wyszukiwanie, 404.
 *
 * @package computerit
 */

get_header();

if ( have_posts() ) :
	while ( have_posts() ) :
		the_post();
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?>>
			<?php if ( is_singular() ) : ?>
				<h1 class="entry__title"><?php the_title(); ?></h1>
				<div class="entry__content">
					<?php the_content(); ?>
				</div>
			<?php else : ?>
				<h2 class="entry__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
				<div class="entry__content">
					<?php the_excerpt(); ?>
				</div>
			<?php endif; ?>
		</article>
		<?php
	endwhile;

	the_posts_pagination();
else :
	?>
	<article class="entry">
		<h1 class="entry__title">Nie znaleziono strony</h1>
		<div class="entry__content">
			<p>Tej strony nie ma. <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Wróć na stronę główną</a>.</p>
		</div>
	</article>
	<?php
endif;

get_footer();
