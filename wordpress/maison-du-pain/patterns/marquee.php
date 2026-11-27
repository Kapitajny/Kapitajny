<?php
/**
 * Title: Pasek z nazwami wypieków
 * Slug: maison-du-pain/marquee
 * Categories: maison-du-pain
 * Keywords: pasek, separator, marquee
 * Viewport Width: 1440
 *
 * @package MaisonDuPain
 */

$mdp_items = array( 'Pain au levain', 'Croissant au beurre', 'Baguette de tradition', 'Tarte au citron', 'Żytni razowy', 'Pain au chocolat', 'Brioche', 'Cynamonka z kardamonem' );
$mdp_text  = implode( ' <span class="mdp-marquee__sep">✦</span> ', array_map( 'esc_html', $mdp_items ) ) . ' <span class="mdp-marquee__sep">✦</span>';
?>
<!-- wp:group {"align":"full","className":"mdp-marquee","backgroundColor":"chocolate","textColor":"sand","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull mdp-marquee has-sand-color has-chocolate-background-color has-text-color has-background"><!-- wp:group {"className":"mdp-marquee__inner","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-marquee__inner"><!-- wp:paragraph {"className":"mdp-marquee__track"} -->
<p class="mdp-marquee__track"><?php echo $mdp_text . ' ' . $mdp_text; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
