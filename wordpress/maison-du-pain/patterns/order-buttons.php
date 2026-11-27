<?php
/**
 * Title: Przyciski zamówienia
 * Slug: maison-du-pain/order-buttons
 * Categories: maison-du-pain
 * Keywords: zamów, przycisk
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo mdp_anchor( 'kontakt' ); ?>"><?php esc_html_e( 'Zamów na jutro', 'maison-du-pain' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-text-arrow"} -->
<div class="wp-block-button is-style-text-arrow"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/oferta/' ) ); ?>"><?php esc_html_e( 'Cała oferta', 'maison-du-pain' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->
