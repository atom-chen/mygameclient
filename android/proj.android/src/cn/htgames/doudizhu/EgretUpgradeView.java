package cn.htgames.doudizhu;

import android.content.Context;
import android.widget.FrameLayout;

import com.aliencoder.egret.UpgradeManager;

public class EgretUpgradeView extends FrameLayout {
	UpgradeManager upgradeManager;

	/**
	 * 游戏下载进度条 上线前请替换渠道自定制进度条
	 *
	 * @param context
	 */
	public EgretUpgradeView(Context context, UpgradeManager upgradeManager) {
		super(context);

		this.upgradeManager = upgradeManager;
	}

	public void onProgress(float progress) {
		if(this.upgradeManager != null){
			this.upgradeManager.onProgress(progress);
		}
	}

	public void onGameZipUpdateProgress(float percent) {
		if(this.upgradeManager != null){
			this.upgradeManager.onGameZipUpdateProgress(percent);
		}
	}

	public void onGameZipUpdateError() {
		if(this.upgradeManager != null){
			this.upgradeManager.onGameZipUpdateError();
		}
	}

	public void onGameZipUpdateSuccess() {
		if(this.upgradeManager != null){
			this.upgradeManager.onGameZipUpdateSuccess();
		}
	}

}