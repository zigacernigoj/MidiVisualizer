var pathView = 'explode';





function initListener() {
	MIDI.Player.addListener(
		function(data) {
            /* POPRAVLJEN drawOnNote ZA VEC INSTRUMENTOV */
            drawOnNote(data, channelsInstruments, pathView);
            //console.log(data);
            
            /* channel, stevilka instrumenta, ime instrumenta */
            //console.log(data.channel, channelsInstruments[data.channel], MIDI.GM.byId[channelsInstruments[data.channel]].id);
		}
	);
}

var names = [
  "accordion",
  "acoustic_bass",
  "acoustic_grand_piano",
  "acoustic_guitar_nylon",
  "acoustic_guitar_steel",
  "agogo",
  "alto_sax",
  "applause",
  "bagpipe",
  "banjo",
  "baritone_sax",
  "bassoon",
  "bird_tweet",
  "blown_bottle",
  "brass_section",
  "breath_noise",
  "bright_acoustic_piano",
  "celesta",
  "cello",
  "choir_aahs",
  "church_organ",
  "clarinet",
  "clavinet",
  "contrabass",
  "distortion_guitar",
  "drawbar_organ",
  "dulcimer",
  "electric_bass_finger",
  "electric_bass_pick",
  "electric_grand_piano",
  "electric_guitar_clean",
  "electric_guitar_jazz",
  "electric_guitar_muted",
  "electric_piano_1",
  "electric_piano_2",
  "english_horn",
  "fiddle",
  "flute",
  "french_horn",
  "fretless_bass",
  "fx_1_rain",
  "fx_2_soundtrack",
  "fx_3_crystal",
  "fx_4_atmosphere",
  "fx_5_brightness",
  "fx_6_goblins",
  "fx_7_echoes",
  "fx_8_scifi",
  "glockenspiel",
  "guitar_fret_noise",
  "guitar_harmonics",
  "gunshot",
  "harmonica",
  "harpsichord",
  "helicopter",
  "honkytonk_piano",
  "kalimba",
  "koto",
  "lead_1_square",
  "lead_2_sawtooth",
  "lead_3_calliope",
  "lead_4_chiff",
  "lead_5_charang",
  "lead_6_voice",
  "lead_7_fifths",
  "lead_8_bass__lead",
  "marimba",
  "melodic_tom",
  "music_box",
  "muted_trumpet",
  "oboe",
  "ocarina",
  "orchestra_hit",
  "orchestral_harp",
  "overdriven_guitar",
  "pad_1_new_age",
  "pad_2_warm",
  "pad_3_polysynth",
  "pad_4_choir",
  "pad_5_bowed",
  "pad_6_metallic",
  "pad_7_halo",
  "pad_8_sweep",
  "pan_flute",
  "percussive_organ",
  "piccolo",
  "pizzicato_strings",
  "recorder",
  "reed_organ",
  "reverse_cymbal",
  "rock_organ",
  "seashore",
  "shakuhachi",
  "shamisen",
  "shanai",
  "sitar",
  "slap_bass_1",
  "slap_bass_2",
  "soprano_sax",
  "steel_drums",
  "string_ensemble_1",
  "string_ensemble_2",
  "synth_bass_1",
  "synth_bass_2",
  "synth_brass_1",
  "synth_brass_2",
  "synth_choir",
  "synth_drum",
  "synth_strings_1",
  "synth_strings_2",
  "taiko_drum",
  "tango_accordion",
  "telephone_ring",
  "tenor_sax",
  "timpani",
  "tinkle_bell",
  "tremolo_strings",
  "trombone",
  "trumpet",
  "tuba",
  "tubular_bells",
  "vibraphone",
  "viola",
  "violin",
  "voice_oohs",
  "whistle",
  "woodblock",
  "xylophone"
];

function loadPlugin() {
	MIDI.loadPlugin({
		soundfontUrl: "./libs/midi/soundfont/",
		instruments: ["acoustic_grand_piano"],
		onsuccess: function() {
			console.log('MIDI-Plugin loaded');
			initListener();

			$('#info').hide();
			$('#file_upload').filestyle('disabled', false);
		}
	});
}

var channelsInstruments = null;

function play(data) {
	$('#info_text').text('Loading track');
	$('#info').show();

	MIDI.Player.stop();
	MIDI.Player.loadFile(
		data,
		function() {
			$('#info').hide();
			$('#toggle').attr('disabled', false);
			console.log('Song loaded');
            
            channelsInstruments = MIDI.Player.getFileChannelInstruments();
            instrumentsNames = MIDI.Player.getFileInstruments();
            
            console.log("chins",  channelsInstruments);
            console.log("chinsnames",  instrumentsNames);
            
            
            var endMins = parseInt((MIDI.Player.endTime / 1000) / 60);
            var endSecs = parseInt((MIDI.Player.endTime / 1000) % 60);
            var endTt = ""+endMins+":"+endSecs;
            console.log(endMins, ":", endSecs);
            
        $   ("#timeline").html("");
            
            $("#timeline").append(
                '<div class="col-lg-1" style="margin-top: 7px; text-align: right;">0:00</div>' +
                '<div class="col-lg-10" id="slider" style="margin-top: 10px; margin-bottom: 5px; background-color: #6495ED;">' +
                    '<div id="custom-handle" class="ui-slider-handle"></div>' +
                '</div>' +
                '<div class="col-lg-1" style="margin-top: 5px; text-align: left;">' + endTt + '</div>');

            var handle = $( "#custom-handle" );
            
            $( "#slider" ).slider({
                range: "max",
                min: 0,
                max: MIDI.Player.endTime,
                
                create: function() {
                    handle.text( $( this ).slider( "value" ) );
                },

                slide: function( event, ui ) {
//                    console.log(ui.value);
//                    console.log("end", MIDI.Player.endTime);
//                    console.log(MIDI.Player.currentTime);
                    MIDI.Player.cueTo(ui.value);
//                     console.log(MIDI.Player.currentTime);
                }

            });

            window.setInterval(function(){
                var currMins = parseInt((MIDI.Player.currentTime / 1000) / 60);
                var currSecs = parseInt((MIDI.Player.currentTime / 1000) % 60);
                var currTt = ""+currMins+":"+currSecs;
            
                $("#custom-handle").text(currTt);
                
                $( "#slider" ).slider({
                    value: MIDI.Player.currentTime
                });
                
            }, 100);

            
            
            $("#choose_instruments").html("");
            
            for(var ins in channelsInstruments) {
                var nn = MIDI.GM.byId[channelsInstruments[ins]].id;
                //console.log(nn);
                
                var options = "";
                for(var x in instrumentsNames) {
                    if(instrumentsNames[x] === nn) {
                        options += '<option value="' + instrumentsNames[x] + '" selected>' + instrumentsNames[x] + '</option>';
                    }
                    else {
                        options += '<option value="' + instrumentsNames[x] + '">' + instrumentsNames[x] + '</option>';
                    }   
                }
//                console.log(options);
                
                $("#choose_instruments").append('<div class="col-lg-2" style="margin-top: 5px;"><select id="' + ins + '" class="form-control">' + options + '</select></div>');
            }
            
            $('select').select2();
            
            console.log("chlen", Object.keys(channelsInstruments).length);
            
			MIDI.Player.start();
		}
	);
}



