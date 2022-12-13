

	'use strict';

	(function() {

	/**
		This script is not optimized
	*/

		var
		box = document.getElementById('box'),
		txt = document.getElementById('msg'),
		res = document.getElementById('res'),

		set = document.getElementById('set'),
		op1 = document.getElementById('op1'),
		op2 = document.getElementById('op2'),

		in1 = document.getElementById('in1'),
		in2 = document.getElementById('in2'),
		in3 = document.getElementById('in3'),
		in4 = document.getElementById('in4'),
		in5 = document.getElementById('in5'),
		in6 = document.getElementById('in6'),
		in7 = document.getElementById('in7'),
		in8 = document.getElementById('in8'),
		in9 = document.getElementById('in9'),

		current = function( o ) {

				o._value = o.value;
			},

		updated = function( o ) {

				return o._value == o.value;
			},

		clear = function( o ) {

				while( o.childNodes[ 0 ] ) {

					o.removeChild( o.childNodes[ 0 ] );
				}
			},

		hint = function( d ) {

				var
				c = 0,
				s = [];

				/* beautify: remove default values */
				if( 256  == d.dim ) delete d.dim;
				if(   4  == d.pad ) delete d.pad;
				if(  -1  == d.mtx ) delete d.mtx;
				if(  'M' == d.ecl ) delete d.ecl;
				if(   1  == d.ecb ) delete d.ecb;
				if(   0  == d.pal[ 1 ] ) delete d.pal.pop();
				if(   d.pal[ 0 ] == '#000000' && !d.pal[ 1 ] ) delete d.pal;
				if(   0  == d.vrb ) delete d.vrb;

				for( var k in d ) {

					var
					v = d[ k ];

					if( 1 * v == v )
					v = '  <i class="num">' + v + '</i>';

					else if ( Array == v.constructor )
					v = '[<i class="clr">"<i>' + v.join('</i>"</i>, <i class="clr">"<i>') + '</i>"</i>]';

					else
					v = ' <i class="txt">"<i>' + v + '</i>"</i>';

					s.push( (s.length ? ',' : ' ') + '<b class="key">' + k + '</b> : ' + v );
					c++;
				}

				//if( 1 == c )	else
				res.innerHTML = '<b class="obj"><b>QRCode</b>(</b>'
					+ (( 1 == c )
					? '<i class="txt">"<i>' + d.msg + '</i>"</i>'
					: '{\n\n    ' + s.join('\n    ') + '\n\n}')
					+ '<b class="obj">)</b>;\n'
					+ '\n\n/**\n\n     Source code and documentation:\n     <a href="https://github.com/datalog/qrcode-svg">https://github.com/datalog/qrcode-svg</a>\n\n*/\n\n\n';

		},

		download = function( d ) {


			/**
				ATTN!
				We are going to download "WHAT WAS RENDERED" by browser
				not "WHAT WAS GENERATED" by qrcode.js
			*/

			function replace( d, r ) { 

				return d.replace( new RegExp( Object.keys( r ).join('|'), 'gi'), function( m ) {

					return r[ m ];
				}); 
			} 

			var
			d = '<!--\n\nhttps://github.com/datalog/qrcode-svg\n\n-->' + replace( d, {

				/* removing useless spaces */
				 'M '	: 'M'
				,' M '	: 'M'
				,' V '	: 'V'
				,' v '	: 'v'
				,' H '	: 'H'
				,' h '	: 'h'
				,' Z'	: 'Z'			
				,' z'	: 'z'
				,' />'	: '/>'

				,'></path>': '/>'
				,'svg xmlns="http://www.w3.org/2000/svg"':'svg'
			}),

			n = 'qrcode-' + replace( new Date().toISOString().slice( 0, 19 ), {

	 			 ':'	: ''
	 			,'-'	: ''
	 			,'T'	: '-'

			}) + '.svg',

			b = new Blob( [ d ], { type:'image/svg+xml'} );

			if( window.navigator.msSaveOrOpenBlob ) {

				window.navigator.msSaveOrOpenBlob( b, n );

			} else {

				var
				a = document.createElement("a"),
				u = URL.createObjectURL( b );

				a.href = u;
				a.download = n;

				document.body.appendChild( a );
				a.click();

				setTimeout( function() {

					document.body.removeChild( a );
					window.URL.revokeObjectURL( u );

				}, 0); 
			}

			return false;
		};

		op1.onclick = function() {

					set.className = 'show';
					return false;
		};

		op2.onclick = function() {

					set.className = 'hide';
					return false;
		};

		in1.onchange =
		in2.onchange =
		in3.onchange =
		in4.onchange =
		in5.onchange =
		in6.onchange =
		in8.onchange =
		in9.onchange = function() {

					box.update();
			};

		in7.onchange = function() {

					in8.checked = true;
					box.update();
			};

		txt.onkeyup = function() {

					if( updated( txt ) ) return;

					box.update();
					current( txt );
			};

		box.update = function() {

					clear( box );

					var
					time = new Date(),
					data = {

						 msg  :   txt.value
						,dim  :   in1.value | 0
						,pad  :   in2.value | 0
						,mtx  :   in3.value
						,ecl  :   in4.value
						,ecb  :   in5.checked | 0
						,pal  : [ in6.value, in8.checked | 0 && in7.value ]
						,vrb  : ( in9.checked ) ? 0 : 1
					};

					box.appendChild( QRCode( data ) )

						.onclick = function() {

							return download( box.innerHTML );
						};

					console.log('QRCode generation time: ' + ( new Date() - time ) + ' ms');

					hint( data );
			};

		txt.value = [
				 'Your message here'
				,'https://github.com/datalog/qrcode-svg'
				,'Pure javascript QRCode generator'
				,'Type here...'
				,'This is QRCode'
				,'Abyssus abyssum invocat'
				,'Amor non est medicabilis herbis'
				,'Nulla dies sine linea'
				,'Cogitations poenam nemo patitur'
				,'Verbaque praevisam rem non invita sequentur'
			][ ( Math.random() * 10 ) | 0 ];

		current( txt );
		box.update();
		txt.focus();
	})();

