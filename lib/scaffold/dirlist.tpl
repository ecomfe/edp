<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Directory List</title>
    <style type="text/css">
    body,p,dl,dd,blockquote,h1,h2,h3,h4,h5,h6,pre,table,td,th,ul,ol,li,hr,legend,fieldset,input,textarea,img,form{margin:0;padding:0;}
    table,input{font-size:1em;}html{border:none;}
    table{border-collapse:separate;border-spacing:0;}
    table.ui-table { border-left: 1px solid #8CACBB; border-top: 1px solid #8CACBB; color: #222; line-height:2em; margin: 0 0 1.5em; }
    table.ui-table  thead th, table.ui-table tfoot th{ border: 1px solid #8CACBB; border-left:none; color:#000; font-weight:bold; line-height:3em; } 
    table.ui-table tfoot th { background-position:left bottom; border:none; line-height:2.5em; } 
    table.ui-table tbody th, table.ui-table tbody td, table.ui-table tfoot th { border-bottom: 1px solid #8CACBB; border-right: 1px solid #8CACBB; vertical-align:top; padding-left: 0.5em; word-break: break-all; } 
    table.ui-table tbody th{ color:#1867AF; background: #DEE7EC; } 
    table.ui-table tr-alt { background:#ECF5FD; } 
    table.ui-table tbody tr:nth-child(odd) td { background: #ebf1f7; } 
    table.ui-table tbody tr:hover td{ background:#F3FAFA; }
    </style>
  </head>
  <body>
    <h1>Fserver directory list</h1>
    <table class="ui-table" width="98%">
      <tr>
        <th>Name</th>
        <th>Size</th>
        <th>Last Modified</th>
      </tr>
      <tr>
        <td><a href="..">..</a></td>
        <td>4096</td>
        <td>&nbsp;</td>
      </tr>
      {{#files}}
      <tr>
        <td><a href="{{url}}">{{name}}</a></td>
        <td>{{size}}</td>
        <td>{{mtime}}</td>
      </tr>
      {{/files}}
    </table>
  </body>
</html>
