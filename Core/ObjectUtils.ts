namespace Core
{
	/**
	 * Pomocnicze narzedzia
	 */
	export class ObjectUtils
	{
        public static cloneObject( object : any ) : any
        {
            if( object )
            {
                if ( object.constructor == Array )
                    return object.clone();

                if ( object.constructor == Date || object.constructor == RegExp || object.constructor == Function || object.constructor == String || object.constructor == Number || object.constructor == Boolean )
                    return object;

                let result = new Object();

                for ( let el in object )
                    result[ el ] = this.cloneObject( object[ el ] );

                return result;
            }

            return null;
        }

		/**
		 * Tworzy subobiekty jesli nie istnieja. Przykladowo dla wywolania metody z parametrem ['window', 'Utils', 'test',
		 * 'examples'] zostana utworzone obiekty budujace sciezke window.Utils.test.examples i zwrocona referencja do
		 * ostatniego obketu (tzn. examples).
		 *
		 * @param names
		 *        [wymagany] okresla kolejne nazwy obiektow
		 * @returns zwraca referencje do ostantiego obiektu lub obiektu window
		 */
		public static createPath( names : Array<string> ) : object
		{
			let ob : any = window;

			for ( let i = 0; i < names.length; ++i )
			{
				let name = names[ i ];

				ob = ob[ name ] || ( ob[ name ] = new Object() );
			}

			return ob;
		}

        public static findHead( object : object ) : string
        {
            for( let el in object )
                return el;

            return null;
        }

        public static findTail( object : object ) : string
        {
        	let result : string = null;

            for( let el in object )
                result = el;

            return result;
        }

        public static getHead( object : object ) : any
        {
            let name = this.findHead( object );

            if( name )
                return object[ name ];

            return null;
        }

        public static getTail( object : object ) : any
        {
            let name = this.getTail( object );

            if( name )
                return object[ name ];

            return null;
        }
	}
}




// /**
//  * Pomocnicze narzedzia
//  */
// window.Utils = {
// 	/**
// 	 * Wyciaga nazwe pliku z url'a
// 	 *
// 	 * @param fileUrl
// 	 *        [wymagany] okresla polozenie pliku
// 	 * @returns nazwa pliku
// 	 */
// 	extractFileName : function( fileUrl )
// 	{
// 		return fileUrl.replace( /^.*(\\|\/)/gi, '' );
//
// 		// var index = fileUrl.lastIndexOf( '/' );
//
// 		// return ( index > -1 ) ? fileUrl.substr( index + 1 ) : fileUrl;
// 	},
//
// 	/**
// 	 * Wyciaga url katalogu w ktorym znajduje sie plik
// 	 *
// 	 * @param fileUrl
// 	 *        [wymagany] okresla polozenie pliku
// 	 * @returns url katalogu
// 	 */
// 	extractDirectoryUrl : function( fileUrl )
// 	{
// 		return fileUrl.replace( /^(\\|\/).*/gi, '' );
//
// 		// var index = fileUrl.lastIndexOf( '/' );
// 		//
// 		// return ( index > -1 ) ? fileUrl.substr( 0, index + 1 ) : fileUrl;
// 	},
//
// 	/**
// 	 * Tworzy string uzupelniany lewo-stronnie zerami do dlugosci 2 dla numeru.
// 	 *
// 	 * @param number
// 	 *        [wymagany] numer dla ktorego tworzony jest string
// 	 * @returns string utworzony z numeru
// 	 */
// 	createL2String : function( number )
// 	{
// 		return ( number > 9 ? number.toString() : '0' + number );
// 	},
//
// 	/**
// 	 * Tworzy string uzupelniany lewo-stronnie zerami do dlugosci 4 dla numeru.
// 	 *
// 	 * @param number
// 	 *        [wymagany] numer dla ktorego tworzony jest string
// 	 * @returns string utworzony z numeru
// 	 */
// 	createL4String : function( number )
// 	{
// 		if ( number > 9 )
// 		{
// 			if ( number > 99 )
// 			{
// 				if ( number > 999 )
// 					return number.toString();
//
// 				return '0' + number;
// 			}
//
// 			return '00' + number;
// 		}
//
// 		return '000' + number;
// 	},
//
// 	/**
// 	 * Tworzy subobiekty jesli nie istnieja. Przykladowo dla wywolania metody z parametrem ['window', 'Utils', 'test',
// 	 * 'examples'] zostana utworzone obiekty budujace sciezke window.Utils.test.examples i zwrocona referencja do
// 	 * ostatniego obketu (tzn. examples).
// 	 *
// 	 * @param names
// 	 *        [wymagany] okresla kolejne nazwy obiektow
// 	 * @returns zwraca referencje do ostantiego obiektu lub obiektu window
// 	 */
// 	createObjectPath : function( names )
// 	{
// 		var ob = window;
//
// 		for ( var i = 0; i < names.length; ++i ) {
// 			var name = names[ i ];
//
// 			ob = ob[ name ] || ( ob[ name ] = new Object() );
// 		}
//
// 		return ob;
// 	},
//
// 	/**
// 	 * Pilnuje aby wartosc nie przekroczyla dopuszczalnego zakresu zwracajac tolerowana liczbe.
// 	 *
// 	 * @param value
// 	 *        sprawdzana wartosc
// 	 * @param minValue
// 	 *        minimalna wartosc
// 	 * @param maxValue
// 	 *        maksymalna wartosc
// 	 * @returns tolerowana liczba
// 	 */
// 	watchValue : function( value, minValue, maxValue )
// 	{
// 		if ( value < minValue )
// 			return minValue;
//
// 		if ( value > maxValue )
// 			return maxValue;
//
// 		return value;
// 	},
//
// 	/**
// 	 * Parsuje kod zrodlowy. Jesli kod zrodlywy zawira bledy to rzucany jest exception.
// 	 *
// 	 * @param source
// 	 *        parsowany kod zrodlowy
// 	 * @returns wynik parsowania
// 	 */
// 	parseSource : function( source )
// 	{
// 		var object = null;
// 		var result = eval( 'object = (' + source + ')' );
//
// 		return object || result;
// 	},
//
// 	execute : function( action, argument )
// 	{
// 		try {
// 			return action( argument );
// 		}
// 		catch ( e ) {
// 			return null;
// 		}
// 	}
// };
