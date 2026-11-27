<?php
/**
 * Title: Nagłówek – logo, menu, przycisk zamówienia
 * Slug: maison-du-pain/header
 * Categories: header
 * Block Types: core/template-part/header
 * Inserter: no
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"align":"full","className":"mdp-header","backgroundColor":"espresso","textColor":"cream","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull mdp-header has-cream-color has-espresso-background-color has-text-color has-background"><!-- wp:group {"align":"wide","className":"mdp-header__bar","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group alignwide mdp-header__bar"><!-- wp:group {"className":"mdp-brand","layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
<div class="wp-block-group mdp-brand"><!-- wp:image {"width":"44px","sizeSlug":"full","linkDestination":"custom","className":"mdp-brand__mark"} -->
<figure class="wp-block-image size-full is-resized mdp-brand__mark"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><img src="<?php echo esc_url( mdp_asset( 'logo-mark.svg' ) ); ?>" alt="<?php esc_attr_e( 'Maison du Pain – strona główna', 'maison-du-pain' ); ?>" style="width:44px;height:auto"/></a></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"mdp-brand__text","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-brand__text"><!-- wp:site-title {"level":0} /-->

<!-- wp:paragraph {"className":"mdp-brand__tagline"} -->
<p class="mdp-brand__tagline"><?php esc_html_e( 'Boulangerie · depuis 1994', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:navigation {"overlayBackgroundColor":"espresso","overlayTextColor":"cream","className":"mdp-nav","layout":{"type":"flex","justifyContent":"center"}} -->
<!-- wp:navigation-link {"label":"<?php esc_attr_e( 'Strona główna', 'maison-du-pain' ); ?>","url":"<?php echo esc_url( home_url( '/' ) ); ?>","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"<?php esc_attr_e( 'O piekarni', 'maison-du-pain' ); ?>","url":"<?php echo mdp_anchor( 'o-piekarni' ); ?>","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"<?php esc_attr_e( 'Produkty', 'maison-du-pain' ); ?>","url":"<?php echo mdp_anchor( 'produkty' ); ?>","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"<?php esc_attr_e( 'Galeria', 'maison-du-pain' ); ?>","url":"<?php echo mdp_anchor( 'galeria' ); ?>","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"<?php esc_attr_e( 'Kontakt', 'maison-du-pain' ); ?>","url":"<?php echo mdp_anchor( 'kontakt' ); ?>","kind":"custom","isTopLevelLink":true} /-->
<!-- /wp:navigation -->

<!-- wp:buttons {"className":"mdp-header__cta"} -->
<div class="wp-block-buttons mdp-header__cta"><!-- wp:button {"className":"is-style-outline-light"} -->
<div class="wp-block-button is-style-outline-light"><a class="wp-block-button__link wp-element-button" href="<?php echo mdp_anchor( 'kontakt' ); ?>"><?php esc_html_e( 'Zamów', 'maison-du-pain' ); ?></a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
