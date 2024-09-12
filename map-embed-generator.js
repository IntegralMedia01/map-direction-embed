(function() {
    function log(message) {
        console.log('[Map Embed Generator]: ' + message);
    }

    try {
        if (!document.querySelector('div[aria-label="Trip options"]')) {
            throw new Error('This script only works on Google Maps direction pages.');
        }

        var embedUrl = 'https://www.google.com/maps/embed?pb=!1m';

        // Extract locations from the DOM
        var locationElements = document.querySelectorAll('div[aria-label="Trip options"] input[aria-label]');
        var locations = Array.from(locationElements).map(el => el.value);

        if (locations.length < 2) {
            throw new Error('Could not extract start and end locations from the page.');
        }

        // Extract map center coordinates
        var mapDiv = document.querySelector('div[aria-label="Map"]');
        var lat = mapDiv.getAttribute('data-lat') || '0';
        var lng = mapDiv.getAttribute('data-lng') || '0';

        embedUrl += (14 + locations.length * 7) + '!1m12!1m3!1d200000!2d' + lng + '!3d' + lat + 
                    '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m' + 
                    (1 + locations.length * 5) + '!3e0';

        locations.forEach(function(loc) {
            embedUrl += '!4m5!1s' + encodeURIComponent(loc) + '!2s' + encodeURIComponent(loc) + '!3s' + encodeURIComponent(loc);
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
