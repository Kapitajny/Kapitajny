<?php
/**
 * Title: Hero – ciemne otwarcie z fotografią pieczywa
 * Slug: maison-du-pain/hero
 * Categories: maison-du-pain, banner
 * Keywords: hero, nagłówek, baner
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"tagName":"section","align":"full","className":"mdp-hero","backgroundColor":"espresso","textColor":"cream","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull mdp-hero has-cream-color has-espresso-background-color has-text-color has-background"><!-- wp:columns {"verticalAlignment":"center","align":"wide","className":"mdp-hero__grid"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center mdp-hero__grid"><!-- wp:column {"verticalAlignment":"center","width":"54%","className":"mdp-hero__content"} -->
<div class="wp-block-column is-vertically-aligned-center mdp-hero__content" style="flex-basis:54%"><!-- wp:paragraph {"className":"is-style-eyebrow mdp-hero__eyebrow"} -->
<p class="is-style-eyebrow mdp-hero__eyebrow"><?php esc_html_e( 'Boulangerie artisanale — od 1994 roku', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"className":"mdp-hero__title"} -->
<h1 class="wp-block-heading mdp-hero__title"><?php echo wp_kses_post( __( 'Chleb, który ma <em>swój czas</em>', 'maison-du-pain' ) ); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"mdp-hero__lead"} -->
<p class="mdp-hero__lead"><?php esc_html_e( 'Wypiekamy chleb na naturalnym zakwasie, francuskie croissanty i sezonowe tarty. Bez skrótów i bez polepszaczy — tylko mąka, woda, sól i czterdzieści osiem godzin cierpliwości.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"className":"mdp-hero__actions"} -->
<div class="wp-block-buttons mdp-hero__actions"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo mdp_anchor( 'produkty' ); ?>"><?php esc_html_e( 'Poznaj ofertę', 'maison-du-pain' ); ?></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-text-arrow"} -->
<div class="wp-block-button is-style-text-arrow"><a class="wp-block-button__link wp-element-button" href="<?php echo mdp_anchor( 'o-piekarni' ); ?>"><?php esc_html_e( 'Nasza historia', 'maison-du-pain' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:group {"className":"mdp-hero__facts","layout":{"type":"flex","flexWrap":"wrap","verticalAlignment":"top"}} -->
<div class="wp-block-group mdp-hero__facts"><!-- wp:group {"className":"mdp-fact","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-fact"><!-- wp:paragraph {"className":"mdp-fact__num"} -->
<p class="mdp-fact__num">48 h</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"mdp-fact__label"} -->
<p class="mdp-fact__label"><?php esc_html_e( 'naturalnej fermentacji', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"mdp-fact","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-fact"><!-- wp:paragraph {"className":"mdp-fact__num"} -->
<p class="mdp-fact__num">4:00</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"mdp-fact__label"} -->
<p class="mdp-fact__label"><?php esc_html_e( 'pierwszy wypiek dnia', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"mdp-fact","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-fact"><!-- wp:paragraph {"className":"mdp-fact__num"} -->
<p class="mdp-fact__num">100%</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"mdp-fact__label"} -->
<p class="mdp-fact__label"><?php esc_html_e( 'naturalnych składników', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"46%","className":"mdp-hero__visual"} -->
<div class="wp-block-column is-vertically-aligned-center mdp-hero__visual" style="flex-basis:46%"><?php echo mdp_image( 'hero-chleb-regaly.jpg', __( 'Świeżo upieczone bochenki na zakwasie stygną na metalowych regałach piekarni', 'maison-du-pain' ), array( 'ratio' => '4/5', 'class' => 'mdp-hero__photo', 'focal' => array( 0.5, 0.42 ) ) ); ?>

<!-- wp:html -->
<div class="mdp-badge" aria-hidden="true"><svg viewBox="0 0 160 160" focusable="false"><defs><path id="mdp-badge-path" d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0"/></defs><text><textPath href="#mdp-badge-path">Pieczone codziennie od 4:00 · Maison du Pain · </textPath></text></svg><span class="mdp-badge__star">✦</span></div>
<!-- /wp:html -->

<!-- wp:paragraph {"className":"mdp-hero__caption"} -->
<p class="mdp-hero__caption"><?php esc_html_e( 'Nr 01 — Bochenki z porannego wypieku', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->
