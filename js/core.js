$(function() {
	/* 
	 * Initialize file upload
	 */
	$('#file_upload').on('change', function() {
        localStorage.clear();
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				play(e.target.result);
			};
            $('#toggle').html('<span class="glyphicon glyphicon-pause"></span>  &nbsp; Pause');
            $('#path').attr('disabled', false);
            $('#update').attr('disabled', false);
            
            
			reader.readAsDataURL(this.files[0]);
            $('#file_title').text(this.files[0].name);
                        
		}
	});
	$('#file_upload').filestyle({
		disabled: true,
		input: false,
		icon: true,
		buttonText: ' &nbsp; Upload file',
		size: "md"
	});
	$('.bootstrap-filestyle').css('display', 'inline');
    $('.group-span-filestyle>.btn').addClass('btn-primary');
    
	/* 
	 * Initialize file buttons
	 */
	$('#toggle').on('click', function(event) {
		if(MIDI.Player.playing) {
			MIDI.Player.pause();
            $('#toggle').html('<span class="glyphicon glyphicon-play"></span>  &nbsp; Play');
        }
		else {
			MIDI.Player.resume();
            $('#toggle').html('<span class="glyphicon glyphicon-pause"></span>  &nbsp; Pause');
        }
	});
    
    
//    $('#test').on('click', function(event) {
//        console.log("end",MIDI.Player.endTime);
//        console.log(MIDI.Player.currentTime);
//        MIDI.Player.cueTo(MIDI.Player.endTime/2);
//        console.log(MIDI.Player.currentTime);
//        
//        
//    });
//    
	
    $('#path').on('click', function(event) {
    //    console.log("old", pathView);

        if(pathView === 'explode') {
            $('#path').html('Change view to: Independent channels');
            pathView = 'merged'
        }
        else {
            $('#path').html('Change view to: Merged channels');
            pathView = 'explode'
        }
    //    console.log("new", pathView);
    });
    
    
    $('#update').on('click', function(event) {
        console.log(channelsInstruments);
        
        for(ins in channelsInstruments) {
            var newIns = $('#'+ins).val();
            var newInsId = MIDI.GM.byName[newIns].number;
            
            MIDI.Player.pause();
            MIDI.programChange(ins, newInsId);
            MIDI.Player.resume();
            
            console.log(newIns, newInsId);
        }
        
    });
    
    $('.form-control').on('click', function(event) {
        console.log('test');
    });
    
    
    
	/*
	 * Other stuff
	 */
	$('#file_upload').attr('disabled', true);
	$('#toggle').attr('disabled', true);
    $('#path').attr('disabled', true);
    $('#update').attr('disabled', true);
    
	$('#info').show();

	$('#info_text').text('Initializing WebGL');
	initWebGL();

	$('#info_text').text('Loading MIDI-Plugin');
	loadPlugin();
});