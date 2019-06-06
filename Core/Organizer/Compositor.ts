/// <reference path="Composition.ts" />


namespace Core.Organizer
{
    export class ControllerEntity
    {
        public constructor( public name : string, public pattern : ControllerPattern )
        {
            // nothing here ...
        }
    }

    export class Compositor
    {
        // constructor

        constructor( private organizer : Organizer, private services : Tube<Object>, private bridges : Tube<Bridge>, private resources : Tube<Resource>, private debug : boolean = false )
        {
            // nothing here...
        }

        // public methods

        /**
         * Compose scope tree.
         *
         * @param root scope tree
         */
        public compose( root : RootPattern, parent ? : Controller<any> ) : Composition
        {
            let backbone = new Backbone( root.templates, this.organizer, this.services, this.bridges, this.resources, this.debug );

            let composition = backbone.constructComposition( root, parent );

            return new Composition( composition );
        }
    }
}
