/**
 * Created by rockyl on 16/1/5.
 *
 * 头像
 */

class MatchDetailRoundAvatar extends eui.Component {
	private imgMask: eui.Image;
	private imgAvatar: eui.Image;
	private lblName: eui.Label;
	private lblScore: eui.BitmapLabel;

	createChildren(): void {
		super.createChildren();
		this._initDefault();
		this.imgAvatar.source = 'common_avatar_mask';

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		if (this.imgMask) {
			this.imgAvatar.mask = this.imgMask;
		}
	}

	private onAddToStage(): void {
		this._enableEvent(true);
	}

	private onRemoveFromStage(): void {
		this._enableEvent(false);
	}

	/**
	 * 初始化默认数据 zhu
	 */
	private _initDefault(): void {

	}

	/**
	 * 初始化事件
	 */
	private _enableEvent(bEnable): void {
		let func = "addEventListener";
		if (!bEnable) {
			func = "removeEventListener";
		}

		this[func](egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
	}

	set imageId(value: string) {
		let _url = value;
		if (!value) {
			this.imgAvatar.source = "common_avatar_mask";
		}
		else {
			if (value != this.imgAvatar.source) {
				this.imgAvatar.source = "common_avatar_mask";
				if (value.indexOf("http://") != -1) {
					_url = value.replace("http://", "https://");
				}
				let defaultAvatarsArr = [
					["https://pl-ddz.hztangyou.com/uploads/avatar/head1.png", "head1.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head2.png", "head2.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head3.png", "head3.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head4.png", "head4.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head5.png", "head5.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head6.png", "head6.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head7.png", "head7.png"],
					["https://pl-ddz.hztangyou.com/uploads/avatar/head8.png", "head8.png"],
				];
				for (var i = 0; i < defaultAvatarsArr.length; i++) {
					if (_url == defaultAvatarsArr[i][0]) {
						_url = defaultAvatarsArr[i][1];
						break;
					}
				}
				this.imgAvatar.source = _url;//RES.getRes(defaultAvatar);
			}
		}
	}

	set nickName(value: string) {
		if (!value) value = "玩家昵称";
		this.lblName.text = value;
	}

	set score(value: string) {
		if (value == "---" || Number(value) <= 0) {
			this.lblScore.font = "font_match_2";
		}
		else {
			this.lblScore.font = "font_match_1";
		}
		this.lblScore.text = value;
	}

	clean(): void {
		this.imgAvatar.source = null;
	}
}
window["MatchDetailRoundAvatar"] = MatchDetailRoundAvatar;