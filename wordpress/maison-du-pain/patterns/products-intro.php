<?php
/**
 * Title: Wypieki – wprowadzenie do oferty
 * Slug: maison-du-pain/products-intro
 * Categories: maison-du-pain, maison-du-pain-products
 * Keywords: produkty, oferta, wypieki
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"tagName":"section","anchor":"produkty","align":"full","className":"mdp-section mdp-products mdp-products-intro","backgroundColor":"ivory","layout":{"type":"constrained"}} -->
<section id="produkty" class="wp-block-group alignfull mdp-section mdp-products mdp-products-intro has-ivory-background-color has-background"><!-- wp:separator {"align":"wide","className":"is-style-ornament"} -->
<hr class="wp-block-separator alignwide has-alpha-channel-opacity is-style-ornament"/>
<!-- /wp:separator -->

<!-- wp:columns {"verticalAlignment":"bottom","align":"wide"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-bottom"><!-- wp:column {"verticalAlignment":"bottom","width":"62%"} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:62%"><?php echo mdp_section_label( '02', __( 'Nasze wypieki', 'maison-du-pain' ) ); ?>

<!-- wp:heading {"className":"mdp-display"} -->
<h2 class="wp-block-heading mdp-display"><?php echo wp_kses_post( __( 'Katalog codziennych <em>przyjemności</em>', 'maison-du-pain' ) ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"bottom","width":"38%"} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:38%"><!-- wp:paragraph -->
<p><?php esc_html_e( 'Cztery rozdziały, jedna zasada: piec nie zna pośpiechu. Wypieki można zamówić dzień wcześniej do 14:00 — odbierzesz je ciepłe, prosto z porannego wypieku.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"mdp-chapters-index"} -->
<p class="mdp-chapters-index"><a href="#chleby">I. Chleby</a> <a href="#viennoiserie">II. Viennoiserie</a> <a href="#bulki">III. Bułki</a> <a href="#desery">IV. Ciasta i desery</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->
