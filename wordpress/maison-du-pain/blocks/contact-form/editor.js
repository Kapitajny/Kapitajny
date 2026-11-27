/**
 * Edytor bloku „Formularz kontaktowy piekarni” – bez kroku budowania.
 */
( function ( wp ) {
	var el = wp.element.createElement;
	var __ = wp.i18n.__;
	var be = wp.blockEditor;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var PanelBody = wp.components.PanelBody;
	var ServerSideRender = wp.serverSideRender;

	wp.blocks.registerBlockType( 'maison-du-pain/contact-form', {
		edit: function ( props ) {
			var a = props.attributes;
			var set = props.setAttributes;
			return el(
				'div',
				be.useBlockProps(),
				el(
					be.InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Treść formularza', 'maison-du-pain' ) },
						el( TextControl, {
							label: __( 'Nagłówek', 'maison-du-pain' ),
							value: a.heading,
							onChange: function ( v ) { set( { heading: v } ); },
							__nextHasNoMarginBottom: true,
						} ),
						el( TextareaControl, {
							label: __( 'Wstęp', 'maison-du-pain' ),
							value: a.intro,
							onChange: function ( v ) { set( { intro: v } ); },
							__nextHasNoMarginBottom: true,
						} ),
						el( TextControl, {
							label: __( 'Etykieta przycisku', 'maison-du-pain' ),
							value: a.buttonLabel,
							onChange: function ( v ) { set( { buttonLabel: v } ); },
							__nextHasNoMarginBottom: true,
						} )
					)
				),
				el(
					'div',
					{ style: { pointerEvents: 'none' } },
					el( ServerSideRender, { block: 'maison-du-pain/contact-form', attributes: a } )
				)
			);
		},
		save: function () {
			return null;
		},
	} );
} )( window.wp );
