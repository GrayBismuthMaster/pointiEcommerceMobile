package com.drabettygarzon;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import android.content.Intent;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "draBettyGarzon";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
  
  @Override
  public void onNewIntent(Intent intent) {
      super.onNewIntent(intent);
  }

}
