<?php
/**
 * Title: Wypieki III – Bułki (schodkowy tryptyk)
 * Slug: maison-du-pain/products-rolls
 * Categories: maison-du-pain, maison-du-pain-products
 * Keywords: bułki, brioszka, produkty
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"tagName":"section","anchor":"bulki","align":"full","className":"mdp-products mdp-chapter mdp-chapter--rolls","backgroundColor":"ivory","layout":{"type":"constrained"}} -->
<section id="bulki" class="wp-block-group alignfull mdp-products mdp-chapter mdp-chapter--rolls has-ivory-background-color has-background"><?php echo mdp_chapter_head( 'III', __( 'Bułki i poranne pieczywo', 'maison-du-pain' ), __( 'Codziennie od 6:30 · do śniadania i na drogę', 'maison-du-pain' ) ); ?>

<!-- wp:columns {"align":"wide","className":"mdp-trio"} -->
<div class="wp-block-columns alignwide mdp-trio"><!-- wp:column {"width":"36%","className":"mdp-trio__item"} -->
<div class="wp-block-column mdp-trio__item" style="flex-basis:36%"><?php echo mdp_image( 'bulki-rzemieslnicze.jpg', __( 'Rzemieślnicze bułki z ziarnami na drewnianej desce', 'maison-du-pain' ), array( 'ratio' => '3/4', 'class' => 'mdp-product__img', 'focal' => array( 0.5, 0.5 ) ) ); ?>

<?php
echo mdp_product_meta(
	array(
		'eyebrow' => __( '90 g', 'maison-du-pain' ),
		'name'    => __( 'Bułka orkiszowa', 'maison-du-pain' ),
		'desc'    => __( 'Na zakwasie orkiszowym, z chrupiącą skórką i ziarnami.', 'maison-du-pain' ),
		'price'   => '3,50 zł',
	)
);
?></div>
<!-- /wp:column -->

<!-- wp:column {"width":"30%","className":"mdp-trio__item mdp-trio__item--low"} -->
<div class="wp-block-column mdp-trio__item mdp-trio__item--low" style="flex-basis:30%"><?php echo mdp_image( 'bulki-maslane.jpg', __( 'Złociste maślane bułki prosto z pieca', 'maison-du-pain' ), array( 'ratio' => '1/1', 'class' => 'mdp-product__img', 'focal' => array( 0.5, 0.5 ) ) ); ?>

<?php
echo mdp_product_meta(
	array(
		'eyebrow' => __( '70 g', 'maison-du-pain' ),
		'name'    => __( 'Maślana brioszka', 'maison-du-pain' ),
		'desc'    => __( 'Puszysta, na maśle i jajach z wolnego wybiegu.', 'maison-du-pain' ),
		'price'   => '4 zł',
	)
);
?></div>
<!-- /wp:column -->

<!-- wp:column {"width":"34%","className":"mdp-trio__item mdp-trio__item--lower"} -->
<div class="wp-block-column mdp-trio__item mdp-trio__item--lower" style="flex-basis:34%"><?php echo mdp_image( 'cynamonka.jpg', __( 'Cynamonka z lukrem na talerzu', 'maison-du-pain' ), array( 'ratio' => '4/5', 'class' => 'mdp-product__img', 'focal' => array( 0.5, 0.5 ) ) ); ?>

<?php
echo mdp_product_meta(
	array(
		'eyebrow' => __( '1 szt.', 'maison-du-pain' ),
		'name'    => __( 'Cynamonka z kardamonem', 'maison-du-pain' ),
		'desc'    => __( 'Ślimak drożdżowy z cynamonem, kardamonem i glazurą z brązowego masła.', 'maison-du-pain' ),
		'price'   => '10 zł',
	)
);
?></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->
