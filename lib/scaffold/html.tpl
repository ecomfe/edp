<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>{{title}}</title>
    {{#loader}}<script src="{{url}}"></script>{{/loader}} 
    {{#loaderConfig}}
    <script>
    require.config({
        baseUrl: '{{{loaderBaseUrl}}}',
        paths: { {{#loaderPaths}}
        {{/loaderPaths}}
        },
        packages: [ {{#loaderPackages}}
            {
                name: '{{{name}}}',
                location: '{{{location}}}',
                main: '{{{main}}}'
            }{{^last}},{{/last}}
        {{/loaderPackages}}]
    });
    </script>
    {{/loaderConfig}}
</head>

<body>
{{{body}}}
</body>
</html>