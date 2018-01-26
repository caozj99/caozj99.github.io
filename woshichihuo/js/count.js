var tt = window.location.search;
var num=tt.lastIndexOf('/');
var taskid=tt.substring(num+1,num+33);
var userid=tt.substring(num-32,num);
if(userid && taskid){
	$.post('http://www.twttmob.com/api.php/Task/ScoreRecord',{user_id:userid,task_id:taskid});
}