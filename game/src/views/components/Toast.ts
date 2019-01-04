/**
 * Created by rockyl on 16/4/21.
 *
 * 屏幕中间的提示
 */

class Toast{
	static show(content:string, color:number = -1, delay:number = 0){
		alien.Dispatcher.dispatch(EventNames.SHOW_TOAST, {content, color, delay});
	}
}