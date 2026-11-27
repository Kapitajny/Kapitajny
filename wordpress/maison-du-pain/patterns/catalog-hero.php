<?php
/**
 * Title: Oferta – ciemny nagłówek katalogu
 * Slug: maison-du-pain/catalog-hero
 * Categories: maison-du-pain-products
 * Inserter: no
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"align":"full","className":"mdp-page-hero mdp-catalog-hero","backgroundColor":"espresso","textColor":"cream","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull mdp-page-hero mdp-catalog-hero has-cream-color has-espresso-background-color has-text-color has-background"><!-- wp:paragraph {"className":"is-style-eyebrow"} -->
<p class="is-style-eyebrow"><?php esc_html_e( 'La carte — pełna oferta', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:query-title {"type":"archive","showPrefix":false,"level":1,"className":"mdp-page-hero__title"} /-->

<!-- wp:paragraph {"className":"mdp-page-hero__lead"} -->
<p class="mdp-page-hero__lead"><?php esc_html_e( 'Wszystko, co dziś wyjdzie z naszego pieca. Zamówienia na kolejny dzień przyjmujemy do 14:00.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:categories {"taxonomy":"mdp_kategoria","showEmpty":false,"className":"mdp-filter"} /--></div>
<!-- /wp:group -->
