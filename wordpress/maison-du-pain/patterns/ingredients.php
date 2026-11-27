<?php
/**
 * Title: Naturalne składniki – lista i fotografia
 * Slug: maison-du-pain/ingredients
 * Categories: maison-du-pain, about
 * Keywords: składniki, mąka, naturalne
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

$mdp_ingredients = array(
	array( __( 'Mąka', 'maison-du-pain' ), __( 'pszenna T65 i żytnia T2000 z młynów kamiennych', 'maison-du-pain' ) ),
	array( __( 'Zakwas', 'maison-du-pain' ), __( 'ten sam od 1994 roku, dokarmiany dwa razy dziennie', 'maison-du-pain' ) ),
	array( __( 'Sól', 'maison-du-pain' ), __( 'niejodowana sól morska z Guérande', 'maison-du-pain' ) ),
	array( __( 'Woda', 'maison-du-pain' ), __( 'filtrowana, w temperaturze dobranej do pory roku', 'maison-du-pain' ) ),
	array( __( 'Masło', 'maison-du-pain' ), __( 'normandzkie, 84% tłuszczu, do ciasta francuskiego', 'maison-du-pain' ) ),
	array( __( 'Owoce', 'maison-du-pain' ), __( 'sezonowe, od sadowników spod miasta', 'maison-du-pain' ) ),
);
$mdp_promises    = array(
	__( 'Bez polepszaczy', 'maison-du-pain' ),
	__( 'Bez konserwantów', 'maison-du-pain' ),
	__( 'Bez mrożonych półproduktów', 'maison-du-pain' ),
	__( 'Lokalni dostawcy', 'maison-du-pain' ),
);
?>
<!-- wp:group {"tagName":"section","anchor":"skladniki","align":"full","className":"mdp-section mdp-ingredients","backgroundColor":"ivory","layout":{"type":"constrained"}} -->
<section id="skladniki" class="wp-block-group alignfull mdp-section mdp-ingredients has-ivory-background-color has-background"><!-- wp:columns {"align":"wide","className":"mdp-ingredients__grid"} -->
<div class="wp-block-columns alignwide mdp-ingredients__grid"><!-- wp:column {"width":"56%"} -->
<div class="wp-block-column" style="flex-basis:56%"><?php echo mdp_section_label( '04', __( 'Naturalne składniki', 'maison-du-pain' ) ); ?>

<!-- wp:heading -->
<h2 class="wp-block-heading"><?php echo wp_kses_post( __( 'Krótka lista. <em>Żadnych kompromisów.</em>', 'maison-du-pain' ) ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"mdp-lead"} -->
<p class="mdp-lead"><?php esc_html_e( 'Skład naszego chleba zmieści się na jednej linijce. Resztę robią czas, ręce i ogień.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"mdp-ingredient-list","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-ingredient-list"><?php foreach ( $mdp_ingredients as $mdp_i => $mdp_item ) : ?><!-- wp:group {"className":"mdp-ingredient","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-ingredient"><!-- wp:paragraph {"className":"mdp-ingredient__num"} -->
<p class="mdp-ingredient__num"><?php echo esc_html( sprintf( '%02d', $mdp_i + 1 ) ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4,"className":"mdp-ingredient__name"} -->
<h4 class="wp-block-heading mdp-ingredient__name"><?php echo esc_html( $mdp_item[0] ); ?></h4>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"mdp-ingredient__desc"} -->
<p class="mdp-ingredient__desc"><?php echo esc_html( $mdp_item[1] ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --><?php endforeach; ?></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"44%","className":"mdp-ingredients__visual"} -->
<div class="wp-block-column mdp-ingredients__visual" style="flex-basis:44%"><?php echo mdp_image( 'skladniki-maka.jpg', __( 'Miska mąki z drewnianą łyżką na lnianej ściereczce', 'maison-du-pain' ), array( 'ratio' => '4/5', 'class' => 'is-style-frame', 'focal' => array( 0.5, 0.5 ) ) ); ?>

<!-- wp:group {"className":"mdp-stamp","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-stamp"><!-- wp:paragraph {"className":"mdp-stamp__num"} -->
<p class="mdp-stamp__num">0 g</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"mdp-stamp__label"} -->
<p class="mdp-stamp__label"><?php esc_html_e( 'polepszaczy i konserwantów', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:group {"align":"wide","className":"mdp-promises","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide mdp-promises"><?php foreach ( $mdp_promises as $mdp_promise ) : ?><!-- wp:paragraph {"className":"mdp-promise"} -->
<p class="mdp-promise"><?php echo esc_html( $mdp_promise ); ?></p>
<!-- /wp:paragraph --><?php endforeach; ?></div>
<!-- /wp:group --></section>
<!-- /wp:group -->
