<?php
/**
 * Title: Oferta – edytorialna lista wypieków (pętla)
 * Slug: maison-du-pain/catalog-loop
 * Categories: maison-du-pain-products
 * Keywords: oferta, wypieki, lista, pętla
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"align":"full","className":"mdp-section mdp-archive","backgroundColor":"ivory","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull mdp-section mdp-archive has-ivory-background-color has-background"><!-- wp:query {"queryId":7,"query":{"perPage":24,"pages":0,"offset":0,"postType":"mdp_wypiek","order":"asc","orderBy":"menu_order","inherit":true},"align":"wide"} -->
<div class="wp-block-query alignwide"><!-- wp:post-template {"className":"mdp-catalog","layout":{"type":"default"}} -->
<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/5","className":"mdp-catalog__media"} /-->

<!-- wp:group {"className":"mdp-catalog__body","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-catalog__body"><!-- wp:post-terms {"term":"mdp_kategoria","className":"mdp-catalog__terms"} /-->

<!-- wp:post-title {"level":2,"isLink":true,"className":"mdp-catalog__title"} /-->

<!-- wp:post-excerpt {"className":"mdp-catalog__excerpt"} /-->

<!-- wp:group {"className":"mdp-product__footer","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group mdp-product__footer"><!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"maison-du-pain/product-price"}}},"className":"mdp-product__price"} -->
<p class="mdp-product__price"></p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-text-arrow"} -->
<div class="wp-block-button is-style-text-arrow"><a class="wp-block-button__link wp-element-button" href="<?php echo mdp_anchor( 'kontakt' ); ?>"><?php esc_html_e( 'Zamów', 'maison-du-pain' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"}} -->
<!-- wp:query-pagination-previous /-->

<!-- wp:query-pagination-numbers /-->

<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->

<!-- wp:query-no-results -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center"><?php esc_html_e( 'Katalog jest jeszcze pusty. Dodaj wypieki w panelu: Wypieki → Dodaj wypiek (lub Wypieki → Przykładowe wypieki).', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query --></div>
<!-- /wp:group -->
