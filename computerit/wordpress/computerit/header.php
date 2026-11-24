<?php
/**
 * Nagłówek: logo computerit + menu główne.
 *
 * @package computerit
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#tresc">Przejdź do treści</a>

<header class="site-header">
	<div class="site-header__inner">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo" rel="home" aria-label="computerit – strona główna">
			<svg class="site-logo__mark" viewBox="10 10 415 800" fill="currentColor" aria-hidden="true" focusable="false">
				<path d="M15 408 68 368V716l-21 5-5 5 5 3 133 28 160-18 80 18-190 46L15 742Z" />
				<path d="M85 222 119 196 125 15 132 140 138 148V712H85Z" />
				<path d="M152 293 182 320V709H152Z" />
				<path d="M200 488 245 525V704H200Z" />
				<path d="M220 712 325 733 330 737 222 717Z" />
			</svg>
			<span class="site-logo__name">computerit</span>
		</a>

		<nav class="site-nav" aria-label="Menu główne">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'site-nav__list',
					'depth'          => 1,
					'fallback_cb'    => 'computerit_menu_fallback',
				)
			);
			?>
		</nav>
	</div>
</header>

<main id="tresc" class="site-main">
