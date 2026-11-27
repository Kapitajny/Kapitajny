<?php
/**
 * Title: O piekarni – historia i witryna
 * Slug: maison-du-pain/about
 * Categories: maison-du-pain, about
 * Keywords: o nas, historia, piekarnia
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"tagName":"section","anchor":"o-piekarni","align":"full","className":"mdp-section mdp-about","backgroundColor":"ivory","layout":{"type":"constrained"}} -->
<section id="o-piekarni" class="wp-block-group alignfull mdp-section mdp-about has-ivory-background-color has-background"><!-- wp:columns {"align":"wide","className":"mdp-about__intro"} -->
<div class="wp-block-columns alignwide mdp-about__intro"><!-- wp:column {"width":"46%"} -->
<div class="wp-block-column" style="flex-basis:46%"><?php echo mdp_section_label( '01', __( 'O piekarni', 'maison-du-pain' ) ); ?>

<!-- wp:heading {"className":"mdp-about__title"} -->
<h2 class="wp-block-heading mdp-about__title"><?php echo wp_kses_post( __( 'Zaczynamy dzień, <em>zanim obudzi się miasto.</em>', 'maison-du-pain' ) ); ?></h2>
<!-- /wp:heading --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"54%","className":"mdp-about__text"} -->
<div class="wp-block-column mdp-about__text" style="flex-basis:54%"><!-- wp:paragraph {"className":"mdp-lead"} -->
<p class="mdp-lead"><?php esc_html_e( 'Maison du Pain to rodzinna piekarnia, w której od trzydziestu lat pracujemy tak samo: ręcznie, powoli i w rytmie zakwasu, a nie zegara.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Każdej nocy formujemy bochenki, które rano trafiają na drewniane półki naszej witryny. Ciasto na croissanty laminujemy dzień wcześniej, a tarty powstają w małych partiach — tylko z owocami, które akurat mają sezon. Nie mamy mrożonych półproduktów ani gotowych mieszanek. Mamy za to piec, mąkę z kamiennych młynów i ludzi, którzy kochają chleb.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"mdp-signature"} -->
<p class="mdp-signature"><?php esc_html_e( 'Hélène i Marek Duval — założyciele', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:columns {"align":"wide","className":"mdp-about__visuals"} -->
<div class="wp-block-columns alignwide mdp-about__visuals"><!-- wp:column {"width":"64%"} -->
<div class="wp-block-column" style="flex-basis:64%"><?php echo mdp_image( 'witryna-chleby.jpg', __( 'Witryna piekarni z chlebami na zakwasie i tabliczkami z cenami', 'maison-du-pain' ), array( 'ratio' => '4/3', 'class' => 'mdp-about__main', 'caption' => __( 'Nasza witryna o 7:00 — chleby z pierwszego wypieku', 'maison-du-pain' ), 'focal' => array( 0.5, 0.6 ) ) ); ?></div>
<!-- /wp:column -->

<!-- wp:column {"width":"36%","className":"mdp-about__aside"} -->
<div class="wp-block-column mdp-about__aside" style="flex-basis:36%"><?php echo mdp_image( 'proces-wyrabianie.jpg', __( 'Dłonie piekarza wyrabiające ciasto na blacie posypanym mąką', 'maison-du-pain' ), array( 'ratio' => '4/5', 'class' => 'is-style-arch' ) ); ?>

<!-- wp:group {"className":"mdp-stat","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-stat"><!-- wp:paragraph {"className":"mdp-stat__num"} -->
<p class="mdp-stat__num">1994</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"mdp-stat__label"} -->
<p class="mdp-stat__label"><?php esc_html_e( 'od tego roku dokarmiamy ten sam zakwas', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->
