<?php
/**
 * Funkcje pomocnicze używane we wzorcach.
 *
 * @package MaisonDuPain
 */

defined( 'ABSPATH' ) || exit;

/**
 * Adres pliku graficznego z katalogu motywu.
 *
 * @param string $file Nazwa pliku w assets/images.
 * @return string
 */
function mdp_asset( $file ) {
	return MDP_URI . '/assets/images/' . ltrim( $file, '/' );
}

/**
 * Znacznik bloku core/image (zgodny z zapisem edytora, więc blok
 * pozostaje w pełni edytowalny – można podmienić zdjęcie z biblioteki mediów).
 *
 * @param string $file Nazwa pliku w assets/images.
 * @param string $alt  Tekst alternatywny.
 * @param array  $opts ratio (np. "4/5"), class, caption, focal ([x, y] 0–1), align.
 * @return string
 */
function mdp_image( $file, $alt, $opts = array() ) {
	$ratio   = isset( $opts['ratio'] ) ? $opts['ratio'] : '';
	$class   = isset( $opts['class'] ) ? $opts['class'] : '';
	$caption = isset( $opts['caption'] ) ? $opts['caption'] : '';
	$focal   = isset( $opts['focal'] ) ? $opts['focal'] : null;
	$align   = isset( $opts['align'] ) ? $opts['align'] : '';

	$attrs = array(
		'sizeSlug'        => 'full',
		'linkDestination' => 'none',
	);
	if ( $align ) {
		$attrs['align'] = $align;
	}
	$styles = array();
	if ( $ratio ) {
		$attrs['aspectRatio'] = $ratio;
		$attrs['scale']       = 'cover';
		$styles[]             = 'aspect-ratio:' . $ratio;
		$styles[]             = 'object-fit:cover';
		if ( $focal ) {
			$attrs['focalPoint'] = array(
				'x' => $focal[0],
				'y' => $focal[1],
			);
			$styles[]            = 'object-position:' . round( $focal[0] * 100 ) . '% ' . round( $focal[1] * 100 ) . '%';
		}
	}
	if ( $class ) {
		$attrs['className'] = $class;
	}

	$figure_class = trim( 'wp-block-image ' . ( $align ? 'align' . $align . ' ' : '' ) . 'size-full ' . $class );
	$style_attr   = $styles ? ' style="' . esc_attr( implode( ';', $styles ) ) . '"' : '';
	$cap          = $caption ? '<figcaption class="wp-element-caption">' . wp_kses_post( $caption ) . '</figcaption>' : '';

	return sprintf(
		"<!-- wp:image %s -->\n<figure class=\"%s\"><img src=\"%s\" alt=\"%s\"%s/>%s</figure>\n<!-- /wp:image -->",
		wp_json_encode( $attrs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ),
		esc_attr( $figure_class ),
		esc_url( mdp_asset( $file ) ),
		esc_attr( $alt ),
		$style_attr,
		$cap
	);
}

/**
 * Adres sekcji strony głównej (działa także z podstron).
 *
 * @param string $anchor Kotwica bez #.
 * @return string
 */
function mdp_anchor( $anchor ) {
	return esc_url( home_url( '/#' . $anchor ) );
}

/**
 * Wiersz produktu w stylu karty menu: nazwa …… cena.
 *
 * @param string $name  Nazwa.
 * @param string $note  Opis.
 * @param string $price Cena.
 * @return string
 */
function mdp_menu_row( $name, $note, $price ) {
	return '<!-- wp:group {"className":"mdp-menu-row","layout":{"type":"default"}} -->
<div class="wp-block-group mdp-menu-row"><!-- wp:paragraph {"className":"mdp-menu-row__name"} -->
<p class="mdp-menu-row__name">' . esc_html( $name ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"mdp-menu-row__price"} -->
<p class="mdp-menu-row__price">' . esc_html( $price ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"mdp-menu-row__note"} -->
<p class="mdp-menu-row__note">' . esc_html( $note ) . '</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->';
}

/**
 * Edytorialny opis produktu: nadtytuł, nazwa, opis, cena i link zamówienia.
 *
 * @param array $p eyebrow, name, desc, price, cta, class.
 * @return string
 */
function mdp_product_meta( $p ) {
	$class = trim( 'mdp-product__meta ' . ( isset( $p['class'] ) ? $p['class'] : '' ) );
	$cta   = isset( $p['cta'] ) ? $p['cta'] : __( 'Zamów', 'maison-du-pain' );
	$out   = '<!-- wp:group {"className":"' . esc_attr( $class ) . '","layout":{"type":"default"}} -->
<div class="wp-block-group ' . esc_attr( $class ) . '">';

	if ( ! empty( $p['eyebrow'] ) ) {
		$out .= '<!-- wp:paragraph {"className":"is-style-eyebrow"} -->
<p class="is-style-eyebrow">' . esc_html( $p['eyebrow'] ) . '</p>
<!-- /wp:paragraph -->

';
	}

	$out .= '<!-- wp:heading {"level":4,"className":"mdp-product__name"} -->
<h4 class="wp-block-heading mdp-product__name">' . wp_kses_post( $p['name'] ) . '</h4>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"mdp-product__desc"} -->
<p class="mdp-product__desc">' . esc_html( $p['desc'] ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:group {"className":"mdp-product__footer","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group mdp-product__footer"><!-- wp:paragraph {"className":"mdp-product__price"} -->
<p class="mdp-product__price">' . esc_html( $p['price'] ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-text-arrow"} -->
<div class="wp-block-button is-style-text-arrow"><a class="wp-block-button__link wp-element-button" href="' . mdp_anchor( 'kontakt' ) . '">' . esc_html( $cta ) . '</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->';

	return $out;
}

/**
 * Nadtytuł sekcji z numerem, np. „02 — Nasze wypieki”.
 *
 * @param string $num   Numer.
 * @param string $label Etykieta.
 * @return string
 */
function mdp_section_label( $num, $label ) {
	return '<!-- wp:paragraph {"className":"is-style-eyebrow mdp-section-label"} -->
<p class="is-style-eyebrow mdp-section-label"><span class="mdp-section-label__num">' . esc_html( $num ) . '</span>' . esc_html( $label ) . '</p>
<!-- /wp:paragraph -->';
}

/**
 * Nagłówek rozdziału oferty: rzymska cyfra, tytuł i notka.
 *
 * @param string $num   Numer rozdziału.
 * @param string $title Tytuł.
 * @param string $note  Notka.
 * @return string
 */
function mdp_chapter_head( $num, $title, $note ) {
	return '<!-- wp:group {"align":"wide","className":"mdp-chapter__head","layout":{"type":"default"}} -->
<div class="wp-block-group alignwide mdp-chapter__head"><!-- wp:paragraph {"className":"mdp-chapter__num"} -->
<p class="mdp-chapter__num">' . esc_html( $num ) . '</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"className":"mdp-chapter__title"} -->
<h3 class="wp-block-heading mdp-chapter__title">' . esc_html( $title ) . '</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"mdp-chapter__note"} -->
<p class="mdp-chapter__note">' . esc_html( $note ) . '</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->';
}
