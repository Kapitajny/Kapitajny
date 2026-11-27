<?php
/**
 * Title: Kontakt – adres, godziny, telefon i formularz (ciemny)
 * Slug: maison-du-pain/contact
 * Categories: maison-du-pain, contact
 * Keywords: kontakt, adres, godziny, formularz
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

$mdp_hours = array(
	array( __( 'Poniedziałek – piątek', 'maison-du-pain' ), '6:30 – 19:00' ),
	array( __( 'Sobota', 'maison-du-pain' ), '7:00 – 16:00' ),
	array( __( 'Niedziela', 'maison-du-pain' ), '8:00 – 13:00' ),
);
?>
<!-- wp:group {"tagName":"section","anchor":"kontakt","align":"full","className":"mdp-section mdp-contact","backgroundColor":"chocolate","textColor":"cream","layout":{"type":"constrained"}} -->
<section id="kontakt" class="wp-block-group alignfull mdp-section mdp-contact has-cream-color has-chocolate-background-color has-text-color has-background"><!-- wp:columns {"align":"wide","className":"mdp-contact__grid"} -->
<div class="wp-block-columns alignwide mdp-contact__grid"><!-- wp:column {"width":"44%","className":"mdp-contact__info"} -->
<div class="wp-block-column mdp-contact__info" style="flex-basis:44%"><?php echo mdp_section_label( '06', __( 'Kontakt', 'maison-du-pain' ) ); ?>

<!-- wp:heading -->
<h2 class="wp-block-heading"><?php echo wp_kses_post( __( 'Odwiedź nas <em>o świcie</em>', 'maison-du-pain' ) ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"mdp-contact__lead"} -->
<p class="mdp-contact__lead"><?php esc_html_e( 'Najlepszy chleb jest wtedy, gdy jeszcze trzeszczy. Wpadnij rano albo zamów wypieki dzień wcześniej — odłożymy je dla Ciebie.', 'maison-du-pain' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"mdp-contact__details","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-contact__details"><!-- wp:group {"className":"mdp-detail","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-detail"><!-- wp:heading {"level":4,"className":"mdp-detail__label"} -->
<h4 class="wp-block-heading mdp-detail__label"><?php esc_html_e( 'Adres', 'maison-du-pain' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"mdp-detail__value"} -->
<p class="mdp-detail__value">ul. Chlebowa 12<br>00-001 Warszawa</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"mdp-detail","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-detail"><!-- wp:heading {"level":4,"className":"mdp-detail__label"} -->
<h4 class="wp-block-heading mdp-detail__label"><?php esc_html_e( 'Telefon i e-mail', 'maison-du-pain' ); ?></h4>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"mdp-detail__value"} -->
<p class="mdp-detail__value"><a href="tel:+48220000000">+48 22 000 00 00</a><br><a href="mailto:bonjour@maisondupain.pl">bonjour@maisondupain.pl</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"mdp-detail mdp-detail--hours","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-detail mdp-detail--hours"><!-- wp:heading {"level":4,"className":"mdp-detail__label"} -->
<h4 class="wp-block-heading mdp-detail__label"><?php esc_html_e( 'Godziny otwarcia', 'maison-du-pain' ); ?></h4>
<!-- /wp:heading -->

<?php foreach ( $mdp_hours as $mdp_row ) : ?><!-- wp:paragraph {"className":"mdp-hours"} -->
<p class="mdp-hours"><span><?php echo esc_html( $mdp_row[0] ); ?></span><span><?php echo esc_html( $mdp_row[1] ); ?></span></p>
<!-- /wp:paragraph -->

<?php endforeach; ?></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:social-links {"iconColor":"sand","iconColorValue":"#D7C1A2","size":"has-normal-icon-size","className":"is-style-logos-only mdp-social","layout":{"type":"flex","flexWrap":"nowrap"}} -->
<ul class="wp-block-social-links has-normal-icon-size has-icon-color is-style-logos-only mdp-social"><!-- wp:social-link {"url":"https://www.instagram.com/","service":"instagram","label":"Instagram"} /-->

<!-- wp:social-link {"url":"https://www.facebook.com/","service":"facebook","label":"Facebook"} /-->

<!-- wp:social-link {"url":"https://www.pinterest.com/","service":"pinterest","label":"Pinterest"} /-->

<!-- wp:social-link {"url":"https://www.tiktok.com/","service":"tiktok","label":"TikTok"} /--></ul>
<!-- /wp:social-links --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"56%","className":"mdp-contact__form"} -->
<div class="wp-block-column mdp-contact__form" style="flex-basis:56%"><!-- wp:maison-du-pain/contact-form /--></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->
