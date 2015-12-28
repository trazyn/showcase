
define( [ "ui/slide", "ui/toast", "ui/validation" ], function() {

    "use strict";

    return function( container, loader ) {

        var
        menus = container.find( ".menus li[data-index]" ),
        ticker = function() {

            ticker.ticking = true;

            setTimeout( function() {

                var
                index = current.attr( "data-index" ),
                item = menus.filter( "[data-index='" + index + "']" );

                if ( item.length ) {
                    menus.find( ".md-link" ).removeClass( "active" );
                    item.find( ".md-link" ).addClass( "active" );
                }

                ticker.ticking = false;
            }, 500 );
        },

        current = container.find( "section[data-index]:first" );

        container.on( "mousewheel", function( e ) {

            var section;

            if ( ticker.ticking ) {
                return;
            }

            /** Up scroll */
            if ( e.originalEvent.wheelDelta / 120 > 0 ) {

                section = current.prev( "section.background" );
                if ( section.length ) {
                    ticker();

                    current.removeClass( "active" );
                    current = section.removeClass( "down-scroll" ).addClass( "up-scroll" );
                }
            } else {
                /** Down scroll */
                section = current.next( "section.background" );
                if ( section.length ) {
                    ticker();
                    current.removeClass( "up-scroll active" ).addClass( "down-scroll" );
                    current = section;
                }
            }

            current.addClass( "active" );
        } )

        .delegate( ".menus li[data-index]", "click", function() {

            var
            self = $( this ),
            index = self.attr( "data-index" ),
            slide;

            self
            .parents( "ul" )
            .find( ".md-link" )
            .removeClass( "active" );

            if ( current !== index ) {

                current.removeClass( "active" );
                current = container.find( "section.background[data-index='" + index + "']" ).addClass( "active" );
                container.find( "section.background[data-index]" ).removeClass( "up-scroll down-scroll" );
                current.prevAll( "section.background[data-index]" ).removeClass( "up-scroll" ).addClass( "down-scroll" );

                self.find( ".md-link" ).addClass( "active" );
            }
        } )

        .delegate( "form button[name=send]", "click", function( e ) {

            var form = $( this ).parents( "form" ).validation();

            e.preventDefault();
            e.stopPropagation();

            if ( form.validate().state() === "resolved" ) {
                loader.start();

                $.ajax( {
                    type: "POST",
                    url: "service/sendFeedback",
                    data: form.series()
                } )

                .fail( function() {
                    $.toast.top( "Failed to send the feedback, please try again :(" ).left();
                } )

                .done( function() {
                    form.clean();
                    $.toast.top( "Thank you for your feedback!", "md-toast-lightGray" ).left();
                } )

                .always( function() { loader.done(); } );
            }
        } )

        .find( ".slide:first" ).slide();

        container.find( ".video-js" ).each( function() { videojs( this ); } );
    };
} );
