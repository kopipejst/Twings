<!DOCTYPE html>
<html>
    <head>

        <script src="jquery-1.4.2.min.js"></script>
        <script src="jquery-ui-1.8.11.custom.min.js"></script>
        <script src="resources/farbtastic/farbtastic.js"></script>

        <script src="twings.panel.js"></script>
        <script src="twings.data.js"></script>
        <script src="twings.cart.js"></script>        
        
        
        <link rel="stylesheet" href="resources/smoothness/jquery-ui-1.8.11.custom.css" />
        <link rel="stylesheet" href="resources/farbtastic/farbtastic.css" />
        
        <style>
            body { font-family: verdana; font-size: 12px }
            #log { position: fixed; top: 0; left: 0; font-size: 11px; padding: 10px; }
            #page { width: 900px; margin: 0 auto; }
            
            #settings_holder {
                position: fixed;
                top: 0;
                right: 0px;
                width: 280px;
            	margin-top: 10px;
			}
            #settings {
            	padding: 20px 20px 20px;
                background: rgba(00,00,00,0.8);
				border-radius: 5px 0px 0px 5px;
				width: 200px;
				float: right;
            }
            
            .title { color: white; font-size: 10px; line-height: 25px; }
            
            #user_cart {
                background: rgba(00,00,00,0.8);
                box-shadow: 0px 0px 5px #000;
                color: #ffffff;
                padding: 10px;
                width: 200px;
                border-radius: 10px;
            }
            
            #show_hide { float: right; width: 20px; margin-top: 20px; border-radius: 5px 0px 0px 5px; background: rgba(00,00,00,0.8); }
            
            #show_hide div {
            	color: #ffffff;
            	text-align: center;
            	line-height: 30px;
            	cursor: pointer;
	    }
            
	    #show { display: none; }
			
            #name {
		font-size: 16px;
		width: 140px;
		float: left;
		border: 1px solid #f3f3f3;
		height: 25px;
	    }
	    #main_form { overflow: hidden; }
            #screen_name { color: #ccc; }
	    #name_submit {
		border: none;
		background: #f3f3f3;
		width: 40px;
		float: left;
		text-align: center;
		font-weight: bold;
		height: 28px;
		margin-left: 5px;
	    }
            
        </style>
        
    </head>
    <body>


	<div style="position: fixed; bottom: 20px; left: 0px; width: 300px; padding: 10px; font-size: 11px;">
	    <strong style="font-size: 20px; line-height: 30px;">What's this ?</strong><br />
	    This is demo page for Twings - Visual presentation of Twitter connections.
	    You can play with options on right side to create custom presentation of your Twitter connections.
	    Demo works only in modern browsers and it's in early Beta phase. 
	    More details can be found on <a href="http://workshop.rs">workshop.rs</a>.
	</div>


        <div id="cart">
            <div id="cart_screen_name"></div>
        </div>
        
        <div id="settings_holder">
	        <div id="settings">
	            
	            <div class="title">Twitter screen name</div>
		    <form id="main_form">
			<input type="text" id="name" name="name" />
			<input type="submit" id="name_submit" value="go" />
		    </form>
		    
	            <div class="title">Maximum radius</div>
	            <div id="slider_maxRadius"></div>
	            
	            <div class="title">Number of rings</div>
	            <div id="slider_steps"></div>
	            
	            <div class="title">Distance between rings</div>
	            <div id="slider_distance"></div>
	            
	            <div class="title">Order of dots in rings</div>
	            <div id="slider_order"></div>
	            
	            <div class="title">Group (friends, followers, following)</div>            
	            <div id="slider_type"></div>
	            
	            <div class="title">Dots radius</div>
	            <div id="slider_radius"></div>
	            
	            <div id="color_colors"></div>
	            
	        </div>
			<div id="show_hide">
				<div id="hide">&raquo;</div>
				<div id="show">&laquo;</div>
			</div>
		</div>
			
			

        <div id="page">
        
            <svg id="canvas" width="900" height="700" version="1.1" xmlns="http://www.w3.org/2000/svg">
                
            </svg>
        
            <div id="log"></div>
        
            <div id="content"></div>
    
        </div>
    
        <script>
 
            var username = window.location.hash.replace('#','') || 'kopipejst';
	    $('#name').val(username);
	    
            TWINGS.panel.init();
            TWINGS.data.getData(username);

	    // initial type for sliders
            TWINGS.TYPE = "friend";


            /**
             * Adding new message to log
             */
            function log(message){

                $('#log').prepend(message + '<br />');
            }

        
            $( "#slider_maxRadius").slider({
                max: 340,
                min: 200,
                step: 10,
                value: TWINGS.panel.settings.maxRadius,
                change: function(event, ui){
                	TWINGS.panel.settings.maxRadius = ui.value;
                	TWINGS.panel.create();
                }
            });

            $( "#slider_steps").slider({
                max: 10,
                min: 1,
                step: 1,
                value: TWINGS.panel.settings.steps,
                change: function(event, ui){
                    TWINGS.panel.settings.steps = ui.value;
                    TWINGS.panel.create();
                }
            });
            
            $( "#slider_distance").slider({
                max: 100,
                min: 10,
                step: 10,
                value: TWINGS.panel.settings.distance,
                change: function(event, ui){
                    TWINGS.panel.settings.distance = ui.value;
                    TWINGS.panel.create();
                }
            });
            
            $( "#slider_radius").slider({
                max: 20,
                min: 5,
                step: 1,
                value: TWINGS.panel.settings.type[TWINGS.TYPE].radius,
                slide: function(event, ui){
                    TWINGS.panel.settings.type[TWINGS.TYPE].radius = ui.value;
                    TWINGS.panel.create();
                }
            });            

            $( "#slider_order").slider({
                max: 1,
                min: 0,
                step: 1,
                value: TWINGS.panel.settings.order,
                slide: function(event, ui){
                    TWINGS.panel.settings.order = ui.value;
                    TWINGS.panel.create();
                }
            });
            
            $( "#slider_type").slider({
                max: 2,
                min: 0,
                step: 1,
                value: 0,
                slide: function(event, ui){
                    var types = ['friend','follower','following'];
                    TWINGS.TYPE = types[ui.value];
                }
            });              
 
            $('#color_colors').farbtastic(function(color){
                TWINGS.panel.settings.type[TWINGS.TYPE].color =  color;
                TWINGS.panel.create();
            }); 

            $('#hide').click( function(){
		$('#settings_holder').animate({ right: '-240px' } , 500);
		$(this).hide();
		$('#show').show();
            });

            $('#show').click( function(){
            	$('#settings_holder').animate({ right: '0px' } , 500);
            	$(this).hide();
            	$('#hide').show();
            });            

            $('#main_form').submit( function(e){
		var val = $('#name').val();
		e.preventDefault();
		localStorage['TWINGS_' + val] = '';
		TWINGS.data.storageTemp.friends = [];
		TWINGS.data.storageTemp.followers = [];				
		TWINGS.data.getData(val);
            }); 


            
        </script>
  
<script type="text/javascript"> 
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script> 
<script type="text/javascript"> 
try {
var pageTracker = _gat._getTracker("UA-11860629-1");
pageTracker._trackPageview();
} catch(err) {}
</script>   
    
        <a href="https://github.com/kopipejst/Twings"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://d3nwyuy0nl342s.cloudfront.net/img/bec6c51521dcc8148146135149fe06a9cc737577/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub"></a> 


    </body>
</html>