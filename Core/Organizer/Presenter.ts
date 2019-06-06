/// <reference path="Pattern.ts" />


namespace Core.Organizer
{
    export class Presenter
    {
        // helper methods

        private buildText( prefix : string, text : string ) : string
        {
            let lines = text.split( '\n' );

            let size : number = 0;
            let result : string = '';

            for( let entry of lines )
            {
                if( entry.length > size )
                    size = entry.length;
            }

            size += 5;

            for( let entry of lines )
            {
                result += prefix + '\t"' + entry;

                for( let i = size - entry.length; i > 0; --i )
                    result += ' ';

                result += '"\n';
            }

            return result;
        }

        private buildTemplate( prefix : string, name : string, template : TemplatePattern ) : string
        {
            let text : string = prefix + '+ (Name: "' + name + '"):\n';

            if( template.handle )
                text += this.buildText( prefix, template.handle.outerHTML );

            else
                text += prefix + '\t<null>\n';

            text += this.buildLoops( prefix + '\t', template.loops );
            text += this.buildControllers( prefix + '\t', template.controllers );
            text += this.buildCompositions( prefix + '\t', template.compositions );

            return text;
        }

        private buildTemplates( prefix : string, templates : Map<TemplatePattern> ) : string
        {
            let text : string = '';

            for( let el in templates )
            {
                text += '\n' + prefix + 'Templates:\n';

                break;
            }

            for( let el in templates )
            {
                let template = templates[ el ];

                text += this.buildTemplate( prefix + '\t', el, template );
            }

            return text;
        }

        private buildLoop( prefix : string, name : string, loop : LoopPattern ) : string
        {
            let text : string = prefix + '+ (Name: "' + name + '", Controller: "' + loop.logic + '", Identifier: "' + loop.identifier + '"):\n';

            if( loop.handle )
                text += this.buildText( prefix, loop.handle.outerHTML );

            else
                text += prefix + '\t<null>\n';

            text += this.buildLoops( prefix + '\t', loop.loops );
            text += this.buildControllers( prefix + '\t', loop.controllers );
            text += this.buildCompositions( prefix + '\t', loop.compositions );

            return text;
        }

        private buildLoops( prefix : string, loops : Map<LoopPattern> ) : string
        {
            let text : string = '';

            for( let el in loops )
            {
                text += '\n' + prefix + 'Loops:\n';

                break;
            }

            for( let el in loops )
            {
                let loop = loops[ el ];

                text += this.buildLoop( prefix + '\t', el, loop );
            }

            return text;
        }

        private buildController( prefix : string, name : string, controller : ControllerPattern ) : string
        {
            let text : string = prefix + '+ (Name: "' + name + '", Type: "' + controller.type + '", Identifier: "' + controller.identifier + '"):\n';

            if( controller.handle )
                text += this.buildText( prefix, controller.handle.outerHTML );

            else
                text += prefix + '\t<null>\n';

            text += this.buildLoops( prefix + '\t', controller.loops );
            text += this.buildControllers( prefix + '\t', controller.controllers );
            text += this.buildCompositions( prefix + '\t', controller.compositions );

            return text;
        }

        private buildControllers( prefix : string, controllers : Map<ControllerPattern> ) : string
        {
            let text : string = '';

            for( let el in controllers )
            {
                text += '\n' + prefix + 'Controllers:\n';

                break;
            }

            for( let el in controllers )
            {
                let controller = controllers[ el ];

                text += this.buildController( prefix + '\t', el, controller );
            }

            return text;
        }

        private buildComposition( prefix : string, name : string, composition : CompositionPattern ) : string
        {
            return prefix + '+ (Name: "' + name + '", Template: "' + composition.template + '", Identifier: "' + composition.identifier + '")\n';
        }

        private buildCompositions( prefix : string, compositions : Map<CompositionPattern> ) : string
        {
            let text : string = '';

            for( let el in compositions )
            {
                text += '\n' + prefix + 'Compositions:\n';

                break;
            }

            for( let el in compositions )
            {
                let composition = compositions[ el ];

                text += this.buildComposition( prefix + '\t', el, composition );
            }

            return text;
        }

        // public methods

        public constructHtml( root : RootPattern ) : string
        {
            let text : string = 'Root:\n';

            if( root.handle )
                text += this.buildText( '', root.handle.outerHTML );

            else
                text += '\t<null>\n';

            text += this.buildTemplates( '\t', root.templates );
            text += this.buildLoops( '\t', root.loops );
            text += this.buildControllers( '\t', root.controllers );
            text += this.buildCompositions( '\t', root.compositions );

            return text;
        }

        public constructStructure( organizer : Organizer ) : string
        {
            return '';
        }
    }
}
