<?php
/**
 * Title: Stopka – logo, nawigacja, godziny, media społecznościowe
 * Slug: maison-du-pain/footer
 * Categories: footer
 * Block Types: core/template-part/footer
 * Inserter: no
 *
 * @package MaisonDuPain
 */

?>
<!-- wp:group {"align":"full","className":"mdp-footer","backgroundColor":"espresso","textColor":"sand","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull mdp-footer has-sand-color has-espresso-background-color has-text-color has-background"><!-- wp:columns {"align":"wide","className":"mdp-footer__grid"} -->
<div class="wp-block-columns alignwide mdp-footer__grid"><!-- wp:column {"width":"38%","className":"mdp-footer__brand"} -->
<div class="wp-block-column mdp-footer__brand" style="flex-basis:38%"><!-- wp:image {"width":"64px","sizeSlug":"full","linkDestination":"none","className":"mdp-footer__mark"} -->
<figure class="wp-block-image size-full is-resized mdp-footer__mark"><img src="<?php echo esc_url( mdp_asset( 'logo-mark.svg' ) ); ?>" alt="" style="width:64px;height:auto"/></figure>
<!-- /wp:image -->

<!-- wp:site-title {"level":0,"className":"mdp-footer__title"} /-->

<!-- wp:paragraph {"className":"mdp-footer__about"} -->
<p class="mdp-footer__about"><?php esc_html_e( 'Rzemieślnicza piekarnia na naturalnym zakwasie. Chleb, viennoiserie i desery pieczone codziennie od 4:00 rano.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"20%"} -->
<div class="wp-block-column" style="flex-basis:20%"><!-- wp:heading {"level":4,"className":"mdp-footer__heading"} -->
<h4 class="wp-block-heading mdp-footer__heading"><?php esc_html_e( 'Piekarnia', 'maison-du-pain' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:list {"className":"mdp-footer__links"} -->
<ul class="wp-block-list mdp-footer__links"><!-- wp:list-item -->
<li><a href="<?php echo mdp_anchor( 'o-piekarni' ); ?>"><?php esc_html_e( 'O piekarni', 'maison-du-pain' ); ?></a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="<?php echo mdp_anchor( 'produkty' ); ?>"><?php esc_html_e( 'Produkty', 'maison-du-pain' ); ?></a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="<?php echo esc_url( home_url( '/oferta/' ) ); ?>"><?php esc_html_e( 'Pełna oferta', 'maison-du-pain' ); ?></a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="<?php echo mdp_anchor( 'galeria' ); ?>"><?php esc_html_e( 'Galeria', 'maison-du-pain' ); ?></a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><a href="<?php echo mdp_anchor( 'kontakt' ); ?>"><?php esc_html_e( 'Kontakt', 'maison-du-pain' ); ?></a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"22%"} -->
<div class="wp-block-column" style="flex-basis:22%"><!-- wp:heading {"level":4,"className":"mdp-footer__heading"} -->
<h4 class="wp-block-heading mdp-footer__heading"><?php esc_html_e( 'Odwiedź nas', 'maison-du-pain' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ul. Chlebowa 12<br>00-001 Warszawa</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Pon – Pt 6:30 – 19:00', 'maison-du-pain' ); ?><br><?php esc_html_e( 'Sob 7:00 – 16:00 · Ndz 8:00 – 13:00', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"20%"} -->
<div class="wp-block-column" style="flex-basis:20%"><!-- wp:heading {"level":4,"className":"mdp-footer__heading"} -->
<h4 class="wp-block-heading mdp-footer__heading"><?php esc_html_e( 'Zamówienia', 'maison-du-pain' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><a href="tel:+48220000000">+48 22 000 00 00</a><br><a href="mailto:bonjour@maisondupain.pl">bonjour@maisondupain.pl</a></p>
<!-- /wp:paragraph -->

<!-- wp:social-links {"iconColor":"sand","iconColorValue":"#D7C1A2","size":"has-small-icon-size","className":"is-style-logos-only mdp-social","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<ul class="wp-block-social-links has-small-icon-size has-icon-color is-style-logos-only mdp-social"><!-- wp:social-link {"url":"https://www.instagram.com/","service":"instagram","label":"Instagram"} /-->

<!-- wp:social-link {"url":"https://www.facebook.com/","service":"facebook","label":"Facebook"} /-->

<!-- wp:social-link {"url":"https://www.pinterest.com/","service":"pinterest","label":"Pinterest"} /--></ul>
<!-- /wp:social-links --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:paragraph {"align":"center","className":"mdp-footer__wordmark"} -->
<p class="has-text-align-center mdp-footer__wordmark" aria-hidden="true">Maison du Pain</p>
<!-- /wp:paragraph -->

<!-- wp:group {"align":"wide","className":"mdp-footer__bottom","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide mdp-footer__bottom"><!-- wp:paragraph -->
<p>© <?php echo esc_html( gmdate( 'Y' ) ); ?> Maison du Pain. <?php esc_html_e( 'Wszelkie prawa zastrzeżone.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a href="<?php echo esc_url( get_privacy_policy_url() ? get_privacy_policy_url() : home_url( '/polityka-prywatnosci/' ) ); ?>"><?php esc_html_e( 'Polityka prywatności', 'maison-du-pain' ); ?></a> · <a href="<?php echo mdp_anchor( 'kontakt' ); ?>"><?php esc_html_e( 'Zamówienia', 'maison-du-pain' ); ?></a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><?php esc_html_e( 'Pieczone z miłością o 4:00 rano', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
