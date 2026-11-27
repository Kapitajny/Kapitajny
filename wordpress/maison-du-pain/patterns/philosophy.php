<?php
/**
 * Title: Filozofia wypieku – cytat i trzy zasady
 * Slug: maison-du-pain/philosophy
 * Categories: maison-du-pain, about
 * Keywords: filozofia, proces, zasady
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

$mdp_steps = array(
	array( 'I', __( 'Mąka', 'maison-du-pain' ), __( 'Mielona na kamieniu w dwóch rodzinnych młynach. Zachowuje zarodek i otręby, a z nimi smak, którego nie da się dodać później.', 'maison-du-pain' ) ),
	array( 'II', __( 'Czas', 'maison-du-pain' ), __( 'Czterdzieści osiem godzin fermentacji w chłodzie. Zakwas robi to, co gdzie indziej zastępują polepszacze — tylko lepiej.', 'maison-du-pain' ) ),
	array( 'III', __( 'Ogień', 'maison-du-pain' ), __( 'Kamienny piec opalany bukiem. Bochenki pieczemy na trzonie, w parze, aż skórka zacznie śpiewać przy stygnięciu.', 'maison-du-pain' ) ),
);
?>
<!-- wp:group {"tagName":"section","anchor":"filozofia","align":"full","className":"mdp-section mdp-philosophy","backgroundColor":"cream","layout":{"type":"constrained"}} -->
<section id="filozofia" class="wp-block-group alignfull mdp-section mdp-philosophy has-cream-background-color has-background"><!-- wp:paragraph {"align":"center","className":"mdp-bigquote mdp-reveal"} -->
<p class="has-text-align-center mdp-bigquote mdp-reveal"><?php echo wp_kses_post( __( '„Dobry chleb nie lubi pośpiechu. <em>My też nie.</em>”', 'maison-du-pain' ) ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:separator {"className":"is-style-ornament"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-ornament"/>
<!-- /wp:separator -->

<!-- wp:columns {"align":"wide","className":"mdp-philosophy__grid"} -->
<div class="wp-block-columns alignwide mdp-philosophy__grid"><!-- wp:column {"width":"42%"} -->
<div class="wp-block-column" style="flex-basis:42%"><?php echo mdp_image( 'proces-maka.jpg', __( 'Piekarz strzepuje mąkę z dłoni nad blatem', 'maison-du-pain' ), array( 'ratio' => '3/4', 'class' => 'is-style-arch', 'focal' => array( 0.5, 0.4 ) ) ); ?></div>
<!-- /wp:column -->

<!-- wp:column {"width":"58%","className":"mdp-philosophy__text"} -->
<div class="wp-block-column mdp-philosophy__text" style="flex-basis:58%"><?php echo mdp_section_label( '03', __( 'Filozofia wypieku', 'maison-du-pain' ) ); ?>

<!-- wp:heading -->
<h2 class="wp-block-heading"><?php echo wp_kses_post( __( 'Trzy rzeczy, <em>których nie skracamy</em>', 'maison-du-pain' ) ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Rzemiosło piekarskie nie wymaga skomplikowanych receptur. Wymaga dobrych surowców, cierpliwości i ognia — i konsekwencji, by nie iść na skróty, nawet gdy kolejka sięga drzwi.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"mdp-steps","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-steps"><?php foreach ( $mdp_steps as $mdp_step ) : ?><!-- wp:group {"className":"mdp-step","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-step"><!-- wp:paragraph {"className":"mdp-step__num"} -->
<p class="mdp-step__num"><?php echo esc_html( $mdp_step[0] ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4,"className":"mdp-step__title"} -->
<h4 class="wp-block-heading mdp-step__title"><?php echo esc_html( $mdp_step[1] ); ?></h4>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"mdp-step__text"} -->
<p class="mdp-step__text"><?php echo esc_html( $mdp_step[2] ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --><?php endforeach; ?></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->
