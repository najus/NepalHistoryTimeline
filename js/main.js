

// when page was load all resources.
$(document).ready(function(){

	// startup timeliner
	$.timeliner({timelineContainer:'#timeline'});

	// array of content
	var content = [_content['nepal_1740'], _content['nepal_1770']];

	var timeline = new TimeLine('timeline', content);

	timeline.createHTML();

	$('.venobox').venobox();

    // /* custom settings */
    $('.venobox_custom').venobox({
        framewidth: '600px',        // default: ''
        frameheight: '400px',       // default: ''
        border: '1px',             // default: '0'
        bgcolor: '#83a300',         // default: '#fff'
        titleattr: 'data-title',    // default: 'title'
        numeratio: true,            // default: false
        infinigall: true            // default: false
    });

});
