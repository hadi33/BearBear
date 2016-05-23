/**
 * Created by Qianxiong.Zheng on 2016/5/3.
 */
function loginHide(p1) {
    if( p1 == 1){
        //隐藏
        document.getElementById('login').style.display='none';
        document.getElementById('reset_pass').style.display='none';
        //显示
        document.getElementById('register').style.display='';
    } else if(p1 == 2)
    {
        //隐藏
        document.getElementById('register').style.display='none';
        document.getElementById('reset_pass').style.display='none';
        //显示
        document.getElementById('login').style.display='';
    }else if(p1 == 3){
        //隐藏
        document.getElementById('login').style.display='none';
        document.getElementById('register').style.display='none';
        //显示
        document.getElementById('reset_pass').style.display='';
    }
}