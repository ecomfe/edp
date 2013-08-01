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
