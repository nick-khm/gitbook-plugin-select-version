require(['gitbook', 'jQuery'], function (gitbook, $) {
    var versions = [];
    var current;
    var pluginConfig = {};
    var STORAGE_SELECTED_VERSION = "selected_version"

    gitbook.events.bind('start', function (e, config) {
        console.log('event start >> gitbook var', gitbook);
        console.log('select.js >> events >> start >> config', config);
        pluginConfig = config;

    });

    gitbook.events.bind('page.change', function () {
        var selected_version = gitbook.storage.get(STORAGE_SELECTED_VERSION);
        console.log('storage get selected version', selected_version);
        gitbook.storage.remove(STORAGE_SELECTED_VERSION);

        console.log('event page.change >> gitbook var', gitbook);
        var versionFile = pluginConfig["select-version"].file;
        console.log("Look up for json with version", versionFile);
        if( typeof versionFile !== undefined && versionFile !== null ) {
            $.ajax(versionFile)
                .then(function(versions){
                    console.log("versions", versions);

                    var output = "";
                    versions.forEach((version) => {
                        var selected = (selected_version === version.url) ? 'selected="selected"' : '';
                        output += `<option ${selected} value="${version.url}">${version.name}</option>`;
                    });

                    output = `
                    <label class="versions-select">
                        <select>
                            ${output}
                        </select>
                    </label>
                    `;
                    $("nav[role=navigation]").prepend(output);

                    $(".versions-select select").change(function() {
                        console.log('select is changed >> gitbook.state.bookRoot', gitbook.state.bookRoot);
                        console.log('select is changed >> gitbook.state.filepath', gitbook.state.filepath);
                        var version_url = $(".versions-select select").val();
                        var redirect_url = `${gitbook.state.bookRoot}${gitbook.state.filepath.replace(/README\.md/, "")}`;
                        console.log("redirect to ", redirect_url);
                        gitbook.storage.set(STORAGE_SELECTED_VERSION, version_url);
                        window.location.href = redirect_url;
                    });
                });


        }
    });
});