import React from 'react';

// acá definimos el layout de nuestro HTML donde están los tags html, head, body, etc.
const Layout = React.createClass({
    render() {
        return (
            <html lang="es-AR">
            <head>
                <meta charSet="utf-8" />
                <title>{ this.props.title }</title>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet"
                      href="/assets/css/style.css" />
            </head>
            <body>
            { this.props.children }
            <script src="/assets/js/app.js"></script>
            </body>
            </html>
        );
    }
});

export default Layout;