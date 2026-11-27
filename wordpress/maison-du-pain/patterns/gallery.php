<?php
/**
 * Title: Galeria – wnętrze i proces wypieku (mozaika)
 * Slug: maison-du-pain/gallery
 * Categories: maison-du-pain, gallery
 * Keywords: galeria, wnętrze, zdjęcia
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"tagName":"section","anchor":"galeria","align":"full","className":"mdp-section mdp-gallery","backgroundColor":"ivory","layout":{"type":"constrained"}} -->
<section id="galeria" class="wp-block-group alignfull mdp-section mdp-gallery has-ivory-background-color has-background"><!-- wp:columns {"verticalAlignment":"bottom","align":"wide","className":"mdp-gallery__head"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-bottom mdp-gallery__head"><!-- wp:column {"verticalAlignment":"bottom","width":"58%"} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:58%"><?php echo mdp_section_label( '05', __( 'Galeria', 'maison-du-pain' ) ); ?>

<!-- wp:heading -->
<h2 class="wp-block-heading"><?php echo wp_kses_post( __( 'Za kulisami <em>piekarni</em>', 'maison-du-pain' ) ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"bottom","width":"42%"} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:42%"><!-- wp:paragraph -->
<p><?php esc_html_e( 'Drewniane półki, zapach palonego buku i mąka w powietrzu. Zajrzyj do miejsca, w którym każdego ranka powstaje Twój chleb.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:group {"align":"wide","className":"mdp-mosaic","layout":{"type":"default"}} -->
<div class="wp-block-group alignwide mdp-mosaic"><?php
echo mdp_image( 'wnetrze-polki.jpg', __( 'Drewniane półki z rzemieślniczym pieczywem we wnętrzu piekarni', 'maison-du-pain' ), array( 'caption' => __( 'Półki z porannym wypiekiem', 'maison-du-pain' ) ) );
echo "\n\n";
echo mdp_image( 'viennoiserie-lada.jpg', __( 'Croissanty i ciastka na marmurowej ladzie', 'maison-du-pain' ), array( 'caption' => __( 'Viennoiserie prosto z pieca', 'maison-du-pain' ) ) );
echo "\n\n";
echo mdp_image( 'wnetrze-witryna.jpg', __( 'Witryna piekarni pełna chleba i wypieków', 'maison-du-pain' ), array( 'caption' => __( 'Witryna o świcie', 'maison-du-pain' ) ) );
echo "\n\n";
echo mdp_image( 'patisserie-witryna.jpg', __( 'Francuskie ciastka i tartaletki w przeszklonej witrynie', 'maison-du-pain' ), array( 'caption' => __( 'Pâtisserie', 'maison-du-pain' ) ) );
echo "\n\n";
echo mdp_image( 'proces-piec.jpg', __( 'Piekarz wkłada bochenki do tradycyjnego pieca opalanego drewnem', 'maison-du-pain' ), array( 'caption' => __( 'Piec opalany bukiem', 'maison-du-pain' ) ) );
?></div>
<!-- /wp:group --></section>
<!-- /wp:group -->
