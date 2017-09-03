module.exports = {
    book: {
        assets: './assets',
        js: [
            './select.js'
        ],
        // still not work!
        html: {
            'html:end': function() {
                console.log('html:end')
                return '<!-- End of book -->';
            }
        }
    },
    hooks: {
        init: function() {
            console.log( 'init!' );
        },

        finish: function() {
            console.log( 'finish!' );
        }
    }
};