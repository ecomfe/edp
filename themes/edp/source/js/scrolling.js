    function Scrolling(id, hei) {

        this.hei = hei;
        this.tarDom = $(id);//获取目标元素

    }

    /**
     * 向上翻屏
     */
    Scrolling.prototype.scrollUp = function () {

        var me = this;
        var curScrollTop = me.tarDom.scrollTop();
        var tarScrollTop = curScrollTop - me.hei;

        console.log("curScrollTop="+curScrollTop);
        console.log("tarScrollTop="+tarScrollTop);

        //me.tarDom.scrollTop(tarScrollTop);
        me.tarDom.animate({scrollTop: (tarScrollTop + "px")}, "slow");
        console.log("up finish");
    };


    /**
     * 向下翻屏
     */
    Scrolling.prototype.scrollDown = function () {

        var me = this;
        var curScrollTop = me.tarDom.scrollTop();
        var tarScrollTop = curScrollTop + me.hei;

        console.log("curScrollTop="+curScrollTop);
        console.log("tarScrollTop="+tarScrollTop);

        //me.tarDom.scrollTop(tarScrollTop);
        me.tarDom.animate({scrollTop: (tarScrollTop + "px")}, "slow");
        console.log("down finish");

    };
