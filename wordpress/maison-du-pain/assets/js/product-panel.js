/**
 * Maison du Pain – panel „Cena i gramatura” w edytorze wypieku.
 * Czysty JavaScript (bez kroku budowania), korzysta z pakietów WordPressa.
 */
( function ( wp ) {
	if ( ! wp || ! wp.plugins || ! wp.editor ) {
		return;
	}

	var el = wp.element.createElement;
	var __ = wp.i18n.__;
	var TextControl = wp.components.TextControl;
	var useSelect = wp.data.useSelect;
	var useEntityProp = wp.coreData.useEntityProp;
	var Panel = wp.editor.PluginDocumentSettingPanel;

	function ProductPanel() {
		var postType = useSelect( function ( select ) {
			return select( 'core/editor' ).getCurrentPostType();
		}, [] );
		var entity = useEntityProp( 'postType', postType, 'meta' );
		var meta = entity[ 0 ] || {};
		var setMeta = entity[ 1 ];

		if ( 'mdp_wypiek' !== postType ) {
			return null;
		}

		function update( key ) {
			return function ( value ) {
				var next = Object.assign( {}, meta );
				next[ key ] = value;
				setMeta( next );
			};
		}

		return el(
			Panel,
			{
				name: 'mdp-product-details',
				title: __( 'Cena i gramatura', 'maison-du-pain' ),
				initialOpen: true,
			},
			el( TextControl, {
				label: __( 'Cena', 'maison-du-pain' ),
				help: __( 'Np. „18 zł” lub „od 120 zł”.', 'maison-du-pain' ),
				value: meta.mdp_cena || '',
				onChange: update( 'mdp_cena' ),
				__nextHasNoMarginBottom: true,
				__next40pxDefaultSize: true,
			} ),
			el( 'div', { style: { height: '16px' } } ),
			el( TextControl, {
				label: __( 'Gramatura / porcja', 'maison-du-pain' ),
				help: __( 'Np. „800 g” lub „kawałek”.', 'maison-du-pain' ),
				value: meta.mdp_gramatura || '',
				onChange: update( 'mdp_gramatura' ),
				__nextHasNoMarginBottom: true,
				__next40pxDefaultSize: true,
			} )
		);
	}

	wp.plugins.registerPlugin( 'mdp-product-details', { render: ProductPanel } );
} )( window.wp );
