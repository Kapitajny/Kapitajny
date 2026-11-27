<?php
/**
 * Title: Wypieki I – Chleby (duże zdjęcie + asymetryczne opisy)
 * Slug: maison-du-pain/products-bread
 * Categories: maison-du-pain, maison-du-pain-products
 * Keywords: chleb, produkty, zakwas
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"tagName":"section","anchor":"chleby","align":"full","className":"mdp-products mdp-chapter mdp-chapter--bread","backgroundColor":"ivory","layout":{"type":"constrained"}} -->
<section id="chleby" class="wp-block-group alignfull mdp-products mdp-chapter mdp-chapter--bread has-ivory-background-color has-background"><?php echo mdp_chapter_head( 'I', __( 'Chleby', 'maison-du-pain' ), __( 'Naturalny zakwas · 48 h fermentacji · piec opalany drewnem', 'maison-du-pain' ) ); ?>

<!-- wp:columns {"align":"wide","className":"mdp-feature"} -->
<div class="wp-block-columns alignwide mdp-feature"><!-- wp:column {"width":"60%","className":"mdp-feature__media"} -->
<div class="wp-block-column mdp-feature__media" style="flex-basis:60%"><?php echo mdp_image( 'chleb-w-dloniach.jpg', __( 'Bochenek chleba na zakwasie z naciętą, karmelową skórką trzymany w dłoniach', 'maison-du-pain' ), array( 'ratio' => '1/1', 'class' => 'mdp-product__img mdp-product__img--hero', 'focal' => array( 0.4, 0.5 ) ) ); ?></div>
<!-- /wp:column -->

<!-- wp:column {"width":"40%","className":"mdp-feature__aside"} -->
<div class="wp-block-column mdp-feature__aside" style="flex-basis:40%"><?php
echo mdp_product_meta(
	array(
		'eyebrow' => __( 'Bestseller · 800 g', 'maison-du-pain' ),
		'name'    => 'Pain au levain',
		'desc'    => __( 'Pszenno-żytni chleb na naturalnym zakwasie. Chrupiąca, karmelowa skórka, wilgotny i sprężysty miąższ, delikatna kwasowość. Najlepszy w dniu wypieku, wspaniały jeszcze przez trzy kolejne.', 'maison-du-pain' ),
		'price'   => '18 zł',
		'class'   => 'mdp-product__meta--lead',
	)
);
?>

<?php echo mdp_image( 'chleb-zytni.jpg', __( 'Ciemny chleb żytni z ziarnami na drewnianej desce', 'maison-du-pain' ), array( 'ratio' => '4/3', 'class' => 'mdp-product__img mdp-product__img--small', 'focal' => array( 0.5, 0.55 ) ) ); ?>

<?php
echo mdp_product_meta(
	array(
		'eyebrow' => __( '700 g', 'maison-du-pain' ),
		'name'    => __( 'Żytni razowy z ziarnami', 'maison-du-pain' ),
		'desc'    => __( 'Mąka żytnia typ 2000, słonecznik, siemię lniane i nuta palonego słodu.', 'maison-du-pain' ),
		'price'   => '16 zł',
	)
);
?></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:columns {"verticalAlignment":"center","align":"wide","className":"mdp-feature mdp-feature--reverse"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center mdp-feature mdp-feature--reverse"><!-- wp:column {"verticalAlignment":"center","width":"34%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:34%"><?php
echo mdp_product_meta(
	array(
		'eyebrow' => __( '280 g · trzy wypieki dziennie', 'maison-du-pain' ),
		'name'    => 'Baguette de tradition',
		'desc'    => __( 'Francuska mąka T65, długa fermentacja w chłodzie i ręczne formowanie. Ostatnia partia wychodzi z pieca o 15:00.', 'maison-du-pain' ),
		'price'   => '9 zł',
	)
);
?></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"66%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:66%"><?php echo mdp_image( 'bagietki.jpg', __( 'Złociste bagietki oprószone mąką na ciemnym blacie', 'maison-du-pain' ), array( 'ratio' => '16/9', 'class' => 'mdp-product__img', 'focal' => array( 0.5, 0.5 ) ) ); ?></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->
