(function() {
    function log(message) {
        console.log('[Map Embed Generator]: ' + message);
    }

    function decodeURIComponentSafe(uri) {
        try {
            return decodeURIComponent(uri);
        } catch (e) {
            return uri;
        }
    }

    try {
        var currentUrl = window.location.href;
        log('Current URL: ' + currentUrl);
        
        if (!currentUrl.includes('google.com/maps/dir/')) {
            throw new Error('This script only works on Google Maps direction pages.');
        }

        var embedUrl = 'https://www.google.com/maps/embed?pb=!1m';

        // Extract coordinates
        var matches = currentUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        var lat = matches ? matches[1] : '0';
        var lng = matches ? matches[2] : '0';

        // Extract locations
        var dirPart = currentUrl.split('/maps/dir/')[1].split('/@')[0];
        var locations = dirPart.split('/').filter(Boolean);

        if (locations.length < 2) {
            throw new Error('Could not extract start and end locations from URL.');
        }

        // Extract coordinates for each location from the data parameter
        var dataParam = currentUrl.split('!4m')[1];
        var coordPairs = dataParam.match(/!2d(-?\d+\.\d+)!2d(-?\d+\.\d+)/g);

        embedUrl += (14 + locations.length * 7) + '!1m12!1m3!1d200000!2d' + lng + '!3d' + lat + 
                    '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m' + 
                    (1 + locations.length * 5) + '!3e0';

        locations.forEach(function(loc, index) {
            var coords = coordPairs && coordPairs[index] ? coordPairs[index].match(/!2d(-?\d+\.\d+)!2d(-?\d+\.\d+)/) : null;
            var locLng = coords ? coords[1] : '0';
            var locLat = coords ? coords[2] : '0';
            embedUrl += '!4m5!1s' + encodeURIComponent(decodeURIComponentSafe(loc)) + '!2m2!1d' + locLng + '!2d' + locLat + '!3s' + encodeURIComponent(decodeURIComponentSafe(loc));
        });

        embedUrl += '!5e0!3m2!1sen!2sus!4v' + Date.now() + '!5m2!1sen!2sus';

        var iframeCode = '<iframe src="' + embedUrl + '" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

        log('Generated iframe code: ' + iframeCode);

        navigator.clipboard.writeText(iframeCode).then(function() {
            alert('Embed code copied to clipboard!');
            log('Embed code successfully copied to clipboard.');
        }).catch(function(err) {
            throw new Error('Failed to copy to clipboard: ' + err);
        });
    } catch (error) {
        console.error('[Map Embed Generator Error]:', error);
        alert('An error occurred: ' + error.message + '\nPlease check the console for more details.');
    }
})();
