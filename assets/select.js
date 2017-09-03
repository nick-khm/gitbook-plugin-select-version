require(['gitbook', 'jQuery'], function (gitbook, $) {
    var versions = [];
    var current_version;
    var pluginConfig = {};
    var STORAGE_SELECTED_VERSION = "selected_version"

    gitbook.events.bind('start', function (e, config) {
        console.log('event start >> gitbook var', gitbook);
        console.log('select.js >> events >> start >> config', config);
        pluginConfig = config;

    });

    gitbook.events.bind('page.change', function () {
        gitbook.storage.remove(STORAGE_SELECTED_VERSION);

        console.log('event page.change >> gitbook var', gitbook);
        var versionFile = pluginConfig["select-version"].file;
        console.log("Look up for json with version", versionFile);
        if( typeof versionFile !== undefined && versionFile !== null ) {
            $.ajax(versionFile)
                .then(function(versions){
                    console.log("versions", versions);

                    var output = '';
                    versions.forEach((version) => {
                        var selected = "";
                        if(gitbook.state.bookRoot.match(version.name)){
                            selected = 'selected="selected';
                            current_version = version;
                        }
                        output += `<option ${selected} value="${version.url}">${version.name}</option>`;
                    });

                    output = `
                    <a href="/" id="brand-logo"><img src="/assets/thingparkx_logo.png" style="width: 100%;padding: 10px;"></a>
                    <label class="versions-select">
                        <select>
                            ${output}
                        </select>
                    </label>
                    `;
                    $("#book-search-input").before(output);

                    $(".versions-select select").change(function() {
                        console.log('select is changed >> gitbook.state.bookRoot', gitbook.state.bookRoot);
                        console.log('select is changed >> gitbook.state.filepath', gitbook.state.filepath);
                        var base_url = gitbook.state.bookRoot
                        var version_url = $(".versions-select select").val();

                        if(version_url.match(/^http/)) {
                            // if version is an absolute link
                            window.location.href = version_url;
                        } else {
                            /* path_url is different of gitbook.state.filepath because of multiple projects */
                            var path_url = window.location.href.split(current_version.url)[1] || "";
                            var redirect_url = `${version_url}${path_url}`;
                            console.log("redirect to ", redirect_url);
                            window.location.href = redirect_url;
                        }
                    });
                });


        }
    });
});