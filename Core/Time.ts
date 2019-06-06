
namespace Core
{
	export class Period
	{
		// constructor

		public constructor( private years : number, private months : number, private days : number, private hours : number, private minutes : number, private seconds : number, private milliseconds : number )
		{
			// nothing here ...
		}

		// public methods

		public getYears() : number
		{
			return this.years;
		}

		public getMonths() : number
		{
			return this.months;
		}

		public getDays() : number
		{
			return this.days;
		}

		public getHours() : number
		{
			return this.hours;
		}

		public getMinutes() : number
		{
			return this.minutes;
		}

		public getSeconds() : number
		{
			return this.seconds;
		}

		public getMilliseconds() : number
		{
			return this.milliseconds;
		}
	}

	export class Time
    {
    	// public methods

		public static getSeconds() : number
		{
			let time = this.getMilliseconds();

			return Math.round( time / 1000 );
		}

		public static getMilliseconds() : number
		{
			let date = new Date();

			return date.getTime();
		}

		public static calculatePeriod( time : number, now : number = this.getMilliseconds() ) : Period
		{
			let a = new Date( time );
			let b = new Date( now );

			let years = b.getUTCFullYear() - a.getUTCFullYear();
			let months = b.getUTCMonth() - a.getUTCMonth();
			let days = b.getUTCDate() - a.getUTCDate();
			let hours = b.getUTCHours() - a.getUTCHours();
			let minutes = b.getUTCMinutes() - a.getUTCMinutes();
			let seconds = b.getUTCSeconds() - a.getUTCSeconds();
			let milliseconds = b.getUTCMilliseconds() - a.getUTCMilliseconds();

			if( milliseconds < 0 )
			{
				seconds -= 1;

				milliseconds = ( milliseconds + 1000 ) % 1000;
			}

			if( seconds < 0 )
			{
				minutes -= 1;

				seconds = ( seconds + 60 ) % 60;
			}

			if( minutes < 0 )
			{
				hours -= 1;

				minutes = ( minutes + 60 ) % 60;
			}

			if( hours < 0 )
			{
				days -= 1;

				hours = ( hours + 24 ) % 24;
			}

			if( days < 0 ) // months have specific length
			{
				months -= 1;

				b.setUTCMonth( b.getUTCMonth() + 1 ); // jump to next month
				b.setUTCDate( 0 ); // jump to last month day

				days = ( days + b.getUTCDate() ) % b.getUTCDate();
			}

			if( months < 0 )
			{
				years -= 1;

				months = ( months + 12 ) % 12;
			}

			return new Period( years, months, days, hours, minutes, seconds, milliseconds );





			// let dt = now - milliseconds;
			//
			// if( dt < 1.0 )
			// 	return "0 millisecond(s)";
			//
			// if( dt < 1000.0 )
			// 	return Math.floor( dt ) + " millisecond(s)";
			//
			// dt /= 1000.0;
			//
			// if( dt < 60.0 )
			// 	return Math.floor( dt ) + " second(s)";
			//
			// {
			// 	let tmp = dt;
			//
			// 	dt /= 60.0;
			//
			// 	if( dt < 60.0 )
			// 	{
			// 		let minutes = Math.floor( dt );
			// 		let seconds = Math.floor( tmp ) - 60 * minutes;
			//
			// 		if( seconds < 1.0 )
			// 			return minutes + " minute(s)";
			//
			// 		return minutes + " minute(s) " + seconds + " second(s)";
			// 	}
			// }
			//
			// {
			// 	let tmp = dt;
			//
			// 	dt /= 60.0;
			//
			// 	if( dt < 24.0 )
			// 	{
			// 		let hours = Math.floor( dt );
			// 		let minutes = Math.floor( tmp ) - 60 * hours;
			//
			// 		if( minutes < 1.0 )
			// 			return hours + " hour(s)";
			//
			// 		return hours + " hour(s) " + minutes + " minute(s)";
			// 	}
			// }
			//
			// let days = Math.floor( dt / 24.0 );
			// let hours = Math.floor( dt ) - 24 * days;
			//
			// if( hours < 1.0 )
			// 	return days + " day(s)";
			//
			// return days + " day(s) " + hours + " hour(s)";
		}

		public static renderPeriod( time : number, now ? : number ) : string
		{
			let period = this.calculatePeriod( time, now );

			let years = period.getYears();
			let months = period.getMonths();
			let days = period.getDays();
			let hours = period.getHours();
			let minutes = period.getMinutes();
			let seconds = period.getSeconds();
			let milliseconds = period.getMilliseconds();

			let result = '';

			if( years > 0 )
				result += years + ' year(s)';

			if( months > 0 )
			{
				if( result )
					result += ' ';

				result += months + ' month(s)';
			}

			if( days > 0 )
			{
				if( result )
					result += ' ';

				result += days + ' day(s)';
			}

			if( hours > 0 )
			{
				if( result )
					result += ' ';

				result += hours + ' hour(s)';
			}

			if( minutes > 0 )
			{
				if( result )
					result += ' ';

				result += minutes + ' minute(s)';
			}

			if( seconds > 0 )
			{
				if( result )
					result += ' ';

				result += seconds + ' second(s)';
			}

			if( milliseconds )
			{
				if( result )
					result += ' ';

				result += milliseconds + ' millisecond(s)';
			}

			return result;
		}
    }
}
