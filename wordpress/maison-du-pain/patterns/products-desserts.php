<?php
/**
 * Title: Wypieki IV – Ciasta i desery (panorama z kartą + duet)
 * Slug: maison-du-pain/products-desserts
 * Categories: maison-du-pain, maison-du-pain-products
 * Keywords: ciasta, desery, tarta, produkty
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"tagName":"section","anchor":"desery","align":"full","className":"mdp-products mdp-chapter mdp-chapter--desserts","backgroundColor":"ivory","layout":{"type":"constrained"}} -->
<section id="desery" class="wp-block-group alignfull mdp-products mdp-chapter mdp-chapter--desserts has-ivory-background-color has-background"><?php echo mdp_chapter_head( 'IV', __( 'Ciasta i desery', 'maison-du-pain' ), __( 'Małe partie · owoce z sezonu · na kawałki i w całości', 'maison-du-pain' ) ); ?>

<!-- wp:group {"align":"wide","className":"mdp-showcase","layout":{"type":"default"}} -->
<div class="wp-block-group alignwide mdp-showcase"><?php echo mdp_image( 'tarta-cytrynowa.jpg', __( 'Tarta cytrynowa z suszonymi plastrami cytrusów na ciemnym tle', 'maison-du-pain' ), array( 'ratio' => '16/9', 'class' => 'mdp-product__img mdp-showcase__img', 'focal' => array( 0.5, 0.5 ) ) ); ?>

<!-- wp:group {"className":"mdp-showcase__card","backgroundColor":"ivory","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-showcase__card has-ivory-background-color has-background"><?php
echo mdp_product_meta(
	array(
		'eyebrow' => __( 'Deser sezonu', 'maison-du-pain' ),
		'name'    => 'Tarte au citron',
		'desc'    => __( 'Kruchy spód na maśle, aksamitny krem z cytryn z Amalfi i suszone plastry cytrusów. Cała tarta na 8 osób — 120 zł, zamówienia z dnia na dzień.', 'maison-du-pain' ),
		'price'   => __( '16 zł / kawałek', 'maison-du-pain' ),
	)
);
?></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:columns {"align":"wide","className":"mdp-duo"} -->
<div class="wp-block-columns alignwide mdp-duo"><!-- wp:column {"width":"30%","className":"mdp-duo__quote"} -->
<div class="wp-block-column mdp-duo__quote" style="flex-basis:30%"><!-- wp:paragraph {"className":"mdp-pullquote"} -->
<p class="mdp-pullquote"><?php echo wp_kses_post( __( 'Desery pieczemy <em>w małych partiach</em> — dlatego w weekend potrafią zniknąć przed południem.', 'maison-du-pain' ) ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"mdp-muted"} -->
<p class="mdp-muted"><?php esc_html_e( 'Torty i tarty okolicznościowe przygotujemy na zamówienie złożone minimum 3 dni wcześniej.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"36%"} -->
<div class="wp-block-column" style="flex-basis:36%"><?php echo mdp_image( 'tort-biszkoptowy.jpg', __( 'Kawałek tortu biszkoptowego z kremem i truskawką na talerzu', 'maison-du-pain' ), array( 'ratio' => '4/5', 'class' => 'mdp-product__img', 'focal' => array( 0.5, 0.5 ) ) ); ?>

<?php
echo mdp_product_meta(
	array(
		'eyebrow' => __( 'Kawałek', 'maison-du-pain' ),
		'name'    => 'Gâteau fraisier',
		'desc'    => __( 'Puszysty biszkopt, krem z wanilii Bourbon i warstwa konfitury truskawkowej.', 'maison-du-pain' ),
		'price'   => '15 zł',
	)
);
?></div>
<!-- /wp:column -->

<!-- wp:column {"width":"34%","className":"mdp-duo__low"} -->
<div class="wp-block-column mdp-duo__low" style="flex-basis:34%"><?php echo mdp_image( 'tarta-kratka.jpg', __( 'Domowe tarty jabłkowe z kruszonką w kratkę', 'maison-du-pain' ), array( 'ratio' => '1/1', 'class' => 'mdp-product__img', 'focal' => array( 0.5, 0.5 ) ) ); ?>

<?php
echo mdp_product_meta(
	array(
		'eyebrow' => __( 'Kawałek', 'maison-du-pain' ),
		'name'    => __( 'Tarta jabłkowa w kratkę', 'maison-du-pain' ),
		'desc'    => __( 'Jabłka z lokalnego sadu, cynamon i kruche ciasto na maśle.', 'maison-du-pain' ),
		'price'   => '14 zł',
	)
);
?></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:buttons {"align":"wide","className":"mdp-products__more","layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons alignwide mdp-products__more"><!-- wp:button {"className":"is-style-outline-dark"} -->
<div class="wp-block-button is-style-outline-dark"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/oferta/' ) ); ?>"><?php esc_html_e( 'Zobacz pełną ofertę', 'maison-du-pain' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></section>
<!-- /wp:group -->
