<?php
/**
 * Title: Wypieki II – Viennoiserie (karta menu + kompozycja zdjęć)
 * Slug: maison-du-pain/products-viennoiserie
 * Categories: maison-du-pain, maison-du-pain-products
 * Keywords: croissant, viennoiserie, produkty
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"tagName":"section","anchor":"viennoiserie","align":"full","className":"mdp-products mdp-chapter mdp-chapter--viennoiserie","backgroundColor":"cream","layout":{"type":"constrained"}} -->
<section id="viennoiserie" class="wp-block-group alignfull mdp-products mdp-chapter mdp-chapter--viennoiserie has-cream-background-color has-background"><!-- wp:columns {"align":"wide","className":"mdp-viennoiserie"} -->
<div class="wp-block-columns alignwide mdp-viennoiserie"><!-- wp:column {"width":"40%","className":"mdp-viennoiserie__text"} -->
<div class="wp-block-column mdp-viennoiserie__text" style="flex-basis:40%"><?php echo mdp_chapter_head( 'II', 'Viennoiserie', __( 'Laminowane ręcznie · masło z Normandii', 'maison-du-pain' ) ); ?>

<!-- wp:paragraph {"className":"mdp-lead"} -->
<p class="mdp-lead"><?php esc_html_e( 'Dwadzieścia siedem warstw masła, trzy dni pracy i jeden moment, w którym skórka pęka pod palcami.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"mdp-menu","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-menu"><?php
echo mdp_menu_row( 'Croissant au beurre', __( 'klasyczny, na maśle 84%', 'maison-du-pain' ), '8 zł' );
echo mdp_menu_row( 'Pain au chocolat', __( 'z dwiema laskami czekolady 70%', 'maison-du-pain' ), '9 zł' );
echo mdp_menu_row( 'Croissant aux amandes', __( 'z kremem migdałowym i płatkami', 'maison-du-pain' ), '11 zł' );
echo mdp_menu_row( 'Chausson aux pommes', __( 'z pieczonymi jabłkami i wanilią', 'maison-du-pain' ), '10 zł' );
?></div>
<!-- /wp:group -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-outline-dark"} -->
<div class="wp-block-button is-style-outline-dark"><a class="wp-block-button__link wp-element-button" href="<?php echo mdp_anchor( 'kontakt' ); ?>"><?php esc_html_e( 'Zarezerwuj na rano', 'maison-du-pain' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"60%","className":"mdp-stack"} -->
<div class="wp-block-column mdp-stack" style="flex-basis:60%"><?php echo mdp_image( 'croissant-au-beurre.jpg', __( 'Dwa złociste croissanty na lnianej ściereczce', 'maison-du-pain' ), array( 'ratio' => '4/5', 'class' => 'mdp-product__img mdp-stack__main', 'focal' => array( 0.55, 0.5 ) ) ); ?>

<?php echo mdp_image( 'pain-au-chocolat.jpg', __( 'Pain au chocolat i inne wypieki z ciasta francuskiego', 'maison-du-pain' ), array( 'ratio' => '1/1', 'class' => 'mdp-product__img mdp-stack__inset', 'caption' => __( 'Pain au chocolat — 9 zł', 'maison-du-pain' ), 'focal' => array( 0.5, 0.5 ) ) ); ?></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->
