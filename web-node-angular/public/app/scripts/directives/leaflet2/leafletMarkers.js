
function createHtmlElement(text, icon) {
	var $buildHtml,
		$textItem,
		outputHtml,
		image = '';

	if(typeof icon !== 'undefined') {
		image = '<img class="mapAvatar" src="' + icon + '" />';
	}

	$buildHtml = $('<span />');
	$textItem = $('<span />');
	$textItem.text(text);

	$buildHtml.append($textItem);
	outputHtml = $buildHtml.html();

	return image + outputHtml;
}

/**
	opts {
	text: the text to show,
	lat: lat,
	lng: lng
	}
 */
function mapTextMarker(opts) {
	var letterWidth = 8,
		outputHtml,
		calculatedWidth,
		calculatedArrowCenter,
		markerText,
		divIcon,
		icon,
		iconWidth = 24;
		arrowWidth = 10;

	icon = opts.icon;
	markerText = opts.text;

	calculatedWidth = (markerText.length * letterWidth) + iconWidth;
	calculatedArrowCenter = calculatedWidth / 2 + (arrowWidth / 2);

	outputHtml = createHtmlElement(markerText, icon);

	divIcon = L.divIcon({
		iconSize: new L.Point(calculatedWidth, 24),
		iconAnchor: new L.Point(calculatedArrowCenter, 40),
		className: 'mapTextMarker',
		html: outputHtml
	});

	return new L.Marker([opts.lat, opts.lng],{icon: divIcon});
}

/**
 * @description markers module
 */
var module = {
	mapTextMarker: mapTextMarker
};

