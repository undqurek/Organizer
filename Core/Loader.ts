/**
 * Created by qurek on 24.11.2016.
 */
namespace Core
{
    export class Loader
    {
        public static write( path : string ) : void
        {
            let date = new Date();

            document.write( '<script type="text/javascript" src="' + path + '?time=' + date.getTime() + '" charset="utf-8"></' + 'script>' );
        }
    }
}
