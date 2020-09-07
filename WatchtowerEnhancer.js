// ==UserScript==
// @name        	WatchtowerEnhancer
// @description 	Let's you see when an attack reaches your tower radius
// @author      	Warre, Max
// @version     	1.1
// @grant       	none
// @include     	https://*.die-staemme.de*screen=overview_villages*
// @include     	https://*.die-staemme.de*info_command*type=other*
// ==/UserScript==

/********************************
**         Translations        **
********************************/

var Translation = (function() {
	var lang;
	var msg = {
		'de' : {
			saveInfo : 'Informationen speichern',
			saveInfoTitle : 'Die notwendigen Informationen von Ihren Wachtürmen werden gespeichert. Alte Informationen werden entfernt.',
			lastSaved : 'Letzte Aktualisierung',
			infoSaved : 'Informationen gespeichert',
			never : 'nie',
			deleteInfo : 'Informationen löschen',
			deleteInfoTitle : 'Löschen Sie alle zuvor gespeicherten Informationen.',
			infoDeleted : 'Informationen gelöscht',
			noWatchtowersLoaded : 'Keine Wachturm Informationen geladen',
			viewIn : 'WT Tag in:',
            timeAfter: 'Zeit nach WT Tag:',
			multipleTags : 'mehrere tags',
			noTag : 'kein tag'
		},
		'int' : {
			// NOT SUPORTED YET
		}
	};

	var get = function() {
		lang = (msg.hasOwnProperty(game_data.market)) ? game_data.market : 'int';

		return msg[lang];
	}

	return {
		get : get
	}
})();

/********************************
**   WatchtowerEnhancer Code   **
********************************/

var WatchtowerEnhancer = (function() {
	var general = (function () {
		var getRadius = function(lvl) {
			var lvlRadius = {
				'1' : 1.1,
				'2' : 1.3,
				'3' : 1.5,
				'4' : 1.7,
				'5' : 2,
				'6' : 2.3,
				'7' : 2.6,
				'8' : 3,
				'9' : 3.4,
				'10' : 3.9,
				'11' : 4.4,
				'12' : 5.1,
				'13' : 5.8,
				'14' : 6.7,
				'15' : 7.6,
				'16' : 8.7,
				'17' : 10,
				'18' : 11.5,
				'19' : 13.1,
				'20' : 15
			};

			return lvlRadius[lvl];
		};

		var getTags = function() {
			var tags = { // Einheitenname (abhängig vom Tagger): Laufzeit der Einheit / des Feldes (abhängig von der Welt)
				'Speer' : 18,
                'Schwert' : 22,
				'Axt' : 18,
				'Boogschutter' : 18,
				'Spy' : 9,
                'Späher' : 9,
				'Lkav' : 10,
				'BBoog' : 10,
				'Skav' : 11,
				'Ramme' : 30,
                'Kata' : 30,
				'Ritter' : 10,
				'AG' : 35
			}

			return tags;
		};

		return {
			getRadius : getRadius,
			getTags : getTags
		}
	})();

	var storage = (function() {
		var id = game_data.player.id;
		var timestamp = $('#serverDate').text() + ' ' + $('#serverTime').text();
		var watchtowers = JSON.parse(localStorage.getItem('WatchtowerEnhancer_watchtowers_' + id));

		var getWatchtowers = function(reset) {
			if (watchtowers === null || reset) {
				watchtowers = {
					'date' : Translation.get().never,
					'info' : {}
				}

				localStorage.setItem('WatchtowerEnhancer_watchtowers_' + id, JSON.stringify(watchtowers));

				if (reset) UI.SuccessMessage(Translation.get().infoDeleted);
			}

			return watchtowers;
		};

		var setWatchtowers = function(info) {
			watchtowers = {
				'date' : timestamp,
				'info' : info
			}

			localStorage.setItem('WatchtowerEnhancer_watchtowers_' + id, JSON.stringify(watchtowers));
			UI.SuccessMessage(Translation.get().infoSaved);
		};

		return {
			getWatchtowers : getWatchtowers,
			setWatchtowers : setWatchtowers
		}
	})();

	var groupPage = (function() {
		var addInterface = function() {

			var table = '<table class="vis WatchtowerEnhancer" style="width:100%;height: 34px;"><tr><th style="width: 10%;padding: 0px 8px;">WatchtowerEnhancer:</th><th>'
					  +		'<input type="button" class="btn tooltip uploadWatchtowers" style="margin-left:15px;" value="' + Translation.get().saveInfo + '">'
					  +		'<input type="button" class="btn tooltip deleteWatchtowers" style="margin-left:15px;" value="' + Translation.get().deleteInfo + '" title="' + Translation.get().deleteInfoTitle + '">'
					  + '</th></tr></table>'

			$('#buildings_table').before(table);
			groupPage.setUploadTitle();
			WatchtowerEnhancer.bindEventHandlers();
			groupPage.bindEventHandlers();
		};

		var setUploadTitle = function() {
			$('.uploadWatchtowers').addClass('tooltip').attr('title', Translation.get().saveInfoTitle + '<br><br>' + Translation.get().lastSaved + ': ' + storage.getWatchtowers().date);
			WatchtowerEnhancer.bindEventHandlers();
		}

		var bindEventHandlers = function() {
			$('.uploadWatchtowers').off('click').on('click', function() {
				var watchtowers = {};
				$('#buildings_table').find('td.b_watchtower').map(function() {
					if ($(this).find('.hidden').length == 0) {
						var coord = $(this).closest('tr').find('.quickedit-label').text().match(/\d{1,3}\|\d{1,3}/g).slice(-1)[0].toString();
						var radius = general.getRadius($(this).text().trim());

						watchtowers[coord] = radius;
					}
				});

				storage.setWatchtowers(watchtowers);
				groupPage.setUploadTitle();
			});

			$('.deleteWatchtowers').off('click').on('click', function() {
				storage.getWatchtowers(true);
				groupPage.setUploadTitle();
			});
		};

		return {
			addInterface : addInterface,
			setUploadTitle : setUploadTitle,
			bindEventHandlers : bindEventHandlers
		}
	})();

	var incomingsPage = (function() {
		var addInterface = function() {
			var log = $('.server_info');
			if ($.isEmptyObject(storage.getWatchtowers().info)) {
				log.prepend('WacthtowerEnhancer -> ' + Translation.get().noWatchtowersLoaded + ' | ');
			} else {
				log.prepend('WacthtowerEnhancer -> ' + Translation.get().lastSaved + ': ' + storage.getWatchtowers().date + ' | ');

				var $rows = $('#incomings_table').find('tr');

				$rows.first().append('<th>' + Translation.get().viewIn + '</th>');
				$rows.not(':first, :last').append('<td class="WatchtowerEnhancer_result"></td>');
				$rows.last().find('th').last().attr('colspan', parseInt($rows.last().find('th').last().attr('colspan')) + 1);

                $rows.first().append('<th>' + Translation.get().timeAfter + '</th>');
				$rows.not(':first, :last').append('<td class="WatchtowerEnhancer_result2"></td>');
				$rows.last().find('th').last().attr('colspan', parseInt($rows.last().find('th').last().attr('colspan')) + 1);

				for (var i = 1, l = $rows.length -1; i < l; i++) {
					var $this = $rows.eq(i);

					if ($this.find('.quickedit-content').find('a').first().attr('href').match('type=other') && $this.find('.quickedit-content').find('img[src*="/command/attack.png"]').length > 0) {
						var home = $this.find('a[href*="screen=info_village"]').first().text().match(/\d{1,3}\|\d{1,3}/g).slice(-1)[0].toString();
						var target = $this.find('a[href*="screen=overview"]').first().text().match(/\d{1,3}\|\d{1,3}/g).slice(-1)[0].toString();
						var intersection = generalFunctions.getIntersections(home, target);

						if (intersection) {
							var arival = generalFunctions.convertToTimestamp($this.find('td').eq(5).text().trim());
							var extract = generalFunctions.calculateDiff(intersection.distance, $this.find('.quickedit-label').text().trim());
                            console.log("intersection, arival:"+arival+" extract:"+extract)

							if (typeof extract === 'string') {
								$this.find('.WatchtowerEnhancer_result').html(extract);
							} else {
								$this.find('.WatchtowerEnhancer_result').html('<span class="timer" data-endtime="' + (arival - extract) + '"></span>');
                                $this.find('.WatchtowerEnhancer_result2').html('<span>'+new Date(extract * 1000).toISOString().substr(11, 8)+'</span>');
							}
						}
					}
				}

				Timing.tickHandlers.timers.init(); // initiate timers
			}
		};

		return {
			addInterface : addInterface
		}
	})();

	var generalFunctions = (function(){
		var getIntersections = function(home, target) {
			function split(coord) {
				return coord.split('|');
			}

			function TWdistance(targetC, originC) {
				targetC = targetC.split('|');
				originC = originC.split('|');
				return Math.sqrt(((originC[0]-targetC[0])*(originC[0]-targetC[0])+(originC[1]-targetC[1])*(originC[1]-targetC[1])));
			}

			function distance(a,b) {
				return Math.sqrt( Math.pow(a[0]-b[0], 2) + Math.pow(a[1]-b[1], 2) )
			}

			function is_on(a, b, c) {
				return distance(a,c) + distance(c,b) == distance(a,b);
			}

			function calc(a, b, c) {
				// ORIGINAL CODE BY https://bl.ocks.org/milkbread/11000965#index.html

				// Calculate the euclidean distance between a & b
				eDistAtoB = Math.sqrt( Math.pow(b[0]-a[0], 2) + Math.pow(b[1]-a[1], 2) );

				// compute the direction vector d from a to b
				d = [ (b[0]-a[0])/eDistAtoB, (b[1]-a[1])/eDistAtoB ];

				// Now the line equation is x = dx*t + ax, y = dy*t + ay with 0 <= t <= 1.

				// compute the value t of the closest point to the circle center (cx, cy)
				t = (d[0] * (c[0]-a[0])) + (d[1] * (c[1]-a[1]));

				// compute the coordinates of the point e on line and closest to c
			    var e = {coords:[], onLine:false};
				e.coords[0] = (t * d[0]) + a[0];
				e.coords[1] = (t * d[1]) + a[1];

				// Calculate the euclidean distance between c & e
				eDistCtoE = Math.sqrt( Math.pow(e.coords[0]-c[0], 2) + Math.pow(e.coords[1]-c[1], 2) );

				// test if the line intersects the circle
				if( eDistCtoE < c[2] ) {
					// compute distance from t to circle intersection point
				    dt = Math.sqrt( Math.pow(c[2], 2) - Math.pow(eDistCtoE, 2));

				    // compute first intersection point
				    var f = {coords:[], onLine:false};
				    f.coords[0] = ((t-dt) * d[0]) + a[0];
				    f.coords[1] = ((t-dt) * d[1]) + a[1];
				    // check if f lies on the line
				    f.onLine = is_on(a,b,f.coords);

				    // compute second intersection point
				    var g = {coords:[], onLine:false};
				    g.coords[0] = ((t+dt) * d[0]) + a[0];
				    g.coords[1] = ((t+dt) * d[1]) + a[1];
				    // check if g lies on the line
				    g.onLine = is_on(a,b,g.coords);

					return {points: {intersection1:f, intersection2:g}, pointOnLine: e};

				} else if (parseInt(eDistCtoE) === parseInt(c[2])) {
					console.log("Only one intersection");
					return {points: false, pointOnLine: e};
				} else {
					console.log("No intersection");
					return {points: false, pointOnLine: e};
				}
			}

			var watchtowers = storage.getWatchtowers().info;
			var intersections = [];
            console.log(watchtowers)
			for (var prop in watchtowers) {
				var a = [parseInt(split(home)[0]), parseInt(split(home)[1])];
				var b = [parseInt(split(target)[0]), parseInt(split(target)[1])];
				var c = [parseInt(split(prop)[0]), parseInt(split(prop)[1]), parseInt(watchtowers[prop])];
				var result = calc(a, b, c);
                console.log("watchtower: "+c+" result: "+result);
				if (result.points) {
					for (var x in result.points) {
						if (result.points[x].onLine) {
							intersections.push(result.points[x].coords[0] + '|' + result.points[x].coords[1]);
						}
					}
				}
			}

			if (intersections.length == 0) {
				return false;
			} else {
				var firstIntersection =  {
					distance : 0,
					coord : ''
				};

				for (var i = 0, l = intersections.length; i < l; i++) {
					var dis = TWdistance(target, intersections[i]);
                    console.log("home: "+home+" target: "+target+" intersections["+i+"]: "+intersections[i]+"  dis: "+dis);
					if (dis > firstIntersection.distance) {
						firstIntersection.distance = dis;
						firstIntersection.coord = intersections[i];
					}
				}

				return firstIntersection;
			}
		};

		var convertToTimestamp = function(timestr) {
			//   vandaag om 16:49:08 uur
			//   op 21.08. om 05:04:11 uur
			var pos = timestr.indexOf(':');
			var T = timestr.substr(pos - 2, 8); //+','+MS;

			var Serverdate = $('#serverDate').text().split('/');
			Serverdate = Serverdate[1] + ' ' + Serverdate[0] + ', ' + Serverdate[2];
			var Serverdate = new Date(Date.parse(Serverdate + ' ' + T));

			if (timestr.match('heute')) {
				var D = Serverdate;
			} else if (timestr.match('morgen')) {
				var D = Serverdate;
				D.setDate(D.getDate() + 1);
			} else {
				var pos = timestr.indexOf('.');
				var d = timestr.substr(pos - 2, 5).split('.');
				d = d[1] + '/' + d[0] + '/' + Serverdate.getFullYear() + ' ' + T;
				var D = new Date(Date.parse(d));
			}
			return D.getTime()/1000;
		};

        var convertFromTimestamp = function(UNIX_timestamp){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            return time;
        };

		var calculateDiff = function(distance, tag) {
			var tags = general.getTags();
            console.log(tags);
			var count = 0;
			var runtime = 0;
			for (var prop in tags) {
				if (tag.match(prop)) {
					runtime = tags[prop];
					count++;
				}
			}

			if (count > 1) {
				return Translation.get().multipleTags;
			} else if (runtime == 0) {
				return Translation.get().noTag;
			} else {
                console.log((runtime * distance) * 60);
				return (runtime * distance) * 60;
			}
		};

		return {
			getIntersections : getIntersections,
			convertToTimestamp : convertToTimestamp,
			calculateDiff : calculateDiff
		}
	})();

	var init = function() {
		switch (game_data.screen) {
			case 'overview_villages':
				if ($('#buildings_table').length > 0) groupPage.addInterface();
				if ($('#incomings_table').length > 0) incomingsPage.addInterface();
				break;
		}
	};

	var bindEventHandlers = function() {
		UI.ToolTip($('.tooltip'));
	};

	return {
		init : init,
		bindEventHandlers : bindEventHandlers
	}
})();

$(function() {
	WatchtowerEnhancer.init();
});
