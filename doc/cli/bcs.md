bcs
---------
### Usage

    edp bcs <file> bs://<bucket>/<this/is/the/target>
    edp bcs <dir> bs://<bucket>/mydir

### Description

使用`bcs`存储静态文件的资源，支持上传单个文件或者目录.

使用之前需要设置两个参数：

    edp config bcs.ak <ak>
    edp config bcs.sk <sk>

下面这个设置是可选的：

    edp config bcs.host <bcs cdn host>

默认只上传小于10M的文件，如果需要放宽这个限制，可以添加`max-size`参数，例如：

    edp bcs <file> bs://<bucket>/mydir --max-size=20m

如果需要自动对上传的文件名进行编码，需要添加`auto-uri`参数。

    edp bcs <file> bs://<bucket>/mydir --max-size=20m --auto-uri
