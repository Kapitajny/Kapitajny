<?php
/**
 * Formularz kontaktowy / zamówień – blok „maison-du-pain/contact-form”
 * oraz obsługa wysyłki (wp_mail) przez admin-post.php.
 *
 * @package MaisonDuPain
 */

defined( 'ABSPATH' ) || exit;

/**
 * Rejestracja bloku formularza.
 */
function mdp_register_contact_block() {
	register_block_type( MDP_DIR . '/blocks/contact-form' );
}
add_action( 'init', 'mdp_register_contact_block' );

/**
 * Tematy wiadomości dostępne w formularzu.
 *
 * @return array
 */
function mdp_contact_topics() {
	return array(
		'zamowienie' => __( 'Zamówienie wypieków na odbiór', 'maison-du-pain' ),
		'tort'       => __( 'Tort lub tarta na okazję', 'maison-du-pain' ),
		'catering'   => __( 'Catering / śniadania firmowe', 'maison-du-pain' ),
		'inne'       => __( 'Inne pytanie', 'maison-du-pain' ),
	);
}

/**
 * Obsługa wysłanego formularza.
 */
function mdp_handle_contact() {
	$redirect = isset( $_POST['_mdp_redirect'] ) ? esc_url_raw( wp_unslash( $_POST['_mdp_redirect'] ) ) : home_url( '/' );
	$redirect = wp_validate_redirect( $redirect, home_url( '/' ) );
	$redirect = remove_query_arg( 'kontakt', $redirect );

	$back = function ( $status ) use ( $redirect ) {
		wp_safe_redirect( add_query_arg( 'kontakt', $status, $redirect ) . '#kontakt' );
		exit;
	};

	if ( ! isset( $_POST['_mdp_nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['_mdp_nonce'] ) ), 'mdp_contact' ) ) {
		$back( 'blad' );
	}

	// Pułapka na boty – pole niewidoczne dla ludzi musi pozostać puste.
	if ( ! empty( $_POST['mdp_website'] ) ) {
		$back( 'wyslano' );
	}

	$name    = isset( $_POST['mdp_name'] ) ? sanitize_text_field( wp_unslash( $_POST['mdp_name'] ) ) : '';
	$email   = isset( $_POST['mdp_email'] ) ? sanitize_email( wp_unslash( $_POST['mdp_email'] ) ) : '';
	$phone   = isset( $_POST['mdp_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['mdp_phone'] ) ) : '';
	$topic   = isset( $_POST['mdp_topic'] ) ? sanitize_key( wp_unslash( $_POST['mdp_topic'] ) ) : 'inne';
	$message = isset( $_POST['mdp_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['mdp_message'] ) ) : '';
	$consent = ! empty( $_POST['mdp_consent'] );
	$topics  = mdp_contact_topics();

	if ( '' === $name || ! is_email( $email ) || '' === $message || ! $consent ) {
		$back( 'brak-danych' );
	}

	$recipient = get_option( 'mdp_contact_recipient' );
	if ( ! is_email( $recipient ) ) {
		$recipient = get_option( 'admin_email' );
	}

	$subject = sprintf(
		/* translators: 1: topic, 2: name */
		__( '[%1$s] Wiadomość od: %2$s', 'maison-du-pain' ),
		isset( $topics[ $topic ] ) ? $topics[ $topic ] : $topics['inne'],
		$name
	);
	$body = implode(
		"\n",
		array(
			__( 'Imię i nazwisko:', 'maison-du-pain' ) . ' ' . $name,
			__( 'E-mail:', 'maison-du-pain' ) . ' ' . $email,
			__( 'Telefon:', 'maison-du-pain' ) . ' ' . ( $phone ? $phone : '—' ),
			__( 'Temat:', 'maison-du-pain' ) . ' ' . ( isset( $topics[ $topic ] ) ? $topics[ $topic ] : $topics['inne'] ),
			'',
			$message,
		)
	);

	$sent = wp_mail( $recipient, $subject, $body, array( 'Reply-To: ' . $name . ' <' . $email . '>' ) );

	/**
	 * Pozwala zapisać wiadomość np. w CRM lub w bazie.
	 */
	do_action( 'mdp_contact_submitted', compact( 'name', 'email', 'phone', 'topic', 'message' ), $sent );

	$back( $sent ? 'wyslano' : 'blad' );
}
add_action( 'admin_post_mdp_contact', 'mdp_handle_contact' );
add_action( 'admin_post_nopriv_mdp_contact', 'mdp_handle_contact' );

/**
 * Ustawienie adresu odbiorcy w Ustawienia → Ogólne.
 */
function mdp_contact_settings() {
	register_setting(
		'general',
		'mdp_contact_recipient',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_email',
			'default'           => '',
		)
	);
	add_settings_field(
		'mdp_contact_recipient',
		__( 'Adres dla formularza piekarni', 'maison-du-pain' ),
		function () {
			printf(
				'<input type="email" class="regular-text" name="mdp_contact_recipient" id="mdp_contact_recipient" value="%s" placeholder="%s"><p class="description">%s</p>',
				esc_attr( get_option( 'mdp_contact_recipient' ) ),
				esc_attr( get_option( 'admin_email' ) ),
				esc_html__( 'Wiadomości z formularza kontaktowego Maison du Pain. Puste pole = adres administratora.', 'maison-du-pain' )
			);
		},
		'general',
		'default',
		array( 'label_for' => 'mdp_contact_recipient' )
	);
}
add_action( 'admin_init', 'mdp_contact_settings' );
