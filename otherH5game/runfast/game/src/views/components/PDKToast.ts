/**
 * Created by rockyl on 16/4/21.
 *
 * 屏幕中间的提示
 */

class PDKToast{
	static show(content:string, color:number = -1, delay:number = 0){
		PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_TOAST, {content, color, delay});
	}
}