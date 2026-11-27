<?php
/**
 * Render bloku formularza kontaktowego.
 *
 * @package MaisonDuPain
 *
 * @var array $attributes Atrybuty bloku.
 */

defined( 'ABSPATH' ) || exit;

$mdp_status   = isset( $_GET['kontakt'] ) ? sanitize_key( wp_unslash( $_GET['kontakt'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
$mdp_messages = array(
	'wyslano'     => array( 'success', __( 'Dziękujemy! Wiadomość dotarła do piekarni – odezwiemy się jeszcze dziś.', 'maison-du-pain' ) ),
	'brak-danych' => array( 'error', __( 'Uzupełnij imię, poprawny adres e-mail, treść wiadomości i zgodę.', 'maison-du-pain' ) ),
	'blad'        => array( 'error', __( 'Nie udało się wysłać wiadomości. Zadzwoń do nas lub spróbuj ponownie.', 'maison-du-pain' ) ),
);
$mdp_uid      = wp_unique_id( 'mdp-form-' );
$mdp_redirect = ( is_singular() || is_front_page() ) ? get_permalink() : home_url( '/' );
if ( is_front_page() ) {
	$mdp_redirect = home_url( '/' );
}
?>
<div <?php echo get_block_wrapper_attributes( array( 'class' => 'mdp-form' ) ); ?>>
	<?php if ( ! empty( $attributes['heading'] ) ) : ?>
		<h3 class="mdp-form__title"><?php echo esc_html( $attributes['heading'] ); ?></h3>
	<?php endif; ?>
	<?php if ( ! empty( $attributes['intro'] ) ) : ?>
		<p class="mdp-form__intro"><?php echo esc_html( $attributes['intro'] ); ?></p>
	<?php endif; ?>

	<?php if ( isset( $mdp_messages[ $mdp_status ] ) ) : ?>
		<p class="mdp-form__notice is-<?php echo esc_attr( $mdp_messages[ $mdp_status ][0] ); ?>" role="status">
			<?php echo esc_html( $mdp_messages[ $mdp_status ][1] ); ?>
		</p>
	<?php endif; ?>

	<form class="mdp-form__fields" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
		<input type="hidden" name="action" value="mdp_contact">
		<input type="hidden" name="_mdp_redirect" value="<?php echo esc_url( $mdp_redirect ); ?>">
		<?php wp_nonce_field( 'mdp_contact', '_mdp_nonce', false ); ?>

		<div class="mdp-form__hp" aria-hidden="true">
			<label for="<?php echo esc_attr( $mdp_uid ); ?>-website">Website</label>
			<input type="text" id="<?php echo esc_attr( $mdp_uid ); ?>-website" name="mdp_website" tabindex="-1" autocomplete="off">
		</div>

		<p class="mdp-field">
			<label for="<?php echo esc_attr( $mdp_uid ); ?>-name"><?php esc_html_e( 'Imię i nazwisko', 'maison-du-pain' ); ?></label>
			<input type="text" id="<?php echo esc_attr( $mdp_uid ); ?>-name" name="mdp_name" autocomplete="name" required>
		</p>
		<p class="mdp-field">
			<label for="<?php echo esc_attr( $mdp_uid ); ?>-email"><?php esc_html_e( 'E-mail', 'maison-du-pain' ); ?></label>
			<input type="email" id="<?php echo esc_attr( $mdp_uid ); ?>-email" name="mdp_email" autocomplete="email" required>
		</p>
		<p class="mdp-field">
			<label for="<?php echo esc_attr( $mdp_uid ); ?>-phone"><?php esc_html_e( 'Telefon (opcjonalnie)', 'maison-du-pain' ); ?></label>
			<input type="tel" id="<?php echo esc_attr( $mdp_uid ); ?>-phone" name="mdp_phone" autocomplete="tel">
		</p>
		<p class="mdp-field">
			<label for="<?php echo esc_attr( $mdp_uid ); ?>-topic"><?php esc_html_e( 'Temat', 'maison-du-pain' ); ?></label>
			<select id="<?php echo esc_attr( $mdp_uid ); ?>-topic" name="mdp_topic">
				<?php foreach ( mdp_contact_topics() as $mdp_key => $mdp_label ) : ?>
					<option value="<?php echo esc_attr( $mdp_key ); ?>"><?php echo esc_html( $mdp_label ); ?></option>
				<?php endforeach; ?>
			</select>
		</p>
		<p class="mdp-field mdp-field--full">
			<label for="<?php echo esc_attr( $mdp_uid ); ?>-message"><?php esc_html_e( 'Wiadomość', 'maison-du-pain' ); ?></label>
			<textarea id="<?php echo esc_attr( $mdp_uid ); ?>-message" name="mdp_message" rows="5" required placeholder="<?php esc_attr_e( 'Np. 2 × pain au levain i 6 croissantów na sobotę, 8:00', 'maison-du-pain' ); ?>"></textarea>
		</p>
		<p class="mdp-field mdp-field--full mdp-field--check">
			<input type="checkbox" id="<?php echo esc_attr( $mdp_uid ); ?>-consent" name="mdp_consent" value="1" required>
			<label for="<?php echo esc_attr( $mdp_uid ); ?>-consent"><?php esc_html_e( 'Wyrażam zgodę na przetwarzanie moich danych w celu odpowiedzi na wiadomość.', 'maison-du-pain' ); ?></label>
		</p>
		<p class="mdp-field mdp-field--full mdp-form__submit">
			<button type="submit" class="wp-element-button"><?php echo esc_html( $attributes['buttonLabel'] ); ?></button>
		</p>
	</form>
</div>
