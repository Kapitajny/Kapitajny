<?php
/**
 * Title: Sklep – sekcja otwierająca
 * Slug: computerit-shop/store-hero
 * Categories: computerit-shop, banner
 * Description: Nagłówek strony głównej sklepu z wezwaniem do działania.
 *
 * @package ComputerIT_Shop
 */
?>
<!-- wp:group {"align":"wide","backgroundColor":"surface","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|50","right":"var:preset|spacing|50"},"margin":{"top":"var:preset|spacing|40"}},"border":{"radius":"var:custom|radius"}},"layout":{"type":"constrained","contentSize":"640px","justifyContent":"left"}} -->
<div class="wp-block-group alignwide has-surface-background-color has-background" style="border-radius:var(--wp--custom--radius);margin-top:var(--wp--preset--spacing--40);padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50)"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading"><?php echo esc_html__( 'Sprzęt do pracy i domu', 'computerit-shop' ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"large"} -->
<p class="has-large-font-size"><?php echo esc_html__( 'Laptopy, monitory i akcesoria z wysyłką w 24 godziny. Zmień ten tekst w edytorze witryny.', 'computerit-shop' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/sklep/' ) ); ?>"><?php echo esc_html__( 'Przejdź do sklepu', 'computerit-shop' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->
