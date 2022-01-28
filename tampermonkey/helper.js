// ==UserScript==
// @name         bbs helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       xusheng
// @match        https://bbs.pku.edu.cn/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_deleteValue

// ==/UserScript==



function is_thread_page(s) {
    return s.includes('bid') && s.includes('threadid') && s.includes('post-read.php');
}

function get_bid_threadid(s) {
    s = s.split('&page')[0];
    s = s.split('?bid=')[1];
    return s.split('&threadid=');
}

function get_current_time() {
    var now = new Date();
    const offset = now.getTimezoneOffset();
    now = new Date(now.getTime() - (offset * 60 * 1000));
    return now.toISOString().replace('T', ' ').split('.')[0];
}

(function () {
    console.log("[bbs helper] start");
    var cssFix = document.createElement('style');
    // 左侧边栏隐私模块
    if (1) {
        // 隐藏头像，
        cssFix.innerHTML += '.portrait.pic{display: none}'
        // 隐藏id
        cssFix.innerHTML += '[data-role=login-username]{display: none!important}';
        // 隐藏nick、等级和文章数
        cssFix.innerHTML += '[data-role=login-nickname]{display: none!important}';
        cssFix.innerHTML += '[data-role=login-rankname]{display: none!important}';
        cssFix.innerHTML += '[data-role=login-numposts]{display: none!important}';
    }

    // 只读模块
    if (1) {
        // 隐藏发送按钮
        cssFix.innerHTML += '.publish-button.extended{ display: none!important;}';
        // 隐藏输入文本的框框
        cssFix.innerHTML += 'textarea{display: none}';
    }

    document.getElementsByTagName('head')[0].appendChild(cssFix);

    // 测试


    // 帖子收藏模块
    if (1) {
        const ft_str = 'favorite_threads';
        var favorite_threads = GM_getValue(ft_str, []);
        console.log(favorite_threads);
        // favorite_threads中每个元素应该是[帖子标题，收藏时间，bid，threadid]

        var current_url = window.location.href;

        if (is_thread_page(current_url)) {
            var bid_threadid = get_bid_threadid(current_url);
            var bid = bid_threadid[0], threadid = bid_threadid[1];
            var favorite_flag = false;
            for (var ft_index = 0; ft_index < favorite_threads.length; ++ft_index) {
                if (favorite_threads[ft_index][2] == bid && favorite_threads[ft_index][3] == threadid) {
                    favorite_flag = true;
                    break;
                }
            }

            // todo，创建收藏按钮等
            if (favorite_flag) {

            } else {

            }
        }

        if (current_url == 'https://bbs.pku.edu.cn/v2/favorite_thread') {
            document.title = "帖子收藏夹";
            document.head.innerHTML = '';
            document.body.innerHTML += '<a href="home.php"> 返回首页 </a>';
            // table
            document.body.innerHTML += '<table><tr><th>帖子标题</th><th>收藏时间</th><th>链接</th><th></th></tr>';
            for (var i = 0; i < favorite_threads.length; ++i) {
                document.body.innerHTML += '<td><tr>' + favorite_threads[i][0] + '</tr><tr>' + favorite_threads[i][1] + '</tr><tr>';
                document.body.innerHTML += '<a href="https://bbs.pku.edu.cn/v2/post-read.php?bid=' + favorite_threads[i][2] + '&threadid=' + favorite_threads[i][3] + '">' + '</a></tr><tr>';
                // todo 按钮
                document.body.innerHTML += '</tr><td>';
            }
            document.body.innerHTML += '</table>';

        } else {
            // 添加一个按钮
            var link_buttons = document.getElementById('link-buttons');
            link_buttons.innerHTML += '<a href="favorite_thread", id="tab_favorite_thread"> 收藏的帖子 </a>';
        }
    }

})();


