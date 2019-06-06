module js
{
	/**
	 * Pomocnicze narzedzia
	 */
	export class Utils
	{
		/**
		 * Wyciaga nazwe pliku z url'a
		 *
		 * @param fileUrl
		 *        [wymagany] okresla polozenie pliku
		 * @returns nazwa pliku
		 */
		public static extractFileName( fileUrl : string ) : string
		{
			return fileUrl.replace( /^.*(\\|\/)/gi, '' );

			// var index = fileUrl.lastIndexOf( '/' );

			// return ( index > -1 ) ? fileUrl.substr( index + 1 ) : fileUrl;
		}

		/**
		 * Wyciaga url katalogu w ktorym znajduje sie plik
		 *
		 * @param fileUrl
		 *        [wymagany] okresla polozenie pliku
		 * @returns url katalogu
		 */
		public static extractDirectoryUrl( fileUrl : string ) : string
		{
			return fileUrl.replace( /^(\\|\/).*/gi, '' );

			// var index = fileUrl.lastIndexOf( '/' );
			//
			// return ( index > -1 ) ? fileUrl.substr( 0, index + 1 ) : fileUrl;
		}

		/**
		 * Tworzy string uzupelniany lewo-stronnie zerami do dlugosci 2 dla numeru.
		 *
		 * @param number
		 *        [wymagany] numer dla ktorego tworzony jest string
		 * @returns string utworzony z numeru
		 */
		public static createL2String( number : number ) : string
		{
			return ( number > 9 ? number.toString() : '0' + number );
		}

		/**
		 * Tworzy string uzupelniany lewo-stronnie zerami do dlugosci 4 dla numeru.
		 *
		 * @param number
		 *        [wymagany] numer dla ktorego tworzony jest string
		 * @returns string utworzony z numeru
		 */
		public static createL4String( number : number ) : string
		{
			if ( number > 9 )
			{
				if ( number > 99 )
				{
					if ( number > 999 )
						return number.toString();

					return '0' + number;
				}

				return '00' + number;
			}

			return '000' + number;
		}

		// /**
		//  * Tworzy subobiekty jesli nie istnieja. Przykladowo dla wywolania metody z parametrem ['window', 'Utils', 'test',
		//  * 'examples'] zostana utworzone obiekty budujace sciezke window.Utils.test.examples i zwrocona referencja do
		//  * ostatniego obketu (tzn. examples).
		//  *
		//  * @param names
		//  *        [wymagany] okresla kolejne nazwy obiektow
		//  * @returns zwraca referencje do ostantiego obiektu lub obiektu window
		//  */
		// public static createObjectPath( names : Array<string> ) : object
		// {
		// 	let ob : any = window;
        //
		// 	for ( let i = 0; i < names.length; ++i )
		// 	{
		// 		var name = names[ i ];
        //
		// 		ob = ob[ name ] || ( ob[ name ] = new Object() );
		// 	}
        //
		// 	return ob;
		// }

		/**
		 * Pilnuje aby wartosc nie przekroczyla dopuszczalnego zakresu zwracajac tolerowana liczbe.
		 *
		 * @param value
		 *        sprawdzana wartosc
		 * @param minValue
		 *        minimalna wartosc
		 * @param maxValue
		 *        maksymalna wartosc
		 * @returns tolerowana liczba
		 */
		public static watchValue( value : number, minValue : number, maxValue : number ) : number
		{
			if ( value < minValue )
				return minValue;

			if ( value > maxValue )
				return maxValue;

			return value;
		}

		public static executeAction(action : any, argument : any ) : any
		{
			try
			{
				return action( argument );
			}
			catch ( e )
			{
				return null;
			}
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
