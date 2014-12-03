//Marker for the richmedia ad being open
var richmedia_open = false;

//Marker for the richmedia ad being in action
var richmedia_action = false;

(function ($) {
	"use strict";
	$(function () {
		// Place your public-facing JavaScript here
		
		var d = new Date( );
		
		//Get Date Variables to be passed through ajax
		var year 	= d.getYear( ) + 1900;
		var month 	= ( d.getMonth( ) + 1 );
		var day		= d.getDate( );
		
		//Get Time variables to be passed through ajax
		var hour 	= d.getHours( );
		var minute	= d.getMinutes( );
		
		//Current URL
		var url		= location.href;
		
		//spliting the querystring by '?'
		var q_str   = url.split("?");
		
		var richmedia_id = "";
		
		//Checking if there are parameters in the querystring
		if( q_str.length > 1 )
		{
			//Split the parameters by '&'
			var q_str_params = q_str[1].split("&");
			
			var url = "";
			
			//Check if there is only one index from q_str_params
			if( q_str_params.length == 1 )
			{
				//Split the parameter by '='
				var key_value = q_str[1].split("=");
				
				//Check to see what parameters are being checked in 
				switch( key_value[0] )
				{
					case "richmedia_testdate": //Testing Date (usually goes with time)
						var richmedia_date = key_value[1].split("-");					
					
						year 	= richmedia_date[0];
						month 	= richmedia_date[1];
						day		= richmedia_date[2];
					
					break;
					case "richmedia_testtime": //Testing Time (usually goes with date)
						var richmedia_time = key_value[1].split(":");
						
						hour 	= richmedia_time[0];
						minute	= richmedia_time[1];
						
					break
					case "richmedia_id": //Testing by ID
						richmedia_id = key_value[1];
					break;
				}
			}
			else if ( q_str_params.length > 1 ) //More than one parameter in the querystring
			{
				//Loop through the parameters
				for( var i = 0 ; i < q_str_params.length ; i++ )
				{
										
					//Split the parameter by '='
					var key_value = q_str_params[i].split("=");
					
					//Check to see what parameters are being checked in 
					switch( key_value[0] )
					{
						case "richmedia_testdate": //Testing Date (usually goes with time)
							var richmedia_date = key_value[1].split("-");					
						
							year 	= richmedia_date[0];
							month 	= richmedia_date[1];
							day		= richmedia_date[2];
						
						break;
						case "richmedia_testtime": //Testing Time (usually goes with date)
							var richmedia_time = key_value[1].split(":");
							
							hour 	= richmedia_time[0];
							minute	= richmedia_time[1];
							
						break
						case "richmedia_id": //Testing by ID
							richmedia_id = key_value[1];
						break;
					}
				}
			}
		}
		
		//If the richmedia ad Id was NOT passed through the querystring then use either the current date info OR any date info that was passed in the querystring
		if( richmedia_id == "" )
		{
			url = "/wp-admin/admin-ajax.php?year=" + year + "&month=" + month + "&day=" + day + "&hour=" + hour + "&minute=" + minute + "&action=richmedia_get_ad";
		}
		else //If ID was passed retrieve the richmedia ad associated with that ID
		{
			url = "/wp-admin/admin-ajax.php?id=" + richmedia_id + "&action=richmedia_get_ad";
		}
		
		//AJAX Call to retrieve information
		 $.ajax({
			url : url,
			type : "GET",
			dataType : "json",
			success: function( data )
			{
				//The script has returned that there is a richmedia AD
				if( data.richmedia == true )
				{

					//Extract Variables from JSON obj
					var id				= data.id;
					var name 			= data.name;
					var image  			= data.img;
					var link 			= data.link;
					var target			= data.target;
					var video			= data.has_video;
					var video_assets	= data.video_assets;
					var parallax		= data.parallax;
					var parallax_assets = data.parallax_assets;
					
					//set up style changes for the header element
					$("header").css("margin-bottom", "5px");
					
					//set style changes for the #main-content element
					$("#main-content").css("margin-top", "5px");
					
					//Create #richmedia element after the header element
					$("header").after( $('<div>', {id : "richmedia"}) );
					
					//Begin appending elements to the newly created #richmedia element
					
					//Append the #richmediaControl element
					$("#richmedia").append( $('<div>', {id : "richmediaControl"}) );
					
					//Append a div element to the #richmediaControl Element - used to house the arrow or X on open and close
					$("#richmediaControl").append( $('<div>') );
					
					//Append the #richmediaContainer element
					$("#richmedia").append( $('<div>', {id : "richmediaContainer"}) );			
					
					//Append the #richmediaBackground element
					$("#richmediaContainer").append( $('<div>', {id : 'richmediaBackground'}) );
					
					//Check if using parallax
					if( parallax == 1)
					{
						//Append the parallax element to the div directly under the #richmediaContainer element
						$("#richmediaContainer > div").append( $('<div>', {id : "parallax", class : "clear"}) );
						
						//Grab parallax assets
						var assets = parallax_assets.split(",");
						
						//Loop through assets and create elements for eacha asset
						for( var i = 0 ; i < assets.length ; i++ )
						{
							//Split current asset by the delimiting ':' 
							var item  = assets[i].split("|"); 
							
							var name 	= item[0];
							
							var p_file_path = name.split(".");
							
							var p_item_extension = p_file_path[(p_file_path.length - 1)];
							
							var dimensions = item[1].split(":");
							
							var width 	= dimensions[0];
							var height 	= dimensions[1];
							
							//Background will be the initial layer and set up slightly differently than the others
							if( p_item_extension.toLowerCase( ) == "jpg" )
							{
								$("#parallax").css("background", "url(" + name + ")");
								$("#parallax").css("position","relative");
							}
							else
							{
								$("#parallax").append( $('<div>', {class : "parallax-layer", id : "parallax-layer-" + i}) );
								
								$("#parallax-layer-" + i).css({ width : width + "px" , height : height + "px"});
								
								$("#parallax-layer-" + i).append( $('<img>', {src : name} ) );
							}
						}
						
						//set up parallax-layer position
						$(".parallax-layer").css("position","absolute");
						
						//Call parallax jQuery plugin
						$("#parallax .parallax-layer").parallax({
							mouseport : $("#parallax")
						});
					}
					else
					{	
						//If using video, append the #richmediaVideoContainer element
						if( video == 1)
						{
							$("#richmediaContainer").append( $('<div>', { id : "richmediaVideoContainer"}) );				
						}
					
						//If parallax not being used, set up regular richmedia ad background
						$("#richmediaBackground").append( $('<img>', {src : image, border : "0", valign : "bottom"}) );
					}
					
					//Set up mouseout/mouseleave events for richmedia ads
					$("#richmediaControl > div").on({
						mouseover : function( ){
							$(this).css("cursor", "pointer");	
						},
						mouseleave : function( ){
							$(this).css("cursor", "auto");
						}
					});
					
					//Marker for first-pass
					var first_pass = false;
					
					//Set up events for tapping or clicking the div directly under the #richmediaControl element
					$("#richmediaControl > div").on('click', function( e ){
	
						//Get width of the browser window
						var win_width = $(window).width( );
						
						//Check if the ad is open - if so, set up mouseover/mouseout events
						if( richmedia_open === false )
						{
							$("#richmedia").on({
								mouseover : function( ){
									$(this).css("cursor", "pointer");
									
								},
								mouseleave : function( ){
									$(this).css("cursor", "auto");
								}
							});
							
							/*
							* The following lines will check the width of the browser window  
							* and adjust the opening height accordingly.
							*/
							
							if( parseInt( win_width ) <= 767 && parseInt( win_width ) >= 480 )
							{
								if( video )
								{
									$("#richmedia").animate({height: '450px'},500);	
								}
								else
								{
									$("#richmedia").animate({height: '250px'},500);
								}
							}
							else if( parseInt( win_width ) <= 985 && parseInt( win_width) >= 768 )
							{
								$("#richmedia").animate({height: '248px'},500);
							}
							else
							{
								$("#richmedia").animate({height: '350px'},500);
							}
							
							//Set up the close button in the top right-hand corner.
							$("#richmediaControl div").css("background", "url(/wp-content/plugins/rich-media/assets/close.png) no-repeat top center");
							
							//Check if the Richmedia is using video.  If so, set up videos
							if( video == 1 )
							{
								//Check if the browser supports HTML5 Video
								if( supports_video( ) )
								{
									//Setup video tag and attributes
									$("#richmediaVideoContainer").append( $('<video>', { id : "richMediaVideo", width : "320px", height : "240px" , controls : "controls"}) );
									
									//split video assets
									var assets = video_assets.split(",");
									
									//Loop through video assets and assign them as source tags underneath the video tag
									for( var i = 0 ; i < assets.length ; i++ )
									{
	
										var item  = assets[i].split("|");
										
										var name 	= item[0];
										//var type 	= item[1].split("/");
										var type 	= item[1];
										
										$("#richmediaVideoContainer > video").append( $('<source>', { src : name, type : type}) );
									}
									
									//When richmedia ad is open play video player.
									$("#richMediaVideo").get( 0 ).play( );
								}
								else //Browser doesn NOT support HTML5 video - use flash player
								{
									//get video_assets
									var assets = video_assets.split(",");
									
									var embed_video_name = "";
									
									//Loop through assets and look for the 'FLV' file
									for( var i = 0 ; i < assets.length ; i++ )
									{
	
										var item  = assets[i].split(":");
										
										var name 	= item[0];
										var type 	= item[1];
										
										if( type == "video/flv" || type == "video/x-flv" )
										{
											embed_video_name = name;
										}
									}
									
									//If embed name is not empty (FLV file present) then build embed object in element #richmediaVideoContainer
									if( embed_video_name != "" )
									{
										
										$("#richmediaVideoContainer").append( $('<embed>', {
											id : "#richMediaVideo",
											src: "/wp-content/plugins/rich-media/assets/mediaplayer.swf?autostart=true&file=" + embed_video_name,
											quality: "high",
											bgcolor: "#fff",
											width: "320px",
											height: "240px",
											name: "scroller",
											align: "middle",
											allowScriptAccess: "sameDomain",
											type: "application/x-shockwave-flash",
											pluginspage: "http://www.macromedia.com/go/getflashplayer",
											wmode: "opaque",
											allowfullscreen: "true"
										}) );	
									}
								}
							}
							
							//Set richmedia_open marker equal to true
							richmedia_open = true;
						}
						else //If richmedia_open marker is set to true
						{
							//Set up mouseover/mouseout events for #richmedia elements
							$("richmedia").on({
								mouseover : function( ){
									$(this).css("cursor", "auto");
									
								},
								mouseleave : function( ){
									$(this).css("cursor", "auto");
								}
							});
								
							//Animate richmedia ad to close
							$("#richmedia").animate({height: '55px'},500);
							
							//Change the close button to the expand button
							$("#richmediaControl div").css("background", "url(/wp-content/plugins/rich-media/assets/expand.png) no-repeat top center");	
							
							//Set richmedia_open marker equal to false
							richmedia_open = false;
							
							//If has video remove all video players
							if( video == 1 )
							{
								$("#richMediaVideo").remove( );
								$("#richmediaVideoContainer > embed").remove( );
							}
						}
	
						e.preventDefault( );
					});
					
					//Event for clicking on the richmedia background.
					$("#richmediaBackground").on("click", function( ){
						
												
						//Check if the richmedia ad is open and the richmedia_action marker is set to false.
						//If both conditions are met then, depending on the target, open the ad in a new window/tab
						//or same window.
						if( richmedia_open === true && ! richmedia_action)
						{
							if( target == "blank" )
							{
								_gaq.push(['_trackEvent',"Rich Media - " + name, 'Click', link]);
							}
							else
							{
								_gaq.push(['_trackEvent',"Rich Media - " + name, 'Click']);
								setTimeout( function( ){ window.location.href = link;}, 400 );
							}
						}
						
						//Set richmedia_action marker to false.
						richmedia_action = false;
					});
					
					
					//Put actions to when ever the window resizes
					$(window).resize( function( )
					{
						//window browser width
						var win_width = $(window).width( );
						
						if( parseInt( win_width ) <= 767 && parseInt( win_width ) >= 480 )
						{
							if( richmedia_open && ( parseInt( $("#richmedia").css('height') ) != 450  ) && ( video == 1 ) && ( parallax == 0 ) )
							{
								//console.log( 'resizing' );
								$("#richmedia").stop( ).animate({height: '450px'},500);
							}
							else if( richmedia_open && ( parseInt( $("#richmedia").css('height') ) != 450  ) && ( video == 0 ) && ( parallax == 1 ) )
							{
								$("#richmedia").stop( ).animate({height: '250px'},500);
							}
						}
						
						if( parseInt( win_width ) <= 479 )
						{
							if( richmedia_open  && ( video == 1 ) && ( parallax == 0 ) )
							{
								//console.log( 'resizing' );
								$("#richmedia").stop( ).animate({height: '350px'},500);
							}
							else if( richmedia_optn && (parallax == 1) && (video == 0 ) )
							{
								$("#richmedia").stop( ).animate({height: '250px'},500);
								
							}
						}
						
						if( parseInt( win_width ) > 767 && parseInt( win_width) < 986)
						{
							if( richmedia_open && ( parseInt( $("#richmedia").css('height') ) != 248 ) && ( video == 1 ) && ( parallax == 0 ) )
							{
								//console.log( 'resizing' );
								$("#richmedia").stop( ).animate({height: '248px'},500);
							}
						}
						
						if( parseInt( win_width ) >= 986 )
						{
							if( richmedia_open && ( parseInt( $("#richmedia").css('height') ) != 350 ) && ( video == 1 ) && ( parallax == 0 ) )
							{
								//console.log( 'resizing' );
								$("#richmedia").stop( ).animate({height: '350px'},500);
							}
						}
					});
				}
			}
		});
	});
}(jQuery));

function supports_video() 
{
  return !!document.createElement('video').canPlayType;
}

